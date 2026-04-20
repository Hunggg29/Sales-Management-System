using SalesManagementAPI.Models.DTO;

namespace SalesManagementAPI.Services.Interfaces
{
    public interface IEmployeeService
    {
        Task<List<EmployeeListItemDto>> GetAllAsync();
        Task<EmployeeListItemDto?> GetByIdAsync(int employeeId);
        Task<(bool Success, string Message, EmployeeListItemDto? Employee)> CreateAsync(CreateEmployeeDto dto);
        Task<(bool Success, string Message, EmployeeListItemDto? Employee)> UpdateAsync(int employeeId, UpdateEmployeeDto dto);
        Task<(bool Success, string Message, EmployeeListItemDto? Employee)> UpdateStatusAsync(int employeeId, UpdateEmployeeStatusDto dto);
    }
}
