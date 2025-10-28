using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SalesManagementAPI.Data;
using SalesManagementAPI.Models;
using SalesManagementAPI.Services.Interfaces;
using System.ComponentModel;

namespace SalesManagementAPI.Services.Implementations
{
    public class CategoryService : ICategoryService
    {
        private readonly ApplicationDbContext _context;

        public CategoryService(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IEnumerable<Category>> GetProductsByCategoryAsync()
        {
            var results = await _context.Categories
                .Include(c => c.Products.Where(p => p.IsActive))
                .ToListAsync();

            return results;
        }


    }
}
