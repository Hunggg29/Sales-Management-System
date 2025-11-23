namespace SalesManagementAPI.Models.DTO
{
    public class UpdateCustomerDto
    {
        public string FullName { get; set; } = null!;
        public string? Phone { get; set; }
        public string? Address { get; set; }
        public string? CompanyName { get; set; }
    }
}
