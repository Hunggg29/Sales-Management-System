// Models/Payment.cs
namespace SalesManagementAPI.Models
{
    public class Payment
    {
        public int PaymentID { get; set; }
        public int OrderID { get; set; }
        public string PaymentMethod { get; set; } = null!;
        public string PaymentStatus { get; set; } = null!;
        public DateTime PaymentDate { get; set; }
        public string? TransactionCode { get; set; }
        public decimal Amount { get; set; }

        public Order? Order { get; set; }
        public ICollection<PaymentLog>? PaymentLogs { get; set; }
    }
}