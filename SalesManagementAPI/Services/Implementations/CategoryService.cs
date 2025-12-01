using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SalesManagementAPI.Data;
using SalesManagementAPI.Models;
using SalesManagementAPI.Services.Interfaces;

namespace SalesManagementAPI.Services.Implementations
{
    public class CategoryService : ICategoryService
    {
        private readonly ApplicationDbContext _context;

        public CategoryService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Category>> GetAllCategoriesAsync()
        {
            return await _context.Categories.ToListAsync();
        }

        public async Task<Category?> GetCategoryByIdAsync(int id)
        {
            return await _context.Categories.FirstOrDefaultAsync(c => c.CategoryID == id);
        }

        [HttpGet]
        public async Task<IEnumerable<Category>> GetProductsByCategoryAsync()
        {
            var results = await _context.Categories
                .Include(c => c.Products)
                .ToListAsync();

            // Filter active products in memory to avoid null reference
            foreach (var category in results)
            {
                if (category.Products != null)
                {
                    category.Products = category.Products.Where(p => p.IsActive).ToList();
                }
            }

            return results;
        }

        public async Task<Category> CreateCategoryAsync(Category category)
        {
            _context.Categories.Add(category);
            await _context.SaveChangesAsync();
            return category;
        }

        public async Task<Category?> UpdateCategoryAsync(int id, Category category)
        {
            var existingCategory = await _context.Categories.FirstOrDefaultAsync(c => c.CategoryID == id);
            if (existingCategory == null)
            {
                return null;
            }

            existingCategory.CategoryName = category.CategoryName;
            existingCategory.Description = category.Description;

            await _context.SaveChangesAsync();
            return existingCategory;
        }

        public async Task<bool> DeleteCategoryAsync(int id)
        {
            var category = await _context.Categories.FirstOrDefaultAsync(c => c.CategoryID == id);
            if (category == null)
            {
                return false;
            }

            // Check if category has products
            var hasProducts = await _context.Products.AnyAsync(p => p.CategoryID == id);
            if (hasProducts)
            {
                throw new InvalidOperationException("Không thể xóa danh mục đang có sản phẩm");
            }

            _context.Categories.Remove(category);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
