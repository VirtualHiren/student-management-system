using Microsoft.EntityFrameworkCore;
using StudentManagement.Core.Entities;
using StudentManagement.Core.Interfaces;
using StudentManagement.Infrastructure.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace StudentManagement.Infrastructure.Repositories
{
    /// <summary>
    /// Implements the IStudentRepository using Entity Framework Core and AppDbContext.
    /// This contains the actual SQL-equivalent LINQ queries executed against the PostgreSQL database.
    /// </summary>
    public class StudentRepository : IStudentRepository
    {
        private readonly AppDbContext _context;

        // AppDbContext is automatically injected here by the ASP.NET Core DI Container.
        public StudentRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Student>> GetAllStudentsAsync(
            string? searchName, 
            int pageNumber, 
            int pageSize, 
            string? sortBy, 
            bool isDescending)
        {
            // AsNoTracking() optimizes query performance for read-only operations.
            // It tells EF Core not to track changes for these entities in its memory cache.
            var query = _context.Students.AsNoTracking().AsQueryable();

            // 1. Search Filter (Search in FirstName or LastName)
            if (!string.IsNullOrWhiteSpace(searchName))
            {
                var lowerSearch = searchName.Trim().ToLower();
                query = query.Where(s => s.FirstName.ToLower().Contains(lowerSearch) 
                                      || s.LastName.ToLower().Contains(lowerSearch));
            }

            // 2. Sorting Logic
            if (!string.IsNullOrWhiteSpace(sortBy))
            {
                query = sortBy.ToLower() switch
                {
                    "firstname" => isDescending ? query.OrderByDescending(s => s.FirstName) : query.OrderBy(s => s.FirstName),
                    "lastname" => isDescending ? query.OrderByDescending(s => s.LastName) : query.OrderBy(s => s.LastName),
                    "email" => isDescending ? query.OrderByDescending(s => s.Email) : query.OrderBy(s => s.Email),
                    "course" => isDescending ? query.OrderByDescending(s => s.Course) : query.OrderBy(s => s.Course),
                    "createddate" => isDescending ? query.OrderByDescending(s => s.CreatedDate) : query.OrderBy(s => s.CreatedDate),
                    "dateofbirth" => isDescending ? query.OrderByDescending(s => s.DateOfBirth) : query.OrderBy(s => s.DateOfBirth),
                    "studentid" => isDescending ? query.OrderByDescending(s => s.StudentId) : query.OrderBy(s => s.StudentId),
                    _ => query.OrderBy(s => s.StudentId) // Default sorting
                };
            }
            else
            {
                // Default fallback: Order by StudentId
                query = query.OrderBy(s => s.StudentId);
            }

            // 3. Pagination Logic
            // Skip skips the previous pages' records. Take fetches only the requested page size limit.
            return await query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }

        public async Task<int> GetTotalCountAsync(string? searchName)
        {
            var query = _context.Students.AsNoTracking().AsQueryable();

            if (!string.IsNullOrWhiteSpace(searchName))
            {
                var lowerSearch = searchName.Trim().ToLower();
                query = query.Where(s => s.FirstName.ToLower().Contains(lowerSearch) 
                                      || s.LastName.ToLower().Contains(lowerSearch));
            }

            return await query.CountAsync();
        }

        public async Task<Student?> GetStudentByIdAsync(int id)
        {
            // FindAsync looks up by primary key (optimized, checks context cache first).
            return await _context.Students.FindAsync(id);
        }

        public async Task<Student> AddStudentAsync(Student student)
        {
            await _context.Students.AddAsync(student);
            await _context.SaveChangesAsync(); // Executes the SQL INSERT command
            return student;
        }

        public async Task<Student?> UpdateStudentAsync(Student student)
        {
            // Find the existing entity in the database
            var existing = await _context.Students.FindAsync(student.StudentId);
            if (existing == null)
            {
                return null;
            }

            // Map updated values. EF Core tracks these changes.
            existing.FirstName = student.FirstName;
            existing.LastName = student.LastName;
            existing.Email = student.Email;
            existing.MobileNumber = student.MobileNumber;
            existing.DateOfBirth = student.DateOfBirth;
            existing.Gender = student.Gender;
            existing.Address = student.Address;
            existing.City = student.City;
            existing.State = student.State;
            existing.Course = student.Course;
            existing.IsActive = student.IsActive;

            // SaveChangesAsync executes the SQL UPDATE statement for changed columns.
            await _context.SaveChangesAsync();
            return existing;
        }

        public async Task<bool> DeleteStudentAsync(int id)
        {
            var student = await _context.Students.FindAsync(id);
            if (student == null)
            {
                return false;
            }

            _context.Students.Remove(student);
            await _context.SaveChangesAsync(); // Executes the SQL DELETE command
            return true;
        }

        public async Task<bool> EmailExistsAsync(string email, int? excludeStudentId = null)
        {
            var lowerEmail = email.Trim().ToLower();
            if (excludeStudentId.HasValue)
            {
                // Verify if email is already taken by ANY student OTHER than the current one being edited.
                return await _context.Students.AnyAsync(s => s.Email.ToLower() == lowerEmail && s.StudentId != excludeStudentId.Value);
            }
            return await _context.Students.AnyAsync(s => s.Email.ToLower() == lowerEmail);
        }
    }
}
