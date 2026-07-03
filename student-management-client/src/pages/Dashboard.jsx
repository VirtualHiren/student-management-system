import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import { toast } from 'react-toastify';
import { 
  Users, 
  UserCheck, 
  BookOpen, 
  UserPlus, 
  ChevronRight,
  TrendingUp
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recentStudents, setRecentStudents] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch all students to compute local metrics
        const allRes = await API.get('/students?pageSize=1000');
        setStudents(allRes.data.items);

        // Fetch the 5 most recently created students for the history list
        const recentRes = await API.get('/students?pageSize=5&sortBy=CreatedDate&isDescending=true');
        setRecentStudents(recentRes.data.items);
      } catch (error) {
        console.error('Failed to load dashboard metrics:', error);
        toast.error('Could not connect to the backend server.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Compute stats from students array
  const totalStudents = students.length;
  const activeStudents = students.filter(s => s.isActive).length;
  const inactiveStudents = totalStudents - activeStudents;
  
  // Extract unique courses
  const uniqueCourses = [...new Set(students.map(s => s.course))].filter(Boolean);
  const totalCourses = uniqueCourses.length;

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '60vh', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" style={{ width: '32px', height: '32px', borderRadius: '50%', border: '4px solid var(--primary)', borderTopColor: 'transparent' }}></div>
          <p style={{ color: 'var(--text-muted)', fontWeight: '500' }}>Computing Dashboard Metrics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Welcome banner */}
      <div className="page-header">
        <div className="page-header-info">
          <h2 className="page-title">System Dashboard</h2>
          <p className="page-subtitle">
            Real-time analytics and student registry control panel
          </p>
        </div>
        <button
          onClick={() => navigate('/students/add')}
          className="btn btn-primary"
        >
          <UserPlus size={16} />
          <span>Add New Student</span>
        </button>
      </div>

      {/* Summary Cards Grid */}
      <div className="metrics-grid">
        {/* Total Students Card */}
        <div className="glass-card glass-card-hover metric-card">
          <div className="metric-icon">
            <Users size={24} />
          </div>
          <div className="metric-details">
            <span className="metric-label">Total Enrolled</span>
            <h3 className="metric-value">{totalStudents}</h3>
          </div>
        </div>

        {/* Active Students Card */}
        <div className="glass-card glass-card-hover metric-card active-card">
          <div className="metric-icon">
            <UserCheck size={24} />
          </div>
          <div className="metric-details">
            <span className="metric-label">Active Students</span>
            <h3 className="metric-value">{activeStudents}</h3>
          </div>
        </div>

        {/* Total Courses Card */}
        <div className="glass-card glass-card-hover metric-card courses-card">
          <div className="metric-icon">
            <BookOpen size={24} />
          </div>
          <div className="metric-details">
            <span className="metric-label">Active Courses</span>
            <h3 className="metric-value">{totalCourses}</h3>
          </div>
        </div>
      </div>

      {/* Content Columns split */}
      <div className="content-grid-2-1">
        {/* Left Column: Recent Students List */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="card-header">
            <h3 className="card-title">Recently Registered</h3>
            <Link to="/students" style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '600' }}>
              <span>View Registry</span>
              <ChevronRight size={14} />
            </Link>
          </div>

          {recentStudents.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', padding: '16px 0', textAlign: 'center' }}>
              No student records found. Add some students to see them here.
            </p>
          ) : (
            <div className="table-container">
              <table className="glass-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Course</th>
                    <th>Date Added</th>
                  </tr>
                </thead>
                <tbody>
                  {recentStudents.map((student) => (
                    <tr key={student.studentId} style={{ cursor: 'pointer' }} onClick={() => navigate(`/students/${student.studentId}`)}>
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
                      <td style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
                        {new Date(student.createdDate).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right Column: Database details */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="card-header">
            <h3 className="card-title">Quick Overview</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(21, 29, 42, 0.4)', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--bg-dark-border)' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Database Engine</span>
              <span style={{ fontSize: '13px', fontWeight: '600' }}>PostgreSQL</span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(21, 29, 42, 0.4)', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--bg-dark-border)' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Backend Server</span>
              <span style={{ fontSize: '13px', fontWeight: '600' }}>ASP.NET Core</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(21, 29, 42, 0.4)', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--bg-dark-border)' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>ORM Tool</span>
              <span style={{ fontSize: '13px', fontWeight: '600' }}>EF Core Code-First</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(21, 29, 42, 0.4)', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--bg-dark-border)' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Authentication</span>
              <span style={{ fontSize: '13px', fontWeight: '600' }}>Stateless JWT</span>
            </div>

            <div style={{ 
              padding: '16px', 
              borderRadius: '12px', 
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(236, 72, 153, 0.08) 100%)', 
              border: '1px solid rgba(99, 102, 241, 0.15)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#818cf8', marginBottom: '8px' }}>
                <TrendingUp size={16} />
                <span style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Registry Health</span>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                Database currently has {activeStudents} active out of {totalStudents} total student accounts. 
                Deactivated accounts ({inactiveStudents}) are preserved in history but ignored in default portal displays.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
