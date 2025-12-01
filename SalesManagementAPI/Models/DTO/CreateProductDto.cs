namespace SalesManagementAPI.Models.DTO
{
  public class CreateProductDto
  {
    public string ProductName { get; set; } = null!;
    public string? Description { get; set; }
    public decimal UnitPrice { get; set; }
    public int StockQuantity { get; set; }
    public int CategoryID { get; set; }
    public string? ImageURL { get; set; }
    public string? Unit { get; set; }
  }
}
