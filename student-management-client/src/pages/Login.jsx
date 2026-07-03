import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-toastify';
import { LogIn, Mail, Lock, ShieldAlert } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  // Form State
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Client-side Validation
  const validateForm = () => {
    const tempErrors = {};
    if (!usernameOrEmail.trim()) {
      tempErrors.usernameOrEmail = 'Username or Email is required.';
    }
    if (!password) {
      tempErrors.password = 'Password is required.';
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    const result = await login(usernameOrEmail, password);
    setSubmitting(false);

    if (result.success) {
      toast.success('Successfully logged in!');
      navigate('/', { replace: true });
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="auth-page">
      {/* Background radial glow */}
      <div className="auth-radial-glow"></div>

      <div className="glass-card auth-card animate-fade-in">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '24px', textAlign: 'center' }}>
          {/* Decorative Shield Icon */}
          <div style={{ display: 'flex', height: '48px', width: '48px', alignItems: 'center', justifyContent: 'center', borderRadius: '12px', backgroundColor: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', marginBottom: '16px', border: '1px solid rgba(99, 102, 241, 0.25)' }}>
            <LogIn size={20} />
          </div>
          <h2 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '6px' }}>Welcome Back</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
            Sign in to access the Student Management System
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Username/Email Input */}
          <div className="form-group">
            <label className="form-label" htmlFor="usernameOrEmail">
              Username or Email
            </label>
            <div className="input-icon-wrapper">
              <span className="input-icon">
                <Mail size={18} />
              </span>
              <input
                id="usernameOrEmail"
                type="text"
                className="form-input"
                placeholder="Enter username or email"
                value={usernameOrEmail}
                onChange={(e) => setUsernameOrEmail(e.target.value)}
                disabled={submitting}
              />
            </div>
            {errors.usernameOrEmail && (
              <span className="form-error">
                <ShieldAlert size={14} /> {errors.usernameOrEmail}
              </span>
            )}
          </div>

          {/* Password Input */}
          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <div className="input-icon-wrapper">
              <span className="input-icon">
                <Lock size={18} />
              </span>
              <input
                id="password"
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={submitting}
              />
            </div>
            {errors.password && (
              <span className="form-error">
                <ShieldAlert size={14} /> {errors.password}
              </span>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary w-full"
            style={{ padding: '12px', fontSize: '15px', marginTop: '8px' }}
            disabled={submitting}
          >
            {submitting ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" style={{ width: '16px', height: '16px', borderRadius: '50%', border: '2px solid #fff', borderTopColor: 'transparent', animation: 'fadeIn 1s infinite' }}></div>
                <span>Signing in...</span>
              </div>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '14px', color: 'var(--text-muted)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--primary-light)', fontWeight: '600' }}>
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
