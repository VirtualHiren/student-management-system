import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { toast } from 'react-toastify';
import { 
  Search, 
  ArrowUpDown, 
  ChevronLeft, 
  ChevronRight, 
  UserPlus, 
  Eye, 
  Pencil, 
  Trash2, 
  AlertTriangle,
  X
} from 'lucide-react';

const StudentList = () => {
  const navigate = useNavigate();

  // Student list state
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination & query state
  const [search, setSearch] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(5); // Show 5 students per page
  const [sortBy, setSortBy] = useState('StudentId');
  const [isDescending, setIsDescending] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Delete modal state
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Load students whenever query parameters change
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const response = await API.get('/students', {
          params: {
            searchName: search,
            pageNumber,
            pageSize,
            sortBy,
            isDescending
          }
        });
        setStudents(response.data.items);
        setTotalPages(response.data.totalPages);
        setTotalCount(response.data.totalCount);
      } catch (error) {
        console.error('Failed to load student registry:', error);
        toast.error('Failed to load student records.');
      } finally {
        setLoading(false);
      }
    };

    // Simple debounce to prevent calling API on every keystroke
    const delayDebounceFn = setTimeout(() => {
      fetchStudents();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [search, pageNumber, pageSize, sortBy, isDescending]);

  // Handle column header sorting
  const handleSort = (column) => {
    if (sortBy === column) {
      setIsDescending(!isDescending);
    } else {
      setSortBy(column);
      setIsDescending(false);
    }
    setPageNumber(1); // Reset to first page
  };

  // Execute delete API call
  const handleDeleteConfirm = async () => {
    if (!studentToDelete) return;
    try {
      setDeleting(true);
      await API.delete(`/students/${studentToDelete.studentId}`);
      toast.success(`Successfully deleted student: ${studentToDelete.firstName}`);
      setStudentToDelete(null);
      
      const newPageNumber = students.length === 1 && pageNumber > 1 ? pageNumber - 1 : pageNumber;
      setPageNumber(newPageNumber);
      setSortBy(sortBy === 'StudentId' ? 'createddate' : 'StudentId');
    } catch (error) {
      console.error('Deletion failed:', error);
      toast.error('Failed to delete student.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-info">
          <h2 className="page-title">Student Registry</h2>
          <p className="page-subtitle">
            Displaying {totalCount} total students in the system
          </p>
        </div>
        <button
          onClick={() => navigate('/students/add')}
          className="btn btn-primary"
        >
          <UserPlus size={16} />
          <span>Add Student</span>
        </button>
      </div>

      {/* Filter and Search controls */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '16px', backgroundColor: 'rgba(21, 29, 42, 0.3)', borderRadius: '12px', border: '1px solid var(--bg-dark-border)' }}>
        <div className="input-icon-wrapper" style={{ maxWidth: '400px' }}>
          <span className="input-icon">
            <Search size={18} />
          </span>
          <input
            type="text"
            className="form-input"
            placeholder="Search students by name..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPageNumber(1);
            }}
          />
        </div>
      </div>

      {/* Main Table Registry */}
      {loading && students.length === 0 ? (
        <div style={{ display: 'flex', height: '30vh', alignItems: 'center', justifycontent: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', margin: '0 auto' }}>
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" style={{ width: '24px', height: '24px', borderRadius: '50%', border: '3px solid var(--primary)', borderTopColor: 'transparent' }}></div>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Querying database...</p>
          </div>
        </div>
      ) : students.length === 0 ? (
        <div className="glass-card" style={{ textalign: 'center', padding: '48px', borderStyle: 'dashed', borderWidth: '2px', borderColor: 'var(--bg-dark-border)' }}>
          <p style={{ color: 'var(--text-muted)', fontWeight: '500' }}>No students match your query filters.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="table-container">
            <table className="glass-table">
              <thead>
                <tr>
                  <th style={{ cursor: 'pointer', userSelect: 'none' }} onClick={() => handleSort('FirstName')}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>Name</span>
                      <ArrowUpDown size={13} style={{ color: 'var(--text-muted)' }} />
                    </div>
                  </th>
                  <th style={{ cursor: 'pointer', userSelect: 'none' }} onClick={() => handleSort('Email')}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>Email</span>
                      <ArrowUpDown size={13} style={{ color: 'var(--text-muted)' }} />
                    </div>
                  </th>
                  <th style={{ cursor: 'pointer', userSelect: 'none' }} onClick={() => handleSort('Course')}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>Course</span>
                      <ArrowUpDown size={13} style={{ color: 'var(--text-muted)' }} />
                    </div>
                  </th>
                  <th>Mobile Number</th>
                  <th>Status</th>
                  <th style={{ textalign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.studentId}>
                    <td style={{ fontWeight: '600', color: 'var(--text-main)' }}>
                      {student.firstName} {student.lastName}
                    </td>
                    <td style={{ color: 'var(--text-muted)' }}>{student.email}</td>
                    <td>
                      <span style={{ 
                        borderRadius: '6px', 
                        backgroundColor: '#1b2332', 
                        padding: '4px 8px', 
                        fontSize: '11px', 
                        fontWeight: '600', 
                        color: '#94a3b8',
                        border: '1px solid rgba(255, 255, 255, 0.04)'
                      }}>
                        {student.course}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-muted)' }}>{student.mobileNumber}</td>
                    <td>
                      <span className={`td-badge ${student.isActive ? 'td-badge-active' : 'td-badge-inactive'}`}>
                        <span className="td-dot"></span>
                        <span>{student.isActive ? 'Active' : 'Inactive'}</span>
                      </span>
                    </td>
                    <td>
                      <div className="td-actions">
                        <button
                          onClick={() => navigate(`/students/${student.studentId}`)}
                          className="btn btn-secondary"
                          style={{ padding: '6px 10px', borderRadius: '6px' }}
                          title="View Details"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={() => navigate(`/students/edit/${student.studentId}`)}
                          className="btn btn-secondary"
                          style={{ padding: '6px 10px', borderRadius: '6px' }}
                          title="Edit Student"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => setStudentToDelete(student)}
                          className="btn btn-secondary"
                          style={{ padding: '6px 10px', borderRadius: '6px', color: '#f87171', bordercolor: 'rgba(239, 68, 68, 0.15)' }}
                          title="Delete Student"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="pagination-container">
            <div className="pagination-info">
              Showing page {pageNumber} of {totalPages} ({totalCount} total students)
            </div>
            <div className="pagination-actions">
              <button
                className="btn btn-secondary"
                style={{ padding: '6px 10px' }}
                onClick={() => setPageNumber(prev => Math.max(prev - 1, 1))}
                disabled={pageNumber === 1}
              >
                <ChevronLeft size={16} />
              </button>
              <button
                className="btn btn-secondary"
                style={{ padding: '6px 10px' }}
                onClick={() => setPageNumber(prev => Math.min(prev + 1, totalPages))}
                disabled={pageNumber === totalPages}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. DELETE CONFIRMATION DIALOG MODAL */}
      {studentToDelete && (
        <div className="modal-overlay">
          <div className="glass-card modal-card animate-fade-in">
            <div className="modal-header">
              <div className="modal-icon-alert">
                <AlertTriangle size={20} />
              </div>
              <button
                onClick={() => setStudentToDelete(null)}
                className="modal-close-btn"
              >
                <X size={18} />
              </button>
            </div>

            <h3 className="modal-title">Delete Student Profile?</h3>
            <p className="modal-body-text">
              Are you sure you want to delete the student profile for{' '}
              <strong style={{ color: 'var(--text-main)' }}>{studentToDelete.firstName} {studentToDelete.lastName}</strong>? 
              This action cannot be undone and will permanently remove their records from the database.
            </p>

            <div className="modal-actions">
              <button
                className="btn btn-secondary"
                onClick={() => setStudentToDelete(null)}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                className="btn btn-danger"
                onClick={handleDeleteConfirm}
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

export default StudentList;
