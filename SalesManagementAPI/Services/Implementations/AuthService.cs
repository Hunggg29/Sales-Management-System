using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using SalesManagementAPI.Data;
using SalesManagementAPI.Models;
using SalesManagementAPI.Services.Interfaces;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BC = BCrypt.Net.BCrypt;

namespace SalesManagementAPI.Services.Implementations
{
    public class AuthService : IAuthService
    {   
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthService(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        public async Task<(bool success, string token)> LoginAsync(string email, string password)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            if(user == null || !BC.Verify(password, user.PasswordHash))
            {
                return (false, "Invalid email or password");
            }

            var token = GenerateJwtToken(user);
            return (true, token);
        }

        public async Task<(bool success, string message)> RegisterAsync(string username, string email, string password)
        {
            var existingUser = await _context.Users.AnyAsync(u => u.Email == email);
            if (existingUser)
            {
                return (false, "Email already in use");
            }
            var user = new User
            {
                UserName = username,
                Email = email,
                PasswordHash = BC.HashPassword(password),
                Role = "User",
                CreatedAt = DateTime.Now,
                IsActive = true
            };
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();
            return (true, "User registered successfully");
        }

        public async Task<User> GetUserByIdAsync(int id)
        {
            return await _context.Users.FindAsync(id);
        }

        public async Task<bool> UpdateUserAsync(User user)
        {
            var existingUser = await _context.Users.FindAsync(user.UserID);
            if (existingUser == null)
                return false;

            _context.Entry(existingUser).CurrentValues.SetValues(user);
            await _context.SaveChangesAsync();
            return true;
        }
        public async Task<bool> DeleteUserAsync(int userId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                return false;

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<User> GetUserByEmailAsync(string email)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
        }

        private string GenerateJwtToken(User user)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.UserID.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role)
            };

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddDays(1),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

    }
}
