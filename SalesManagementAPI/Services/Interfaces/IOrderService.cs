using SalesManagementAPI.Models;
using SalesManagementAPI.Models.DTO;

namespace SalesManagementAPI.Services.Interfaces
{
    public interface IOrderService
    {
        Task<OrderResponseDto> CreateOrderFromCartAsync(int userId, CreateOrderDto createOrderDto);
        Task<List<OrderResponseDto>> GetOrdersByUserIdAsync(int userId);
        Task<OrderResponseDto?> GetOrderByIdAsync(int orderId);
        Task<bool> UpdateOrderStatusAsync(int orderId, string status);
        Task<bool> CancelOrderAsync(int orderId);
    }
}
