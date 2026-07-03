# Build Stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy project files and restore dependencies
COPY ["StudentManagement.Core/StudentManagement.Core.csproj", "StudentManagement.Core/"]
COPY ["StudentManagement.Infrastructure/StudentManagement.Infrastructure.csproj", "StudentManagement.Infrastructure/"]
COPY ["StudentManagement.Api/StudentManagement.Api.csproj", "StudentManagement.Api/"]
RUN dotnet restore "StudentManagement.Api/StudentManagement.Api.csproj"

# Copy everything else and build the publish package
COPY . .
RUN dotnet publish "StudentManagement.Api/StudentManagement.Api.csproj" -c Release -o /app/publish

# Runtime Stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .

# Expose port and start Web API
EXPOSE 8080
ENTRYPOINT ["dotnet", "StudentManagement.Api.dll"]
