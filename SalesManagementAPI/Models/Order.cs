// Models/Order.cs
namespace SalesManagementAPI.Models
{
    public class Order
    {
        public int OrderID { get; set; }
        public int CustomerID { get; set; }
        public DateTime OrderDate { get; set; }
        public decimal TotalAmount { get; set; }
        public string Status { get; set; } = null!;

        public Customer? Customer { get; set; }
        public ICollection<OrderDetail>? OrderDetails { get; set; }
        public ICollection<Payment>? Payments { get; set; }
        public Invoice? Invoice { get; set; }
   