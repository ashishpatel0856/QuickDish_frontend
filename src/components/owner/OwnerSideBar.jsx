import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const OwnerSidebar = () => {
  const location = useLocation();
  const { logout } = useAuth();

  const menuItems = [
    { path: '/owner', label: 'Dashboard', icon: '' },
    { path: '/owner/menu', label: 'My Menu', icon: '' },
    { path: '/owner/orders', label: 'Orders', icon: '' },
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg">
      <div className="p-6 border-b">
        <h2 className="text-xl font-bold text-orange-500">QuickDish Owner</h2>
      </div>
      
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center space-x-3 p-3 rounded-lg ${
              location.pathname === item.path 
                ? 'bg-orange-50 text-orange-600' 
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <span>{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
        
        <button
          onClick={logout}
          className="flex items-center space-x-3 p-3 rounded-lg text-red-600 hover:bg-red-50 w-full mt-8"
        >
          <span>🚪</span>
          <span className="font-medium">Logout</span>
        </button>
      </nav>
    </div>
  );
};

export default OwnerSidebar;