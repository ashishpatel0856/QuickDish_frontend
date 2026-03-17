import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { riderAPI } from '../services/api'; 
import { 
  MapPin, Navigation, Phone, Clock, DollarSign, Star, 
  LogOut, Menu, X, ChevronRight, Bike, Package, 
  CheckCircle, AlertCircle, User, TrendingUp, Calendar,
  ArrowRight, MapPinned, Timer, Wallet
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const RiderDashboard = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('orders');
  const [riderStatus, setRiderStatus] = useState('OFFLINE');
  const [availableOrders, setAvailableOrders] = useState([]);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [earnings, setEarnings] = useState({ today: 0, total: 0 });
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [otpInput, setOtpInput] = useState('');
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpAction, setOtpAction] = useState(null);
 const { logout } = useAuth();
  
  useEffect(() => {
    fetchRiderData();
    const interval = setInterval(fetchRiderData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchRiderData = async () => {
    try {
      setLoading(true);
      console.log('🚀 Fetching rider data...');

      const [profileRes, earningsRes, currentRes, availableRes] = await Promise.all([
        riderAPI.getProfile(),
        riderAPI.getTodayEarnings(),
        riderAPI.getCurrentOrder().catch(() => ({ data: null })),
        riderAPI.getAvailableOrders().catch(() => ({ data: [] }))
      ]);

      if (profileRes.data) {
        setProfile(profileRes.data);
        setRiderStatus(profileRes.data.status || 'OFFLINE');
      }
      if (earningsRes.data) setEarnings(earningsRes.data);
      if (currentRes.data) setCurrentOrder(currentRes.data);
      if (availableRes.data) setAvailableOrders(availableRes.data);
      
      console.log('✅ Rider data loaded');
    } catch (error) {
      console.error('❌ Error fetching rider data:', error);
      if (error.response?.status === 401) {
        console.log('🔒 Unauthorized, redirecting to login');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (status) => {
    try {
      await riderAPI.updateStatus(status);
      setRiderStatus(status);
      fetchRiderData();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const acceptOrder = async (orderId) => {
    try {
      await riderAPI.acceptOrder(orderId);
      fetchRiderData();
    } catch (error) {
      console.error('Error accepting order:', error);
    }
  };

  const handleOtpSubmit = async () => {
    try {
      if (otpAction === 'pickup') {
        await riderAPI.pickupOrder(currentOrder.id, otpInput);
      } else {
        await riderAPI.deliverOrder(currentOrder.id, otpInput);
      }
      setShowOtpModal(false);
      setOtpInput('');
      fetchRiderData();
    } catch (error) {
      alert('Invalid OTP');
    }
  };

  const handleLogout = () => {
    logout();
  };


  const StatusButton = ({ status, label, icon: Icon, color }) => (
    <button
      onClick={() => updateStatus(status)}
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
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

        <nav className="p-4 space-y-2">
          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === 'orders' 
                ? 'bg-orange-50 text-orange-600 border border-orange-200' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Package className="w-5 h-5" />
            <span className="font-medium">Orders</span>
            {availableOrders.length > 0 && (
              <span className="ml-auto bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                {availableOrders.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('earnings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === 'earnings' 
                ? 'bg-green-50 text-green-600 border border-green-200' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Wallet className="w-5 h-5" />
            <span className="font-medium">Earnings</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === 'profile' 
                ? 'bg-blue-50 text-blue-600 border border-blue-200' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <User className="w-5 h-5" />
            <span className="font-medium">Profile</span>
          </button>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="flex items-center justify-between p-4 sm:p-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                <Menu className="w-6 h-6 text-gray-600" />
              </button>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  {activeTab === 'orders' ? 'Orders' : 
                   activeTab === 'earnings' ? 'Earnings' : 'Profile'}
                </h2>
                <p className="text-sm text-gray-500 hidden sm:block">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </div>

            {/* Status Toggle */}
            <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-full">
              <StatusButton status="ONLINE" label="Online" icon={MapPin} color="bg-green-500" />
              <StatusButton status="OFFLINE" label="Offline" icon={AlertCircle} color="bg-gray-500" />
              <StatusButton status="BUSY" label="Busy" icon={Clock} color="bg-orange-500" />
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-6 lg:p-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-green-600" />
                </div>
                <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">Today</span>
              </div>
              <p className="text-gray-500 text-sm mb-1">Earnings</p>
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">₹{earnings.today || 0}</h3>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">Active</span>
              </div>
              <p className="text-gray-500 text-sm mb-1">Deliveries</p>
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">{profile?.totalDeliveries || 0}</h3>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <Star className="w-6 h-6 text-orange-600" />
                </div>
                <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded-full">Rating</span>
              </div>
              <p className="text-gray-500 text-sm mb-1">Your Rating</p>
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">{profile?.rating || '4.8'} ⭐</h3>
            </div>
          </div>

          {/* Current Order */}
          {currentOrder && (
            <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 text-white mb-8 shadow-lg shadow-orange-500/30">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Navigation className="w-5 h-5" />
                  Current Delivery
                </h3>
                <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                  {currentOrder.status}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <p className="text-white/70 text-sm mb-1">Pickup From</p>
                  <p className="font-semibold">{currentOrder.restaurantName}</p>
                  <p className="text-sm text-white/80">{currentOrder.restaurantAddress}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <p className="text-white/70 text-sm mb-1">Deliver To</p>
                  <p className="font-semibold">{currentOrder.customerName}</p>
                  <p className="text-sm text-white/80">{currentOrder.deliveryAddress}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                {currentOrder.status === 'ASSIGNED' && (
                  <button
                    onClick={() => {
                      setOtpAction('pickup');
                      setShowOtpModal(true);
                    }}
                    className="flex-1 sm:flex-none bg-white text-orange-600 px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Pickup Order
                  </button>
                )}
                {currentOrder.status === 'PICKED_UP' && (
                  <button
                    onClick={() => {
                      setOtpAction('deliver');
                      setShowOtpModal(true);
                    }}
                    className="flex-1 sm:flex-none bg-white text-orange-600 px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
                  >
                    <MapPin className="w-5 h-5" />
                    Deliver Order
                  </button>
                )}
                <a 
                  href={`tel:${currentOrder.customerPhone}`}
                  className="flex-1 sm:flex-none bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl font-bold hover:bg-white/30 transition-colors flex items-center justify-center gap-2"
                >
                  <Phone className="w-5 h-5" />
                  Call Customer
                </a>
              </div>
            </div>
          )}

          {/* Available Orders */}
          {activeTab === 'orders' && !currentOrder && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Available Orders</h3>
              {availableOrders.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Package className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No orders available</h3>
                  <p className="text-gray-500">Stay online to receive delivery requests</p>
                </div>
              ) : (
                availableOrders.map((order) => (
                  <div key={order.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-1 rounded-full">
                            ₹{order.deliveryFee}
                          </span>
                          <span className="text-gray-500 text-sm">{order.distance} km</span>
                          <span className="text-gray-500 text-sm flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {order.estimatedTime} min
                          </span>
                        </div>
                        <h4 className="font-bold text-gray-900 mb-1">{order.restaurantName}</h4>
                        <p className="text-sm text-gray-500 mb-3">{order.restaurantAddress}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span>Deliver to: {order.deliveryAddress}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => acceptOrder(order.id)}
                        className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl font-bold hover:from-orange-600 hover:to-red-600 transition-all shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2"
                      >
                        Accept
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Earnings Tab */}
          {activeTab === 'earnings' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Earnings Overview</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <Wallet className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Today's Earnings</p>
                        <p className="text-sm text-gray-500">{new Date().toLocaleDateString()}</p>
                      </div>
                    </div>
                    <span className="text-xl font-bold text-gray-900">₹{earnings.today || 0}</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">This Week</p>
                        <p className="text-sm text-gray-500">Last 7 days</p>
                      </div>
                    </div>
                    <span className="text-xl font-bold text-gray-900">₹{earnings.week || 0}</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Total Earnings</p>
                        <p className="text-sm text-gray-500">All time</p>
                      </div>
                    </div>
                    <span className="text-xl font-bold text-gray-900">₹{earnings.total || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && profile && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-red-400 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                  {profile.name?.charAt(0) || 'R'}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{profile.name}</h3>
                  <p className="text-gray-500">{profile.email}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full">
                      {riderStatus}
                    </span>
                    <span className="text-sm text-gray-500">{profile.vehicleType}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-500 mb-1">Phone</p>
                  <p className="font-semibold text-gray-900">{profile.phone}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-500 mb-1">Vehicle Number</p>
                  <p className="font-semibold text-gray-900 font-mono">{profile.vehicleNumber}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-500 mb-1">License Number</p>
                  <p className="font-semibold text-gray-900 font-mono">{profile.licenseNumber}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-500 mb-1">Member Since</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(profile.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* OTP Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {otpAction === 'pickup' ? 'Enter Pickup OTP' : 'Enter Delivery OTP'}
            </h3>
            <p className="text-gray-500 mb-6">
              Ask the {otpAction === 'pickup' ? 'restaurant' : 'customer'} for the OTP code
            </p>
            <input
              type="text"
              value={otpInput}
              onChange={(e) => setOtpInput(e.target.value)}
              placeholder="Enter 4-digit OTP"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-center text-2xl font-bold tracking-widest focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none mb-6"
              maxLength={4}
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowOtpModal(false)}
                className="flex-1 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleOtpSubmit}
                className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold hover:from-orange-600 hover:to-red-600 transition-all"
              >
                Verify
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RiderDashboard;