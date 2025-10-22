// Models/Invoice.cs
namespace SalesManagementAPI.Models
{
    public class Invoice
    {
        public int InvoiceID { get; set; }
        public int OrderID { get; set; }
        public int StaffID { get; set; }
        public string InvoiceNumber { get; set; } = null!;
        public DateTime IssueDate { get; set; }
        public decimal TotalAmount { get; set; }
        public decimal Tax { get; set; }
        public string CustomerName { get; set; } = null!;
        public string CustomerAddress { get; set; } = null!;

        public Order? Order { get; set; }
        public User? Staff { get; set; }
    }
}