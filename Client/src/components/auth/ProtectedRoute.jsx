import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // While restoring session from localStorage, show nothing (avoid flash)
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f3f4f6' }}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-green-600 border-t-transparent rounded-full animate-spin" style={{ borderWidth: '3px' }}></div>
          <p className="text-sm text-gray-500">Loading FoodLoop...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Save attempted URL so we can redirect after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
