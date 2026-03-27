namespace SalesManagementAPI.Models.DTO
{
    public class EmployeeListItemDto
    {
        public int EmployeeID { get; set; }
        public int UserID { get; set; }
        public string UserName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Role { get; set; } = "Staff";
        public bool IsActive { get; set; }
        public int EmployeeType { get; set; }
        public string EmployeeTypeName { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }

    public class CreateEmployeeDto
    {
        public string UserName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public int EmployeeType { get; set; } = 0;
    }

    public class UpdateEmployeeDto
    {
        public string UserName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public int EmployeeType { get; set; }
        public bool IsActive { get; set; }
    }

    public class UpdateEmployeeStatusDto
    {
        public bool IsActive { get; set; }
    }
}
