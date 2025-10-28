using SalesManagementAPI.Models;

namespace SalesManagementAPI.Services.Interfaces
{
    public interface IAuthService
    {
        Task<(bool success, string token)> LoginAsync(string username, string password);
        Task<(bool success, string message)> RegisterAsync(string username, string email, string password);
        Task<User> GetUserByIdAsync(int id);
        Task<bool> DeleteUserAsync(int id);

        Task<bool> UpdateUserAsync(User user);

        Task<User> GetUserByEmailAsync(string email);

    }
}
