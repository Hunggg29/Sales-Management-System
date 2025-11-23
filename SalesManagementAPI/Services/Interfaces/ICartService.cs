// Services/Interfaces/ICartService.cs
using SalesManagementAPI.Models;
using SalesManagementAPI.Models.DTO;

namespace SalesManagementAPI.Services.Interfaces
{
  public interface ICartService
  {
    Task<CartDto?> GetCartByUserIdAsync(int userId);
    Task<CartDto> AddToCartAsync(int userId, AddToCartDto addToCartDto);
    Task<CartDto?> UpdateCartItemAsync(int userId, int cartItemId, UpdateCartItemDto updateDto);
    Task<bool> RemoveCartItemAsync(int userId, int cartItemId);
    Task<bool> ClearCartAsync(int userId);
  }
}
