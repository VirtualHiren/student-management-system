import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

/// <summary>
/// A custom React hook that grants components easy access to the global AuthContext.
/// </summary>
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider. Verify that you wrapped your app inside <AuthProvider>.');
  }
  
  return context;
};
