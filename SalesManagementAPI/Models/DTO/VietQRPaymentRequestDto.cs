namespace SalesManagementAPI.Models.DTO
{
    public class VietQRPaymentRequestDto
    {
        public int OrderId { get; set; }
        public decimal Amount { get; set; }
        public string Description { get; set; } = string.Empty;
    }
}
