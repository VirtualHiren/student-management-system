using Microsoft.EntityFrameworkCore;
using StudentManagement.Core.Entities;
using System;

namespace StudentManagement.Infrastructure.Data
{
    /// <summary>
    /// The database context that manages connections and queries to the PostgreSQL database.
    /// It configures the mapping rules between C# entities and database tables using Fluent API.
    /// </summary>
    public class AppDbContext : DbContext
    {
        // The constructor accepts connection options (like PostgreSQL configs)
        // and forwards them to the base EF Core DbContext class.
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        // Represents the table 'Students' in PostgreSQL.
        public DbSet<Student> Students { get; set; } = null!;

        // Represents the table 'Users' in PostgreSQL.
        public DbSet<User> Users { get; set; } = null!;

        /// <summary>
        /// Configures database table columns, types, constraints, and seeds initial data.
        /// </summary>
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure Student Entity Constraints using Fluent API
            modelBuilder.Entity<Student>(entity =>
            {
                // Define Primary Key
                entity.HasKey(s => s.StudentId);
                
                // FirstName is required and cannot exceed 50 characters
                entity.Property(s => s.FirstName)
                    .IsRequired()
                    .HasMaxLength(50);

                // LastName is required and cannot exceed 50 characters
                entity.Property(s => s.LastName)
                    .IsRequired()
                    .HasMaxLength(50);

                // Email is required, maximum 100 characters
                entity.Property(s => s.Email)
                    .IsRequired()
                    .HasMaxLength(100);
                
                // Creates a unique index on Email to ensure no two students can share the same email.
                entity.HasIndex(s => s.Email)
                    .IsUnique();

                entity.Property(s => s.MobileNumber)
                    .HasMaxLength(15);

                entity.Property(s => s.Gender)
                    .HasMaxLength(10);

                // Course is required, maximum 100 characters
                entity.Property(s => s.Course)
                    .IsRequired()
                    .HasMaxLength(100);
            });

            // Configure User Entity Constraints using Fluent API
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(u => u.UserId);

                entity.Property(u => u.Username)
                    .IsRequired()
                    .HasMaxLength(50);

                // Create a unique index on Username
                entity.HasIndex(u => u.Username)
                    .IsUnique();

                entity.Property(u => u.Email)
                    .IsRequired()
                    .HasMaxLength(100);

                // Create a unique index on Email
                entity.HasIndex(u => u.Email)
                    .IsUnique();

                entity.Property(u => u.PasswordHash)
                    .IsRequired();

                entity.Property(u => u.Role)
                    .IsRequired()
                    .HasMaxLength(20);
            });

            // Seed Sample Data (Seeds default records when database is first created)
            modelBuilder.Entity<Student>().HasData(
                new Student
                {
                    StudentId = 1,
                    FirstName = "John",
                    LastName = "Doe",
                    Email = "john.doe@example.com",
                    MobileNumber = "1234567890",
                    DateOfBirth = new DateTime(2001, 5, 15, 0, 0, 0, DateTimeKind.Utc),
                    Gender = "Male",
                    Address = "123 Main St",
                    City = "New York",
                    State = "NY",
                    Course = "Computer Science",
                    IsActive = true,
                    CreatedDate = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new Student
                {
                    StudentId = 2,
                    FirstName = "Jane",
                    LastName = "Smith",
                    Email = "jane.smith@example.com",
                    MobileNumber = "9876543210",
                    DateOfBirth = new DateTime(2002, 8, 20, 0, 0, 0, DateTimeKind.Utc),
                    Gender = "Female",
                    Address = "456 Oak Ave",
                    City = "Los Angeles",
                    State = "CA",
                    Course = "Information Technology",
                    IsActive = true,
                    CreatedDate = new DateTime(2026, 1, 2, 0, 0, 0, DateTimeKind.Utc)
                }
            );
        }
    }
}
