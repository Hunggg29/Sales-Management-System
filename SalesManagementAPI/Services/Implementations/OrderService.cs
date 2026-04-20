using Microsoft.EntityFrameworkCore;
using AutoMapper;
using SalesManagementAPI.Data;
using SalesManagementAPI.Models;
using SalesManagementAPI.Models.DTO;
using SalesManagementAPI.Services.Interfaces;

namespace SalesManagementAPI.Services.Implementations
{
    public class OrderService : IOrderService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public OrderService(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<OrderResponseDto> CreateOrderFromCartAsync(int userId, CreateOrderDto createOrderDto)
        {
            // Use execution strategy for transaction with retry logic
            var strategy = _context.Database.CreateExecutionStrategy();

            return await strategy.ExecuteAsync(async () =>
            {
                using var transaction = await _context.Database.BeginTransactionAsync();

                try
                {
                    // Get customer by userId
                    var customer = await _context.Customers.FirstOrDefaultAsync(c => c.UserID == userId);
                    if (customer == null)
                        throw new Exception("Không tìm thấy thông tin khách hàng");

                    // Get cart with items
                    var cart = await _context.Carts
                        .Include(c => c.CartItems!)
                        .ThenInclude(ci => ci.Product)
                        .FirstOrDefaultAsync(c => c.CustomerID == customer.CustomerID);

                    if (cart == null || cart.CartItems == null || !cart.CartItems.Any())
                        throw new Exception("Giỏ hàng trống");

                    // Calculate total
                    decimal totalAmount = cart.CartItems.Sum(ci => ci.Quantity * ci.Product!.UnitPrice);

                    // Create Order
                    var order = new Order
                    {
                        CustomerID = customer.CustomerID,
                        OrderDate = DateTime.Now,
                        TotalAmount = totalAmount,
                        Status = OrderStatus.CREATED
                    };

                    _context.Orders.Add(order);
                    await _context.SaveChangesAsync();

                    // Create Order Details
                    foreach (var cartItem in cart.CartItems)
                    {
                        var orderDetail = new OrderDetail
                        {
                            OrderID = order.OrderID,
                            ProductID = cartItem.ProductID,
                            Quantity = cartItem.Quantity,
                            UnitPrice = cartItem.Product!.UnitPrice
                        };
                        _context.OrderDetails.Add(orderDetail);
                    }

                    // Create Payment (always UNPAID for post-paid scenario)
                    var payment = new Payment
                    {
                        OrderID = order.OrderID,
                        PaymentMethod = createOrderDto.PaymentMethod.ToUpper() switch
                        {
                            "COD" => PaymentMethod.COD,
                            "BANK_TRANSFER" => PaymentMethod.BANK_TRANSFER,
                            "CASH" => PaymentMethod.CASH,
                            _ => PaymentMethod.COD
                        },
                        PaymentStatus = PaymentStatus.UNPAID,
                        PaymentDate = DateTime.Now,
                        TransactionCode = GenerateTransactionCode(),
                        Amount = totalAmount
                    };

                    _context.Payments.Add(payment);

                    // Clear cart items
                    _context.CartItems.RemoveRange(cart.CartItems);

                    await _context.SaveChangesAsync();
                    await transaction.CommitAsync();

                    var response = _mapper.Map<OrderResponseDto>(order);
                    response.PaymentMethod = payment.PaymentMethod.ToString();
                    response.Payment = _mapper.Map<PaymentResponseDto>(payment);
                    response.OrderDetails = _mapper.Map<List<OrderDetailDto>>(cart.CartItems);
                    return response;
                }
                catch
                {
                    await transaction.RollbackAsync();
                    throw;
                }
            });
        }

        public async Task<List<OrderResponseDto>> GetOrdersByUserIdAsync(int userId)
        {
            var customer = await _context.Customers.FirstOrDefaultAsync(c => c.UserID == userId);
            if (customer == null)
                return new List<OrderResponseDto>();

            var orders = await _context.Orders
                .Include(o => o.OrderDetails!)
                    .ThenInclude(od => od.Product)
                .Include(o => o.Payments)
                .Where(o => o.CustomerID == customer.CustomerID)
                .OrderByDescending(o => o.OrderDate)
                .ToListAsync();

            return orders.Select(MapToOrderResponse).ToList();
        }

        public async Task<PagedOrdersResponseDto> GetOrdersByUserIdPagedAsync(int userId, int page, int pageSize)
        {
            var customer = await _context.Customers.FirstOrDefaultAsync(c => c.UserID == userId);
            if (customer == null)
            {
                return new PagedOrdersResponseDto
                {
                    Items = new List<OrderResponseDto>(),
                    Page = page,
                    PageSize = pageSize,
                    TotalCount = 0,
                    TotalPages = 0,
                    HasNextPage = false
                };
            }

            var baseQuery = _context.Orders
                .Include(o => o.OrderDetails!)
                    .ThenInclude(od => od.Product)
                .Include(o => o.Payments)
                .Where(o => o.CustomerID == customer.CustomerID)
                .OrderByDescending(o => o.OrderDate);

            var totalCount = await baseQuery.CountAsync();
            var totalPages = totalCount == 0 ? 0 : (int)Math.Ceiling(totalCount / (double)pageSize);

            var orders = await baseQuery
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return new PagedOrdersResponseDto
            {
                Items = orders.Select(MapToOrderResponse).ToList(),
                Page = page,
                PageSize = pageSize,
                TotalCount = totalCount,
                TotalPages = totalPages,
                HasNextPage = page < totalPages
            };
        }

        public async Task<List<OrderResponseDto>> GetAllOrdersAsync()
        {
            var orders = await _context.Orders
                .Include(o => o.Customer)
                .Include(o => o.OrderDetails!)
                    .ThenInclude(od => od.Product)
                .Include(o => o.Payments)
                .OrderByDescending(o => o.OrderDate)
                .ToListAsync();

            return orders.Select(MapToOrderResponse).ToList();
        }

        private OrderResponseDto MapToOrderResponse(Order o)
        {
            var normalizedStatus = NormalizeLegacyOrderStatus(o.Status);
            var dto = _mapper.Map<OrderResponseDto>(o);
            dto.Status = normalizedStatus.ToString();
            return dto;
        }

        public async Task<OrderResponseDto?> GetOrderByIdAsync(int orderId)
        {
            var order = await _context.Orders
                .Include(o => o.Customer)
                .Include(o => o.OrderDetails!)
                    .ThenInclude(od => od.Product)
                .Include(o => o.Payments)
                .FirstOrDefaultAsync(o => o.OrderID == orderId);

            if (order == null)
                return null;

            return MapToOrderResponse(order);
        }

        public async Task<bool> UpdateOrderStatusAsync(int orderId, string status)
        {
            var order = await _context.Orders
                .Include(o => o.Payments)
                .FirstOrDefaultAsync(o => o.OrderID == orderId);
            if (order == null)
                return false;

            var currentStatus = NormalizeLegacyOrderStatus(order.Status);
            if (currentStatus != order.Status)
            {
                order.Status = currentStatus;
            }

            // Parse string to enum
            if (Enum.TryParse<OrderStatus>(status, out var orderStatus))
            {
                if (!CanTransition(currentStatus, orderStatus))
                {
                    return false;
                }

                // COMPLETED chỉ hợp lệ khi đơn đã DELIVERED và payment đã PAID
                if (orderStatus == OrderStatus.COMPLETED)
                {
                    var hasPaidPayment = order.Payments?.Any(p => p.PaymentStatus == PaymentStatus.PAID) == true;
                    if (currentStatus != OrderStatus.DELIVERED || !hasPaidPayment)
                    {
                        return false;
                    }
                }

                order.Status = orderStatus;
                await _context.SaveChangesAsync();
                return true;
            }

            return false;
        }

        public async Task<bool> CancelOrderAsync(int orderId)
        {
            var order = await _context.Orders
                .Include(o => o.Payments)
                .FirstOrDefaultAsync(o => o.OrderID == orderId);

            if (order == null)
                return false;

            var currentStatus = NormalizeLegacyOrderStatus(order.Status);
            if (!CanTransition(currentStatus, OrderStatus.CANCELLED))
                return false;

            order.Status = OrderStatus.CANCELLED;

            if (order.Payments != null)
            {
                foreach (var payment in order.Payments)
                {
                    payment.PaymentStatus = PaymentStatus.FAILED;
                }
            }

            await _context.SaveChangesAsync();
            return true;
        }

        private string GenerateTransactionCode()
        {
            return $"TXN{DateTime.Now:yyyyMMddHHmmss}{new Random().Next(1000, 9999)}";
        }

        private static bool CanTransition(OrderStatus current, OrderStatus next)
        {
            if (current == next)
                return true;

            return current switch
            {
                OrderStatus.CREATED => next == OrderStatus.APPROVED || next == OrderStatus.CANCELLED,
                OrderStatus.APPROVED => next == OrderStatus.SHIPPING || next == OrderStatus.CANCELLED,
                OrderStatus.SHIPPING => next == OrderStatus.DELIVERED || next == OrderStatus.CANCELLED,
                OrderStatus.DELIVERED => next == OrderStatus.COMPLETED,
                OrderStatus.COMPLETED => false,
                OrderStatus.CANCELLED => false,
                _ => false
            };
        }

        private static OrderStatus NormalizeLegacyOrderStatus(OrderStatus status)
        {
            // Legacy value 1 (old PENDING) được quy về CREATED theo workflow mới.
            if ((int)status == 1)
                return OrderStatus.CREATED;

            return status;
        }
    }
}
