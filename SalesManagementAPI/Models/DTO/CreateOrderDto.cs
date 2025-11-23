using System.ComponentModel.DataAnnotations;

namespace SalesManagementAPI.Models.DTO
{
    public class CreateOrderDto
    {
        [Required(ErrorMessage = "Payment method is required")]
        public string PaymentMethod { get; set; } = null!; // COD, BankTransfer
        public string? ShippingAddress { get; set; }
        public string? Note { get; set; }
    }
}
