using SalesManagementAPI.Models;

namespace SalesManagementAPI.Services.Interfaces
{
    public interface ICategoryService
    {
        Task<IEnumerable<Category>> GetProductsByCategoryAsync();
        Task<IEnumerable<Category>> GetAllCategoriesAsync();

    }
}
