namespace SalesManagementAPI.Models.DTO
{
    public class SepayWebhookDto
    {
        // Một số cổng webhook dùng các tên field khác nhau.
        public string? Content { get; set; }             // vd: "DH42"
        public string? Description { get; set; }         // alias content
        public string? TransferContent { get; set; }     // alias content
        public string? TransactionContent { get; set; }  // alias content

        public string? TransferCode { get; set; }        // mã giao dịch
        public string? Code { get; set; }                // alias transfer code

        public decimal? TransferAmount { get; set; }     // số tiền chuyển khoản
        public decimal? Amount { get; set; }             // alias amount
        public string? BankCode { get; set; }
    }

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
