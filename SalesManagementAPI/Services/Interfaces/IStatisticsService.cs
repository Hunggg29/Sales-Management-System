using SalesManagementAPI.Models.DTO;

namespace SalesManagementAPI.Services.Interfaces
{
    public interface IStatisticsService
    {
        Task<DashboardStatsDto> GetDashboardStatsAsync();
        Task<List<MonthlyRevenueDto>> GetMonthlyRevenueAsync(int months = 12);
        Task<List<TopProductDto>> GetTopProductsAsync(int top = 10);
        Task<List<RecentOrderDto>> GetRecentOrdersAsync(int count = 10);
        Task<DetailedReportDto> GetDetailedReportAsync();
    }
}
