using System.Threading.Tasks;
using StudentManagement.Core.DTOs;

namespace StudentManagement.Core.Interfaces
{
    /// <summary>
    /// Service interface handling the business logic of user authentication.
    /// Manages password hashing, user registration/validation, and JWT generation.
    /// </summary>
    public interface IAuthService
    {
        // Registers a new user. Returns user details and JWT token if successful, null if username/email already exists.
        Task<AuthResponseDto?> RegisterAsync(UserRegisterDto registerDto);

        // Authenticates a user. Returns user details and JWT token if successful, null if invalid credentials.
        Task<AuthResponseDto?> LoginAsync(UserLoginDto loginDto);
    }
}
