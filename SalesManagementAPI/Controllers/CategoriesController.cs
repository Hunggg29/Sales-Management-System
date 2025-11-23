using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SalesManagementAPI.Services.Interfaces;

namespace SalesManagementAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private readonly ICategoryService _categoryService;

        public CategoriesController(ICategoryService categoryService)
        {
            _categoryService = categoryService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllCategories()
        {
            var results = await _categoryService.GetAllCategoriesAsync();
            if (results == null)
            {
                return NotFound();
            }
            return Ok(results);
        }

        [HttpGet("with-products")]
        public async Task<IActionResult> GetProductsWithCategory()
        {
            var results = await _categoryService.GetProductsByCategoryAsync();
            if (results == null)
            {
                return NotFound();
            }
            return Ok(results);
        }
    }
}
