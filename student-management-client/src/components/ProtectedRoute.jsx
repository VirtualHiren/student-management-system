import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

/// <summary>
/// A route guard component that prevents unauthorized users from visiting protected pages.
/// </summary>
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // If we are still checking for an existing user session on boot, render a loading indicator.
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-900 text-white">
        <div className="flex flex-col items-center gap-4">
          {/* A clean CSS Loading Spinner */}
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
          <p className="text-slate-400 font-medium">Verifying Session...</p>
        </div>
      </div>
    );
  }

  // If no user session is present, redirect to the login page.
  // We use replace=true to prevent the user from clicking the back button into this protected page.
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Render the protected page content
  return children;
};

export default ProtectedRoute;
