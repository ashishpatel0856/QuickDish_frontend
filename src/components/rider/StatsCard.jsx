import { Wallet, Package, Star } from 'lucide-react';

const icons = { Wallet, Package, Star };
const colors = {
  green: { bg: 'bg-green-100', text: 'text-green-600', badge: 'bg-green-50 text-green-600' },
  blue: { bg: 'bg-blue-100', text: 'text-blue-600', badge: 'bg-blue-50 text-blue-600' },
  orange: { bg: 'bg-orange-100', text: 'text-orange-600', badge: 'bg-orange-50 text-orange-600' }
};

const StatsCard = ({ title, value, subtext, icon, color }) => {
  const Icon = icons[icon];
  const style = colors[color];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 ${style.bg} rounded-xl flex items-center justify-center`}>
          <Icon className={`w-6 h-6 ${style.text}`} />
        </div>
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${style.badge}`}>
          {subtext}
        </span>
      </div>
      <p className="text-gray-500 text-sm mb-1">{title}</p>
      <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">{value}</h3>
    </div>
  );
};

export default StatsCard;