import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import API from '../services/api';
import { toast } from 'react-toastify';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  BookOpen, 
  Calendar,
  ArrowLeft,
  Pencil,
  Trash2,
  Clock,
  AlertTriangle,
  X
} from 'lucide-react';

const StudentDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        setLoading(true);
        const response = await API.get(`/students/${id}`);
        setStudent(response.data);
      } catch (error) {
        console.error('Failed to load student details:', error);
        toast.error('Student profile not found.');
        navigate('/students');
      } finally {
        setLoading(false);
      }
    };

    fetchStudentDetails();
  }, [id, navigate]);

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await API.delete(`/students/${id}`);
      toast.success(`Successfully deleted student: ${student.firstName}`);
      setShowDeleteModal(false);
      navigate('/students');
    } catch (error) {
      console.error('Deletion failed:', error);
      toast.error('Failed to delete student.');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '50vh', alignItems: 'center', justifycontent: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', margin: '0 auto' }}>
          <div style={{ width: '24px', height: '24px', borderRadius: '50%', border: '3px solid var(--primary)', borderTopColor: 'transparent', animation: 'fadeIn 1s infinite' }}></div>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Loading student record...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Banner */}
      <div className="page-header">
        <div className="flex items-center" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={() => navigate('/students')}
            className="btn btn-secondary"
            style={{ padding: '8px' }}
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h2 className="page-title" style={{ fontSize: '24px' }}>Student Profile</h2>
            <p className="page-subtitle" style={{ fontSize: '13px' }}>
              Detailed registry overview for {student.firstName} {student.lastName}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => navigate(`/students/edit/${student.studentId}`)}
            className="btn btn-secondary"
            style={{ padding: '8px 14px', fontSize: '13px' }}
          >
            <Pencil size={13} />
            <span>Edit Profile</span>
          </button>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="btn btn-secondary"
            style={{ padding: '8px 14px', fontSize: '13px', color: '#f87171', bordercolor: 'rgba(239, 68, 68, 0.15)' }}
          >
            <Trash2 size={13} />
            <span>Delete Profile</span>
          </button>
        </div>
      </div>

      <div className="content-grid-2-1" style={{ display: 'grid', gap: '24px' }}>
        {/* Left Column: Profile Card summary (We swap elements to match content-grid-2-1 logic or keep standard) */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '24px' }}>
          {/* Circular avatar badge */}
          <div style={{ 
            display: 'flex', 
            height: '96px', 
            width: '96px', 
            alignItems: 'center', 
            justifyContent: 'center', 
            borderRadius: '50%', 
            background: 'var(--grad-avatar)', 
            color: 'var(--primary-light)', 
            border: '1px solid rgba(99, 102, 241, 0.25)' 
          }}>
            <User size={44} />
          </div>

          <div>
            <h3 style={{ fontSize: '22px', fontWeight: '800' }}>{student.firstName} {student.lastName}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '4px' }}>{student.email}</p>
          </div>

          <span className={`td-badge ${student.isActive ? 'td-badge-active' : 'td-badge-inactive'}`}>
            <span className="td-dot"></span>
            <span>{student.isActive ? 'Active Profile' : 'Inactive Profile'}</span>
          </span>

          <div style={{ width: '100%', borderTop: '1px solid var(--bg-dark-border)', paddingTop: '20px', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <BookOpen size={16} style={{ color: 'var(--primary-light)' }} />
              <div>
                <p className="details-label">Registered Course</p>
                <p style={{ fontSize: '14px', fontWeight: '600' }}>{student.course}</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Clock size={16} style={{ color: 'var(--primary-light)' }} />
              <div>
                <p className="details-label">Date Registered</p>
                <p style={{ fontSize: '14px', fontWeight: '600' }}>
                  {new Date(student.createdDate).toLocaleDateString(undefined, {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Demographics & Contacts Details */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3 className="card-title" style={{ borderBottom: '1px solid var(--bg-dark-border)', paddingBottom: '12px' }}>Registry Information</h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            {/* Name */}
            <div className="details-row">
              <span className="details-label">First Name</span>
              <span className="details-value">{student.firstName}</span>
            </div>

            <div className="details-row">
              <span className="details-label">Last Name</span>
              <span className="details-value">{student.lastName}</span>
            </div>

            {/* Email */}
            <div className="details-row">
              <span className="details-label">Email Address</span>
              <span className="details-value" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Mail size={14} style={{ color: 'var(--text-muted)' }} />
                <span>{student.email}</span>
              </span>
            </div>

            {/* Phone */}
            <div className="details-row">
              <span className="details-label">Mobile Number</span>
              <span className="details-value" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Phone size={14} style={{ color: 'var(--text-muted)' }} />
                <span>{student.mobileNumber}</span>
              </span>
            </div>

            {/* DOB */}
            <div className="details-row">
              <span className="details-label">Date of Birth</span>
              <span className="details-value" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Calendar size={14} style={{ color: 'var(--text-muted)' }} />
                <span>
                  {new Date(student.dateOfBirth).toLocaleDateString(undefined, {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
              </span>
            </div>

            {/* Gender */}
            <div className="details-row">
              <span className="details-label">Gender</span>
              <span className="details-value">{student.gender}</span>
            </div>

            {/* Address */}
            <div className="details-row" style={{ gridColumn: 'span 2' }}>
              <span className="details-label">Address Details</span>
              <span className="details-value" style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                <MapPin size={14} style={{ color: 'var(--text-muted)', marginTop: '4px' }} />
                <span>
                  {student.address}, {student.city}, {student.state}
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="glass-card modal-card animate-fade-in">
            <div className="modal-header">
              <div className="modal-icon-alert">
                <AlertTriangle size={20} />
              </div>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="modal-close-btn"
              >
                <X size={18} />
              </button>
            </div>

            <h3 className="modal-title">Delete Student Profile?</h3>
            <p className="modal-body-text">
              Are you sure you want to delete the student profile for{' '}
              <strong style={{ color: 'var(--text-main)' }}>{student.firstName} {student.lastName}</strong>? 
              This action cannot be undone and will permanently remove their records from the database.
            </p>

            <div className="modal-actions">
              <button
                className="btn btn-secondary"
                onClick={() => setShowDeleteModal(false)}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                className="btn btn-danger"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Delete Student'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDetails;
