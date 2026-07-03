using System.Collections.Generic;
using System.Threading.Tasks;
using StudentManagement.Core.Entities;

namespace StudentManagement.Core.Interfaces
{
    /// <summary>
    /// Interface defining the contract for database operations related to the Student entity.
    /// This keeps the Core layer decoupled from database implementation details (like EF Core).
    /// </summary>
    public interface IStudentRepository
    {
        // Retrieves a list of students with pagination, sorting, and name filtering.
        Task<IEnumerable<Student>> GetAllStudentsAsync(
            string? searchName, 
            int pageNumber, 
            int pageSize, 
            string? sortBy, 
            bool isDescending);

        // Gets the total count of students matching a search term (needed for calculating total pagination pages).
        Task<int> GetTotalCountAsync(string? searchName);

        // Retrieves a specific student by their unique ID.
        Task<Student?> GetStudentByIdAsync(int id);

        // Adds a new student record to the database.
        Task<Student> AddStudentAsync(Student student);

        // Updates an existing student record in the database.
        Task<Student?> UpdateStudentAsync(Student student);

        // Deletes a student record by ID. Returns true if successful, false if not found.
        Task<bool> DeleteStudentAsync(int id);

        // Checks if an email is already registered in the system.
        // Option to exclude a specific student ID (useful when updating a student's own email).
        Task<bool> EmailExistsAsync(string email, int? excludeStudentId = null);
    }
}
