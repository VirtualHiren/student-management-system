using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StudentManagement.Core.DTOs;
using StudentManagement.Core.Entities;
using StudentManagement.Core.Interfaces;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace StudentManagement.Api.Controllers
{
    /// <summary>
    /// API Controller exposing CRUD endpoints for Students.
    /// Accesses the data layer via repository abstraction and maps results using AutoMapper.
    /// </summary>
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class StudentsController : ControllerBase
    {
        private readonly IStudentRepository _repository;
        private readonly IMapper _mapper;

        // DI container automatically injects the registered IStudentRepository and IMapper.
        public StudentsController(IStudentRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        /// <summary>
        /// Retrieves a paginated, sorted, and filtered list of students.
        /// GET /api/students?searchName=John&pageNumber=1&pageSize=10&sortBy=LastName&isDescending=false
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetAllStudents(
            [FromQuery] string? searchName,
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? sortBy = "StudentId",
            [FromQuery] bool isDescending = false)
        {
            // Protect against invalid pagination parameters
            if (pageNumber < 1) pageNumber = 1;
            if (pageSize < 1 || pageSize > 100) pageSize = 10; // Cap page size at 100 for safety

            var students = await _repository.GetAllStudentsAsync(searchName, pageNumber, pageSize, sortBy, isDescending);
            var totalCount = await _repository.GetTotalCountAsync(searchName);

            var studentDtos = _mapper.Map<IEnumerable<StudentReadDto>>(students);

            var totalPages = (int)Math.Ceiling((double)totalCount / pageSize);

            // Return a structured envelope containing the items and pagination metadata
            return Ok(new
            {
                Items = studentDtos,
                TotalCount = totalCount,
                PageNumber = pageNumber,
                PageSize = pageSize,
                TotalPages = totalPages
            });
        }

        /// <summary>
        /// Retrieves a single student by their ID.
        /// GET /api/students/{id}
        /// </summary>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetStudentById(int id)
        {
            var student = await _repository.GetStudentByIdAsync(id);
            if (student == null)
            {
                return NotFound(new { Message = $"Student with ID {id} was not found." });
            }

            var readDto = _mapper.Map<StudentReadDto>(student);
            return Ok(readDto);
        }

        /// <summary>
        /// Creates a new student record.
        /// POST /api/students
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> AddStudent([FromBody] StudentCreateDto createDto)
        {
            // 1. Business Logic Validation: Ensure Email is unique
            if (await _repository.EmailExistsAsync(createDto.Email))
            {
                ModelState.AddModelError("Email", "This email address is already in use.");
                return ValidationProblem(ModelState); // Returns a standard 400 Bad Request with field-specific errors
            }

            // 2. Map DTO to DB Entity
            var studentEntity = _mapper.Map<Student>(createDto);

            // 3. Save to database
            var savedStudent = await _repository.AddStudentAsync(studentEntity);

            // 4. Map saved database state back to Read DTO
            var readDto = _mapper.Map<StudentReadDto>(savedStudent);

            // 5. Return HTTP 201 Created with Location header pointing to GET /api/students/{id}
            return CreatedAtAction(nameof(GetStudentById), new { id = readDto.StudentId }, readDto);
        }

        /// <summary>
        /// Updates an existing student record.
        /// PUT /api/students/{id}
        /// </summary>
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateStudent(int id, [FromBody] StudentUpdateDto updateDto)
        {
            // 1. Business Logic Validation: Ensure email is not taken by another student
            if (await _repository.EmailExistsAsync(updateDto.Email, id))
            {
                ModelState.AddModelError("Email", "This email address is already in use by another student.");
                return ValidationProblem(ModelState);
            }

            // 2. Map DTO to DB Entity
            var studentEntity = _mapper.Map<Student>(updateDto);
            studentEntity.StudentId = id; // Ensure the ID matches the route parameter

            // 3. Perform update in Repository
            var updatedStudent = await _repository.UpdateStudentAsync(studentEntity);
            if (updatedStudent == null)
            {
                return NotFound(new { Message = $"Student with ID {id} was not found." });
            }

            // 4. Map updated entity to Read DTO and return
            var readDto = _mapper.Map<StudentReadDto>(updatedStudent);
            return Ok(readDto);
        }

        /// <summary>
        /// Deletes a student record.
        /// DELETE /api/students/{id}
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStudent(int id)
        {
            var isDeleted = await _repository.DeleteStudentAsync(id);
            if (!isDeleted)
            {
                return NotFound(new { Message = $"Student with ID {id} was not found." });
            }

            return NoContent(); // HTTP 204: Action completed successfully, no content to return
        }
    }
}
