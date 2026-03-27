using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SalesManagementAPI.Data;
using SalesManagementAPI.Models;
using SalesManagementAPI.Models.DTO;
using SalesManagementAPI.Services.Interfaces;

namespace SalesManagementAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class EmployeesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IAuthService _authService;

        public EmployeesController(ApplicationDbContext context, IAuthService authService)
        {
            _context = context;
            _authService = authService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<EmployeeListItemDto>>> GetAll()
        {
            var employees = await _context.Employees
                .Include(e => e.User)
                .Where(e => e.User.Role == "Staff")
                .OrderByDescending(e => e.CreatedAt)
                .Select(e => ToListItem(e))
                .ToListAsync();

            return Ok(employees);
        }

        [HttpGet("{employeeId:int}")]
        public async Task<ActionResult<EmployeeListItemDto>> GetById(int employeeId)
        {
            var employee = await _context.Employees
                .Include(e => e.User)
                .FirstOrDefaultAsync(e => e.EmployeeID == employeeId && e.User.Role == "Staff");

            if (employee == null)
            {
                return NotFound(new { message = "Không tìm thấy nhân viên" });
            }

            return Ok(ToListItem(employee));
        }

        [HttpPost]
        public async Task<ActionResult<EmployeeListItemDto>> Create([FromBody] CreateEmployeeDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.UserName) || string.IsNullOrWhiteSpace(dto.Email) || string.IsNullOrWhiteSpace(dto.Password))
            {
                return BadRequest(new { message = "Vui lòng nhập đầy đủ tên đăng nhập, email và mật khẩu" });
            }

            if (!Enum.IsDefined(typeof(EmployeeType), dto.EmployeeType))
            {
                return BadRequest(new { message = "Loại nhân viên không hợp lệ" });
            }

            var normalizedEmail = dto.Email.Trim().ToLowerInvariant();
            var existing = await _context.Users.AnyAsync(u => u.Email.ToLower() == normalizedEmail);
            if (existing)
            {
                return BadRequest(new { message = "Email đã được sử dụng" });
            }

            var (success, message) = await _authService.RegisterAdminAsync(dto.UserName.Trim(), normalizedEmail, dto.Password, "Staff");
            if (!success)
            {
                return BadRequest(new { message });
            }

            var user = await _context.Users
                .Include(u => u.Employee)
                .FirstOrDefaultAsync(u => u.Email.ToLower() == normalizedEmail && u.Role == "Staff");

            if (user == null || user.Employee == null)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Không thể tạo hồ sơ nhân viên" });
            }

            user.Employee.EmployeeType = (EmployeeType)dto.EmployeeType;
            user.Employee.IsActive = true;
            user.IsActive = true;

            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { employeeId = user.Employee.EmployeeID }, ToListItem(user.Employee));
        }

        [HttpPut("{employeeId:int}")]
        public async Task<ActionResult<EmployeeListItemDto>> Update(int employeeId, [FromBody] UpdateEmployeeDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.UserName) || string.IsNullOrWhiteSpace(dto.Email))
            {
                return BadRequest(new { message = "Tên đăng nhập và email không được để trống" });
            }

            if (!Enum.IsDefined(typeof(EmployeeType), dto.EmployeeType))
            {
                return BadRequest(new { message = "Loại nhân viên không hợp lệ" });
            }

            var employee = await _context.Employees
                .Include(e => e.User)
                .FirstOrDefaultAsync(e => e.EmployeeID == employeeId && e.User.Role == "Staff");

            if (employee == null)
            {
                return NotFound(new { message = "Không tìm thấy nhân viên" });
            }

            var normalizedEmail = dto.Email.Trim().ToLowerInvariant();
            var duplicateEmail = await _context.Users.AnyAsync(u => u.UserID != employee.UserID && u.Email.ToLower() == normalizedEmail);
            if (duplicateEmail)
            {
                return BadRequest(new { message = "Email đã được sử dụng" });
            }

            employee.User.UserName = dto.UserName.Trim();
            employee.User.Email = normalizedEmail;
            employee.EmployeeType = (EmployeeType)dto.EmployeeType;
            employee.IsActive = dto.IsActive;
            employee.User.IsActive = dto.IsActive;

            await _context.SaveChangesAsync();

            return Ok(ToListItem(employee));
        }

        [HttpPatch("{employeeId:int}/status")]
        public async Task<ActionResult<EmployeeListItemDto>> UpdateStatus(int employeeId, [FromBody] UpdateEmployeeStatusDto dto)
        {
            var employee = await _context.Employees
                .Include(e => e.User)
                .FirstOrDefaultAsync(e => e.EmployeeID == employeeId && e.User.Role == "Staff");

            if (employee == null)
            {
                return NotFound(new { message = "Không tìm thấy nhân viên" });
            }

            employee.IsActive = dto.IsActive;
            employee.User.IsActive = dto.IsActive;

            await _context.SaveChangesAsync();

            return Ok(ToListItem(employee));
        }

        private static EmployeeListItemDto ToListItem(Employee employee)
        {
            return new EmployeeListItemDto
            {
                EmployeeID = employee.EmployeeID,
                UserID = employee.UserID,
                UserName = employee.User.UserName,
                Email = employee.User.Email,
                Role = employee.User.Role,
                IsActive = employee.IsActive && employee.User.IsActive,
                EmployeeType = (int)employee.EmployeeType,
                EmployeeTypeName = employee.EmployeeType.ToString(),
                CreatedAt = employee.CreatedAt
            };
        }
    }
}
