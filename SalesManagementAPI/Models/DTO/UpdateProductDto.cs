namespace SalesManagementAPI.Models.DTO
{
    public class UpdateProductDto
    {
        public string ProductName { get; set; } = null!;
        public string? Description { get; set; }
        public decimal UnitPrice { get; set; }
        public string? Unit { get; set; }
        public int StockQuantity { get; set; }
        public int CategoryID { get; set; }
        public string? ImageURL { get; set; }
    }
}
