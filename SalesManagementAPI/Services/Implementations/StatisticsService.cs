using AutoMapper;
using Microsoft.EntityFrameworkCore;
using SalesManagementAPI.Data;
using SalesManagementAPI.Models;
using SalesManagementAPI.Models.DTO;
using SalesManagementAPI.Services.Interfaces;

namespace SalesManagementAPI.Services.Implementations
{
    public class StatisticsService : IStatisticsService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public StatisticsService(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<DashboardStatsDto> GetDashboardStatsAsync()
        {
            var now = DateTime.Now;
            var currentMonth = new DateTime(now.Year, now.Month, 1);
            var previousMonth = currentMonth.AddMonths(-1);

            var totalOrders = await _context.Orders.CountAsync();
            var ordersThisMonth = await _context.Orders.CountAsync(o => o.OrderDate >= currentMonth);
            var ordersLastMonth = await _context.Orders.CountAsync(o => o.OrderDate >= previousMonth && o.OrderDate < currentMonth);

            var totalCustomers = await _context.Customers.CountAsync();
            var customersThisMonth = await _context.Customers
                .Where(c => c.Orders != null && c.Orders.Any(o => o.OrderDate >= currentMonth))
                .CountAsync();
            var customersLastMonth = await _context.Customers
                .Where(c => c.Orders != null && c.Orders.Any(o => o.OrderDate >= previousMonth && o.OrderDate < currentMonth))
                .CountAsync();

            var totalProducts = await _context.Products.CountAsync();
            var productsThisMonth = await _context.Products.CountAsync(p => p.CreatedAt >= currentMonth);
            var productsLastMonth = await _context.Products.CountAsync(p => p.CreatedAt >= previousMonth && p.CreatedAt < currentMonth);

            var totalRevenue = await _context.Orders
                .Include(o => o.Payments)
                .Where(o => o.Status == OrderStatus.COMPLETED &&
                       o.Payments != null &&
                       o.Payments.Any(p => p.PaymentStatus == PaymentStatus.PAID))
                .SumAsync(o => (decimal?)o.TotalAmount) ?? 0;

            var revenueThisMonth = await _context.Orders
                .Include(o => o.Payments)
                .Where(o => o.OrderDate >= currentMonth &&
                       o.Status == OrderStatus.COMPLETED &&
                       o.Payments != null &&
                       o.Payments.Any(p => p.PaymentStatus == PaymentStatus.PAID))
                .SumAsync(o => (decimal?)o.TotalAmount) ?? 0;

            var revenueLastMonth = await _context.Orders
                .Include(o => o.Payments)
                .Where(o => o.OrderDate >= previousMonth && o.OrderDate < currentMonth &&
                       o.Status == OrderStatus.COMPLETED &&
                       o.Payments != null &&
                       o.Payments.Any(p => p.PaymentStatus == PaymentStatus.PAID))
                .SumAsync(o => (decimal?)o.TotalAmount) ?? 0;

            return new DashboardStatsDto
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
        }

        public async Task<List<MonthlyRevenueDto>> GetMonthlyRevenueAsync(int months = 12)
        {
            var now = DateTime.Now;
            var startDate = now.AddMonths(-months + 1);
            startDate = new DateTime(startDate.Year, startDate.Month, 1);

            var monthlyData = await _context.Orders
                .Include(o => o.Payments)
                .Where(o => o.OrderDate >= startDate &&
                       o.Status == OrderStatus.COMPLETED &&
                       o.Payments != null &&
                       o.Payments.Any(p => p.PaymentStatus == PaymentStatus.PAID))
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

            return result;
        }

        public async Task<List<TopProductDto>> GetTopProductsAsync(int top = 10)
        {
            return await _context.OrderDetails
                .Include(od => od.Product)
                .Include(od => od.Order)
                    .ThenInclude(o => o!.Payments)
                .Where(od => od.Order!.Status == OrderStatus.COMPLETED &&
                       od.Order.Payments != null &&
                       od.Order.Payments.Any(p => p.PaymentStatus == PaymentStatus.PAID))
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
        }

        public async Task<List<RecentOrderDto>> GetRecentOrdersAsync(int count = 10)
        {
            var recentOrders = await _context.Orders
                .Include(o => o.Customer)
                .OrderByDescending(o => o.OrderDate)
                .Take(count)
                .ToListAsync();

            return _mapper.Map<List<RecentOrderDto>>(recentOrders);
        }

        public async Task<DetailedReportDto> GetDetailedReportAsync()
        {
            var overallStats = await GetDashboardStatsAsync();
            var monthlyRevenues = await GetMonthlyRevenueAsync(12);
            var topProducts = await GetTopProductsAsync(10);
            var recentOrders = await GetRecentOrdersAsync(10);

            return new DetailedReportDto
            {
                OverallStats = overallStats,
                MonthlyRevenues = monthlyRevenues,
                TopProducts = topProducts,
                RecentOrders = recentOrders
            };
        }

        private static decimal CalculateGrowth(decimal current, decimal previous)
        {
            if (previous == 0)
                return current > 0 ? 100 : 0;

            return Math.Round(((current - previous) / previous) * 100, 1);
        }
    }
}
