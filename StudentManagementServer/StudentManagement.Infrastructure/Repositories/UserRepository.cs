using Microsoft.EntityFrameworkCore;
using StudentManagement.Core.Entities;
using StudentManagement.Core.Interfaces;
using StudentManagement.Infrastructure.Data;
using System.Threading.Tasks;

namespace StudentManagement.Infrastructure.Repositories
{
    /// <summary>
    /// Implements database operations for the User entity using Entity Framework Core.
    /// </summary>
    public class UserRepository : IUserRepository
    {
        private readonly AppDbContext _context;

        public UserRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<User?> GetUserByUsernameAsync(string username)
        {
            var lowerName = username.Trim().ToLower();
            return await _context.Users.FirstOrDefaultAsync(u => u.Username.ToLower() == lowerName);
        }

        public async Task<User?> GetUserByEmailAsync(string email)
        {
            var lowerEmail = email.Trim().ToLower();
            return await _context.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == lowerEmail);
        }

        public async Task<User> CreateUserAsync(User user)
        {
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();
            return user;
        }

        public async Task<bool> UserExistsAsync(string username, string email)
        {
            var lowerName = username.Trim().ToLower();
            var lowerEmail = email.Trim().ToLower();
            return await _context.Users.AnyAsync(u => u.Username.ToLower() == lowerName || u.Email.ToLower() == lowerEmail);
        }

        public async Task<System.Collections.Generic.IEnumerable<User>> GetAllUsersAsync()
        {
            return await _context.Users.AsNoTracking().ToListAsync();
        }
    }
}
