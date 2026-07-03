using System;

namespace StudentManagement.Core.Entities
{
    /// <summary>
    /// Represents a system User authorized to access the application.
    /// Password passwords must NEVER be stored in plain text; we store a BCrypt password hash.
    /// </summary>
    public class User
    {
        // Auto-incrementing Primary Key
        public int UserId { get; set; }

        public string Username { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        // Stores the salted and hashed password, NOT the plain text password.
        public string PasswordHash { get; set; } = string.Empty;

        // Roles like "Admin" or "User" to restrict access to certain APIs.
        public string Role { get; set; } = "User";

        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
    }
}
