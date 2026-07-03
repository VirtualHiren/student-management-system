using BCrypt.Net;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using StudentManagement.Core.DTOs;
using StudentManagement.Core.Entities;
using StudentManagement.Core.Interfaces;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace StudentManagement.Api.Services
{
    /// <summary>
    /// Implements authentication business logic including user registration, validation,
    /// password hashing, and signed JWT token generation.
    /// </summary>
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly IConfiguration _configuration;

        public AuthService(IUserRepository userRepository, IConfiguration configuration)
        {
            _userRepository = userRepository;
            _configuration = configuration;
        }

        public async Task<AuthResponseDto?> RegisterAsync(UserRegisterDto registerDto)
        {
            // 1. Check if user already exists
            if (await _userRepository.UserExistsAsync(registerDto.Username, registerDto.Email))
            {
                return null; // Return null to indicate duplication
            }

            // 2. Hash the plain text password using BCrypt
            string passwordHash = BCrypt.Net.BCrypt.HashPassword(registerDto.Password);

            // 3. Create User entity
            var newUser = new User
            {
                Username = registerDto.Username.Trim(),
                Email = registerDto.Email.Trim().ToLower(),
                PasswordHash = passwordHash,
                Role = string.IsNullOrWhiteSpace(registerDto.Role) ? "User" : registerDto.Role.Trim(),
                CreatedDate = DateTime.UtcNow
            };

            // 4. Save to Database
            var savedUser = await _userRepository.CreateUserAsync(newUser);

            // 5. Generate JWT token
            string token = GenerateJwtToken(savedUser);

            return new AuthResponseDto
            {
                Token = token,
                Username = savedUser.Username,
                Email = savedUser.Email,
                Role = savedUser.Role
            };
        }

        public async Task<AuthResponseDto?> LoginAsync(UserLoginDto loginDto)
        {
            // 1. Attempt to find user by email or username
            User? user = null;
            if (loginDto.UsernameOrEmail.Contains("@"))
            {
                user = await _userRepository.GetUserByEmailAsync(loginDto.UsernameOrEmail);
            }
            else
            {
                user = await _userRepository.GetUserByUsernameAsync(loginDto.UsernameOrEmail);
            }

            // 2. Verify user exists
            if (user == null)
            {
                return null;
            }

            // 3. Verify password hash using BCrypt
            bool isPasswordCorrect = BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash);
            if (!isPasswordCorrect)
            {
                return null;
            }

            // 4. Generate JWT token
            string token = GenerateJwtToken(user);

            return new AuthResponseDto
            {
                Token = token,
                Username = user.Username,
                Email = user.Email,
                Role = user.Role
            };
        }

        /// <summary>
        /// Generates a signed, stateless JSON Web Token (JWT) containing user claims.
        /// </summary>
        private string GenerateJwtToken(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();

            // Retrieve signing key from appsettings.json
            var keyString = _configuration["JwtSettings:Key"];
            if (string.IsNullOrEmpty(keyString))
            {
                throw new InvalidOperationException("JWT Key is not configured in appsettings.json.");
            }

            var key = Encoding.UTF8.GetBytes(keyString);

            // Define Claims (User properties stored inside the token payload)
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role)
            };

            // Set token descriptors (Expiration, Issuer, Audience, and Cryptographic Signatures)
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddMinutes(double.Parse(_configuration["JwtSettings:DurationInMinutes"] ?? "60")),
                Issuer = _configuration["JwtSettings:Issuer"],
                Audience = _configuration["JwtSettings:Audience"],
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}
