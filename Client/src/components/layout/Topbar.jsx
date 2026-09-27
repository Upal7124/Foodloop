import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Building2, ChevronDown, Bell, LogOut, UserCircle, HelpCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const pageTitles = {
  '/': { title: 'Dashboard', subtitle: 'Overview of food production, waste and impact' },
  '/analytics': { title: 'Analytics', subtitle: 'Deep dive into your food data trends' },
  '/inventory': { title: 'Inventory', subtitle: 'Manage and track your food stock' },
  '/sensors': { title: 'Sensors', subtitle: 'Real-time sensor monitoring and alerts' },
  '/weighing-scale': { title: 'Weighing Scale', subtitle: 'Live sensor readings and measurement history' },
  '/surplus-detection': { title: 'Surplus Detection', subtitle: 'Log morning and evening sessions to detect daily surplus' },
  '/surplus-marketplace': { title: 'Surplus Marketplace', subtitle: 'Browse and claim available surplus food listings' },
  '/ml-intelligence': { title: 'ML Intelligence', subtitle: 'AI model training records, predictions and performance metrics' },
  '/redistribution': { title: 'Redistribution', subtitle: 'Track surplus food distribution to partners' },
  '/feedback': { title: 'Feedback', subtitle: 'View and respond to user feedback' },
  '/reports': { title: 'Reports', subtitle: 'Generate and download detailed reports' },
  '/settings': { title: 'Settings', subtitle: 'Configure your account and preferences' },
};

export default function Topbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [restaurantOpen, setRestaurantOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const page = pageTitles[location.pathname] || pageTitles['/'];

  const handleLogout = () => {
    setUserOpen(false);
    logout();
    navigate('/login');
  };

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <header className="fixed top-0 left-56 right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-20">
      {/* Page Title */}
      <div>
        <h1 className="text-lg font-semibold text-gray-900">{page.title}</h1>
        <p className="text-xs text-gray-500">{page.subtitle}</p>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        {/* Notification Bell */}
        <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <Bell size={18} className="text-gray-600" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Restaurant Selector */}
        <div className="relative">
          <button
            onClick={() => { setRestaurantOpen(!restaurantOpen); setUserOpen(false); }}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-sm"
          >
            <Building2 className="w-4 h-4 text-gray-600" />
            <span className="text-gray-700 font-medium max-w-40 truncate">
              {user?.restaurant || 'My Restaurant'}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
          </button>
          {restaurantOpen && (
            <div className="absolute top-full right-0 mt-1 w-56 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-30">
              {[user?.restaurant || 'My Restaurant', 'City Food Hub', 'Sunrise Kitchen'].map((name) => (
                <button
                  key={name}
                  onClick={() => setRestaurantOpen(false)}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  {name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => { setUserOpen(!userOpen); setRestaurantOpen(false); }}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
              style={{ backgroundColor: '#1a6b3a' }}
            >
              {initials}
            </div>
            <span className="text-sm text-gray-700 font-medium max-w-24 truncate">
              {user?.name?.split(' ')[0] || 'User'}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
          </button>

          {userOpen && (
            <div className="absolute top-full right-0 mt-1 w-52 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-30">
              {/* User info header */}
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-900 truncate">{user?.name}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>

              <button
                onClick={() => { setUserOpen(false); navigate('/settings'); }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              >
                <UserCircle size={14} className="text-gray-400" />
                Account Settings
              </button>
              <button
                onClick={() => setUserOpen(false)}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              >
                <HelpCircle size={14} className="text-gray-400" />
                Help & Support
              </button>

              <div className="border-t border-gray-100 mt-1 pt-1">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                >
                  <LogOut size={14} />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
