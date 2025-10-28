using Microsoft.EntityFrameworkCore;
using SalesManagementAPI.Data;
using SalesManagementAPI.Models;
using SalesManagementAPI.Services.Interfaces;

namespace SalesManagementAPI.Services.Implementations
{
    public class CustomerService : ICustomerService
    {
        private readonly ApplicationDbContext _context;

        public CustomerService(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<IEnumerable<Customer>> GetAllCustomerAsync()
        {
            return await _context.Customers.ToListAsync();
        }

        public async Task<Customer?> GetCustomerByCustomerIdAsync(int id)
        {
            return await _context.Customers.FirstOrDefaultAsync(c => c.CustomerID == id);
        }

        public async Task<Customer> CreateCustomerAsync(Customer customer)
        {
            _context.Customers.Add(customer);
            await _context.SaveChangesAsync();
            return customer;
        }

        public async Task<Customer?> UpdateCustomerAsync(int customerId, Customer customer)
        {
            var existCustomer = await _context.Customers.FirstOrDefaultAsync(c => c.CustomerID == customerId);
            if (existCustomer == null)
            {
                return null;
            }
            existCustomer.FullName = customer.FullName;
            existCustomer.Phone = customer.Phone;
            existCustomer.Address = customer.Address;
            existCustomer.CompanyName = customer.CompanyName;

            await _context.SaveChangesAsync();

            return existCustomer;
        }
    }
}
