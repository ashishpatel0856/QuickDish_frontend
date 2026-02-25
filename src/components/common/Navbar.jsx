import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Search, MapPin, ChevronDown, ShoppingCart, HelpCircle, User } from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);

 
  const userRoles = user?.roles || [];
  const isOwner = userRoles.includes('ROLE_RESTAURANT_OWNER');

  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    navigate('/login');
  };

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white shadow-md' : 'bg-white'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-orange-500 tracking-tight">
                QuickDish
              </span>
            </Link>

            {isAuthenticated && (
              <div className="relative hidden md:block">
                <button 
                  onClick={() => setShowLocationDropdown(!showLocationDropdown)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-orange-500 focus:outline-none"
                >
                  <MapPin className="w-5 h-5 text-orange-500" />
                  <div className="flex flex-col items-start">
                    <span className="text-xs font-medium text-gray-500">Deliver to</span>
                    <span className="text-sm font-bold text-gray-800 flex items-center">
                      Current Location
                      <ChevronDown className="w-4 h-4 ml-1" />
                    </span>
                  </div>
                </button>

                {showLocationDropdown && (
                  <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-lg shadow-xl border py-4 z-50">
                    <div className="px-4 pb-3 border-b">
                      <h3 className="font-semibold text-gray-800">Select Location</h3>
                    </div>
                    <div className="p-2">
                      <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 flex items-center space-x-3">
                        <MapPin className="w-5 h-5 text-orange-500" />
                        <div>
                          <p className="font-medium text-gray-800">Detect Current Location</p>
                          <p className="text-xs text-gray-500">Using GPS</p>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {isAuthenticated && (
            <div className="flex-1 max-w-2xl mx-8 hidden md:block">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="text"
                  placeholder="Search for restaurants, cuisines, or dishes..."
                  className="w-full pl-12 pr-4 py-3 bg-gray-100 border-transparent focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-200 rounded-lg transition-all outline-none"
                  onClick={() => navigate('/search')}
                  readOnly
                />
              </div>
            </div>
          )}

          <div className="flex items-center space-x-6">
                        <Link to="/help" className="hidden lg:flex items-center space-x-2 text-gray-700 hover:text-orange-500 font-medium">
              <HelpCircle className="w-5 h-5" />
              <span>Help</span>
            </Link>
            {isAuthenticated && (
              <Link to="/cart" className="flex items-center space-x-2 text-gray-700 hover:text-orange-500 font-medium">
                <div className="relative">
                  <ShoppingCart className="w-6 h-6" />
                  <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    0
                  </span>
                </div>
                <span className="hidden lg:block">Cart</span>
              </Link>
            )}


            {isAuthenticated ? (
              <div className="relative">
                <button 
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-orange-500 focus:outline-none"
                >
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="hidden lg:flex flex-col items-start">
                    <span className="text-xs text-gray-500">Hey,</span>
                    <span className="text-sm font-bold text-gray-800 flex items-center">
                      {user?.name?.split(' ')[0] || 'User'}
                      <ChevronDown className="w-4 h-4 ml-1" />
                    </span>
                  </div>
                </button>


                {showDropdown && (
                  <div className="absolute right-0 mt-3 w-64 bg-white rounded-lg shadow-xl border py-2 z-50">
                    
                    <div className="px-4 py-3 border-b">
                      <p className="font-bold text-gray-800">{user?.name}</p>
                      <p className="text-sm text-gray-500">{user?.email}</p>
                    </div>
                    <Link 
                      to="/profile"
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50"
                    >
                      <User className="w-5 h-5" />
                      <span>Profile</span>
                    </Link>

                    <Link 
                      to="/orders"
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      <span>Orders</span>
                    </Link>

                    {isOwner && (
                      <Link 
                        to="/owner/dashboard"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center space-x-3 px-4 py-3 text-orange-600 hover:bg-orange-50 font-medium"
                      >
                        <span className="w-5 h-5 flex items-center justify-center">🏪</span>
                        <span>Owner Dashboard</span>
                      </Link>
                    )}

                    <hr className="my-2" />

                    <button 
                      onClick={handleLogout}
                      className="flex items-center space-x-3 w-full text-left px-4 py-3 text-red-600 hover:bg-red-50"
                    >
                      <span className="w-5 h-5 flex items-center justify-center">🚪</span>
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              
              <Link 
                to="/login" 
                className="flex items-center space-x-2 text-gray-700 hover:text-orange-500 font-medium"
              >
                <User className="w-6 h-6" />
                <span className="hidden lg:block">Sign In</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;