// Models/DTO/CartDto.cs
namespace SalesManagementAPI.Models.DTO
{
  public class CartDto
  {
    public int CartID { get; set; }
    public int CustomerID { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public List<CartItemDto> CartItems { get; set; } = new List<CartItemDto>();
    public decimal TotalAmount { get; set; }
    public int TotalItems { get; set; }
  }
}
