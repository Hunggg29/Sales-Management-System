using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity.Data;
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
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDto request)
        {
            var (success, token) = await _authService.LoginAsync(request.Email, request.Password);
            if (!success)
                return Unauthorized(new { message = token });

            // Fetch the user by email (since user is not available from claims at this point)
            var user = await _authService.GetUserByEmailAsync(request.Email);
            // Remove sensitive info
            if (user != null) user.PasswordHash = null;

            return Ok(new { user, token });
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequestDto request)
        {
            var (success, message) = await _authService.RegisterAsync(request.Username, request.Email, request.Password);
            if (!success) return BadRequest(new { message });
            return Ok(new {message});

        }
    }
}
