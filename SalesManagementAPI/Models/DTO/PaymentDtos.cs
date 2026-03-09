namespace SalesManagementAPI.Models.DTO
{
    public class ConfirmPaymentDto
    {
        public int OrderId { get; set; }
        public int StaffId { get; set; }
        public string? TransactionCode { get; set; }
    }

    public class PaymentStatusDto
    {
        public int OrderId { get; set; }
        public string PaymentMethod { get; set; } = string.Empty;
        public string PaymentStatus { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public string? TransactionCode { get; set; }
        public DateTime PaymentDate { get; set; }
        public string? OrderStatus { get; set; }
    }

    public class ConfirmPaymentResponseDto
    {
        public bool Success { get; set; } = true;
        public string Message { get; set; } = string.Empty;
        public PaymentInfoDto Payment { get; set; } = null!;
        public InvoiceInfoDto Invoice { get; set; } = null!;
    }

    public class PaymentInfoDto
    {
        public int PaymentId { get; set; }
        public int OrderId { get; set; }
        public string Status { get; set; } = string.Empty;
        public decimal Amount { get; set; }
    }

    public class InvoiceInfoDto
    {
        public int InvoiceId { get; set; }
        public string InvoiceNumber { get; set; } = string.Empty;
        public decimal TotalAmount { get; set; }
        public decimal Tax { get; set; }
    }
}
