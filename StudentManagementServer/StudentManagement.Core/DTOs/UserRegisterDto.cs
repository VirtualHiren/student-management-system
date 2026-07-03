using System.ComponentModel.DataAnnotations;

namespace StudentManagement.Core.DTOs
{
    /// <summary>
    /// DTO for capturing user registration parameters.
    /// Includes model validation rules.
    /// </summary>
    public class UserRegisterDto
    {
        [Required(ErrorMessage = "Username is required.")]
        [StringLength(50, MinimumLength = 3, ErrorMessage = "Username must be between 3 and 50 characters.")]
        public string Username { get; set; } = string.Empty;

        [Required(ErrorMessage = "Email address is required.")]
        [EmailAddress(ErrorMessage = "Invalid email address format.")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Password is required.")]
        [StringLength(100, MinimumLength = 6, ErrorMessage = "Password must be at least 6 characters long.")]
        public string Password { get; set; } = string.Empty;

        // Allows setting the user role (defaulting to "User", but can be "Admin").
        public string Role { get; set; } = "User";
    }
}
