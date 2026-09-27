import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * ProtectedRoute — supports two usage patterns:
 *   1. <ProtectedRoute>  (children pattern — wraps a single child)
 *   2. <Route element={<ProtectedRoute />}>  (Outlet pattern — wraps nested routes)
 */
export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // While restoring session from localStorage, avoid a flash redirect
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f3f4f6' }}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-t-green-600 border-green-200 rounded-full animate-spin" style={{ borderWidth: '3px', borderTopColor: '#16a34a', borderColor: '#d1fae5' }}></div>
          <p className="text-sm text-gray-500">Loading FoodLoop...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Save attempted URL so we can redirect after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Support both children and Outlet (nested route) patterns
  return children ? children : <Outlet />;
}
