import { 
  Users, CheckCircle, Bike, DollarSign, TrendingUp, 
  Clock, Store, Building2, CheckCircle2 
} from 'lucide-react';

const iconMap = { Users, CheckCircle, CheckCircle2,Bike,DollarSign,Clock,Store,Building2};

const StatCard = ({ title, value, icon, color, trend, subtitle }) => {
  const Icon = iconMap[icon] || DollarSign;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">{value}</h3>
          {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
          {trend && (
            <p className="text-green-600 text-sm mt-2 flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              {trend}
            </p>
          )}
        </div>
        <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
        </div>
      </div>
    </div>
  );
};

export default StatCard;