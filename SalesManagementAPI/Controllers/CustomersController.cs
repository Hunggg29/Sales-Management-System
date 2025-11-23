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
            var customer = _mapper.Map<Customer>(createCustomerDto);
            await _customerService.CreateCustomerAsync(customer);
            return CreatedAtAction(nameof(GetCustomerByUserId), new { userId = customer.UserID }, customer);
        }

        [HttpPut("{userId}")]
        public async Task<IActionResult> UpdateCustomerByUserId([FromRoute] int userId, [FromBody] UpdateCustomerDto updateCustomerDto)
        {
            var customer = _mapper.Map<Customer>(updateCustomerDto);
            customer = await _customerService.UpdateCustomerByUserIdAsync(userId, customer);
            if (customer == null)
            {
                return NotFound(new { message = "Không tìm thấy tài khoản khách hàng" });
            }
            return Ok(customer);
        }


    }
}
