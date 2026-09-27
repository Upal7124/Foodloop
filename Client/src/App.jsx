import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Sidebar from './components/layout/Sidebar';
import Topbar from './components/layout/Topbar';

// Auth pages (public)
import Login from './pages/Login';
import Signup from './pages/Signup';

// App pages (protected)
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Inventory from './pages/Inventory';
import Sensors from './pages/Sensors';
import WeighingScale from './pages/WeighingScale';
import SurplusDetection from './pages/SurplusDetection';
import SurplusMarketplace from './pages/SurplusMarketplace';
import MLIntelligence from './pages/MLIntelligence';
import Redistribution from './pages/Redistribution';
import Feedback from './pages/Feedback';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

// Layout wrapper for authenticated pages
function AppLayout() {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar />
      <div className="flex-1 ml-56 flex flex-col min-h-screen">
        <Topbar />
        <main className="flex-1 pt-16 p-6 overflow-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/sensors" element={<Sensors />} />
            <Route path="/weighing-scale" element={<WeighingScale />} />
            <Route path="/surplus-detection" element={<SurplusDetection />} />
            <Route path="/surplus-marketplace" element={<SurplusMarketplace />} />
            <Route path="/ml-intelligence" element={<MLIntelligence />} />
            <Route path="/redistribution" element={<Redistribution />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
            {/* Catch-all inside app */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

// Public-only route: redirect to dashboard if already logged in
function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  return isAuthenticated ? <Navigate to="/" replace /> : children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <Signup />
              </PublicRoute>
            }
          />

          {/* Protected routes — all app pages */}
          <Route
            path="/*"
            element={
              // <ProtectedRoute>
                <AppLayout />
              // </ProtectedRoute> 
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
