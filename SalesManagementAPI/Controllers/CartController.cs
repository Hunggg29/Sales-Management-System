// Controllers/CartController.cs
using Microsoft.AspNetCore.Mvc;
using SalesManagementAPI.Models.DTO;
using SalesManagementAPI.Services.Interfaces;

namespace SalesManagementAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CartController : ControllerBase
    {
        private readonly ICartService _cartService;

        public CartController(ICartService cartService)
        {
            _cartService = cartService;
        }

        /// <summary>
        /// Lấy giỏ hàng của user đang đăng nhập
        /// </summary>
        /// <param name="userId">ID của user</param>
        /// <returns>Thông tin giỏ hàng bao gồm danh sách sản phẩm và tổng tiền</returns>
        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetCartByUserId(int userId)
        {
            try
            {
                var cart = await _cartService.GetCartByUserIdAsync(userId);
                
                if (cart == null)
                {
                    return NotFound(new { message = "Không tìm thấy giỏ hàng" });
                }

                return Ok(cart);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Thêm sản phẩm vào giỏ hàng
        /// </summary>
        [HttpPost("user/{userId}/items")]
        public async Task<IActionResult> AddToCart(int userId, [FromBody] AddToCartDto addToCartDto)
        {
            try
            {
                var cart = await _cartService.AddToCartAsync(userId, addToCartDto);
                return Ok(cart);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Cập nhật số lượng sản phẩm trong giỏ hàng
        /// </summary>
        [HttpPut("user/{userId}/items/{cartItemId}")]
        public async Task<IActionResult> UpdateCartItem(int userId, int cartItemId, [FromBody] UpdateCartItemDto updateDto)
        {
            try
            {
                var cart = await _cartService.UpdateCartItemAsync(userId, cartItemId, updateDto);
                
                if (cart == null)
                {
                    return NotFound(new { message = "Không tìm thấy sản phẩm trong giỏ hàng" });
                }

                return Ok(cart);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Xóa sản phẩm khỏi giỏ hàng
        /// </summary>
        [HttpDelete("user/{userId}/items/{cartItemId}")]
        public async Task<IActionResult> RemoveCartItem(int userId, int cartItemId)
        {
            try
            {
                var result = await _cartService.RemoveCartItemAsync(userId, cartItemId);
                
                if (!result)
                {
                    return NotFound(new { message = "Không tìm thấy sản phẩm trong giỏ hàng" });
                }

                return Ok(new { message = "Đã xóa sản phẩm khỏi giỏ hàng" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Xóa toàn bộ giỏ hàng
        /// </summary>
        [HttpDelete("user/{userId}")]
        public async Task<IActionResult> ClearCart(int userId)
        {
            try
            {
                var result = await _cartService.ClearCartAsync(userId);
                
                if (!result)
                {
                    return NotFound(new { message = "Không tìm thấy giỏ hàng" });
                }

                return Ok(new { message = "Đã xóa toàn bộ giỏ hàng" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
