using SalesManagementAPI.Models;
using SalesManagementAPI.Models.DTO;

namespace SalesManagementAPI.Services.Interfaces
{
  public interface IProductService
  {
    Task<Product?> GetProductByIdAsync(int productId);
    Task<IEnumerable<Product>> GetAllProductsAsync();
    Task<Product?> GetProductByNameAsync(string productName);
    Task<IEnumerable<Product>> SearchProductsByNameAsync(string searchTerm);
    Task<Product> CreateProductAsync(CreateProductDto createProductDto);
    Task<Product?> UpdateProductAsync(int productId, UpdateProductDto updateProductDto);
    Task<bool> DeleteProductAsync(int productId);
    Task<bool> UpdateProductStockAsync(int productId, int stockQuantity);
  }
}
