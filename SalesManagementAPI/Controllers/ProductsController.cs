using Microsoft.AspNetCore.Mvc;
using SalesManagementAPI.Services.Interfaces;

namespace SalesManagementAPI.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class ProductsController : ControllerBase
  {
    private readonly IProductService _productService;

    public ProductsController(IProductService productService)
    {
      _productService = productService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllProducts()
    {
      var results = await _productService.GetAllProductsAsync();
      if (results == null || !results.Any())
      {
        return NotFound();
      }
      return Ok(results);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetProductById(int id)
    {
      var result = await _productService.GetProductByIdAsync(id);
      if (result == null)
      {
        return NotFound(new { message = "Không tìm thấy sản phẩm" });
      }
      return Ok(result);
    }

    [HttpGet("search")]
    public async Task<IActionResult> SearchProductsByName([FromQuery] string name)
    {
      if (string.IsNullOrWhiteSpace(name))
      {
        return BadRequest(new { message = "Tên sản phẩm không được để trống" });
      }

      var results = await _productService.SearchProductsByNameAsync(name);
      if (results == null || !results.Any())
      {
        return Ok(new List<object>()); //return empty array instead of 404
      }
      return Ok(results);
    }
  }
}
