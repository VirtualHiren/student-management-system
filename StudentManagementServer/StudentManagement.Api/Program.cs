using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using StudentManagement.Core.Interfaces;
using StudentManagement.Infrastructure.Data;
using StudentManagement.Infrastructure.Repositories;
using StudentManagement.Api.Middleware;
using StudentManagement.Api.Services;
using System;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// ==========================================
// 1. DATABASE & CONFIGURATION REGISTRATION
// ==========================================

// Retrieve the database connection string from appsettings.json
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

// Register AppDbContext with PostgreSQL provider
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString, b => b.MigrationsAssembly("StudentManagement.Infrastructure")));

// ==========================================
// 2. REPOSITORIES & SERVICES REGISTRATION (DI)
// ==========================================

// Register Repositories (Scoped lifetime)
builder.Services.AddScoped<IStudentRepository, StudentRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();

// Register Services (Scoped lifetime)
builder.Services.AddScoped<IAuthService, AuthService>();

// Register AutoMapper
builder.Services.AddAutoMapper(typeof(Program).Assembly);

// ==========================================
// 3. AUTHENTICATION & SECURITY (JWT) REGISTRATION
// ==========================================

var jwtKey = builder.Configuration["JwtSettings:Key"] ?? throw new InvalidOperationException("JWT Secret Key is missing in appsettings.json.");
var jwtIssuer = builder.Configuration["JwtSettings:Issuer"];
var jwtAudience = builder.Configuration["JwtSettings:Audience"];

builder.Services.AddAuthentication(options =>
{
    // Set Default Authentication Schemes to JWT Bearer
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    // Configure validation rules for incoming JWT tokens
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,             // Validate that issuer matches our server config
        ValidateAudience = true,           // Validate that audience matches our client config
        ValidateLifetime = true,           // Validate that token is not expired
        ValidateIssuerSigningKey = true,   // Validate that token signature matches our secret key
        ValidIssuer = jwtIssuer,
        ValidAudience = jwtAudience,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
        ClockSkew = TimeSpan.Zero          // Remove the default 5-minute grace period so tokens expire exactly on time
    };
});

builder.Services.AddControllers();

// Configure CORS (Cross-Origin Resource Sharing) to allow our React app to communicate with this API
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// Configure Swagger/OpenAPI with support for testing JWT Authorized endpoints
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    // Configure Swagger UI to allow inputting Bearer Tokens
    options.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.ApiKey,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Description = "JWT Authorization header using the Bearer scheme. \r\n\r\n Enter 'Bearer' [space] and then your token in the text input below.\r\n\r\nExample: \"Bearer 12345abcdef\""
    });

    options.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

// ==========================================
// 4. HTTP REQUEST PIPELINE (MIDDLEWARE)
// ==========================================

var app = builder.Build();

// Auto-apply any pending EF Core migrations on startup
// This ensures the database schema is always up-to-date without needing to run dotnet-ef CLI
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    dbContext.Database.Migrate();
}

// Custom Global Exception Handler Middleware must be registered FIRST to catch all downstream errors
app.UseMiddleware<ExceptionMiddleware>();

// Enable Swagger UI in development
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Only use HTTPS redirection in development (Nginx handles HTTPS in production)
if (app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

// Enable CORS for frontend client requests before authentication/authorization checking
app.UseCors("AllowReactApp");

// UseAuthentication validates incoming JWT tokens and populates HTTP Context User Identity.
// Must be registered BEFORE UseAuthorization.
app.UseAuthentication();

// UseAuthorization checks if the authenticated user has permission to access the resource.
app.UseAuthorization();

// Route HTTP requests to Controller actions
app.MapControllers();

app.Run();
