import { Wallet, Calendar, TrendingUp } from 'lucide-react';

const EarningsTab = ({ earnings }) => {
  const items = [
    { 
      label: "Today's Earnings", 
      value: earnings.today || 0, 
      subtext: new Date().toLocaleDateString(),
      icon: Wallet,
      color: 'green'
    },
    { 
      label: 'This Week', 
      value: earnings.week || 0, 
      subtext: 'Last 7 days',
      icon: Calendar,
      color: 'blue'
    },
    { 
      label: 'Total Earnings', 
      value: earnings.total || 0, 
      subtext: 'All time',
      icon: TrendingUp,
      color: 'purple'
    }
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
      <h3 className="text-lg font-bold text-gray-900 mb-6">Earnings Overview</h3>
      <div className="space-y-4">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 bg-${item.color}-100 rounded-lg flex items-center justify-center`}>
                <item.icon className={`w-5 h-5 text-${item.color}-600`} />
              </div>
              <div>
                <p className="font-semibold text-gray-900">{item.label}</p>
                <p className="text-sm text-gray-500">{item.subtext}</p>
              </div>
            </div>
            <span className="text-xl font-bold text-gray-900">₹{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EarningsTab;