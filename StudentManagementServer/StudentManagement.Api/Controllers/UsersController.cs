using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StudentManagement.Core.DTOs;
using StudentManagement.Core.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace StudentManagement.Api.Controllers
{
    /// <summary>
    /// API controller that exposes safe endpoints for managing user profiles.
    /// Secured by JWT Authorization.
    /// </summary>
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;

        public UsersController(IUserRepository userRepository, IMapper mapper)
        {
            _userRepository = userRepository;
            _mapper = mapper;
        }

        /// <summary>
        /// Retrieves the list of all registered users in the system.
        /// GET /api/users
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _userRepository.GetAllUsersAsync();
            var userDtos = _mapper.Map<IEnumerable<UserReadDto>>(users);
            return Ok(userDtos);
        }
    }
}
