using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SalesManagementAPI.Data;
using SalesManagementAPI.Models.DTO;
using System.Globalization;

namespace SalesManagementAPI.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class StatisticsController : ControllerBase
  {
    private readonly ApplicationDbContext _context;
    private readonly CultureInfo _vietnameseCulture;

    public StatisticsController(ApplicationDbContext context)
    {
      _context = context;
      _vietnameseCulture = new CultureInfo("vi-VN");
    }

    /// <summary>
    /// Lấy thống kê tổng quan cho dashboard
    /// GET: api/Statistics/dashboard
    /// </summary>
    [HttpGet("dashboard")]
    public async Task<ActionResult<DashboardStatsDto>> GetDashboardStats()
    {
      try
      {
        var now = DateTime.Now;
        var currentMonth = new DateTime(now.Year, now.Month, 1);
        var previousMonth = currentMonth.AddMonths(-1);

        // Tổng đơn hàng
        var totalOrders = await _context.Orders.CountAsync();
        var ordersThisMonth = await _context.Orders
            .CountAsync(o => o.OrderDate >= currentMonth);
        var ordersLastMonth = await _context.Orders
            .CountAsync(o => o.OrderDate >= previousMonth && o.OrderDate < currentMonth);

        // Tổng khách hàng (based on first order date since Customer doesn't have CreatedAt)
        var totalCustomers = await _context.Customers.CountAsync();
        var customersThisMonth = await _context.Customers
            .Where(c => c.Orders != null && c.Orders.Any(o => o.OrderDate >= currentMonth))
            .CountAsync();
        var customersLastMonth = await _context.Customers
            .Where(c => c.Orders != null && c.Orders.Any(o => o.OrderDate >= previousMonth && o.OrderDate < currentMonth))
            .CountAsync();

        // Tổng sản phẩm
        var totalProducts = await _context.Products.CountAsync();
        var productsThisMonth = await _context.Products
            .CountAsync(p => p.CreatedAt >= currentMonth);
        var productsLastMonth = await _context.Products
            .CountAsync(p => p.CreatedAt >= previousMonth && p.CreatedAt < currentMonth);

        // Doanh thu
        var totalRevenue = await _context.Orders
            .SumAsync(o => (decimal?)o.TotalAmount) ?? 0;
        var revenueThisMonth = await _context.Orders
            .Where(o => o.OrderDate >= currentMonth)
            .SumAsync(o => (decimal?)o.TotalAmount) ?? 0;
        var revenueLastMonth = await _context.Orders
            .Where(o => o.OrderDate >= previousMonth && o.OrderDate < currentMonth)
            .SumAsync(o => (decimal?)o.TotalAmount) ?? 0;

        // Tính phần trăm tăng trưởng
        var stats = new DashboardStatsDto
        {
          TotalOrders = totalOrders,
          TotalCustomers = totalCustomers,
          TotalProducts = totalProducts,
          TotalRevenue = totalRevenue,
          OrdersGrowthPercentage = CalculateGrowth(ordersThisMonth, ordersLastMonth),
          CustomersGrowthPercentage = CalculateGrowth(customersThisMonth, customersLastMonth),
          ProductsGrowthPercentage = CalculateGrowth(productsThisMonth, productsLastMonth),
          RevenueGrowthPercentage = CalculateGrowth(revenueThisMonth, revenueLastMonth)
        };

        return Ok(stats);
      }
      catch (Exception ex)
      {
        return StatusCode(500, new { message = "Lỗi khi lấy thống kê", error = ex.Message });
      }
    }

    /// <summary>
    /// Lấy doanh thu theo tháng trong 12 tháng gần nhất
    /// GET: api/Statistics/monthly-revenue
    /// </summary>
    [HttpGet("monthly-revenue")]
    public async Task<ActionResult<List<MonthlyRevenueDto>>> GetMonthlyRevenue([FromQuery] int months = 12)
    {
      try
      {
        var now = DateTime.Now;
        var startDate = now.AddMonths(-months + 1);
        startDate = new DateTime(startDate.Year, startDate.Month, 1);

        var monthlyData = await _context.Orders
            .Where(o => o.OrderDate >= startDate)
            .GroupBy(o => new { o.OrderDate.Year, o.OrderDate.Month })
            .Select(g => new
            {
              Year = g.Key.Year,
              Month = g.Key.Month,
              Revenue = g.Sum(o => o.TotalAmount),
              OrderCount = g.Count()
            })
            .OrderBy(x => x.Year)
            .ThenBy(x => x.Month)
            .ToListAsync();

        // Tạo danh sách đầy đủ các tháng (bao gồm cả tháng không có dữ liệu)
        var result = new List<MonthlyRevenueDto>();
        var currentDate = startDate;

        for (int i = 0; i < months; i++)
        {
          var data = monthlyData.FirstOrDefault(d =>
              d.Year == currentDate.Year && d.Month == currentDate.Month);

          result.Add(new MonthlyRevenueDto
          {
            Year = currentDate.Year,
            Month = currentDate.Month,
            MonthName = $"Tháng {currentDate.Month}/{currentDate.Year}",
            Revenue = data?.Revenue ?? 0,
            OrderCount = data?.OrderCount ?? 0
          });

          currentDate = currentDate.AddMonths(1);
        }

        return Ok(result);
      }
      catch (Exception ex)
      {
        return StatusCode(500, new { message = "Lỗi khi lấy doanh thu theo tháng", error = ex.Message });
      }
    }

    /// <summary>
    /// Lấy danh sách sản phẩm bán chạy nhất
    /// GET: api/Statistics/top-products
    /// </summary>
    [HttpGet("top-products")]
    public async Task<ActionResult<List<TopProductDto>>> GetTopProducts([FromQuery] int top = 10)
    {
      try
      {
        var topProducts = await _context.OrderDetails
            .Include(od => od.Product)
            .GroupBy(od => new { od.ProductID, od.Product!.ProductName, od.Product.ImageURL })
            .Select(g => new TopProductDto
            {
              ProductID = g.Key.ProductID,
              ProductName = g.Key.ProductName,
              ImageURL = g.Key.ImageURL,
              TotalSold = g.Sum(od => od.Quantity),
              TotalRevenue = g.Sum(od => od.Quantity * od.UnitPrice)
            })
            .OrderByDescending(p => p.TotalSold)
            .Take(top)
            .ToListAsync();

        return Ok(topProducts);
      }
      catch (Exception ex)
      {
        return StatusCode(500, new { message = "Lỗi khi lấy sản phẩm bán chạy", error = ex.Message });
      }
    }

    /// <summary>
    /// Lấy danh sách đơn hàng gần đây
    /// GET: api/Statistics/recent-orders
    /// </summary>
    [HttpGet("recent-orders")]
    public async Task<ActionResult<List<RecentOrderDto>>> GetRecentOrders([FromQuery] int count = 10)
    {
      try
      {
        var recentOrders = await _context.Orders
            .Include(o => o.Customer)
            .OrderByDescending(o => o.OrderDate)
            .Take(count)
            .Select(o => new RecentOrderDto
            {
              OrderID = o.OrderID,
              CustomerName = o.Customer != null ? o.Customer.FullName : "Khách vãng lai",
              TotalAmount = o.TotalAmount,
              Status = o.Status,
              OrderDate = o.OrderDate
            })
            .ToListAsync();

        return Ok(recentOrders);
      }
      catch (Exception ex)
      {
        return StatusCode(500, new { message = "Lỗi khi lấy đơn hàng gần đây", error = ex.Message });
      }
    }

    /// <summary>
    /// Lấy báo cáo chi tiết
    /// GET: api/Statistics/detailed-report
    /// </summary>
    [HttpGet("detailed-report")]
    public async Task<ActionResult<DetailedReportDto>> GetDetailedReport()
    {
      try
      {
        var dashboardStatsResult = await GetDashboardStats();
        var monthlyRevenueResult = await GetMonthlyRevenue(12);
        var topProductsResult = await GetTopProducts(10);
        var recentOrdersResult = await GetRecentOrders(10);

        // Check if any of the results failed
        if (dashboardStatsResult.Result is not OkObjectResult dashboardOk ||
            monthlyRevenueResult.Result is not OkObjectResult monthlyOk ||
            topProductsResult.Result is not OkObjectResult productsOk ||
            recentOrdersResult.Result is not OkObjectResult ordersOk)
        {
          return StatusCode(500, new { message = "Lỗi khi lấy một phần dữ liệu báo cáo" });
        }

        var report = new DetailedReportDto
        {
          OverallStats = (DashboardStatsDto)dashboardOk.Value!,
          MonthlyRevenues = (List<MonthlyRevenueDto>)monthlyOk.Value!,
          TopProducts = (List<TopProductDto>)productsOk.Value!,
          RecentOrders = (List<RecentOrderDto>)ordersOk.Value!
        };

        return Ok(report);
      }
      catch (Exception ex)
      {
        return StatusCode(500, new { message = "Lỗi khi lấy báo cáo chi tiết", error = ex.Message });
      }
    }

    /// <summary>
    /// Hàm tính phần trăm tăng trưởng
    /// </summary>
    private decimal CalculateGrowth(decimal current, decimal previous)
    {
      if (previous == 0)
        return current > 0 ? 100 : 0;

      return Math.Round(((current - previous) / previous) * 100, 1);
    }
  }
}
