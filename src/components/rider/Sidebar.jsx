import { Bike, Package, Wallet, User, LogOut } from 'lucide-react';

const Sidebar = ({ isOpen, activeTab, onTabChange, onClose, availableCount, onLogout }) => {
  
  const MenuButton = ({ id, label, icon: Icon, color }) => (
    <button
      onClick={() => {
        onTabChange(id);
        onClose();
      }}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
        activeTab === id 
          ? `bg-${color}-50 text-${color}-600 border border-${color}-200` 
          : 'text-gray-600 hover:bg-gray-50'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium">{label}</span>
      {id === 'orders' && availableCount > 0 && (
        <span className="ml-auto bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
          {availableCount}
        </span>
      )}
    </button>
  );

  return (
    <aside className={`
      fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 
      transform transition-transform duration-300
      ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
    `}>
      {/* Logo */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
            <Bike className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-gray-900">QuickDish</h1>
            <p className="text-xs text-gray-500">Rider Partner</p>
          </div>
        </div>
      </div>

      {/* Menu */}
      <nav className="p-4 space-y-2">
        <MenuButton id="orders" label="Orders" icon={Package} color="orange" />
        <MenuButton id="earnings" label="Earnings" icon={Wallet} color="green" />
        <MenuButton id="profile" label="Profile" icon={User} color="blue" />
      </nav>

      {/* Logout */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100">
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