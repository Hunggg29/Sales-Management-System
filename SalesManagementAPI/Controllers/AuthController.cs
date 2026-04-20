using Microsoft.AspNetCore.Mvc;
using SalesManagementAPI.Models.DTO;
using SalesManagementAPI.Services.Interfaces;

namespace SalesManagementAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("oauth/google")]
        public async Task<IActionResult> LoginWithGoogle([FromBody] GoogleLoginRequestDto googleLoginRequestDto)
        {
            if (string.IsNullOrWhiteSpace(googleLoginRequestDto.ProviderToken))
            {
                return BadRequest(new { message = "providerToken là bắt buộc" });
            }

            var (success, tokenOrMessage, user) = await _authService.GoogleLoginAsync(
                googleLoginRequestDto.ProviderToken,
                googleLoginRequestDto.Name);

            if (!success || user == null)
            {
                return Unauthorized(new { message = tokenOrMessage });
            }

            var responseUser = new
            {
                user.UserID,
                user.UserName,
                user.Email,
                user.Role,
                user.CreatedAt,
                user.IsActive,
                EmployeeID = user.Employee?.EmployeeID
            };

            return Ok(new { user = responseUser, token = tokenOrMessage });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDto request)
        {
            var (success, token) = await _authService.LoginAsync(request.Email, request.Password);
            if (!success)
                return Unauthorized(new { message = token });

            // Fetch the user by email (since user is not available from claims at this point)
            var user = await _authService.GetUserByEmailAsync(request.Email);
            var responseUser = user == null ? null : new
            {
                user.UserID,
                user.UserName,
                user.Email,
                user.Role,
                user.CreatedAt,
                user.IsActive,
                EmployeeID = user.Employee?.EmployeeID
            };

            return Ok(new { user = responseUser, token });
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequestDto request)
        {
            var (success, message) = await _authService.RegisterAsync(request.Username, request.Email, request.Password);
            if (!success) return BadRequest(new { message });
            return Ok(new { message });

        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequestDto request)
        {
            if (string.IsNullOrWhiteSpace(request.Email))
            {
                return BadRequest(new { message = "Email là bắt buộc" });
            }

            try
            {
                await _authService.ForgotPasswordAsync(request.Email);
            }
            catch (Exception)
            {
                return StatusCode(500, new { message = "Không thể gửi email đặt lại mật khẩu. Vui lòng kiểm tra cấu hình SMTP." });
            }

            return Ok(new { message = "Đã gửi liên kết đặt lại mật khẩu." });
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequestDto request)
        {
            if (string.IsNullOrWhiteSpace(request.Email) ||
                string.IsNullOrWhiteSpace(request.Token) ||
                string.IsNullOrWhiteSpace(request.NewPassword))
            {
                return BadRequest(new { message = "Email, token và mật khẩu mới là bắt buộc" });
            }

            if (request.NewPassword.Length < 6)
            {
                return BadRequest(new { message = "Mật khẩu mới phải có ít nhất 6 ký tự" });
            }

            var (success, message) = await _authService.ResetPasswordAsync(
                request.Email,
                request.Token,
                request.NewPassword);

            if (!success)
            {
                return BadRequest(new { message });
            }

            return Ok(new { message });
        }

    }
}
