using System;

namespace StudentManagement.Core.DTOs
{
    /// <summary>
    /// Data Transfer Object representing a user profile sent in responses.
    /// Excludes sensitive properties like PasswordHash.
    /// </summary>
    public class UserReadDto
    {
        public int UserId { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public DateTime CreatedDate { get; set; }
    }
}
