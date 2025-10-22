// Models/PaymentLog.cs
namespace SalesManagementAPI.Models
{
    public class PaymentLog
    {
        public int LogID { get; set; }
        public int PaymentID { get; set; }
        public DateTime LogDate { get; set; }
        public string? LogMessage { get; set; }

        public Payment? Payment { get; set; }
    }
}