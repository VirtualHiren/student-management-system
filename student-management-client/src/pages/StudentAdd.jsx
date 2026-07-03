import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { toast } from 'react-toastify';
import { UserPlus, ArrowLeft, ShieldAlert, GraduationCap } from 'lucide-react';

const StudentAdd = () => {
  const navigate = useNavigate();

  // Form Fields
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobileNumber: '',
    dateOfBirth: '',
    gender: 'Male',
    address: '',
    city: '',
    state: '',
    course: ''
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Reusable change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    // Clear validation error when typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Local Validation before API call
  const validateForm = () => {
    const tempErrors = {};
    if (!formData.firstName.trim()) tempErrors.firstName = 'First name is required.';
    if (!formData.lastName.trim()) tempErrors.lastName = 'Last name is required.';
    
    if (!formData.email.trim()) {
      tempErrors.email = 'Email address is required.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = 'Invalid email address format.';
    }

    if (!formData.mobileNumber.trim()) {
      tempErrors.mobileNumber = 'Mobile number is required.';
    }

    if (!formData.dateOfBirth) {
      tempErrors.dateOfBirth = 'Date of birth is required.';
    } else {
      const age = new Date().getFullYear() - new Date(formData.dateOfBirth).getFullYear();
      if (age < 5 || age > 100) {
        tempErrors.dateOfBirth = 'Age must be between 5 and 100 years.';
      }
    }

    if (!formData.address.trim()) tempErrors.address = 'Address is required.';
    if (!formData.city.trim()) tempErrors.city = 'City is required.';
    if (!formData.state.trim()) tempErrors.state = 'State is required.';
    if (!formData.course.trim()) tempErrors.course = 'Course name is required.';

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.warning('Please correct the validation errors first.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        dateOfBirth: new Date(formData.dateOfBirth).toISOString()
      };

      await API.post('/students', payload);
      toast.success('Student added successfully!');
      navigate('/students');
    } catch (error) {
      console.error('Failed to save student:', error);
      
      if (error.response?.data?.errors) {
        const serverErrors = {};
        const responseErrors = error.response.data.errors;
        
        Object.keys(responseErrors).forEach((key) => {
          const inputName = key.charAt(0).toLowerCase() + key.slice(1);
          serverErrors[inputName] = responseErrors[key][0];
        });
        
        setErrors(serverErrors);
        toast.error('Validation error returned from server.');
      } else {
        toast.error(error.response?.data?.message || 'Failed to add student. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Navigation Headers */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', borderBottom: '1px solid var(--bg-dark-border)', paddingBottom: '20px' }}>
        <button
          onClick={() => navigate('/students')}
          className="btn btn-secondary"
          style={{ padding: '8px' }}
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <h2 className="page-title" style={{ fontSize: '24px' }}>Add Student</h2>
          <p className="page-subtitle" style={{ fontSize: '13px' }}>
            Register a new student profile in the database
          </p>
        </div>
      </div>

      {/* Add form */}
      <form onSubmit={handleSubmit} className="glass-card max-w-4xl" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#818cf8', borderBottom: '1px solid var(--bg-dark-border)', paddingBottom: '12px' }}>
          <UserPlus size={18} />
          <h3 style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Personal Demographics</h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {/* First Name */}
          <div className="form-group">
            <label className="form-label">First Name</label>
            <input
              type="text"
              name="firstName"
              className="form-input"
              placeholder="John"
              value={formData.firstName}
              onChange={handleChange}
              disabled={submitting}
            />
            {errors.firstName && <span className="form-error"><ShieldAlert size={12} /> {errors.firstName}</span>}
          </div>

          {/* Last Name */}
          <div className="form-group">
            <label className="form-label">Last Name</label>
            <input
              type="text"
              name="lastName"
              className="form-input"
              placeholder="Doe"
              value={formData.lastName}
              onChange={handleChange}
              disabled={submitting}
            />
            {errors.lastName && <span className="form-error"><ShieldAlert size={12} /> {errors.lastName}</span>}
          </div>

          {/* Email */}
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              name="email"
              className="form-input"
              placeholder="john.doe@example.com"
              value={formData.email}
              onChange={handleChange}
              disabled={submitting}
            />
            {errors.email && <span className="form-error"><ShieldAlert size={12} /> {errors.email}</span>}
          </div>

          {/* Mobile Number */}
          <div className="form-group">
            <label className="form-label">Mobile Number</label>
            <input
              type="text"
              name="mobileNumber"
              className="form-input"
              placeholder="1234567890"
              value={formData.mobileNumber}
              onChange={handleChange}
              disabled={submitting}
            />
            {errors.mobileNumber && <span className="form-error"><ShieldAlert size={12} /> {errors.mobileNumber}</span>}
          </div>

          {/* Date Of Birth */}
          <div className="form-group">
            <label className="form-label">Date of Birth</label>
            <input
              type="date"
              name="dateOfBirth"
              className="form-input"
              value={formData.dateOfBirth}
              onChange={handleChange}
              disabled={submitting}
            />
            {errors.dateOfBirth && <span className="form-error"><ShieldAlert size={12} /> {errors.dateOfBirth}</span>}
          </div>

          {/* Gender */}
          <div className="form-group">
            <label className="form-label">Gender</label>
            <select
              name="gender"
              className="form-input"
              value={formData.gender}
              onChange={handleChange}
              disabled={submitting}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#818cf8', borderBottom: '1px solid var(--bg-dark-border)', paddingBottom: '12px', marginTop: '16px' }}>
          <GraduationCap size={18} />
          <h3 style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Address & Academics</h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Address */}
          <div className="form-group">
            <label className="form-label">Street Address</label>
            <input
              type="text"
              name="address"
              className="form-input"
              placeholder="123 Main St"
              value={formData.address}
              onChange={handleChange}
              disabled={submitting}
            />
            {errors.address && <span className="form-error"><ShieldAlert size={12} /> {errors.address}</span>}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            {/* City */}
            <div className="form-group">
              <label className="form-label">City</label>
              <input
                type="text"
                name="city"
                className="form-input"
                placeholder="New York"
                value={formData.city}
                onChange={handleChange}
                disabled={submitting}
              />
              {errors.city && <span className="form-error"><ShieldAlert size={12} /> {errors.city}</span>}
            </div>

            {/* State */}
            <div className="form-group">
              <label className="form-label">State</label>
              <input
                type="text"
                name="state"
                className="form-input"
                placeholder="NY"
                value={formData.state}
                onChange={handleChange}
                disabled={submitting}
              />
              {errors.state && <span className="form-error"><ShieldAlert size={12} /> {errors.state}</span>}
            </div>
          </div>

          {/* Course */}
          <div className="form-group">
            <label className="form-label">Assigned Course</label>
            <input
              type="text"
              name="course"
              className="form-input"
              placeholder="Computer Science"
              value={formData.course}
              onChange={handleChange}
              disabled={submitting}
            />
            {errors.course && <span className="form-error"><ShieldAlert size={12} /> {errors.course}</span>}
          </div>
        </div>

        {/* Submit Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid var(--bg-dark-border)', paddingTop: '20px', marginTop: '16px' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate('/students')}
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            style={{ paddingLeft: '24px', paddingRight: '24px' }}
            disabled={submitting}
          >
            {submitting ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '14px', height: '14px', borderRadius: '50%', border: '2px solid #fff', borderTopColor: 'transparent', animation: 'fadeIn 1s infinite' }}></div>
                <span>Saving...</span>
              </div>
            ) : (
              <span>Save Student</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StudentAdd;
