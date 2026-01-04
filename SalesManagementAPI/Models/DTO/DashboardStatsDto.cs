namespace SalesManagementAPI.Models.DTO
{
  public class DashboardStatsDto
  {
    public int TotalOrders { get; set; }
    public int TotalCustomers { get; set; }
    public int TotalProducts { get; set; }
    public decimal TotalRevenue { get; set; }
    public decimal OrdersGrowthPercentage { get; set; }
    public decimal CustomersGrowthPercentage { get; set; }
    public decimal ProductsGrowthPercentage { get; set; }
    public decimal RevenueGrowthPercentage { get; set; }
  }

  public class MonthlyRevenueDto
  {
    public int Year { get; set; }
    public int Month { get; set; }
    public string MonthName { get; set; } = string.Empty;
    public decimal Revenue { get; set; }
    public int OrderCount { get; set; }
  }

  public class RecentOrderDto
  {
    public int OrderID { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public decimal TotalAmount { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime OrderDate { get; set; }
  }

  public class TopProductDto
  {
    public int ProductID { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public int TotalSold { get; set; }
    public decimal TotalRevenue { get; set; }
    public string? ImageURL { get; set; }
  }

  public class DetailedReportDto
  {
    public List<MonthlyRevenueDto> MonthlyRevenues { get; set; } = new();
    public List<TopProductDto> TopProducts { get; set; } = new();
    public List<RecentOrderDto> RecentOrders { get; set; } = new();
    public DashboardStatsDto OverallStats { get; set; } = new();
  }
}
