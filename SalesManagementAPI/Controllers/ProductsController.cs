using Microsoft.AspNetCore.Mvc;
using SalesManagementAPI.Models.DTO;
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

    [HttpPost]
    public async Task<IActionResult> CreateProduct([FromBody] CreateProductDto createProductDto)
    {
      try
      {
        var product = await _productService.CreateProductAsync(createProductDto);
        return CreatedAtAction(nameof(GetProductById), new { id = product.ProductID }, product);
      }
      catch (Exception ex)
      {
        return BadRequest(new { message = ex.Message });
      }
    }

    [HttpPut("{productId}")]
    public async Task<IActionResult> UpdateProduct([FromRoute] int productId, [FromBody] UpdateProductDto updateProductDto)
    {
      try
      {
        var product = await _productService.UpdateProductAsync(productId, updateProductDto);
        if (product == null)
        {
          return NotFound(new { message = "Sản phẩm không tồn tại" });
        }
        return Ok(product);
      }
      catch (Exception ex)
      {
        return BadRequest(new { message = ex.Message });
      }
    }

    [HttpDelete("{productId}")]
    public async Task<IActionResult> DeleteProduct([FromRoute] int productId)
    {
      try
      {
        var success = await _productService.DeleteProductAsync(productId);
        if (!success)
        {
          return NotFound(new { message = "Sản phẩm không tồn tại" });
        }
        return Ok(new { message = "Xóa sản phẩm thành công" });
      }
      catch (Exception ex)
      {
        return BadRequest(new { message = ex.Message });
      }
    }

    [HttpPatch("{productId}/stock")]
    public async Task<IActionResult> UpdateProductStock([FromRoute] int productId, [FromBody] UpdateStockDto updateStockDto)
    {
      try
      {
        var success = await _productService.UpdateProductStockAsync(productId, updateStockDto.StockQuantity);
        if (!success)
        {
          return NotFound(new { message = "Sản phẩm không tồn tại" });
        }
        return Ok(new { message = "Cập nhật số lượng thành công" });
      }
      catch (Exception ex)
      {
        return BadRequest(new { message = ex.Message });
      }
    }
  }
}
