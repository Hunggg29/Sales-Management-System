using Microsoft.EntityFrameworkCore;
using SalesManagementAPI.Data;
using SalesManagementAPI.Models;
using SalesManagementAPI.Models.DTO;
using SalesManagementAPI.Services.Interfaces;

namespace SalesManagementAPI.Services.Implementations
{
    public class OrderService : IOrderService
    {
        private readonly ApplicationDbContext _context;

        public OrderService(ApplicationDbContext context)
        {
            _context = context;
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
                        .Include(c => c.CartItems)
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
                        Status = OrderStatus.PENDING
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

                    // Return order response
                    return new OrderResponseDto
                    {
                        OrderID = order.OrderID,
                        OrderDate = order.OrderDate,
                        TotalAmount = order.TotalAmount,
                        Status = order.Status.ToString(),
                        PaymentMethod = payment.PaymentMethod.ToString(),
                        Payment = new PaymentResponseDto
                        {
                            PaymentID = payment.PaymentID,
                            PaymentMethod = payment.PaymentMethod.ToString(),
                            PaymentStatus = payment.PaymentStatus.ToString(),
                            PaymentDate = payment.PaymentDate,
                            TransactionCode = payment.TransactionCode,
                            Amount = payment.Amount
                        },
                        OrderDetails = cart.CartItems.Select(ci => new OrderDetailDto
                        {
                            ProductID = ci.ProductID,
                            ProductName = ci.Product!.ProductName,
                            Quantity = ci.Quantity,
                            UnitPrice = ci.Product.UnitPrice,
                            TotalPrice = ci.Quantity * ci.Product.UnitPrice
                        }).ToList()
                    };
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
                .Include(o => o.OrderDetails)
                    .ThenInclude(od => od.Product)
                .Include(o => o.Payments)
                .Where(o => o.CustomerID == customer.CustomerID)
                .OrderByDescending(o => o.OrderDate)
                .ToListAsync();

            return orders.Select(o => MapToOrderResponse(o)).ToList();
        }

        public async Task<List<OrderResponseDto>> GetAllOrdersAsync()
        {
            var orders = await _context.Orders
                .Include(o => o.Customer)
                .Include(o => o.OrderDetails)
                    .ThenInclude(od => od.Product)
                .Include(o => o.Payments)
                .OrderByDescending(o => o.OrderDate)
                .ToListAsync();

            return orders.Select(o => MapToOrderResponse(o)).ToList();
        }

        private OrderResponseDto MapToOrderResponse(Order o)
        {
            return new OrderResponseDto
            {
                OrderID = o.OrderID,
                OrderDate = o.OrderDate,
                TotalAmount = o.TotalAmount,
                Status = o.Status.ToString(),
                PaymentMethod = o.Payments?.FirstOrDefault()?.PaymentMethod.ToString() ?? "COD",
                Customer = o.Customer != null ? new CreateCustomerDto
                {
                    UserID = o.Customer.UserID,
                    FullName = o.Customer.FullName,
                    Phone = o.Customer.Phone ?? "",
                    Address = o.Customer.Address ?? "",
                    CompanyName = o.Customer.CompanyName ?? ""
                } : null,
                Payment = o.Payments?.FirstOrDefault() != null ? new PaymentResponseDto
                {
                    PaymentID = o.Payments.First().PaymentID,
                    PaymentMethod = o.Payments.First().PaymentMethod.ToString(),
                    PaymentStatus = o.Payments.First().PaymentStatus.ToString(),
                    PaymentDate = o.Payments.First().PaymentDate,
                    TransactionCode = o.Payments.First().TransactionCode,
                    Amount = o.Payments.First().Amount
                } : null,
                OrderDetails = o.OrderDetails?.Select(od => new OrderDetailDto
                {
                    ProductID = od.ProductID,
                    ProductName = od.Product?.ProductName ?? "",
                    Quantity = od.Quantity,
                    UnitPrice = od.UnitPrice,
                    TotalPrice = od.Quantity * od.UnitPrice,
                    StockQuantity = od.Product?.StockQuantity ?? 0
                }).ToList()
            };
        }

        public async Task<OrderResponseDto?> GetOrderByIdAsync(int orderId)
        {
            var order = await _context.Orders
                .Include(o => o.Customer)
                .Include(o => o.OrderDetails)
                    .ThenInclude(od => od.Product)
                .Include(o => o.Payments)
                .FirstOrDefaultAsync(o => o.OrderID == orderId);

            if (order == null)
                return null;

            return MapToOrderResponse(order);
        }

        public async Task<bool> UpdateOrderStatusAsync(int orderId, string status)
        {
            var order = await _context.Orders.FindAsync(orderId);
            if (order == null)
                return false;

            // Parse string to enum
            if (Enum.TryParse<OrderStatus>(status, out var orderStatus))
            {
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

            if (order == null || order.Status != OrderStatus.PENDING)
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
    }
}
