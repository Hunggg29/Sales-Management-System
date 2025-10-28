// Models/Product.cs
namespace SalesManagementAPI.Models
{
    public class Product
    {
        public int ProductID { get; set; }
        public int CategoryID { get; set; }
        public string ProductName { get; set; } = null!;
        public string? Description { get; set; }
        public decimal UnitPrice { get; set; }
        public string? Unit { get; set; }
        public int StockQuantity { get; set; }
        public string? ImageURL { get; set; }
        public DateTime CreatedAt { get; set; }
        public bool IsActive { get; set; }

        public Category? Category { get; set; }
        public ICollection<OrderDetail>? OrderDetails { get; set; }
    }
}