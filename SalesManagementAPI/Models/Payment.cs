// Models/Payment.cs
namespace SalesManagementAPI.Models
{
    public enum PaymentStatus
    {
        UNPAID,
        PAID,
        FAILED,
        REFUNDED
    }

    public enum PaymentMethod
    {
        COD,              // Cash on Delivery
        BANK_TRANSFER,    // Bank Transfer
        CASH              // Direct Cash Payment
    }

    public class Payment
    {
        public int PaymentID { get; set; }
        public int OrderID { get; set; }
        public PaymentMethod PaymentMethod { get; set; } = PaymentMethod.COD;
        public PaymentStatus PaymentStatus { get; set; } = PaymentStatus.UNPAID;
        public DateTime PaymentDate { get; set; }
        public string? TransactionCode { get; set; }
        public decimal Amount { get; set; }

        public Order? Order { get; set; }
        public ICollection<PaymentLog>? PaymentLogs { get; set; }
    }
}