import { useState } from 'react';
import { useRiderDashboard } from '../hooks/useRiderDashboard';
import Sidebar from '../components/rider/Sidebar';
import Header from '../components/rider/Header';
import StatsCard from '../components/rider/StatsCard';
import CurrentOrder from '../components/rider/CurrentOrder';
import AvailableOrders from '../components/rider/AvailableOrders';
import EarningsTab from '../components/rider/EarningsTab';
import ProfileTab from '../components/rider/ProfileTab';
import OtpModal from '../components/rider/OtpModal';
import LoadingScreen from '../components/common/LoadingScreen';

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

  // OTP Modal state
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

          <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">Current Status</h3>
                <p className="text-sm text-gray-500">
                  {riderStatus === STATUS.OFFLINE && "You are offline"}
                  {riderStatus === STATUS.AVAILABLE && "Ready to accept orders"}
                  {riderStatus === STATUS.BUSY && "You have an active order"}
                </p>
              </div>
              
              {/* Status Toggle Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => updateStatus(STATUS.OFFLINE)}
                  disabled={riderStatus === STATUS.BUSY || loading}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    riderStatus === STATUS.OFFLINE
                      ? 'bg-gray-800 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  } ${riderStatus === STATUS.BUSY ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  Offline
                </button>
                
                <button
                  onClick={() => updateStatus(STATUS.AVAILABLE)}
                  disabled={riderStatus === STATUS.BUSY || loading}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    riderStatus === STATUS.AVAILABLE
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  } ${riderStatus === STATUS.BUSY ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  Available
                </button>
                
                <button
                  disabled={true}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    riderStatus === STATUS.BUSY
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Busy
                </button>
              </div>
            </div>
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
              onLocationUpdate={updateLocation}
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