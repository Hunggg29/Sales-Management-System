using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SalesManagementAPI.Models;
using SalesManagementAPI.Models.DTO;
using SalesManagementAPI.Services.Implementations;
using SalesManagementAPI.Services.Interfaces;

namespace SalesManagementAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //[Authorize]
    public class CustomersController : ControllerBase
    {
        private readonly ICustomerService _customerService;
        private readonly IMapper _mapper;

        public CustomersController(ICustomerService customerService, IMapper mapper)
        {
            _customerService = customerService;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllCustomers()
        {
            var customers = await _customerService.GetAllCustomerAsync();
            return Ok(customers);
        }

        [HttpGet("{userId}")]
        public async Task<IActionResult> GetCustomerByUserId(int userId)
        {
            var customer = await _customerService.GetCustomerByUserIdAsync(userId);
            if (customer == null)
            {
                return NotFound(new { message = "Không tìm thấy tài khoản khách hàng" });
            }
            return Ok(customer);
        }

        [HttpPost]
        public async Task<IActionResult> CreateCustomer([FromBody] CreateCustomerDto createCustomerDto)
        {
            try
            {
                var customer = _mapper.Map<Customer>(createCustomerDto);
                var createdCustomer = await _customerService.CreateCustomerAsync(customer);
                return CreatedAtAction(nameof(GetCustomerByUserId), new { userId = createdCustomer.UserID }, createdCustomer);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{userId}")]
        public async Task<IActionResult> UpdateCustomerByUserId([FromRoute] int userId, [FromBody] UpdateCustomerDto updateCustomerDto)
        {
            try
            {
                var customer = _mapper.Map<Customer>(updateCustomerDto);
                customer = await _customerService.UpdateCustomerByUserIdAsync(userId, customer);
                if (customer == null)
                {
                    return NotFound(new { message = "Không tìm thấy tài khoản khách hàng" });
                }
                return Ok(customer);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{userId}")]
        public async Task<IActionResult> DeleteCustomer(int userId)
        {
            try
            {
                var result = await _customerService.DeleteCustomerByUserIdAsync(userId);
                if (!result)
                {
                    return NotFound(new { message = "Không tìm thấy khách hàng" });
                }
                return Ok(new { message = "Xóa khách hàng thành công" });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi xóa khách hàng: " + ex.Message });
            }
        }
    }
}
