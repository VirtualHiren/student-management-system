import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../services/api';
import { toast } from 'react-toastify';
import { Pencil, ArrowLeft, ShieldAlert, GraduationCap } from 'lucide-react';

const StudentEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();

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
    course: '',
    isActive: true
  });

  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Fetch student details to prefill the form
  useEffect(() => {
    const fetchStudent = async () => {
      try {
        setLoading(true);
        const response = await API.get(`/students/${id}`);
        const data = response.data;
        const dobFormatted = data.dateOfBirth ? data.dateOfBirth.substring(0, 10) : '';

        setFormData({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          email: data.email || '',
          mobileNumber: data.mobileNumber || '',
          dateOfBirth: dobFormatted,
          gender: data.gender || 'Male',
          address: data.address || '',
          city: data.city || '',
          state: data.state || '',
          course: data.course || '',
          isActive: data.isActive
        });
      } catch (error) {
        console.error('Failed to load student details:', error);
        toast.error('Student profile not found.');
        navigate('/students');
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [id, navigate]);

  // Reusable change handler
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Local Validation
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

      await API.put(`/students/${id}`, payload);
      toast.success('Student profile updated successfully!');
      navigate('/students');
    } catch (error) {
      console.error('Failed to update student:', error);
      
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
        toast.error(error.response?.data?.message || 'Failed to update student profile.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '50vh', alignItems: 'center', justifycontent: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', margin: '0 auto' }}>
          <div style={{ width: '24px', height: '24px', borderRadius: '50%', border: '3px solid var(--primary)', borderTopColor: 'transparent', animation: 'fadeIn 1s infinite' }}></div>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Loading student details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Banner */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', borderBottom: '1px solid var(--bg-dark-border)', paddingBottom: '20px' }}>
        <button
          onClick={() => navigate('/students')}
          className="btn btn-secondary"
          style={{ padding: '8px' }}
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <h2 className="page-title" style={{ fontSize: '24px' }}>Edit Student</h2>
          <p className="page-subtitle" style={{ fontSize: '13px' }}>
            Modify details for {formData.firstName} {formData.lastName}
          </p>
        </div>
      </div>

      {/* Edit Form */}
      <form onSubmit={handleSubmit} className="glass-card max-w-4xl" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#818cf8', borderBottom: '1px solid var(--bg-dark-border)', paddingBottom: '12px' }}>
          <Pencil size={16} />
          <h3 style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Update Personal Profile</h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {/* First Name */}
          <div className="form-group">
            <label className="form-label">First Name</label>
            <input
              type="text"
              name="firstName"
              className="form-input"
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
              value={formData.course}
              onChange={handleChange}
              disabled={submitting}
            />
            {errors.course && <span className="form-error"><ShieldAlert size={12} /> {errors.course}</span>}
          </div>

          {/* Active Status Checkbox */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: 'rgba(21, 29, 42, 0.4)', padding: '16px', borderRadius: '8px', border: '1px solid var(--bg-dark-border)', width: 'fit-content' }}>
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              checked={formData.isActive}
              onChange={handleChange}
              disabled={submitting}
            />
            <label htmlFor="isActive" style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-main)', cursor: 'pointer', userSelect: 'none' }}>
              Student Profile Active
            </label>
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
              <span>Save Changes</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StudentEdit;
