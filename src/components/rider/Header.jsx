import { Menu, MapPin, AlertCircle, Clock } from 'lucide-react';

const Header = ({ activeTab, riderStatus, onStatusChange, onMenuClick }) => {
  
  const getTitle = () => {
    if (activeTab === 'orders') return 'Orders';
    if (activeTab === 'earnings') return 'Earnings';
    return 'Profile';
  };

  const StatusBtn = ({ status, label, icon: Icon, color }) => (
    <button
      onClick={() => onStatusChange(status)}
      className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all ${
        riderStatus === status
          ? `${color} text-white shadow-lg`
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="flex items-center justify-between p-4 sm:p-6">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            <Menu className="w-6 h-6 text-gray-600" />
          </button>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{getTitle()}</h2>
            <p className="text-sm text-gray-500 hidden sm:block">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
              })}
            </p>
          </div>
        </div>

      </div>
    </header>
  );
};

export default Header;