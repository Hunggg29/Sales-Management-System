using Microsoft.EntityFrameworkCore;
using Google.Apis.Auth;
using Microsoft.IdentityModel.Tokens;
using SalesManagementAPI.Data;
using SalesManagementAPI.Models;
using SalesManagementAPI.Services.Interfaces;
using System.Globalization;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Cryptography;
using System.Security.Claims;
using System.Text;
using BC = BCrypt.Net.BCrypt;

namespace SalesManagementAPI.Services.Implementations
{
    public class AuthService : IAuthService
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly IEmailService _emailService;

        public AuthService(ApplicationDbContext context, IConfiguration configuration, IEmailService emailService)
        {
            _context = context;
            _configuration = configuration;
            _emailService = emailService;
        }

        public async Task<(bool success, string token)> LoginAsync(string email, string password)
        {
            var user = await _context.Users
                .Include(u => u.Employee)
                .FirstOrDefaultAsync(u => u.Email == email);

            if (user == null || !BC.Verify(password, user.PasswordHash))
            {
                return (false, "Sai mật khẩu hoặc email");
            }

            if (!user.IsActive)
            {
                return (false, "Tài khoản đã bị vô hiệu hóa");
            }

            if (user.Role == "Staff")
            {
                if (user.Employee == null)
                {
                    return (false, "Tài khoản Staff chưa có hồ sơ nhân viên. Vui lòng liên hệ quản trị viên.");
                }

                if (!user.Employee.IsActive)
                {
                    return (false, "Hồ sơ nhân viên đã bị vô hiệu hóa");
                }
            }

            var token = GenerateJwtToken(user);
            return (true, token);
        }

        public async Task<(bool success, string tokenOrMessage, User? user)> GoogleLoginAsync(string providerToken, string? fallbackName)
        {
            if (string.IsNullOrWhiteSpace(providerToken))
            {
                return (false, "Google token không hợp lệ", null);
            }

            var googleClientId = _configuration["GoogleOAuth:ClientId"];
            if (string.IsNullOrWhiteSpace(googleClientId))
            {
                return (false, "Thiếu cấu hình GoogleOAuth:ClientId", null);
            }

            GoogleJsonWebSignature.Payload payload;
            try
            {
                payload = await GoogleJsonWebSignature.ValidateAsync(providerToken, new GoogleJsonWebSignature.ValidationSettings
                {
                    Audience = new[] { googleClientId }
                });
            }
            catch
            {
                return (false, "Google token không hợp lệ hoặc đã hết hạn", null);
            }

            if (string.IsNullOrWhiteSpace(payload.Email) || payload.EmailVerified != true)
            {
                return (false, "Email Google chưa được xác minh", null);
            }

            var user = await _context.Users
                .Include(u => u.Employee)
                .FirstOrDefaultAsync(u => u.Email == payload.Email);

            if (user == null)
            {
                var displayName = !string.IsNullOrWhiteSpace(payload.Name)
                    ? payload.Name
                    : fallbackName;

                if (string.IsNullOrWhiteSpace(displayName))
                {
                    displayName = payload.Email.Split('@')[0];
                }

                user = new User
                {
                    UserName = displayName,
                    Email = payload.Email,
                    // Keep PasswordHash non-null for current schema while allowing social-only auth.
                    PasswordHash = BC.HashPassword(Guid.NewGuid().ToString("N")),
                    Role = "User",
                    CreatedAt = DateTime.Now,
                    IsActive = true
                };

                await _context.Users.AddAsync(user);
                await _context.SaveChangesAsync();
            }

            if (!user.IsActive)
            {
                return (false, "Tài khoản đã bị vô hiệu hóa", null);
            }

            var token = GenerateJwtToken(user);
            return (true, token, user);
        }

