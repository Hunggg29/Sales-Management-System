// Services/Implementations/CartService.cs
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using SalesManagementAPI.Data;
using SalesManagementAPI.Models;
using SalesManagementAPI.Models.DTO;
using SalesManagementAPI.Services.Interfaces;

namespace SalesManagementAPI.Services.Implementations
{
  public class CartService : ICartService
  {
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;

    public CartService(ApplicationDbContext context, IMapper mapper)
    {
      _context = context;
      _mapper = mapper;
    }

    public async Task<CartDto?> GetCartByUserIdAsync(int userId)
    {
      // Tìm customer theo userId
      var customer = await _context.Customers
          .FirstOrDefaultAsync(c => c.UserID == userId);

      if (customer == null)
        return null;

      // Lấy hoặc tạo cart cho customer
      var cart = await _context.Carts
          .Include(c => c.CartItems)
              .ThenInclude(ci => ci.Product)
          .FirstOrDefaultAsync(c => c.CustomerID == customer.CustomerID);

      if (cart == null)
      {
        // Tạo cart mới nếu chưa có
        cart = new Cart
        {
          CustomerID = customer.CustomerID,
          CreatedAt = DateTime.Now,
          UpdatedAt = DateTime.Now
        };
        _context.Carts.Add(cart);
        await _context.SaveChangesAsync();
      }

      // Map sang DTO sử dụng AutoMapper
      var cartDto = _mapper.Map<CartDto>(cart);
      return cartDto;
    }

    public async Task<CartDto> AddToCartAsync(int userId, AddToCartDto addToCartDto)
    {
      // Tìm customer
      var customer = await _context.Customers
          .FirstOrDefaultAsync(c => c.UserID == userId);

      if (customer == null)
        throw new Exception("Không tìm thấy khách hàng");

      // Kiểm tra product
      var product = await _context.Products
          .FirstOrDefaultAsync(p => p.ProductID == addToCartDto.ProductID);

      if (product == null)
        throw new Exception("Không tìm thấy sản phẩm");

      if (product.StockQuantity < addToCartDto.Quantity)
        throw new Exception("Không đủ hàng trong kho");

      // Lấy hoặc tạo cart
      var cart = await _context.Carts
          .Include(c => c.CartItems)
          .FirstOrDefaultAsync(c => c.CustomerID == customer.CustomerID);

      if (cart == null)
      {
        cart = new Cart
        {
          CustomerID = customer.CustomerID,
          CreatedAt = DateTime.Now,
          UpdatedAt = DateTime.Now
        };
        _context.Carts.Add(cart);
        await _context.SaveChangesAsync();
      }

      // Kiểm tra sản phẩm đã có trong cart chưa
      var existingItem = cart.CartItems?
          .FirstOrDefault(ci => ci.ProductID == addToCartDto.ProductID);

      if (existingItem != null)
      {
        // Cập nhật số lượng
        existingItem.Quantity += addToCartDto.Quantity;
        existingItem.SubTotal = existingItem.Quantity * existingItem.UnitPrice;
      }
      else
      {
        // Thêm mới
        var cartItem = new CartItem
        {
          CartID = cart.CartID,
          ProductID = addToCartDto.ProductID,
          Quantity = addToCartDto.Quantity,
          UnitPrice = product.UnitPrice,
          SubTotal = addToCartDto.Quantity * product.UnitPrice
        };
        _context.CartItems.Add(cartItem);
      }

      cart.UpdatedAt = DateTime.Now;
      await _context.SaveChangesAsync();

      // Trả về cart đã cập nhật
      return await GetCartByUserIdAsync(userId) ?? throw new Exception("Lỗi khi lấy giỏ hàng");
    }

    public async Task<CartDto?> UpdateCartItemAsync(int userId, int cartItemId, UpdateCartItemDto updateDto)
    {
      // Tìm customer
      var customer = await _context.Customers
          .FirstOrDefaultAsync(c => c.UserID == userId);

      if (customer == null)
        return null;

      // Tìm cart item
      var cartItem = await _context.CartItems
          .Include(ci => ci.Cart)
          .Include(ci => ci.Product)
          .FirstOrDefaultAsync(ci => ci.CartItemID == cartItemId && ci.Cart!.CustomerID == customer.CustomerID);

      if (cartItem == null)
        return null;

      // Kiểm tra số lượng tồn kho
      if (cartItem.Product!.StockQuantity < updateDto.Quantity)
        throw new Exception("Không đủ hàng trong kho");

      // Cập nhật
      cartItem.Quantity = updateDto.Quantity;
      cartItem.SubTotal = cartItem.Quantity * cartItem.UnitPrice;
      cartItem.Cart!.UpdatedAt = DateTime.Now;

      await _context.SaveChangesAsync();

      return await GetCartByUserIdAsync(userId);
    }

    public async Task<bool> RemoveCartItemAsync(int userId, int cartItemId)
    {
      // Tìm customer
      var customer = await _context.Customers
          .FirstOrDefaultAsync(c => c.UserID == userId);

      if (customer == null)
        return false;

      // Tìm cart item
      var cartItem = await _context.CartItems
          .Include(ci => ci.Cart)
          .FirstOrDefaultAsync(ci => ci.CartItemID == cartItemId && ci.Cart!.CustomerID == customer.CustomerID);

      if (cartItem == null)
        return false;

      _context.CartItems.Remove(cartItem);
      cartItem.Cart!.UpdatedAt = DateTime.Now;
      await _context.SaveChangesAsync();

      return true;
    }

    public async Task<bool> ClearCartAsync(int userId)
    {
      // Tìm customer
      var customer = await _context.Customers
          .FirstOrDefaultAsync(c => c.UserID == userId);

      if (customer == null)
        return false;

      // Tìm cart
      var cart = await _context.Carts
          .Include(c => c.CartItems)
          .FirstOrDefaultAsync(c => c.CustomerID == customer.CustomerID);

      if (cart == null)
        return false;

      // Xóa tất cả cart items
      if (cart.CartItems != null && cart.CartItems.Any())
      {
        _context.CartItems.RemoveRange(cart.CartItems);
        cart.UpdatedAt = DateTime.Now;
        await _context.SaveChangesAsync();
      }

      return true;
    }
  }
}
