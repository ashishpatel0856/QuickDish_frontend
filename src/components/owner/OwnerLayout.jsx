import { Link, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, UtensilsCrossed, ShoppingBag, LogOut, ChevronLeft } from 'lucide-react';

const OwnerLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const menuItems = [
    { path: '/owner', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/owner/menu', icon: UtensilsCrossed, label: 'Menu' },
    { path: '/owner/orders', icon: ShoppingBag, label: 'Orders' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg fixed h-full">
        <div className="p-6 border-b">
          <Link to="/" className="flex items-center text-primary-600 font-bold text-xl">
            <ChevronLeft className="w-5 h-5 mr-2" />
            QuickDish Owner
          </Link>
        </div>
        
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-3 rounded-xl ${
                  isActive ? 'bg-primary-50 text-primary-600 font-medium' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t">
          <p className="text-sm font-medium px-4">{user?.name}</p>
          <p className="text-xs text-gray-500 px-4">{user?.email}</p>
          <button 
            onClick={logout} 
            className="flex items-center w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl mt-2"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default OwnerLayout;