import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-toastify';
import { 
  GraduationCap, 
  LayoutDashboard, 
  Users, 
  LogOut, 
  User as UserIcon,
  ChevronRight
} from 'lucide-react';

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully.');
    navigate('/login');
  };

  // Get user's first letter for avatar badge
  const userInitial = user?.username ? user.username.charAt(0).toUpperCase() : 'U';

  return (
    <div className="app-container">
      {/* 1. SIDEBAR NAVIGATION */}
      <aside className="sidebar">
        {/* Brand / Logo Header */}
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <GraduationCap size={22} />
          </div>
          <div>
            <h1 className="sidebar-logo-text">EduManage</h1>
            <span className="sidebar-logo-sub">Portal</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="sidebar-nav">
          <NavLink
            to="/"
            end
            className={({ isActive }) => 
              isActive ? 'sidebar-link active' : 'sidebar-link'
            }
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/students"
            className={({ isActive }) => 
              isActive ? 'sidebar-link active' : 'sidebar-link'
            }
          >
            <Users size={18} />
            <span>Students</span>
          </NavLink>

          <NavLink
            to="/users"
            className={({ isActive }) => 
              isActive ? 'sidebar-link active' : 'sidebar-link'
            }
          >
            <UserIcon size={18} />
            <span>Users</span>
          </NavLink>
        </nav>

        {/* User Card Profile Details & Logout */}
        <div className="sidebar-footer">
          <div className="sidebar-user-card">
            <div className="sidebar-avatar">
              <span>{userInitial}</span>
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <p className="sidebar-user-name" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.username}
              </p>
              <p className="sidebar-user-role">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="btn btn-secondary w-full"
            style={{ 
              padding: '8px 12px', 
              fontSize: '12px', 
              backgroundColor: 'rgba(239, 68, 68, 0.08)',
              color: '#f87171',
              border: '1px solid rgba(239, 68, 68, 0.15)',
              justifyContent: 'center'
            }}
          >
            <LogOut size={13} />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <div className="main-content">
        {/* Top Navbar Header */}
        <header className="header-bar">
          <div className="breadcrumbs">
            <span>Admin Portal</span>
            <ChevronRight size={12} className="breadcrumbs-sep" />
            <span className="breadcrumbs-active">
              {window.location.pathname === '/' ? 'Dashboard' : window.location.pathname.split('/')[1]}
            </span>
          </div>
          <div className="header-status">
            <span className="status-dot"></span>
            <span style={{ fontWeight: '600', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Server Connected</span>
          </div>
        </header>

        {/* Dynamic Nested Child Route Render Content */}
        <main className="content-body">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
