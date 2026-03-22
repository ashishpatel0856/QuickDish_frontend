import { useState, useEffect } from 'react';
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

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
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
    };

    fetchDashboardData();
  }, [activeTab, navigate]);

  // Actions
const handleApproveRider = async (userId) => {
  if (!userId) {
    console.error(" Invalid riderId:", userId);
    return;
  }

  try {
    console.log(" Rider ID:", userId);
    await adminAPI.approveRider(userId);
    window.location.reload(); 
  } catch (error) {
    console.error('Error approving rider:', error);
  }
};

  const handleRejectRider = async (riderId) => {
    if (!window.confirm('Are you sure you want to reject this rider?')) return;
    try {
      await adminAPI.rejectRider(riderId);
      window.location.reload();
    } catch (error) {
      console.error('Error rejecting rider:', error);
    }
  };

  const handleApproveOwner = async (ownerId) => {
    try {
      await adminAPI.approveOwner(ownerId);
      window.location.reload();
    } catch (error) {
      console.error('Error approving owner:', error);
    }
  };

  const handleRejectOwner = async (ownerId) => {
    if (!window.confirm('Are you sure you want to reject this restaurant owner?')) return;
    try {
      await adminAPI.rejectOwner(ownerId);
      window.location.reload();
    } catch (error) {
      console.error('Error rejecting owner:', error);
    }
  };

  const handleVerifyDocuments = async (ownerId, approved, rejectionReason = '') => {
    try {
      await adminAPI.verifyOwnerDocuments(ownerId, approved, rejectionReason);
      window.location.reload();
    } catch (error) {
      console.error('Error verifying documents:', error);
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
      handleVerifyDocuments
    }
  };
};