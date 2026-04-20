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
        public string? ResetPasswordTokenHash { get; set; }
        public DateTime? ResetPasswordTokenExpiresAt { get; set; }
        public DateTime? ResetPasswordTokenUsedAt { get; set; }

        public Customer? Customer { get; set; }
        public Employee? Employee { get; set; }
    }
}