import { 
  Users, CheckCircle, Bike, LogOut, Clock, Store, Building2, Shield 
} from 'lucide-react';

const Sidebar = ({ activeTab, onTabChange, isOpen, onClose, stats, onLogout }) => {
  const TabButton = ({ id, icon: Icon, label, count, colorClass, activeClass }) => (
    <button
      onClick={() => {
        onTabChange(id);
        onClose();
      }}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
        activeTab === id ? activeClass : 'text-gray-600 hover:bg-gray-50'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium">{label}</span>
      {count > 0 && (
        <span className={`ml-auto text-white text-xs font-bold px-2 py-1 rounded-full ${
          activeTab === id ? 'bg-white/20' : 'bg-orange-500'
        }`}>
          {count}
        </span>
      )}
    </button>
  );

  return (
    <aside className={`
      fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 
      transform transition-transform duration-300 ease-in-out
      ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
    `}>
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-gray-900">QuickDish</h1>
            <p className="text-xs text-gray-500">Admin Panel</p>
          </div>
        </div>
      </div>

      <nav className="p-4 space-y-1 h-[calc(100vh-180px)] overflow-y-auto">
        {/* Riders Section */}
        <div className="mb-4">
          <p className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Delivery Partners
          </p>
          
          <TabButton
            id="riders-pending"
            icon={Clock}
            label="Pending Riders"
            count={stats.pendingRiders}
            activeClass="bg-orange-50 text-orange-600 border border-orange-200"
          />

          <TabButton
            id="riders-approved"
            icon={CheckCircle}
            label="Approved Riders"
            activeClass="bg-green-50 text-green-600 border border-green-200"
          />

          <TabButton
            id="riders-all"
            icon={Bike}
            label="All Riders"
            activeClass="bg-blue-50 text-blue-600 border border-blue-200"
          />
        </div>

        {/* Restaurant Owners Section */}
        <div className="mb-4">
          <p className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Restaurant Partners
          </p>
          
          <TabButton
            id="owners-pending"
            icon={Store}
            label="Pending Owners"
            count={stats.pendingOwners}
            activeClass="bg-purple-50 text-purple-600 border border-purple-200"
          />

          <TabButton
            id="owners-approved"
            icon={Building2}
            label="Approved Owners"
            activeClass="bg-green-50 text-green-600 border border-green-200"
          />

          <TabButton
            id="owners-all"
            icon={Users}
            label="All Owners"
            activeClass="bg-blue-50 text-blue-600 border border-blue-200"
          />
        </div>
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100 bg-white">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;