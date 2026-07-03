import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { toast } from 'react-toastify';
import { 
  Users, 
  Search, 
  User, 
  Mail, 
  ShieldCheck, 
  Calendar 
} from 'lucide-react';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await API.get('/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Failed to load user accounts:', error);
        toast.error('Failed to load user records.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // In-memory filter for local searching
  const filteredUsers = users.filter((u) => {
    const lowerSearch = search.toLowerCase();
    return (
      u.username.toLowerCase().includes(lowerSearch) ||
      u.email.toLowerCase().includes(lowerSearch) ||
      u.role.toLowerCase().includes(lowerSearch)
    );
  });

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-info">
          <h2 className="page-title">User Accounts Registry</h2>
          <p className="page-subtitle">
            Displaying all registered administrative and staff accounts ({users.length} total)
          </p>
        </div>
        <div className="sidebar-logo" style={{ width: '44px', height: '44px', borderRadius: '12px' }}>
          <Users size={20} />
        </div>
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
            placeholder="Search users by name, email, or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Main Table */}
      {loading ? (
        <div style={{ display: 'flex', height: '30vh', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', margin: '0 auto' }}>
            <div style={{ width: '24px', height: '24px', borderRadius: '50%', border: '3px solid var(--primary)', borderTopColor: 'transparent', animation: 'fadeIn 1s infinite' }}></div>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Querying user records...</p>
          </div>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '48px', borderStyle: 'dashed', borderWidth: '2px', borderColor: 'var(--bg-dark-border)' }}>
          <p style={{ color: 'var(--text-muted)', fontWeight: '500' }}>No users match your query search.</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="glass-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Email Address</th>
                <th>Access Role</th>
                <th>Account Created Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => (
                <tr key={u.userId}>
                  <td style={{ fontWeight: '600', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ display: 'flex', width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'rgba(99, 102, 241, 0.1)', color: '#818cf8', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>
                      <User size={14} />
                    </div>
                    <span>{u.username}</span>
                  </td>
                  <td style={{ color: 'var(--text-muted)' }}>{u.email}</td>
                  <td>
                    <span style={{ 
                      borderRadius: '6px', 
                      backgroundColor: u.role === 'Admin' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(14, 165, 233, 0.15)', 
                      padding: '4px 8px', 
                      fontSize: '11px', 
                      fontWeight: '600', 
                      color: u.role === 'Admin' ? 'var(--primary-light)' : 'var(--secondary)',
                      border: u.role === 'Admin' ? '1px solid rgba(99, 102, 241, 0.25)' : '1px solid rgba(14, 165, 233, 0.25)'
                    }}>
                      {u.role}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Calendar size={13} />
                      <span>
                        {new Date(u.createdDate).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserList;
