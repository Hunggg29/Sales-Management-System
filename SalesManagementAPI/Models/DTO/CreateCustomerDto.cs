namespace SalesManagementAPI.Models.DTO
{
    public class CreateCustomerDto
    {
        public int UserID { get; set; }
        public string FullName { get; set; } = null!;
        public string? Phone { get; set; }
        public string? Address { get; set; }
        public string? CompanyName { get; set; }
    }
}
