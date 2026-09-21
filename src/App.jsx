import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Topbar from './components/layout/Topbar';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Inventory from './pages/Inventory';
import Sensors from './pages/Sensors';
import Redistribution from './pages/Redistribution';
import Feedback from './pages/Feedback';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100 flex">
        {/* Sidebar */}
        <Sidebar />

        {/* Main content */}
        <div className="flex-1 ml-56 flex flex-col min-h-screen">
          {/* Top bar */}
          <Topbar />

          {/* Page content */}
          <main className="flex-1 pt-16 p-6 overflow-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/sensors" element={<Sensors />} />
              <Route path="/redistribution" element={<Redistribution />} />
              <Route path="/feedback" element={<Feedback />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}
