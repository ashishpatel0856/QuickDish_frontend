import { useState, useEffect, useCallback, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import {Search,MapPin,ChevronDown,ShoppingCart, HelpCircle,User,LogOut,LayoutDashboard,Menu,X,Home,UtensilsCrossed,Heart,ClipboardList,} from "lucide-react";

// Custom hook for detecting clicks outside
const useClickOutside = (ref, callback) => {
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [ref, callback]);
};

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const { cartCount } = useCart();

  // State
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location, setLocation] = useState("Current Location");

  const dropdownRef = useRef(null);
  const locationRef = useRef(null);

  // Close dropdowns on click outside
  useClickOutside(dropdownRef, () => setShowDropdown(false));
  useClickOutside(locationRef, () => setShowLocationDropdown(false));

  const userRoles = user?.roles || [];
  const isOwner = userRoles.includes("ROLE_RESTAURANT_OWNER");

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Load saved location
  useEffect(() => {
    const savedLocation = localStorage.getItem("userLocation");
    if (savedLocation) setLocation(savedLocation);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);



  const handleLogout = useCallback(() => {
    logout();
    setShowDropdown(false);
    setMobileMenuOpen(false);
    navigate("/login");
  }, [logout, navigate]);



  const detectLocation = useCallback(() => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await res.json();
          const address =
            data.address?.city ||
            data.address?.town ||
            data.address?.village ||
            data.address?.state ||
            "Your Location";
          
          setLocation(address);
          localStorage.setItem("userLocation", address);
          setShowLocationDropdown(false);
        } catch (error) {
          console.error("Location fetch error:", error);
        }
      },
      (error) => {
        alert("Unable to retrieve location");
        console.error(error);
      }
    );
  }, []);



  const navLinks = [
    { to: "/", icon: Home, label: "Home" },
    { to: "/restaurants", icon: UtensilsCrossed, label: "Restaurants" },
    { to: "/offers", icon: Heart, label: "Offers" },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled 
            ? "bg-white/95 backdrop-blur-md shadow-lg" 
            : "bg-white shadow-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">
            
            {/*  Logo + Location */}
            <div className="flex items-center gap-4 lg:gap-8">
              {/* Logo */}
              
              <Link 
                to="/" 
                className="flex items-center gap-2 group "
                onClick={() => setMobileMenuOpen(false)} >
                <img 
                  src="/QD.png" 
                  alt="QuickDish" 
                  className="h-8 w-auto object-contain group-hover:scale-105 transition-transform"/>
                <span className="text-xl lg:text-2xl font-bold text-orange-500 tracking-tight hidden sm:block group-hover:text-orange-600 transition-colors">
                  QuickDish
                </span>
              </Link>

              {/* Location Desktop Only */}
              {isAuthenticated && (
                <div className="relative hidden lg:block" ref={locationRef}>
                  <button
                    onClick={() => setShowLocationDropdown(!showLocationDropdown)}
                    className="flex items-center gap-2 text-gray-700 hover:text-orange-500 transition-colors">

                    <MapPin className="w-5 h-5 text-orange-500" />
                    <div className="flex flex-col items-start">
                      <span className="text-xs font-medium text-gray-500">Deliver to</span>
                      <span className="text-sm font-bold text-gray-800 flex items-center gap-1">
                        {location.length > 15 ? location.slice(0, 15) + "..." : location}
                        <ChevronDown className={`w-4 h-4 transition-transform ${showLocationDropdown ? "rotate-180" : ""}`} />
                      </span>
                    </div>
                  </button>

                  {/* Location Dropdown */}
                  {showLocationDropdown && (
                    <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 py-3 z-50 animate-in fade-in slide-in-from-top-2">
                      <div className="px-4 pb-3 border-b border-gray-100">
                        <h3 className="font-semibold text-gray-800">Select Location</h3>
                      </div>
                      <div className="p-2">
                        <button
                          onClick={detectLocation}
                          className="w-full text-left px-4 py-3 rounded-lg hover:bg-orange-50 flex items-center gap-3 transition-colors"
                        >
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

            {/* Search Desktop */}
            {isAuthenticated && (
              <div className="hidden md:flex flex-1 max-w-xl mx-4 lg:mx-8">
                <div 
                  className="relative w-full group cursor-pointer"
                  onClick={() => navigate("/search")}
                >
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-orange-500 transition-colors" />
                  <input
                    type="text"
                    placeholder="Search for restaurants, cuisines..."
                    className="w-full pl-12 pr-4 py-2.5 bg-gray-100 rounded-full outline-none focus:ring-2 focus:ring-orange-500/20 focus:bg-white transition-all cursor-pointer hover:bg-gray-200"
                    readOnly
                  />
                </div>
              </div>
            )}

            {/*  Actions */}
            <div className="flex items-center gap-2 lg:gap-6">
              {/* Help  Desktop */}
              <Link
                to="/help"
                className="hidden lg:flex items-center gap-2 text-gray-700 hover:text-orange-500 font-medium transition-colors"
              >
                <HelpCircle className="w-5 h-5" />
                <span>Help</span>
              </Link>

              {/* Cart */}
              {isAuthenticated && (
                <Link
                  to="/cart"
                  className="flex items-center gap-1 lg:gap-2 text-gray-700 hover:text-orange-500 font-medium transition-colors relative">
                  <div className="relative">
                    <ShoppingCart className="w-6 h-6" />
                    {cartCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-bounce">
                        {cartCount > 9 ? "9+" : cartCount}
                      </span>
                    )}
                  </div>
                  <span className="hidden lg:block">Cart</span>
                </Link>
              )}

              {/* User Login */}
              {isAuthenticated ? (
                <div className="relative hidden lg:block" ref={dropdownRef}>
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center gap-2 text-gray-700 hover:text-orange-500 transition-colors"
                  >
                    <div className="w-9 h-9 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {user?.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="text-xs text-gray-500">Hey,</span>
                      <span className="text-sm font-bold text-gray-800 flex items-center gap-1">
                        {user?.name?.split(" ")[0] || "User"}
                        <ChevronDown className={`w-4 h-4 transition-transform ${showDropdown ? "rotate-180" : ""}`} />
                      </span>
                    </div>
                  </button>

                  {/* User Dropdown */}
                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="font-bold text-gray-800">{user?.name}</p>
                        <p className="text-sm text-gray-500 truncate">{user?.email}</p>
                      </div>
                      
                      <Link
                        to="/profile"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                      >
                        <User className="w-5 h-5 text-gray-600" />
                        <span>Profile</span>
                      </Link>
                      
                      <Link
                        to="/orders"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                      >
                        <ClipboardList className="w-5 h-5 text-gray-600" />
                        <span>Orders</span>
                      </Link>

                      {isOwner && (
                        <Link
                          to="/owner/dashboard"
                          onClick={() => setShowDropdown(false)}
                          className="flex items-center gap-3 px-4 py-3 text-orange-600 hover:bg-orange-50 transition-colors"
                        >
                          <LayoutDashboard className="w-5 h-5" />
                          <span>Owner Dashboard</span>
                        </Link>
                      )}

                      <hr className="my-2 border-gray-100" />
                      
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-5 h-5" />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="hidden lg:flex items-center gap-2 px-5 py-2.5 bg-orange-500 text-white rounded-full font-medium hover:bg-orange-600 transition-all hover:shadow-lg hover:shadow-orange-500/30"
                >
                  <User className="w-5 h-5" />
                  <span>Sign In</span>
                </Link>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6 text-gray-700" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-700" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Mobile Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <Link 
              to="/" 
              className="flex items-center gap-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              <img src="/QD.png" alt="QuickDish" className="h-8 w-auto" />
              <span className="text-xl font-bold text-orange-500">QuickDish</span>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-6 h-6 text-gray-700" />
            </button>
          </div>

          {/* Mobile Search */}
          {isAuthenticated && (
            <div className="p-4 border-b border-gray-100">
              <div 
                className="relative"
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate("/search");
                }}
              >
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search restaurants..."
                  className="w-full pl-12 pr-4 py-3 bg-gray-100 rounded-xl outline-none"
                  readOnly
                />
              </div>
            </div>
          )}

          {/* Mobile Navigation */}
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1 px-4">
              {navLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-4 px-4 py-3 rounded-xl text-gray-700 hover:bg-orange-50 hover:text-orange-500 transition-colors"
                  >
                    <link.icon className="w-5 h-5" />
                    <span className="font-medium">{link.label}</span>
                  </Link>
                </li>
              ))}
              
              <li>
                <Link
                  to="/help"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-4 px-4 py-3 rounded-xl text-gray-700 hover:bg-orange-50 hover:text-orange-500 transition-colors"
                >
                  <HelpCircle className="w-5 h-5" />
                  <span className="font-medium">Help</span>
                </Link>
              </li>
            </ul>

            {/* Mobile Location */}
            {isAuthenticated && (
              <div className="mt-6 px-4 border-t border-gray-100 pt-6">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">Delivery Location</p>
                <button
                  onClick={detectLocation}
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-orange-50 text-orange-600 font-medium"
                >
                  <MapPin className="w-5 h-5" />
                  <span className="truncate">{location}</span>
                </button>
              </div>
            )}
          </nav>

          {/* Mobile Footer */}
          <div className="border-t border-gray-100 p-4">
            {isAuthenticated ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-800 truncate">{user?.name}</p>
                    <p className="text-sm text-gray-500 truncate">{user?.email}</p>
                  </div>
                </div>
                
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <User className="w-5 h-5 text-gray-600" />
                  <span>Profile</span>
                </Link>
                
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-3 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 transition-colors"
              >
                <User className="w-5 h-5" />
                <span>Sign In</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="h-16 lg:h-20" />
    </>
  );
};

export default Navbar;