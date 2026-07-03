using AutoMapper;
using StudentManagement.Core.Entities;
using StudentManagement.Core.DTOs;

namespace StudentManagement.Api.Mapping
{
    /// <summary>
    /// Configures AutoMapper object mapping rules.
    /// This removes the need for manual mapping: e.g. Dto.FirstName = Entity.FirstName.
    /// </summary>
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // Map from Student Database Entity to StudentReadDto (for API responses)
            CreateMap<Student, StudentReadDto>();

            // Map from StudentCreateDto to Student Database Entity (for insertion)
            CreateMap<StudentCreateDto, Student>()
                .ForMember(dest => dest.StudentId, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedDate, opt => opt.MapFrom(src => System.DateTime.UtcNow))
                .ForMember(dest => dest.IsActive, opt => opt.MapFrom(src => true));

            // Map from StudentUpdateDto to Student Database Entity (for updates)
            CreateMap<StudentUpdateDto, Student>()
                .ForMember(dest => dest.StudentId, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedDate, opt => opt.Ignore()); // Keep original created date intact

            // Map from User Database Entity to UserReadDto (for API responses)
            CreateMap<User, UserReadDto>();
        }
    }
}
