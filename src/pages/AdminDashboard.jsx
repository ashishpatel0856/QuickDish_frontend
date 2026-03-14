import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../services/api';  // 🆕 Import from api.js
import { 
  Users, CheckCircle, XCircle, Bike, DollarSign, TrendingUp, 
  LogOut, Menu, X, ChevronRight, Shield, Clock, MapPin,
  Search, Filter, MoreVertical, Phone, Mail, Calendar
} from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('pending');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [riders, setRiders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRiders: 0,
    pendingApprovals: 0,
    approvedRiders: 0,
    totalEarnings: 0
  });
  const [selectedRider, setSelectedRider] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, [activeTab]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      console.log('🚀 Fetching admin data...');

      // 🆕 Use adminAPI from api.js
      const [pendingRes, approvedRes] = await Promise.all([
        adminAPI.getPendingRiders(),
        adminAPI.getApprovedRiders()
      ]);

      const pendingRiders = pendingRes.data || [];
      const approvedRiders = approvedRes.data || [];

      setRiders(activeTab === 'pending' ? pendingRiders : approvedRiders);
      
      setStats({
        totalRiders: pendingRiders.length + approvedRiders.length,
        pendingApprovals: pendingRiders.length,
        approvedRiders: approvedRiders.length,
        totalEarnings: 125000
      });
      
      console.log('✅ Admin data loaded');
    } catch (error) {
      console.error('❌ Error fetching data:', error);
      if (error.response?.status === 401) {
        console.log('🔒 Unauthorized, redirecting to login');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId) => {
    try {
      await adminAPI.approveRider(userId);
      fetchDashboardData();
    } catch (error) {
      console.error('Error approving rider:', error);
    }
  };

  const handleReject = async (riderId) => {
    if (!window.confirm('Are you sure you want to reject this rider?')) return;
    try {
      await adminAPI.rejectRider(riderId);
      fetchDashboardData();
    } catch (error) {
      console.error('Error rejecting rider:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const StatCard = ({ title, value, icon: Icon, color, trend }) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">{value}</h3>
          {trend && (
            <p className="text-green-600 text-sm mt-2 flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              {trend}
            </p>
          )}
        </div>
        <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
        </div>
      </div>
    </div>
  );

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
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-gray-900">QuickDish</h1>
              <p className="text-xs text-gray-500">Admin Panel</p>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          <button
            onClick={() => setActiveTab('pending')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === 'pending' 
                ? 'bg-orange-50 text-orange-600 border border-orange-200' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Clock className="w-5 h-5" />
            <span className="font-medium">Pending Approvals</span>
            {stats.pendingApprovals > 0 && (
              <span className="ml-auto bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                {stats.pendingApprovals}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('approved')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === 'approved' 
                ? 'bg-green-50 text-green-600 border border-green-200' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">Approved Riders</span>
          </button>

          <button
            onClick={() => setActiveTab('all')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === 'all' 
                ? 'bg-blue-50 text-blue-600 border border-blue-200' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Users className="w-5 h-5" />
            <span className="font-medium">All Riders</span>
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
                  {activeTab === 'pending' ? 'Pending Approvals' : 
                   activeTab === 'approved' ? 'Approved Riders' : 'All Riders'}
                </h2>
                <p className="text-sm text-gray-500 hidden sm:block">
                  Manage delivery partners
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-700">System Online</span>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold">
                A
              </div>
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-6 lg:p-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
            <StatCard 
              title="Total Riders" 
              value={stats.totalRiders} 
              icon={Users} 
              color="bg-blue-500"
              trend="+12%"
            />
            <StatCard 
              title="Pending Approvals" 
              value={stats.pendingApprovals} 
              icon={Clock} 
              color="bg-orange-500"
            />
            <StatCard 
              title="Approved Riders" 
              value={stats.approvedRiders} 
              icon={CheckCircle} 
              color="bg-green-500"
              trend="+8%"
            />
            <StatCard 
              title="Platform Earnings" 
              value={`₹${stats.totalEarnings.toLocaleString()}`} 
              icon={DollarSign} 
              color="bg-purple-500"
              trend="+23%"
            />
          </div>

          {/* Riders Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h3 className="text-lg font-bold text-gray-900">
                {activeTab === 'pending' ? 'Pending Riders' : 'Rider List'}
              </h3>
              
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type="text"
                    placeholder="Search riders..."
                    className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-lg border border-gray-200">
                  <Filter className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>

            {loading ? (
              <div className="p-12 text-center">
                <div className="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-500">Loading riders...</p>
              </div>
            ) : riders.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No riders found</h3>
                <p className="text-gray-500">
                  {activeTab === 'pending' 
                    ? 'No pending approvals at the moment' 
                    : 'No approved riders yet'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Rider</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Contact</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Vehicle</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {riders.map((rider) => (
                      <tr key={rider.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-400 rounded-full flex items-center justify-center text-white font-bold">
                              {rider.user?.name?.charAt(0) || 'R'}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{rider.user?.name || 'Unknown'}</p>
                              <p className="text-sm text-gray-500">{rider.user?.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 hidden sm:table-cell">
                          <div className="space-y-1">
                            <p className="text-sm text-gray-600 flex items-center gap-2">
                              <Phone className="w-4 h-4" />
                              {rider.user?.phone || 'N/A'}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4 hidden md:table-cell">
                          <div className="space-y-1">
                            <p className="text-sm text-gray-900 capitalize">{rider.vehicleType?.toLowerCase()}</p>
                            <p className="text-xs text-gray-500 font-mono">{rider.vehicleNumber}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                            rider.isVerifiedRider 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${
                              rider.isVerifiedRider ? 'bg-green-500' : 'bg-yellow-500'
                            }`}></div>
                            {rider.isVerifiedRider ? 'Approved' : 'Pending'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {!rider.isVerifiedRider ? (
                              <>
                                <button
                                  onClick={() => handleApprove(rider.user?.id)}
                                  className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                                  title="Approve"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleReject(rider.id)}
                                  className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                                  title="Reject"
                                >
                                  <XCircle className="w-4 h-4" />
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={() => {
                                  setSelectedRider(rider);
                                  setShowModal(true);
                                }}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                              >
                                <MoreVertical className="w-4 h-4 text-gray-600" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Rider Detail Modal */}
      {showModal && selectedRider && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Rider Details</h3>
              <button 
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-400 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {selectedRider.user?.name?.charAt(0) || 'R'}
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900">{selectedRider.user?.name}</h4>
                  <p className="text-gray-500">{selectedRider.user?.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-500 mb-1">Phone</p>
                  <p className="font-semibold text-gray-900">{selectedRider.user?.phone}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-500 mb-1">Status</p>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                    selectedRider.isVerifiedRider 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {selectedRider.isVerifiedRider ? 'Approved' : 'Pending'}
                  </span>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-500 mb-1">Vehicle Type</p>
                  <p className="font-semibold text-gray-900 capitalize">{selectedRider.vehicleType?.toLowerCase()}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-500 mb-1">Vehicle Number</p>
                  <p className="font-semibold text-gray-900 font-mono">{selectedRider.vehicleNumber}</p>
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-xl">
                <p className="text-sm text-gray-500 mb-1">License Number</p>
                <p className="font-semibold text-gray-900 font-mono">{selectedRider.licenseNumber}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;