        public async Task<(bool success, string message)> RegisterAsync(string username, string email, string password)
        {
            var existingUser = await _context.Users.AnyAsync(u => u.Email == email);
            if (existingUser)
            {
                return (false, "Email đã được sử dụng");
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
            return await _context.Users
                .Include(u => u.Employee)
                .FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task<(bool success, string message)> RegisterAdminAsync(string username, string email, string password, string role)
        {
            var existingUser = await _context.Users.AnyAsync(u => u.Email == email);
            if (existingUser)
            {
                return (false, "Email đã được sử dụng");
            }

            // Validate role
            if (role != "Admin" && role != "Staff")
            {
                return (false, "Role không hợp lệ. Chỉ chấp nhận Admin hoặc Staff");
            }

            var user = new User
            {
                UserName = username,
                Email = email,
                PasswordHash = BC.HashPassword(password),
                Role = role,
                CreatedAt = DateTime.Now,
                IsActive = true
            };

            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();

            if (role == "Staff")
            {
                var employee = new Employee
                {
                    UserID = user.UserID,
                    EmployeeType = EmployeeType.Sales,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                };

                await _context.Employees.AddAsync(employee);
                await _context.SaveChangesAsync();
            }

            return (true, $"{role} registered successfully");
        }

        public async Task ForgotPasswordAsync(string email)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email && u.IsActive);
            if (user == null)
            {
                return;
            }

            var rawToken = Convert.ToBase64String(RandomNumberGenerator.GetBytes(48));
            var tokenHash = HashToken(rawToken);

            user.ResetPasswordTokenHash = tokenHash;
            user.ResetPasswordTokenExpiresAt = DateTime.UtcNow.AddMinutes(20);
            user.ResetPasswordTokenUsedAt = null;

            await _context.SaveChangesAsync();

            var frontendBaseUrl = _configuration["App:FrontendBaseUrl"]?.TrimEnd('/') ?? "http://localhost:5173";
            var resetUrl = $"{frontendBaseUrl}/reset-password?email={Uri.EscapeDataString(user.Email)}&token={Uri.EscapeDataString(rawToken)}";

            var expiresAtLocal = user.ResetPasswordTokenExpiresAt.Value.ToLocalTime()
                .ToString("dd/MM/yyyy HH:mm", CultureInfo.InvariantCulture);

            var htmlBody = $@"
                <p>Xin chào {System.Net.WebUtility.HtmlEncode(user.UserName)},</p>
                <p>Chúng tôi đã nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.</p>
                <p>Vui lòng bấm vào liên kết dưới đây để đặt lại mật khẩu:</p>
                <p><a href=""{resetUrl}"">Đặt lại mật khẩu</a></p>
                <p>Liên kết sẽ hết hạn lúc <strong>{expiresAtLocal}</strong>.</p>
                <p>Nếu bạn không thực hiện yêu cầu này, bạn có thể bỏ qua email này.</p>";

            await _emailService.SendAsync(user.Email, "Yêu cầu đặt lại mật khẩu", htmlBody);
        }

        public async Task<(bool success, string message)> ResetPasswordAsync(string email, string token, string newPassword)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email && u.IsActive);
            if (user == null)
            {
                return (false, "Token không hợp lệ hoặc đã hết hạn");
            }

            if (string.IsNullOrWhiteSpace(user.ResetPasswordTokenHash) ||
                user.ResetPasswordTokenExpiresAt == null ||
                user.ResetPasswordTokenUsedAt != null ||
                user.ResetPasswordTokenExpiresAt <= DateTime.UtcNow)
            {
                return (false, "Token không hợp lệ hoặc đã hết hạn");
            }

            var incomingTokenHash = HashToken(token);
            if (!string.Equals(incomingTokenHash, user.ResetPasswordTokenHash, StringComparison.Ordinal))
            {
                return (false, "Token không hợp lệ hoặc đã hết hạn");
            }

            user.PasswordHash = BC.HashPassword(newPassword);
            user.ResetPasswordTokenUsedAt = DateTime.UtcNow;
            user.ResetPasswordTokenHash = null;
            user.ResetPasswordTokenExpiresAt = null;

            await _context.SaveChangesAsync();
            return (true, "Đặt lại mật khẩu thành công");
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

            if (user.Role == "Staff" && user.Employee != null)
            {
                claims = claims
                    .Append(new Claim("employee_type", user.Employee.EmployeeType.ToString()))
                    .Append(new Claim("employee_type_id", ((int)user.Employee.EmployeeType).ToString()))
                    .ToArray();
            }

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddDays(1),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private static string HashToken(string rawToken)
        {
            var bytes = Encoding.UTF8.GetBytes(rawToken);
            var hash = SHA256.HashData(bytes);
            return Convert.ToHexString(hash);
        }

    }
}
