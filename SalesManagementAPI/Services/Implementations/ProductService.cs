using Microsoft.EntityFrameworkCore;
using SalesManagementAPI.Data;
using SalesManagementAPI.Models;
using SalesManagementAPI.Services.Interfaces;

namespace SalesManagementAPI.Services.Implementations
{
  public class ProductService : IProductService
  {
    private readonly ApplicationDbContext _context;

    public ProductService(ApplicationDbContext context)
    {
      _context = context;
    }

    public async Task<Product?> GetProductByIdAsync(int productId)
    {
      return await _context.Products
          .Include(p => p.Category)
          .FirstOrDefaultAsync(p => p.ProductID == productId);
    }

    public async Task<IEnumerable<Product>> GetAllProductsAsync()
    {
      return await _context.Products
          .Include(p => p.Category)
          .ToListAsync();
    }

    public async Task<Product?> GetProductByNameAsync(string productName)
    {
      return await _context.Products
         .Include(p => p.Category)
         .FirstOrDefaultAsync(p => p.ProductName == productName);
    }

    public async Task<IEnumerable<Product>> SearchProductsByNameAsync(string searchTerm)
    {
      return await _context.Products
          .Include(p => p.Category)
          .Where(p => p.ProductName.Contains(searchTerm))
          .ToListAsync();
    }
  }
}
