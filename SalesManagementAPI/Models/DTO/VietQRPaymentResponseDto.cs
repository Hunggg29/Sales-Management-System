namespace SalesManagementAPI.Models.DTO
{
    public class VietQRPaymentResponseDto
    {
        public bool Success { get; set; }
        public string QRCodeUrl { get; set; } = string.Empty;
        public string BankName { get; set; } = string.Empty;
        public string AccountNumber { get; set; } = string.Empty;
        public string AccountName { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public string Description { get; set; } = string.Empty;
        public int OrderId { get; set; }
        public string Message { get; set; } = string.Empty;
    }
}
