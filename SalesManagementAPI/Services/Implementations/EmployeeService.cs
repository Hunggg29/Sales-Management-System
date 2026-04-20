using AutoMapper;
using Microsoft.EntityFrameworkCore;
using SalesManagementAPI.Data;
using SalesManagementAPI.Models;
using SalesManagementAPI.Models.DTO;
using SalesManagementAPI.Services.Interfaces;

namespace SalesManagementAPI.Services.Implementations
{
    public class EmployeeService : IEmployeeService
    {
        private readonly ApplicationDbContext _context;
        private readonly IAuthService _authService;
        private readonly IMapper _mapper;

        public EmployeeService(ApplicationDbContext context, IAuthService authService, IMapper mapper)
        {
            _context = context;
            _authService = authService;
            _mapper = mapper;
        }

        public async Task<List<EmployeeListItemDto>> GetAllAsync()
        {
            var employees = await _context.Employees
                .Include(e => e.User)
                .Where(e => e.User.Role == "Staff")
                .OrderByDescending(e => e.CreatedAt)
                .ToListAsync();

            return _mapper.Map<List<EmployeeListItemDto>>(employees);
        }

        public async Task<EmployeeListItemDto?> GetByIdAsync(int employeeId)
        {
            var employee = await _context.Employees
                .Include(e => e.User)
                .FirstOrDefaultAsync(e => e.EmployeeID == employeeId && e.User.Role == "Staff");

            return employee == null ? null : _mapper.Map<EmployeeListItemDto>(employee);
        }

        public async Task<(bool Success, string Message, EmployeeListItemDto? Employee)> CreateAsync(CreateEmployeeDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.UserName) || string.IsNullOrWhiteSpace(dto.Email) || string.IsNullOrWhiteSpace(dto.Password))
            {
                return (false, "Vui lòng nhập đầy đủ tên đăng nhập, email và mật khẩu", null);
            }

            if (!Enum.IsDefined(typeof(EmployeeType), dto.EmployeeType))
            {
                return (false, "Loại nhân viên không hợp lệ", null);
            }

            var normalizedEmail = dto.Email.Trim().ToLowerInvariant();
            var existing = await _context.Users.AnyAsync(u => u.Email.ToLower() == normalizedEmail);
            if (existing)
            {
                return (false, "Email đã được sử dụng", null);
            }

            var (success, message) = await _authService.RegisterAdminAsync(dto.UserName.Trim(), normalizedEmail, dto.Password, "Staff");
            if (!success)
            {
                return (false, message, null);
            }

            var user = await _context.Users
                .Include(u => u.Employee)
                .FirstOrDefaultAsync(u => u.Email.ToLower() == normalizedEmail && u.Role == "Staff");

            if (user == null || user.Employee == null)
            {
                return (false, "Không thể tạo hồ sơ nhân viên", null);
            }

            user.Employee.EmployeeType = (EmployeeType)dto.EmployeeType;
            user.Employee.IsActive = true;
            user.IsActive = true;

            await _context.SaveChangesAsync();

            return (true, "Tạo nhân viên thành công", _mapper.Map<EmployeeListItemDto>(user.Employee));
        }

        public async Task<(bool Success, string Message, EmployeeListItemDto? Employee)> UpdateAsync(int employeeId, UpdateEmployeeDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.UserName) || string.IsNullOrWhiteSpace(dto.Email))
            {
                return (false, "Tên đăng nhập và email không được để trống", null);
            }

            if (!Enum.IsDefined(typeof(EmployeeType), dto.EmployeeType))
            {
                return (false, "Loại nhân viên không hợp lệ", null);
            }

            var employee = await _context.Employees
                .Include(e => e.User)
                .FirstOrDefaultAsync(e => e.EmployeeID == employeeId && e.User.Role == "Staff");

            if (employee == null)
            {
                return (false, "Không tìm thấy nhân viên", null);
            }

            var normalizedEmail = dto.Email.Trim().ToLowerInvariant();
            var duplicateEmail = await _context.Users.AnyAsync(u => u.UserID != employee.UserID && u.Email.ToLower() == normalizedEmail);
            if (duplicateEmail)
            {
                return (false, "Email đã được sử dụng", null);
            }

            employee.User.UserName = dto.UserName.Trim();
            employee.User.Email = normalizedEmail;
            employee.EmployeeType = (EmployeeType)dto.EmployeeType;
            employee.IsActive = dto.IsActive;
            employee.User.IsActive = dto.IsActive;

            await _context.SaveChangesAsync();

            return (true, "Cập nhật nhân viên thành công", _mapper.Map<EmployeeListItemDto>(employee));
        }

        public async Task<(bool Success, string Message, EmployeeListItemDto? Employee)> UpdateStatusAsync(int employeeId, UpdateEmployeeStatusDto dto)
        {
            var employee = await _context.Employees
                .Include(e => e.User)
                .FirstOrDefaultAsync(e => e.EmployeeID == employeeId && e.User.Role == "Staff");

            if (employee == null)
            {
                return (false, "Không tìm thấy nhân viên", null);
            }

            employee.IsActive = dto.IsActive;
            employee.User.IsActive = dto.IsActive;

            await _context.SaveChangesAsync();

            return (true, "Cập nhật trạng thái nhân viên thành công", _mapper.Map<EmployeeListItemDto>(employee));
        }
    }
}
