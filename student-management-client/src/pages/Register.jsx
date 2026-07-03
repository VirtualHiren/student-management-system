import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-toastify';
import { UserPlus, User, Mail, Lock, ShieldCheck, ShieldAlert } from 'lucide-react';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  // Form State
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Client-side Validation
  const validateForm = () => {
    const tempErrors = {};
    if (!username.trim()) {
      tempErrors.username = 'Username is required.';
    } else if (username.trim().length < 3) {
      tempErrors.username = 'Username must be at least 3 characters.';
    }

    if (!email.trim()) {
      tempErrors.email = 'Email address is required.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      tempErrors.email = 'Invalid email address format.';
    }

    if (!password) {
      tempErrors.password = 'Password is required.';
    } else if (password.length < 6) {
      tempErrors.password = 'Password must be at least 6 characters.';
    }

    if (password !== confirmPassword) {
      tempErrors.confirmPassword = 'Passwords do not match.';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    const result = await register(username, email, password);
    setSubmitting(false);

    if (result.success) {
      toast.success('Account created successfully!');
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
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px', textAlign: 'center' }}>
          {/* Decorative User Plus Icon */}
          <div style={{ display: 'flex', height: '48px', width: '48px', alignItems: 'center', justifyContent: 'center', borderRadius: '12px', backgroundColor: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', marginBottom: '16px', border: '1px solid rgba(99, 102, 241, 0.25)' }}>
            <UserPlus size={20} />
          </div>
          <h2 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '4px' }}>Create Account</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
            Sign up to manage students and course allocations
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Username Input */}
          <div className="form-group">
            <label className="form-label" htmlFor="username">
              Username
            </label>
            <div className="input-icon-wrapper">
              <span className="input-icon">
                <User size={18} />
              </span>
              <input
                id="username"
                type="text"
                className="form-input"
                placeholder="johndoe"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={submitting}
              />
            </div>
            {errors.username && (
              <span className="form-error">
                <ShieldAlert size={14} /> {errors.username}
              </span>
            )}
          </div>

          {/* Email Input */}
          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Email Address
            </label>
            <div className="input-icon-wrapper">
              <span className="input-icon">
                <Mail size={18} />
              </span>
              <input
                id="email"
                type="email"
                className="form-input"
                placeholder="john.doe@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={submitting}
              />
            </div>
            {errors.email && (
              <span className="form-error">
                <ShieldAlert size={14} /> {errors.email}
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
                placeholder="Minimum 6 characters"
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

          {/* Confirm Password Input */}
          <div className="form-group">
            <label className="form-label" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <div className="input-icon-wrapper">
              <span className="input-icon">
                <ShieldCheck size={18} />
              </span>
              <input
                id="confirmPassword"
                type="password"
                className="form-input"
                placeholder="Repeat password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={submitting}
              />
            </div>
            {errors.confirmPassword && (
              <span className="form-error">
                <ShieldAlert size={14} /> {errors.confirmPassword}
              </span>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary w-full"
            style={{ padding: '12px', fontSize: '15px', marginTop: '12px' }}
            disabled={submitting}
          >
            {submitting ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '2px solid #fff', borderTopColor: 'transparent', animation: 'fadeIn 1s infinite' }}></div>
                <span>Creating account...</span>
              </div>
            ) : (
              <span>Register Now</span>
            )}
          </button>
        </form>

        <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--primary-light)', fontWeight: '600' }}>
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
