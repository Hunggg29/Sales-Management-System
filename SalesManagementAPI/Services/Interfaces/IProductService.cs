using SalesManagementAPI.Models;

namespace SalesManagementAPI.Services.Interfaces
{
  public interface IProductService
  {
    Task<Product?> GetProductByIdAsync(int productId);
    Task<IEnumerable<Product>> GetAllProductsAsync();
    Task<Product?> GetProductByNameAsync(string productName);
    Task<IEnumerable<Product>> SearchProductsByNameAsync(string searchTerm);
  }
}
