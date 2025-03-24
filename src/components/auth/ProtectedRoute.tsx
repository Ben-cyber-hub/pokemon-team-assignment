import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  /** The child components to render when authenticated */
  children: ReactNode;
  /** Optional redirect path for unauthenticated users */
  redirectTo?: string;
}

/**
 * ProtectedRoute Component
 * 
 * Wraps routes that require authentication. Redirects unauthenticated users
 * to the login page and shows a loading state while checking authentication.
 * 
 * @example
 * ```tsx
 * <ProtectedRoute>
 *   <TeamDetails />
 * </ProtectedRoute>
 * ```
 */
export const ProtectedRoute = ({ 
  children, 
  redirectTo = '/login' 
}: ProtectedRouteProps) => {
  const { user, loading } = useAuth();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500" />
      </div>
    );
  }

  // Redirect unauthenticated users
  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }

  // Render protected content
  return <>{children}</>;
};