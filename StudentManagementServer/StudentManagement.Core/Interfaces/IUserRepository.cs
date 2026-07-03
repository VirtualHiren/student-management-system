using System.Threading.Tasks;
using StudentManagement.Core.Entities;

namespace StudentManagement.Core.Interfaces
{
    /// <summary>
    /// Contract for database operations related to the User entity.
    /// Used for retrieving and saving user accounts during registration and authentication.
    /// </summary>
    public interface IUserRepository
    {
        Task<User?> GetUserByUsernameAsync(string username);
        Task<User?> GetUserByEmailAsync(string email);
        Task<User> CreateUserAsync(User user);
        Task<bool> UserExistsAsync(string username, string email);
        Task<System.Collections.Generic.IEnumerable<User>> GetAllUsersAsync();
    }
}
