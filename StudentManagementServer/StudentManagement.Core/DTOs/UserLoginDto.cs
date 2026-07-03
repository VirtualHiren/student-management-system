using System.ComponentModel.DataAnnotations;

namespace StudentManagement.Core.DTOs
{
    /// <summary>
    /// DTO for capturing user login credentials.
    /// Supports logging in with either username or email.
    /// </summary>
    public class UserLoginDto
    {
        [Required(ErrorMessage = "Username or Email is required.")]
        public string UsernameOrEmail { get; set; } = string.Empty;

        [Required(ErrorMessage = "Password is required.")]
        public string Password { get; set; } = string.Empty;
    }
}
