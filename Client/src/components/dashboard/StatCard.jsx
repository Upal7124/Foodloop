import { Utensils, Users, Trash2, Leaf, TrendingUp, TrendingDown } from 'lucide-react';

const iconMap = {
  utensils: Utensils,
  users: Users,
  trash: Trash2,
  leaf: Leaf,
};

const colorMap = {
  green: {
    bg: 'bg-green-50',
    iconBg: 'bg-green-100',
    icon: '#16a34a',
    change: 'text-green-600',
  },
  blue: {
    bg: 'bg-blue-50',
    iconBg: 'bg-blue-100',
    icon: '#2563eb',
    change: 'text-green-600',
  },
  red: {
    bg: 'bg-red-50',
    iconBg: 'bg-red-100',
    icon: '#dc2626',
    change: 'text-green-600',
  },
  amber: {
    bg: 'bg-amber-50',
    iconBg: 'bg-amber-100',
    icon: '#d97706',
    change: 'text-green-600',
  },
};

export default function StatCard({ title, value, change, positive, icon, color, vsText }) {
  const Icon = iconMap[icon] || Leaf;
  const colors = colorMap[color] || colorMap.green;
  const TrendIcon = positive ? TrendingUp : TrendingDown;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${colors.iconBg}`}>
        <Icon size={22} style={{ color: colors.icon }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-500 mb-1">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <div className="flex items-center gap-1 mt-1">
          <TrendIcon size={13} className={colors.change} />
          <span className={`text-xs font-semibold ${colors.change}`}>{change}</span>
          <span className="text-xs text-gray-400">{vsText}</span>
        </div>
      </div>
    </div>
  );
}
