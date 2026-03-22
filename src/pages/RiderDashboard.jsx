import { useState } from 'react';
import { useRiderDashboard } from '../hooks/useRiderDashboard';
import Sidebar from '../components/rider/Sidebar';
import StatsCard from '../components/rider/StatsCard';
import CurrentOrder from '../components/rider/CurrentOrder';
import AvailableOrders from '../components/rider/AvailableOrders';
import EarningsTab from '../components/rider/EarningsTab';
import ProfileTab from '../components/rider/ProfileTab';
import LoadingScreen from '../components/common/LoadingScreen';
import Header from '../components/admin/Header';
import OtpModal from '../components/rider/OtpModal'; 
const STATUS = {
  OFFLINE: 'OFFLINE',
  AVAILABLE: 'AVAILABLE',
  BUSY: 'BUSY'
};


const RiderDashboard = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const {
    profile,
    earnings,
    currentOrder,
    availableOrders,
    riderStatus,
    loading,
    updateStatus,
    updateLocation,
    acceptOrder,
    handlePickup,
    handleDeliver,
    logout
  } = useRiderDashboard();

  const [showOtp, setShowOtp] = useState(false);
  const [otpType, setOtpType] = useState(null);
  const [otpValue, setOtpValue] = useState('');

  if (loading) return <LoadingScreen text="Loading dashboard..." />;

  const onOtpSubmit = async () => {
    if (otpType === 'pickup') {
      await handlePickup(otpValue);
    } else {
      await handleDeliver(otpValue);
    }
    setShowOtp(false);
    setOtpValue('');
  };

  const openOtp = (type) => {
    setOtpType(type);
    setShowOtp(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}



      <Sidebar
        isOpen={sidebarOpen}
        activeTab={activeTab}
        onTabChange={setActiveTab}
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
              title="Earnings"
              value={`₹${earnings.today || 0}`}
              subtext="Today"
              icon="Wallet"
              color="green"
            />
            <StatsCard
              title="Deliveries"
              value={profile?.totalDeliveries || 0}
              subtext="Active"
              icon="Package"
              color="blue"
            />
            <StatsCard
              title="Rating"
              value={`${profile?.rating || '4.8'} `}
              subtext="Your Rating"
              icon="Star"
              color="orange"
            />
          </div>

          {/* Current Order */}
          {currentOrder && (
            <CurrentOrder
              order={currentOrder}
              onPickup={() => openOtp('pickup')}
              onDeliver={() => openOtp('deliver')}
            />
          )}

          {activeTab === 'orders' && !currentOrder && (
            <AvailableOrders
              orders={availableOrders}
              onAccept={acceptOrder}
              riderStatus={riderStatus}
            />
          )}

          {activeTab === 'earnings' && (
            <EarningsTab earnings={earnings} />
          )}

          {activeTab === 'profile' && (
            <ProfileTab
              profile={profile}
              status={riderStatus}
              onStatusChange={updateStatus}
              onLocationUpdate={updateLocation}  // ✅ Works perfectly!
            />
          )}
        </div>
      </main>

      <OtpModal
        isOpen={showOtp}
        type={otpType}
        value={otpValue}
        onChange={setOtpValue}
        onSubmit={onOtpSubmit}
        onClose={() => setShowOtp(false)}
      />
    </div>
  );
};

export default RiderDashboard;