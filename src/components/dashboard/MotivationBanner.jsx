import { Leaf } from 'lucide-react';

export default function MotivationBanner() {
  return (
    <div
      className="rounded-xl p-5 flex flex-col justify-between relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #14532d 0%, #1a6b3a 60%, #166534 100%)' }}
    >
      {/* Decorative circles */}
      <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10" style={{ backgroundColor: '#22c55e' }}></div>
      <div className="absolute -right-2 bottom-4 w-16 h-16 rounded-full opacity-10" style={{ backgroundColor: '#4ade80' }}></div>

      {/* Content */}
      <div className="relative z-10">
        <p className="text-white text-lg font-bold leading-snug mb-2">
          Together<br />We Can End<br />Food Waste
        </p>
        <div className="flex items-center gap-1.5 mt-3">
          <Leaf size={14} className="text-green-300" />
          <span className="text-green-200 text-xs">Making an impact every day</span>
        </div>
      </div>

      {/* Decorative food emoji */}
      <div className="absolute right-4 bottom-4 text-4xl opacity-60 select-none">🥗</div>
    </div>
  );
}
