import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI, userAPI } from '../services/api';

export const useAdminDashboard = (activeTab, user) => {
  const navigate = useNavigate();
  const [riders, setRiders] = useState([]);
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRiders: 0,
    pendingRiders: 0,
    approvedRiders: 0,
    totalOwners: 0,
    pendingOwners: 0,
    approvedOwners: 0,
    totalEarnings: 0
  });
  const [adminProfile, setAdminProfile] = useState(null);

  // Fetch admin profile
  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        if (user) {
          setAdminProfile(user);
        } else {
          const response = await userAPI.getProfile();
          const profileData = response.data?.data || response.data || response;
          setAdminProfile(profileData);
        }
      } catch (error) {
        const storedUser = localStorage.getItem('user');
        if (storedUser) setAdminProfile(JSON.parse(storedUser));
      }
    };
    fetchAdminProfile();
  }, [user]);

  // Fetch dashboard data - FIXED: Added refreshTrigger
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  const refreshData = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);

      const [
        ridersPendingRes,
        ridersApprovedRes,
        ownersPendingRes,
        ownersApprovedRes,
        earningsRes
      ] = await Promise.all([
        adminAPI.getPendingRiders(),
        adminAPI.getApprovedRiders(),
        adminAPI.getPendingOwners().catch(() => ({ data: [] })),
        adminAPI.getApprovedOwners().catch(() => ({ data: [] })),
        adminAPI.getPlatformEarnings().catch(() => ({ data: {} }))
      ]);

      const extractData = (res) => {
        if (!res) return [];
        if (Array.isArray(res)) return res;
        if (Array.isArray(res.data)) return res.data;
        if (res.data?.data && Array.isArray(res.data.data)) return res.data.data;
        return [];
      };

      const pendingRiders = extractData(ridersPendingRes);
      const approvedRiders = extractData(ridersApprovedRes);
      const pendingOwners = extractData(ownersPendingRes);
      const approvedOwners = extractData(ownersApprovedRes);

      // Set data based on active tab
      if (activeTab.startsWith('riders-')) {
        if (activeTab === 'riders-pending') setRiders(pendingRiders);
        else if (activeTab === 'riders-approved') setRiders(approvedRiders);
        else setRiders([...pendingRiders, ...approvedRiders]);
      } else {
        if (activeTab === 'owners-pending') setOwners(pendingOwners);
        else if (activeTab === 'owners-approved') setOwners(approvedOwners);
        else setOwners([...pendingOwners, ...approvedOwners]);
      }

      const earnings = earningsRes.data?.data || earningsRes.data || {};
      
      setStats({
        totalRiders: pendingRiders.length + approvedRiders.length,
        pendingRiders: pendingRiders.length,
        approvedRiders: approvedRiders.length,
        totalOwners: pendingOwners.length + approvedOwners.length,
        pendingOwners: pendingOwners.length,
        approvedOwners: approvedOwners.length,
        totalEarnings: earnings.totalEarnings || 0
      });

    } catch (error) {
      console.error('Fetch error:', error);
      if (error.response?.status === 401) navigate('/login');
    } finally {
      setLoading(false);
    }
  }, [activeTab, navigate, refreshTrigger]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Actions - FIXED: Update state instead of reloading page
  const handleApproveRider = async (userId) => {
    if (!userId) {
      console.error("Invalid riderId:", userId);
      return;
    }

    try {
      console.log("Approving Rider ID:", userId);
      await adminAPI.approveRider(userId);
      // Instead of reload, refresh data
      refreshData();
    } catch (error) {
      console.error('Error approving rider:', error);
      alert('Failed to approve rider: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleRejectRider = async (riderId) => {
    if (!window.confirm('Are you sure you want to reject this rider?')) return;
    try {
      await adminAPI.rejectRider(riderId);
      refreshData();
    } catch (error) {
      console.error('Error rejecting rider:', error);
      alert('Failed to reject rider: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleApproveOwner = async (ownerId) => {
    try {
      await adminAPI.approveOwner(ownerId);
      refreshData();
    } catch (error) {
      console.error('Error approving owner:', error);
      alert('Failed to approve owner: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleRejectOwner = async (ownerId) => {
    if (!window.confirm('Are you sure you want to reject this restaurant owner?')) return;
    try {
      await adminAPI.rejectOwner(ownerId);
      refreshData();
    } catch (error) {
      console.error('Error rejecting owner:', error);
      alert('Failed to reject owner: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleVerifyDocuments = async (ownerId, approved, rejectionReason = '') => {
    try {
      await adminAPI.verifyOwnerDocuments(ownerId, approved, rejectionReason);
      refreshData();
    } catch (error) {
      console.error('Error verifying documents:', error);
      alert('Failed to verify documents: ' + (error.response?.data?.message || error.message));
    }
  };

  return {
    riders,
    owners,
    loading,
    stats,
    adminProfile,
    actions: {
      handleApproveRider,
      handleRejectRider,
      handleApproveOwner,
      handleRejectOwner,
      handleVerifyDocuments,
      refreshData // Export this if you need manual refresh
    }
  };
};