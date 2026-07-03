using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using System.Net;
using System.Text.Json;
using System.Threading.Tasks;

namespace StudentManagement.Api.Middleware
{
    /// <summary>
    /// Middleware that intercepts all HTTP requests.
    /// If any exception is thrown down the pipeline, it catches the exception,
    /// logs it, and returns a standardized JSON response.
    /// </summary>
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionMiddleware> _logger;
        private readonly IHostEnvironment _env;

        // RequestDelegate is the next middleware component in the pipeline.
        public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger, IHostEnvironment env)
        {
            _next = next;
            _logger = logger;
            _env = env;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                // Call the next middleware in the pipeline (which eventually executes our controllers)
                await _next(context);
            }
            catch (Exception ex)
            {
                // If any unhandled exception occurs, handle it here
                _logger.LogError(ex, "An unhandled exception occurred during request execution.");
                await HandleExceptionAsync(context, ex);
            }
        }

        private Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

            // In Development environment, return detailed error trace.
            // In Production, return a generic error message for security.
            var response = _env.IsDevelopment()
                ? new ErrorDetails
                {
                    StatusCode = context.Response.StatusCode,
                    Message = exception.Message,
                    Detail = exception.StackTrace
                }
                : new ErrorDetails
                {
                    StatusCode = context.Response.StatusCode,
                    Message = "An internal server error occurred. Please try again later.",
                    Detail = "Internal Server Error"
                };

            var options = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };
            var json = JsonSerializer.Serialize(response, options);

            return context.Response.WriteAsync(json);
        }

        private class ErrorDetails
        {
            public int StatusCode { get; set; }
            public string Message { get; set; } = string.Empty;
            public string? Detail { get; set; }
        }
    }
}
