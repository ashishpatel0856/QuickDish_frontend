import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { Search, ShoppingCart, User, Menu, X, MapPin, ChevronDown, LogOut, Heart, Package } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?name=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/restaurants', label: 'Restaurants', icon: '🍽️' },
    { path: '/orders', label: 'Orders', icon: '📦' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30">
              <span className="text-white text-xl font-bold">Q</span>
            </div>
            <span className="text-2xl font-bold gradient-text hidden sm:block">QuickDish</span>
          </Link>

          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search for food, restaurants..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-2.5 bg-gray-100 border-0 rounded-full focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </form>

          <div className="flex items-center space-x-4">
            <button className="hidden lg:flex items-center space-x-1 text-gray-600 hover:text-primary-600 transition-colors">
              <MapPin className="w-5 h-5" />
              <span className="text-sm font-medium">Delhi, India</span>
              <ChevronDown className="w-4 h-4" />
            </button>

            <Link to="/cart" className="relative p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-all">
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-bounce">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="relative">
                <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 transition-colors">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-500 hidden sm:block" />
                </button>

                {isProfileOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsProfileOpen(false)} />
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-20 animate-fade-in-up">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                      </div>
                      <Link to="/profile" onClick={() => setIsProfileOpen(false)} className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                        <User className="w-4 h-4 mr-3 text-gray-400" /> Profile
                      </Link>
                      <Link to="/orders" onClick={() => setIsProfileOpen(false)} className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                        <Package className="w-4 h-4 mr-3 text-gray-400" /> My Orders
                      </Link>
                      <Link to="/favorites" onClick={() => setIsProfileOpen(false)} className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                        <Heart className="w-4 h-4 mr-3 text-gray-400" /> Favorites
                      </Link>
                      <hr className="my-2 border-gray-100" />
                      <button onClick={() => { logout(); setIsProfileOpen(false); }} className="flex items-center w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50">
                        <LogOut className="w-4 h-4 mr-3" /> Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link to="/login" className="hidden sm:flex items-center space-x-2 px-4 py-2 bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-colors font-medium">
                <User className="w-4 h-4" /><span>Login</span>
              </Link>
            )}

            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded-full">
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        <form onSubmit={handleSearch} className="md:hidden pb-3">
          <div className="relative">
            <input type="text" placeholder="Search food & restaurants..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-gray-100 border-0 rounded-full focus:ring-2 focus:ring-primary-500 text-sm" />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
        </form>
      </div>

      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 animate-slide-in">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path} onClick={() => setIsMenuOpen(false)} className={`flex items-center space-x-3 px-4 py-3 rounded-xl ${isActive(link.path) ? 'bg-primary-50 text-primary-600 font-medium' : 'text-gray-700 hover:bg-gray-50'}`}>
                <span className="text-xl">{link.icon}</span><span>{link.label}</span>
              </Link>
            ))}
            <hr className="my-2 border-gray-100" />
            <button onClick={() => { logout(); setIsMenuOpen(false); }} className="flex items-center space-x-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl">
              <LogOut className="w-5 h-5" /><span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;