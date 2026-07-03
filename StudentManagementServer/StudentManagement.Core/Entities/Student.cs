using System;

namespace StudentManagement.Core.Entities
{
    /// <summary>
    /// Represents the Student domain entity.
    /// This is a pure C# class that defines the structure of a student record.
    /// Entity Framework Core will use this class to map to the 'Students' table in the database.
    /// </summary>
    public class Student
    {
        // EF Core automatically recognizes properties named "Id" or "[EntityName]Id" as the Primary Key.
        // It will be configured as an Identity column (Auto-Incrementing Integer) in PostgreSQL.
        public int StudentId { get; set; }

        // We initialize strings to string.Empty to satisfy C#'s Nullable Reference Types check.
        // This ensures the database column starts as non-nullable unless we explicitly make it nullable (e.g., string?).
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string MobileNumber { get; set; } = string.Empty;
        public DateTime DateOfBirth { get; set; }
        public string Gender { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string State { get; set; } = string.Empty;
        public string Course { get; set; } = string.Empty;

        // Indicates whether the student is active or deactivated. Defaults to true.
        public bool IsActive { get; set; } = true;

        // Automatically logs when the student record was created.
        // Storing timestamps in UTC (Universal Coordinated Time) is the industry standard to avoid timezone discrepancies.
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
    }
}
