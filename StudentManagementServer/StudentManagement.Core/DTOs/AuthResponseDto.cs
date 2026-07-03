namespace StudentManagement.Core.DTOs
{
    /// <summary>
    /// DTO representing the response returned on successful authentication.
    /// Contains the JWT bearer token and logged-in user details.
    /// </summary>
    public class AuthResponseDto
    {
        // The JWT bearer token. The client will store this and send it in subsequent requests.
        public string Token { get; set; } = string.Empty;

        public string Username { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public string Role { get; set; } = string.Empty;
    }
}
