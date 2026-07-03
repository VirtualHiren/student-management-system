# Student Management System

A full-stack, industry-standard **Student Management System** built to demonstrate modern software architecture.

## 🚀 Technologies

* **Frontend**: React.js (Vite), React Router, Axios, Lucide Icons, React-Toastify
* **Backend**: ASP.NET Core Web API (.NET 8), Entity Framework Core (Code First), AutoMapper, BCrypt Hashing
* **Database**: PostgreSQL
* **Security**: Stateless JWT Bearer Authentication

---

## 📂 Project Structure

```
AWS/
├── StudentManagementServer/            # C# Backend Web API Solution
│   ├── StudentManagement.Core/         # Core Layer (Entities, DTOs, Interfaces)
│   ├── StudentManagement.Infrastructure/ # Database access & implementation
│   └── StudentManagement.Api/          # Host project (Controllers, Services)
│
└── student-management-client/          # React Frontend Single Page App
    ├── src/components/                 # Shared Layout shells
    ├── src/context/                    # Session state provider
    ├── src/pages/                      # UI Screens (Login, Student CRUD, User list)
    └── src/services/                   # Axios API interceptor configurations
```

---

## 🏃 Getting Started

### 1. Database Setup
Ensure you have **PostgreSQL** running locally. Set up a database named `student_management_db` and configure your credentials inside [appsettings.json](file:///d:/Hiren/learn/AWS/StudentManagementServer/StudentManagement.Api/appsettings.json).

Apply migrations to seed database tables:
```bash
cd StudentManagementServer
dotnet ef database update --project StudentManagement.Infrastructure --startup-project StudentManagement.Api
```

### 2. Run the Backend API
```bash
cd StudentManagementServer/StudentManagement.Api
dotnet run
```
*Endpoint runs at `https://localhost:7125` and exposes Swagger UI.*

### 3. Run the React Client
```bash
cd student-management-client
npm install
npm run dev
```
*Frontend runs at `http://localhost:5173` (or the next available port like `5174`).*

---

## 🔑 Default Credentials
You can register any new admin or staff account directly using the **Register** screen. The system will encrypt the credentials using BCrypt and save them to the PostgreSQL `Users` table.
