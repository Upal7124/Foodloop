import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Sidebar from "./components/layout/Sidebar";
import Topbar from "./components/layout/Topbar";

// Auth / public pages
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

// Kitchen pages
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import Inventory from "./pages/Inventory";
import Sensors from "./pages/Sensors";
import WeighingScale from "./pages/WeighingScale";
import SurplusDetection from "./pages/SurplusDetection";
import SurplusMarketplace from "./pages/SurplusMarketplace";
import MLIntelligence from "./pages/MLIntelligence";
import Redistribution from "./pages/Redistribution";
import Feedback from "./pages/Feedback";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";

// Role dashboards
import NGODashboard from "./pages/NGODashboard";
import RiderDashboard from "./pages/RiderDashboard";

// Helper — returns home path for each role
const getRoleDashboard = (role) => {
  if (role === "ngo") return "/ngo-dashboard";
  if (role === "agent") return "/rider-dashboard";
  return "/kitchen-dashboard";
};

// Authenticated app shell (sidebar + topbar + outlet)
function AppLayout() {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar />
      <div className="flex-1 ml-56 flex flex-col min-h-screen">
        <Topbar />
        <main className="flex-1 pt-16 p-6 overflow-auto">
          <Routes>
            {/* Kitchen routes */}
            <Route path="/kitchen-dashboard" element={<Dashboard />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/sensors" element={<Sensors />} />
            <Route path="/weighing-scale" element={<WeighingScale />} />
            <Route path="/surplus-detection" element={<SurplusDetection />} />
            <Route path="/surplus-marketplace" element={<SurplusMarketplace />}/>
            <Route path="/ml-intelligence" element={<MLIntelligence />} />
            <Route path="/redistribution" element={<Redistribution />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
            {/* Role dashboards */}
            <Route path="/ngo-dashboard" element={<NGODashboard />} />
            <Route path="/rider-dashboard" element={<RiderDashboard />} />
            {/* Catch-all inside app — send to role home */}
            <Route path="*" element={<RoleRedirect />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

// Redirects to the right dashboard based on role
function RoleRedirect() {
  const { user } = useAuth();
  return <Navigate to={getRoleDashboard(user?.role)} replace />;
}

// Public-only: redirect authenticated users to their dashboard
function PublicRoute({ children }) {
  const { isAuthenticated, loading, user } = useAuth();
  if (loading) return null;
  if (isAuthenticated)
    return <Navigate to={getRoleDashboard(user?.role)} replace />;
  return children;
}

export { getRoleDashboard };

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public landing page */}
          <Route
            path="/"
            element={
              <PublicRoute>
                <Landing />
              </PublicRoute>
            }
          />
          {/* Auth pages */}
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
          {/* All authenticated pages under AppLayout */}
          <Route>
            <Route path="/*" element={<ProtectedRoute><AppLayout /></ProtectedRoute>} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
