import { useState, useEffect } from 'react';
import { useRiderDashboard } from '../hooks/useRiderDashboard';
import Sidebar from '../components/rider/Sidebar';
import StatsCard from '../components/rider/StatsCard';
import LoadingScreen from '../components/common/LoadingScreen';
import Header from '../components/admin/Header';
import OtpModal from '../components/rider/OtpModal';
import EarningsTab from '../components/rider/EarningsTab';
import ProfileTab from '../components/rider/ProfileTab';
import AvailableOrders from '../components/rider/AvailableOrders';
import { IndianRupeeIcon } from 'lucide-react';
import { FaStore } from "react-icons/fa";
import { HiOutlineHome } from "react-icons/hi2";

const STATUS = {
  OFFLINE: 'OFFLINE',
  AVAILABLE: 'AVAILABLE',
  BUSY: 'BUSY'
};

const RiderDashboard = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpType, setOtpType] = useState(null);
  const [otpValue, setOtpValue] = useState('');

  const {
    profile,
    earnings,
    currentOrder,
    availableOrders,
    riderStatus,
    loading,
    actionLoading,
    updateStatus,
    updateLocation,
    acceptOrder,
    arriveAtRestaurant,
    arriveAtCustomer,
    handlePickup,
    handleDeliver,
    getCurrentAction,
    logout,
    fetchEarnings,
  } = useRiderDashboard();

  useEffect(() => {
    if (!loading && activeTab === 'earnings') {
      console.log(' Earnings tab active, fetching data...');
      fetchEarnings();
    }
  }, [activeTab, fetchEarnings, loading]);

  if (loading) return <LoadingScreen text="Loading dashboard..." />;

  const currentAction = getCurrentAction();


  const onOtpSubmit = async () => {
    if (otpType === 'pickup') {
      await handlePickup(otpValue);
    } else {
      await handleDeliver(otpValue);
    }
    setShowOtpModal(false);
    setOtpValue('');
  };

  const openOtpModal = (type) => {
    setOtpType(type);
    setShowOtpModal(true);
  };



  //  RENDER CONTENT BASED ON ACTIVE TAB
  const renderContent = () => {
    switch (activeTab) {
      case 'orders':
        return (
          <>
            {/* Current Order */}
            {currentOrder && (
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
                {/* Header */}
                <div className="bg-gradient-to-r from-orange-500 to-red-500 p-4 text-white">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm opacity-90">Order #{currentOrder.orderId}</p>
                      <h2 className="text-xl font-bold">
                        {currentOrder.status === 'ASSIGNED' && ' Go to Restaurant'}
                        {currentOrder.status === 'PICKED_UP' && ' Deliver to Customer'}
                        {currentOrder.status === 'ON_THE_WAY' && ' Arrived at Customer'}
                      </h2>
                    </div>
                    <div className="text-right ">
                      <p className="text-2xl font-bold flex">
                        <IndianRupeeIcon className='mt-2' />
                        {currentOrder.totalAmount}</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 sm:p-5">
                  {/* OTP Display - Compact Real-World Style */}
                  <div className="bg-gray-50 rounded-2xl p-3 sm:p-4 mb-5 border border-gray-100">
                    <div className="grid grid-cols-2 gap-3">
                      {/* Pickup OTP */}
                      <div className="text-center bg-orange-50 rounded-xl p-2.5 sm:p-3 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-orange-400"></div>
                        <p className="text-[10px] sm:text-xs text-orange-600 font-bold uppercase tracking-wider mb-1.5">
                          Pickup OTP
                        </p>
                        <p className="text-xl sm:text-2xl font-black text-orange-700 tracking-[0.25em] font-mono">
                          {currentOrder.pickupOtp}
                        </p>
                        <p className="text-[10px] text-orange-500 mt-1 font-medium">Show at restaurant</p>
                      </div>

                      {/* Delivery OTP */}
                      <div className="text-center bg-green-50 rounded-xl p-2.5 sm:p-3 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-green-400"></div>
                        <p className="text-[10px] sm:text-xs text-green-600 font-bold uppercase tracking-wider mb-1.5">
                          Delivery OTP
                        </p>
                        <p className="text-xl sm:text-2xl font-black text-green-700 tracking-[0.25em] font-mono">
                          {currentOrder.deliveryOtp}
                        </p>
                        <p className="text-[10px] text-green-500 mt-1 font-medium">Ask from customer</p>
                      </div>
                    </div>
                  </div>

                  {/* Restaurant Info - Compact */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center shrink-0">
                      <FaStore className="text-lg text-orange-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-sm sm:text-base text-gray-900 truncate">
                        {currentOrder.restaurantName}
                      </h3>
                      <p className="text-gray-500 text-xs truncate">{currentOrder.restaurantAddress}</p>
                    </div>
                  </div>

                  {/* Customer Info - Compact */}
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                      <HiOutlineHome className="text-lg text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-sm sm:text-base text-gray-900 truncate">
                        {currentOrder.customerName}
                      </h3>
                      <p className="text-gray-500 text-xs truncate">{currentOrder.deliveryAddress}</p>
                      <p className="text-gray-400 text-xs mt-0.5">{currentOrder.customerPhone}</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2.5">
                    {/* Main Action Button */}
                    {currentAction && (
                      <button
                        onClick={currentAction.action}
                        disabled={actionLoading}
                        className={`w-full py-3 sm:py-3.5 rounded-xl font-bold text-white text-sm sm:text-base shadow-md active:scale-[0.98] transition-transform ${actionLoading ? 'opacity-50 cursor-not-allowed' : ''
                          } ${currentAction.color === 'orange'
                            ? 'bg-gradient-to-r from-orange-500 to-red-500'
                            : 'bg-gradient-to-r from-blue-500 to-blue-600'
                          }`}
                      >
                        {actionLoading ? (
                          <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Processing...
                          </span>
                        ) : (
                          currentAction.label
                        )}
                      </button>
                    )}

                    {/* Pickup OTP Button */}
                    {currentOrder.status === 'ASSIGNED' && (
                      <button
                        onClick={() => openOtpModal('pickup')}
                        disabled={actionLoading}
                        className="w-full py-2.5 sm:py-3 rounded-xl font-semibold text-orange-600 text-sm border-2 border-orange-400 bg-orange-50 hover:bg-orange-100 active:scale-[0.98] transition-all"
                      >
                        Enter Pickup OTP
                      </button>
                    )}

                    {/* Delivery OTP Button */}
                    {currentOrder.status === 'ON_THE_WAY' && (
                      <button
                        onClick={() => openOtpModal('deliver')}
                        disabled={actionLoading}
                        className="w-full py-2.5 sm:py-3 rounded-xl font-semibold text-green-600 text-sm border-2 border-green-400 bg-green-50 hover:bg-green-100 active:scale-[0.98] transition-all"
                      >
                        Enter Delivery OTP
                      </button>
                    )}

                    {/* Call Button */}
                    <a
                      href={`tel:${currentOrder.customerPhone}`}
                      className="block w-full py-2.5 sm:py-3 rounded-xl font-semibold text-blue-600 text-sm border-2 border-blue-400 bg-blue-50 text-center hover:bg-blue-100 active:scale-[0.98] transition-all"
                    >
                      <span className="flex items-center justify-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        Call Customer
                      </span>
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Available Orders */}
            {!currentOrder && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold mb-4">Available Orders</h2>
                {availableOrders.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-2xl">
                    <p className="text-gray-500">No orders available</p>
                    <p className="text-sm text-gray-400">Check back later</p>
                  </div>
                ) : (
                  availableOrders.map(order => (
                    <div key={order.orderId} className="bg-white rounded-xl p-4 shadow">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-bold">{order.restaurantName}</h3>
                          <p className="text-sm text-gray-600">{order.restaurantAddress}</p>
                        </div>
                        <span className="text-lg font-bold text-orange-600 flex">
                          <IndianRupeeIcon size={18} className='mt-2' />
                          {order.totalAmount}</span>
                      </div>
                      <div className="flex justify-between items-center mt-4">
                        <div className="text-sm text-gray-500">
                          <span>{order.itemsCount} items</span>
                          <span className="mx-2">•</span>
                          <span>{order.distance} km</span>
                        </div>
                        <button
                          onClick={() => acceptOrder(order.orderId)}
                          disabled={actionLoading}
                          className="px-6 py-2 bg-orange-500 text-white rounded-lg font-bold hover:bg-orange-600 disabled:opacity-50"
                        >
                          Accept
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </>
        );

      case 'earnings':
        return <EarningsTab earnings={earnings} />;

      case 'profile':
        return (
          <ProfileTab
            profile={profile}
            status={riderStatus}
            onStatusChange={updateStatus}
            onLocationUpdate={updateLocation}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar
        isOpen={sidebarOpen}
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
        }}
        onClose={() => setSidebarOpen(false)}
        availableCount={availableOrders.length}
        onLogout={logout}
      />

      <main className="flex-1 overflow-auto">
        <Header
          activeTab={activeTab}
          riderStatus={riderStatus}
          onStatusChange={updateStatus}
          onMenuClick={() => setSidebarOpen(true)}
        />

        <div className="p-4 sm:p-6 lg:p-8">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
            <StatsCard
              title="Today's Earnings"
              value={`${earnings?.today || 0}`}
              subtext="Keep it up!"
              icon="Wallet"
              color="green"
            />
            <StatsCard
              title="Total Deliveries"
              value={profile?.totalDeliveries || 0}
              subtext="Lifetime"
              icon="Package"
              color="blue"
            />
            <StatsCard
              title="Rating"
              value={` ${profile?.rating || '4.8'}`}
              subtext="Excellent"
              icon="Star"
              color="orange"
            />
          </div>

          {/* Dynamic Content */}
          {renderContent()}
        </div>
      </main>

      {/* OTP Modal */}
      <OtpModal
        isOpen={showOtpModal}
        type={otpType}
        value={otpValue}
        onChange={setOtpValue}
        onSubmit={onOtpSubmit}
        onClose={() => {
          setShowOtpModal(false);
          setOtpValue('');
        }}
      />
    </div>
  );
};

export default RiderDashboard;