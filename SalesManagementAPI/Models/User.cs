// Models/User.cs
namespace SalesManagementAPI.Models
{
    public class User
    {
        public int UserID { get; set; }
        public string UserName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string PasswordHash { get; set; } = null!;
        public string Role { get; set; } = null!;
        public DateTime CreatedAt { get; set; }
        public bool IsActive { get; set; }

        public ICollection<Customer>? Customers { get; set; }
        public ICollection<Invoice>? Invoices { get; set; }
    }
}