namespace SalesManagementAPI.Models
{
  public enum EmployeeType
  {
    Sales = 0,
    Delivery = 1,
    Accountant = 2
  }

  public class Employee
  {
    public int EmployeeID { get; set; }
    public int UserID { get; set; }
    public EmployeeType EmployeeType { get; set; } = EmployeeType.Sales;
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public User User { get; set; } = null!;
    public ICollection<Order>? Orders { get; set; }
    public ICollection<Invoice>? Invoices { get; set; }
  }
}