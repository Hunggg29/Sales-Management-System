using Microsoft.AspNetCore.Mvc;
using SalesManagementAPI.Models.DTO;
using SalesManagementAPI.Services.Interfaces;

namespace SalesManagementAPI.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class StatisticsController : ControllerBase
  {
    private readonly IStatisticsService _statisticsService;

    public StatisticsController(IStatisticsService statisticsService)
    {
      _statisticsService = statisticsService;
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
      var stats = await _statisticsService.GetDashboardStatsAsync();

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
        var result = await _statisticsService.GetMonthlyRevenueAsync(months);
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
        var topProducts = await _statisticsService.GetTopProductsAsync(top);

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
        var recentOrders = await _statisticsService.GetRecentOrdersAsync(count);

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
        var report = await _statisticsService.GetDetailedReportAsync();

        return Ok(report);
      }
      catch (Exception ex)
      {
        return StatusCode(500, new { message = "Lỗi khi lấy báo cáo chi tiết", error = ex.Message });
      }
    }

  }
}
