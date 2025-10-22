// Models/Customer.cs
namespace SalesManagementAPI.Models
{
    public class Customer
    {
        public int CustomerID { get; set; }
        public int UserID { get; set; }
        public string FullName { get; set; } = null!;
        public string? Phone { get; set; }
        public string? Address { get; set; }
        public string? CompanyName { get; set; }

        public User? User { get; set; }
        public ICollection<Order>? Orders { get; set; }
    }
}
