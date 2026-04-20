using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SalesManagementAPI.Models.DTO;
using SalesManagementAPI.Services.Interfaces;

namespace SalesManagementAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class EmployeesController : ControllerBase
    {
        private readonly IEmployeeService _employeeService;

        public EmployeesController(IEmployeeService employeeService)
        {
            _employeeService = employeeService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<EmployeeListItemDto>>> GetAll()
        {
            var employees = await _employeeService.GetAllAsync();
            return Ok(employees);
        }

        [HttpGet("{employeeId:int}")]
        public async Task<ActionResult<EmployeeListItemDto>> GetById(int employeeId)
        {
            var employee = await _employeeService.GetByIdAsync(employeeId);

            if (employee == null)
            {
                return NotFound(new { message = "Không tìm thấy nhân viên" });
            }

            return Ok(employee);
        }

        [HttpPost]
        public async Task<ActionResult<EmployeeListItemDto>> Create([FromBody] CreateEmployeeDto dto)
        {
            var result = await _employeeService.CreateAsync(dto);
            if (!result.Success)
            {
                return BadRequest(new { message = result.Message });
            }

            return CreatedAtAction(nameof(GetById), new { employeeId = result.Employee!.EmployeeID }, result.Employee);
        }

        [HttpPut("{employeeId:int}")]
        public async Task<ActionResult<EmployeeListItemDto>> Update(int employeeId, [FromBody] UpdateEmployeeDto dto)
        {
            var existing = await _employeeService.GetByIdAsync(employeeId);
            if (existing == null)
            {
                return NotFound(new { message = "Không tìm thấy nhân viên" });
            }

            var result = await _employeeService.UpdateAsync(employeeId, dto);
            if (!result.Success)
            {
                return BadRequest(new { message = result.Message });
            }

            return Ok(result.Employee);
        }

        [HttpPatch("{employeeId:int}/status")]
        public async Task<ActionResult<EmployeeListItemDto>> UpdateStatus(int employeeId, [FromBody] UpdateEmployeeStatusDto dto)
        {
            var existing = await _employeeService.GetByIdAsync(employeeId);
            if (existing == null)
            {
                return NotFound(new { message = "Không tìm thấy nhân viên" });
            }

            var result = await _employeeService.UpdateStatusAsync(employeeId, dto);
            if (!result.Success)
            {
                return BadRequest(new { message = result.Message });
            }

            return Ok(result.Employee);
        }
    }
}
