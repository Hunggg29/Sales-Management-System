using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SalesManagementAPI.Models;
using SalesManagementAPI.Models.DTO;
using SalesManagementAPI.Services.Interfaces;

namespace SalesManagementAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private readonly ICategoryService _categoryService;
        private readonly IMapper _mapper;

        public CategoriesController(ICategoryService categoryService, IMapper mapper)
        {
            _categoryService = categoryService;
            _mapper = mapper;
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

        [HttpGet("{id}")]
        public async Task<IActionResult> GetCategoryById(int id)
        {
            var category = await _categoryService.GetCategoryByIdAsync(id);
            if (category == null)
            {
                return NotFound(new { message = "Không tìm thấy danh mục" });
            }
            return Ok(category);
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

        [HttpPost]
        public async Task<IActionResult> CreateCategory([FromBody] CreateCategoryDto createCategoryDto)
        {
            try
            {
                var category = _mapper.Map<Category>(createCategoryDto);
                var createdCategory = await _categoryService.CreateCategoryAsync(category);
                return CreatedAtAction(nameof(GetCategoryById), new { id = createdCategory.CategoryID }, createdCategory);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCategory(int id, [FromBody] UpdateCategoryDto updateCategoryDto)
        {
            try
            {
                var category = _mapper.Map<Category>(updateCategoryDto);
                var updatedCategory = await _categoryService.UpdateCategoryAsync(id, category);
                if (updatedCategory == null)
                {
                    return NotFound(new { message = "Không tìm thấy danh mục" });
                }
                return Ok(updatedCategory);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            try
            {
                var result = await _categoryService.DeleteCategoryAsync(id);
                if (!result)
                {
                    return NotFound(new { message = "Không tìm thấy danh mục" });
                }
                return Ok(new { message = "Xóa danh mục thành công" });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi xóa danh mục: " + ex.Message });
            }
        }
    }
}
