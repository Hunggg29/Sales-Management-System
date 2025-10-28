using SalesManagementAPI.Models;

namespace SalesManagementAPI.Services.Interfaces
{
    public interface ICustomerService
    {
        Task<IEnumerable<Customer>> GetAllCustomerAsync();

        Task<Customer?> GetCustomerByCustomerIdAsync(int id);

        Task<Customer> CreateCustomerAsync(Customer customer);
        Task<Customer?> UpdateCustomerAsync(int customerId, Customer customer);
    }
}
