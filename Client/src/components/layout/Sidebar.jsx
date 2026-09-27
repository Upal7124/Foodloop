import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, BarChart2, Package, Wifi, Scale,
  TrendingDown, ShoppingBag, RefreshCw, MessageSquare,
  FileText, Settings, Leaf, Brain,
} from 'lucide-react';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard',         path: '/' },
  { icon: BarChart2,       label: 'Analytics',         path: '/analytics' },
  { icon: Package,         label: 'Inventory',         path: '/inventory' },
  { icon: Wifi,            label: 'Sensors',           path: '/sensors' },
  { icon: Scale,           label: 'Weighing Scale',    path: '/weighing-scale' },
  { icon: TrendingDown,    label: 'Surplus Monitor', path: '/surplus-detection' },
  { icon: ShoppingBag,     label: 'Surplus Market',    path: '/surplus-marketplace' },
  { icon: Brain,           label: 'ML Intelligence',   path: '/ml-intelligence' },
  { icon: RefreshCw,       label: 'Redistribution',    path: '/redistribution' },
  { icon: MessageSquare,   label: 'Feedback',          path: '/feedback' },
  { icon: FileText,        label: 'Reports',           path: '/reports' },
  { icon: Settings,        label: 'Settings',          path: '/settings' },
];

export default function Sidebar() {
  return (
    <aside className="fixed top-0 left-0 h-screen w-56 flex flex-col" style={{ backgroundColor: '#1a3a2a' }}>
      {/* Logo */}
      <div className="px-5 pt-6 pb-4 border-b border-white/10">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#22c55e' }}>
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <span className="text-white font-bold text-lg tracking-wide">FoodLoop</span>
        </div>
        <p className="text-xs text-white/50 ml-10">Cook Smart. Share More.</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ icon: Icon, label, path }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 ${
                isActive
                  ? 'bg-white/15 text-white font-medium'
                  : 'text-white/60 hover:bg-white/8 hover:text-white/90'
              }`
            }
          >
            <Icon className="w-4.5 h-4.5 flex-shrink-0" size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom tagline */}
      <div className="px-5 py-5 border-t border-white/10">
        <div className="flex items-center gap-2 mb-1">
          <Leaf className="w-4 h-4" style={{ color: '#22c55e' }} />
          <span className="text-white/70 text-xs font-medium">Good Food</span>
        </div>
        <p className="text-white/40 text-xs">Brighter Tomorrows</p>
      </div>
    </aside>
  );
}
