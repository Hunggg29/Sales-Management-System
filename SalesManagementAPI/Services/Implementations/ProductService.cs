using Microsoft.EntityFrameworkCore;
using SalesManagementAPI.Data;
using SalesManagementAPI.Models;
using SalesManagementAPI.Models.DTO;
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

    public async Task<Product> CreateProductAsync(CreateProductDto createProductDto)
    {
      var product = new Product
      {
        ProductName = createProductDto.ProductName,
        Description = createProductDto.Description,
        UnitPrice = createProductDto.UnitPrice,
        StockQuantity = createProductDto.StockQuantity,
        CategoryID = createProductDto.CategoryID,
        ImageURL = createProductDto.ImageURL,
        Unit = createProductDto.Unit,
        CreatedAt = DateTime.Now,
        IsActive = true
      };

      await _context.Products.AddAsync(product);
      await _context.SaveChangesAsync();

      return await GetProductByIdAsync(product.ProductID) ?? product;
    }

    public async Task<Product?> UpdateProductAsync(int productId, UpdateProductDto updateProductDto)
    {
      var product = await _context.Products.FindAsync(productId);
      if (product == null)
        return null;

      product.ProductName = updateProductDto.ProductName;
      product.Description = updateProductDto.Description;
      product.UnitPrice = updateProductDto.UnitPrice;
      product.StockQuantity = updateProductDto.StockQuantity;
      product.CategoryID = updateProductDto.CategoryID;
      product.ImageURL = updateProductDto.ImageURL;
      product.Unit = updateProductDto.Unit;

      await _context.SaveChangesAsync();

      return await GetProductByIdAsync(product.ProductID);
    }

    public async Task<bool> DeleteProductAsync(int productId)
    {
      var product = await _context.Products.FindAsync(productId);
      if (product == null)
        return false;

      _context.Products.Remove(product);
      await _context.SaveChangesAsync();

      return true;
    }

    public async Task<bool> UpdateProductStockAsync(int productId, int stockQuantity)
    {
      var product = await _context.Products.FindAsync(productId);
      if (product == null)
        return false;

      product.StockQuantity = stockQuantity;

      await _context.SaveChangesAsync();

      return true;
    }
  }
}
