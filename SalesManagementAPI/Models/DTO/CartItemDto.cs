// Models/DTO/CartItemDto.cs
namespace SalesManagementAPI.Models.DTO
{
  public class CartItemDto
  {
    public int CartItemID { get; set; }
    public int ProductID { get; set; }
    public string ProductName { get; set; } = null!;
    public string? ProductImage { get; set; }
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal SubTotal { get; set; }
    public int StockQuantity { get; set; }
  }
}
