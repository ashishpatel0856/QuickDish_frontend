import { useState } from 'react';
import { useRiderDashboard } from '../hooks/useRiderDashboard';
import Sidebar from '../components/rider/Sidebar';
import StatsCard from '../components/rider/StatsCard';
import LoadingScreen from '../components/common/LoadingScreen';
import Header from '../components/admin/Header';
import OtpModal from '../components/rider/OtpModal';
import EarningsTab from '../components/rider/EarningsTab';
import ProfileTab from '../components/rider/ProfileTab';
import AvailableOrders from '../components/rider/AvailableOrders';

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
    logout
  } = useRiderDashboard();

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

  // ✅ DEBUG: Console me check karo
  console.log('Active Tab:', activeTab);
  console.log('Profile:', profile);
  console.log('Earnings:', earnings);

  // ✅ RENDER CONTENT BASED ON ACTIVE TAB
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
                        {currentOrder.status === 'ASSIGNED' && '📍 Go to Restaurant'}
                        {currentOrder.status === 'PICKED_UP' && '🛵 Deliver to Customer'}
                        {currentOrder.status === 'ON_THE_WAY' && '🏠 Arrived at Customer'}
                      </h2>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">₹{currentOrder.totalAmount}</p>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  {/* OTP Display */}
                  <div className="bg-gray-50 rounded-xl p-4 mb-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center bg-orange-50 rounded-lg p-3">
                        <p className="text-xs text-orange-600 font-bold mb-1">PICKUP OTP</p>
                        <p className="text-2xl font-bold text-orange-700 tracking-widest">
                          {currentOrder.pickupOtp}
                        </p>
                        <p className="text-xs text-orange-600 mt-1">Tell restaurant</p>
                      </div>
                      <div className="text-center bg-green-50 rounded-lg p-3">
                        <p className="text-xs text-green-600 font-bold mb-1">DELIVERY OTP</p>
                        <p className="text-2xl font-bold text-green-700 tracking-widest">
                          {currentOrder.deliveryOtp}
                        </p>
                        <p className="text-xs text-green-600 mt-1">Ask customer</p>
                      </div>
                    </div>
                  </div>

                  {/* Restaurant Info */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-2xl">
                      🏪
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{currentOrder.restaurantName}</h3>
                      <p className="text-gray-600 text-sm">{currentOrder.restaurantAddress}</p>
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-2xl">
                      🏠
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{currentOrder.customerName}</h3>
                      <p className="text-gray-600 text-sm">{currentOrder.deliveryAddress}</p>
                      <p className="text-gray-500 text-sm mt-1">📞 {currentOrder.customerPhone}</p>
                    </div>
                  </div>

                  {/* ACTION BUTTONS */}
                  <div className="space-y-3">
                    {/* Main Action Button */}
                    {currentAction && (
                      <button
                        onClick={currentAction.action}
                        disabled={actionLoading}
                        className={`w-full py-4 rounded-xl font-bold text-white text-lg shadow-lg ${
                          actionLoading ? 'opacity-50 cursor-not-allowed' : ''
                        } ${
                          currentAction.color === 'orange' 
                            ? 'bg-gradient-to-r from-orange-500 to-red-500' 
                            : 'bg-gradient-to-r from-blue-500 to-blue-600'
                        }`}
                      >
                        {actionLoading ? 'Processing...' : currentAction.label}
                      </button>
                    )}

                    {/* Pickup OTP Button */}
                    {currentOrder.status === 'ASSIGNED' && (
                      <button
                        onClick={() => openOtpModal('pickup')}
                        disabled={actionLoading}
                        className="w-full py-3 rounded-xl font-semibold text-orange-600 border-2 border-orange-500 bg-orange-50 hover:bg-orange-100"
                      >
                        🔢 Enter Pickup OTP from Restaurant
                      </button>
                    )}

                    {/* Delivery OTP Button */}
                    {currentOrder.status === 'ON_THE_WAY' && (
                      <button
                        onClick={() => openOtpModal('deliver')}
                        disabled={actionLoading}
                        className="w-full py-3 rounded-xl font-semibold text-green-600 border-2 border-green-500 bg-green-50 hover:bg-green-100"
                      >
                        ✅ Enter Delivery OTP from Customer
                      </button>
                    )}

                    {/* Call Button */}
                    <a
                      href={`tel:${currentOrder.customerPhone}`}
                      className="block w-full py-3 rounded-xl font-semibold text-blue-600 border-2 border-blue-500 bg-blue-50 text-center"
                    >
                      📞 Call Customer
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
                        <span className="text-lg font-bold text-orange-600">₹{order.totalAmount}</span>
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
        console.log('Rendering EarningsTab with:', earnings); // Debug
        return <EarningsTab earnings={earnings} />;

      case 'profile':
        console.log('Rendering ProfileTab with:', profile); // Debug
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
          console.log('Tab changed to:', tab); // Debug
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
              value={`₹${earnings?.today || 0}`}
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
              value={`⭐ ${profile?.rating || '4.8'}`}
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