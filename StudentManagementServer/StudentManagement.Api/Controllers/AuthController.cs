using Microsoft.AspNetCore.Mvc;
using StudentManagement.Core.DTOs;
using StudentManagement.Core.Interfaces;
using System.Threading.Tasks;

namespace StudentManagement.Api.Controllers
{
    /// <summary>
    /// API Controller exposing endpoints for User Registration and User Login.
    /// Uses IAuthService to coordinate password verification and token generation.
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        /// <summary>
        /// Registers a new user account.
        /// POST /api/auth/register
        /// </summary>
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserRegisterDto registerDto)
        {
            // Call service to register user
            var result = await _authService.RegisterAsync(registerDto);
            
            if (result == null)
            {
                // If service returns null, user already exists (Username or Email duplication)
                ModelState.AddModelError("DuplicateUser", "Username or Email address is already in use.");
                return ValidationProblem(ModelState);
            }

            return Ok(result);
        }

        /// <summary>
        /// Authenticates user credentials and returns a JWT token.
        /// POST /api/auth/login
        /// </summary>
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserLoginDto loginDto)
        {
            var result = await _authService.LoginAsync(loginDto);
            
            if (result == null)
            {
                // Return 400 Bad Request with a clear message on authentication failure
                return BadRequest(new { Message = "Invalid username/email or password." });
            }

            return Ok(result);
        }
    }
}
