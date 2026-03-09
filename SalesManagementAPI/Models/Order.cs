// Models/Order.cs
namespace SalesManagementAPI.Models
{
    public enum OrderStatus
    {
        CREATED,
        PENDING,
        APPROVED,
        COMPLETED,
        CANCELLED
    }

    public class Order
    {
        public int OrderID { get; set; }
        public int? CustomerID { get; set; }
        public int? StaffID { get; set; }
        public DateTime OrderDate { get; set; }
        public decimal TotalAmount { get; set; }
        public OrderStatus Status { get; set; } = OrderStatus.PENDING;

        public Customer? Customer { get; set; }
        public ICollection<OrderDetail>? OrderDetails { get; set; }
        public ICollection<Payment>? Payments { get; set; }
        public ICollection<Invoice>? Invoices { get; set; }
    }
}
