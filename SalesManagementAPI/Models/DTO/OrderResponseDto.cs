namespace SalesManagementAPI.Models.DTO
{
    public class OrderResponseDto
    {
        public int OrderID { get; set; }
        public DateTime OrderDate { get; set; }
        public decimal TotalAmount { get; set; }
        public string Status { get; set; } = null!;
        public PaymentResponseDto? Payment { get; set; }
        public List<OrderDetailDto>? OrderDetails { get; set; }
    }

    public class OrderDetailDto
    {
        public int ProductID { get; set; }
        public string ProductName { get; set; } = null!;
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal TotalPrice { get; set; }
    }

    public class PaymentResponseDto
    {
        public int PaymentID { get; set; }
        public string PaymentMethod { get; set; } = null!;
        public string PaymentStatus { get; set; } = null!;
        public DateTime PaymentDate { get; set; }
        public string? TransactionCode { get; set; }
        public decimal Amount { get; set; }
    }
}
