namespace SalesManagementAPI.Models.VnPay
{
    public class PaymentInformationModel
    {
        public int OrderId { get; set; } // QUAN TRỌNG: Dùng để map về order
        public string OrderType { get; set; }
        public double Amount { get; set; }
        public string OrderDescription { get; set; }
        public string Name { get; set; }
    }
}
