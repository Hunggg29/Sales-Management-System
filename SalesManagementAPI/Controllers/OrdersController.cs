using Microsoft.AspNetCore.Mvc;
using SalesManagementAPI.Models.DTO;
using SalesManagementAPI.Services.Interfaces;

namespace SalesManagementAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly IOrderService _orderService;

        public OrdersController(IOrderService orderService)
        {
            _orderService = orderService;
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
                return Ok(order);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error creating order: {ex.Message}");
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetOrdersByUserId([FromRoute] int userId)
        {
            var orders = await _orderService.GetOrdersByUserIdAsync(userId);
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
            var success = await _orderService.UpdateOrderStatusAsync(orderId, dto.Status);
            if (!success)
                return NotFound(new { message = "Không tìm thấy đơn hàng" });

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
