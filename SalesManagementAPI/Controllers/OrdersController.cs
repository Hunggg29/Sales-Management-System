using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using SalesManagementAPI.Hubs;
using SalesManagementAPI.Models.DTO;
using SalesManagementAPI.Services.Interfaces;

namespace SalesManagementAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly IOrderService _orderService;
        private readonly IHubContext<OrderNotificationHub> _hubContext;

        public OrdersController(IOrderService orderService, IHubContext<OrderNotificationHub> hubContext)
        {
            _orderService = orderService;
            _hubContext = hubContext;
        }

        [HttpPost("create/{userId}")]
        public async Task<IActionResult> CreateOrder([FromRoute] int userId, [FromBody] CreateOrderDto createOrderDto)
        {
            try
            {
                // Log để debug
                Console.WriteLine($"Creating order for userId: {userId}");
                Console.WriteLine($"PaymentMethod: {createOrderDto.PaymentMethod}");

                var order = await _orderService.CreateOrderFromCartAsync(userId, createOrderDto);

                // Gửi thông báo real-time tới admin
                await _hubContext.Clients.All.SendAsync("ReceiveOrderNotification", new
                {
                    orderId = order.OrderID,
                    customerName = order.Customer?.FullName,
                    totalAmount = order.TotalAmount,
                    paymentMethod = order.PaymentMethod,
                    orderDate = order.OrderDate,
                    message = $"Đơn hàng mới #{order.OrderID} từ {order.Customer?.FullName}"
                });

                return Ok(order);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error creating order: {ex.Message}");
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetOrdersByUserId(
            [FromRoute] int userId,
            [FromQuery] int? page = null,
            [FromQuery] int? pageSize = null)
        {
            // Backward-compatible mode: no paging params => return full list
            if (!page.HasValue && !pageSize.HasValue)
            {
                var allOrders = await _orderService.GetOrdersByUserIdAsync(userId);
                return Ok(allOrders);
            }

            var safePage = Math.Max(page ?? 1, 1);
            var safePageSize = Math.Clamp(pageSize ?? 10, 1, 50);

            var pagedOrders = await _orderService.GetOrdersByUserIdPagedAsync(userId, safePage, safePageSize);
            return Ok(pagedOrders);
        }

        [HttpGet]
        public async Task<IActionResult> GetAllOrders()
        {
            var orders = await _orderService.GetAllOrdersAsync();
            return Ok(orders);
        }

        [HttpGet("{orderId}")]
        public async Task<IActionResult> GetOrderById([FromRoute] int orderId)
        {
            var order = await _orderService.GetOrderByIdAsync(orderId);
            if (order == null)
                return NotFound(new { message = "Không tìm thấy đơn hàng" });

            return Ok(order);
        }

        [HttpPut("{orderId}/status")]
        public async Task<IActionResult> UpdateOrderStatus([FromRoute] int orderId, [FromBody] UpdateOrderStatusDto dto)
        {
            var order = await _orderService.GetOrderByIdAsync(orderId);
            if (order == null)
                return NotFound(new { message = "Không tìm thấy đơn hàng" });

            var success = await _orderService.UpdateOrderStatusAsync(orderId, dto.Status);
            if (!success)
                return BadRequest(new { message = "Trạng thái chuyển đổi không hợp lệ" });

            return Ok(new { message = "Cập nhật trạng thái thành công" });
        }

        [HttpPost("{orderId}/cancel")]
        public async Task<IActionResult> CancelOrder([FromRoute] int orderId)
        {
            var success = await _orderService.CancelOrderAsync(orderId);
            if (!success)
                return BadRequest(new { message = "Không thể hủy đơn hàng" });

            return Ok(new { message = "Đã hủy đơn hàng thành công" });
        }
    }

    public class UpdateOrderStatusDto
    {
        public string Status { get; set; } = null!;
    }
}
