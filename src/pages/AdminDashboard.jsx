import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAdminDashboard } from '../hooks/useAdminDashboard';
import Sidebar from '../components/admin/Sidebar';
import Header from '../components/admin/Header';
import StatCard from '../components/admin/StatCard';
import RidersTable from '../components/admin/RidersTable';
import RiderModal from '../components/admin/RiderModal';
import OwnerModal from '../components/admin/OwnerModal';
import DocumentsModal from '../components/admin/DocumentsModal';
import OwnersTable from '../components/admin/OwnersTable';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [activeTab, setActiveTab] = useState('riders-pending');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Modal states
  const [selectedRider, setSelectedRider] = useState(null);
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [showRiderModal, setShowRiderModal] = useState(false);
  const [showOwnerModal, setShowOwnerModal] = useState(false);
  const [showDocumentsModal, setShowDocumentsModal] = useState(false);

  const {
    riders,
    owners,
    loading,
    stats,
    adminProfile,
    actions
  } = useAdminDashboard(activeTab, user);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isRidersTab = activeTab.startsWith('riders-');
  const isOwnersTab = activeTab.startsWith('owners-');

  const tableActions = {
    onApproveRider: actions.handleApproveRider,
    onRejectRider: actions.handleRejectRider,
    onApproveOwner: actions.handleApproveOwner,
    onRejectOwner: actions.handleRejectOwner,
    onViewRider: (rider) => {
      setSelectedRider(rider);
      setShowRiderModal(true);
    },
    onViewOwner: (owner) => {
      setSelectedOwner(owner);
      setShowOwnerModal(true);
    },
    onViewDocuments: (owner) => {
      setSelectedOwner(owner);
      setShowDocumentsModal(true);
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

      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        stats={stats}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <Header
          activeTab={activeTab}
          adminProfile={adminProfile}
          onMenuClick={() => setSidebarOpen(true)}
          onLogout={handleLogout}
        />

        <div className="p-4 sm:p-6 lg:p-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
            {isRidersTab ? (
              <>
                <StatCard
                  title="Total Riders"
                  value={stats.totalRiders}
                  icon="Users"
                  color="bg-blue-500"
                  trend="+12%"
                />
                <StatCard
                  title="Pending Riders"
                  value={stats.pendingRiders}
                  icon="Clock"
                  color="bg-orange-500"
                />
                <StatCard
                  title="Approved Riders"
                  value={stats.approvedRiders}
                  icon="CheckCircle"
                  color="bg-green-500"
                  trend="+8%"
                />
              </>
            ) : (
              <>
                <StatCard
                  title="Total Owners"
                  value={stats.totalOwners}
                  icon="Building2"
                  color="bg-purple-500"
                  trend="+15%"
                />
                <StatCard
                  title="Pending Owners"
                  value={stats.pendingOwners}
                  icon="Store"
                  color="bg-orange-500"
                />
                <StatCard
                  title="Approved Owners"
                  value={stats.approvedOwners}
                  icon="CheckCircle2"
                  color="bg-green-500"
                  trend="+10%"
                />
              </>
            )}
            <StatCard
              title="Platform Earnings"
              value={`₹${stats.totalEarnings.toLocaleString()}`}
              icon="DollarSign"
              color="bg-red-500"
              trend="+23%"
            />
          </div>

          {/* Tables */}
          {isRidersTab && (
            <RidersTable
              riders={riders}
              loading={loading}
              activeTab={activeTab}
              actions={tableActions}
            />
          )}

          {isOwnersTab && (

            <OwnersTable
              owners={owners}
              loading={loading}
              activeTab={activeTab}
              actions={tableActions}
            />
          )}
        </div>
      </main>

      {/* Modals */}
      <RiderModal
        rider={selectedRider}
        isOpen={showRiderModal}
        onClose={() => setShowRiderModal(false)}
      />

      <OwnerModal
        owner={selectedOwner}
        isOpen={showOwnerModal}
        onClose={() => setShowOwnerModal(false)}
      />

      <DocumentsModal
        owner={selectedOwner}
        isOpen={showDocumentsModal}
        onClose={() => setShowDocumentsModal(false)}
        onVerify={actions.handleVerifyDocuments}
      />
    </div>
  );
};

export default AdminDashboard;