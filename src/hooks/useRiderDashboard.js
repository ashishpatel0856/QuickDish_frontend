// hooks/useRiderDashboard.js
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { riderAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

// 🔴 ONLINE hata diya - sirf 3 status
const STATUS = {
  OFFLINE: 'OFFLINE',
  AVAILABLE: 'AVAILABLE', 
  BUSY: 'BUSY'
};

export const useRiderDashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  
  const [profile, setProfile] = useState(null);
  const [earnings, setEarnings] = useState({ today: 0, week: 0, total: 0 });
  const [currentOrder, setCurrentOrder] = useState(null);
  const [availableOrders, setAvailableOrders] = useState([]);
  const [riderStatus, setRiderStatus] = useState(STATUS.OFFLINE);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async () => {
    try {
      const { data } = await riderAPI.getProfile();
      if (data) {
        setProfile(data);
        // Backend se jo status aaye, validate karo
        const validStatus = Object.values(STATUS).includes(data.status) 
          ? data.status 
          : STATUS.OFFLINE;
        setRiderStatus(validStatus);
      }
      return data;
    } catch (err) {
      console.error('Profile fetch error:', err);
      if (err.response?.status === 401) navigate('/login');
      throw err;
    }
  }, [navigate]);

  const fetchEarnings = useCallback(async () => {
    try {
      const { data } = await riderAPI.getTodayEarnings();
      if (data) {
        setEarnings({
          today: data.totalEarnings || 0,
          week: 0,
          total: 0
        });
      }
    } catch (err) {
      console.error('Earnings fetch error:', err);
    }
  }, []);

  const fetchCurrentOrder = useCallback(async () => {
    try {
      const { data } = await riderAPI.getCurrentOrder();
      setCurrentOrder(data);
    } catch (err) {
      setCurrentOrder(null);
    }
  }, []);

  const fetchAvailableOrders = useCallback(async () => {
    if (riderStatus !== STATUS.AVAILABLE) {
      setAvailableOrders([]);
      return;
    }
    
    try {
      const { data } = await riderAPI.getAvailableOrders();
      setAvailableOrders(data || []);
      setError(null);
    } catch (err) {
      console.error('Available orders error:', err);
      setAvailableOrders([]);
      if (err.response?.data?.message?.includes('location')) {
        setError('Please update your location first');
      }
    }
  }, [riderStatus]);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        await fetchProfile();
        await Promise.all([fetchEarnings(), fetchCurrentOrder()]);
      } catch (err) {
        setError('Failed to initialize dashboard');
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [fetchProfile, fetchEarnings, fetchCurrentOrder]);

  useEffect(() => {
    fetchAvailableOrders();
  }, [riderStatus, fetchAvailableOrders]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchCurrentOrder();
      if (riderStatus === STATUS.AVAILABLE) {
        fetchAvailableOrders();
      }
    }, 15000);
    return () => clearInterval(interval);
  }, [riderStatus, fetchCurrentOrder, fetchAvailableOrders]);

  // 🔴 Status update - sirf 3 options
  const updateStatus = async (newStatus) => {
    // Validate status
    if (!Object.values(STATUS).includes(newStatus)) {
      alert('Invalid status: ' + newStatus);
      return;
    }

    try {
      setLoading(true);
      await riderAPI.updateStatus(newStatus);
      setRiderStatus(newStatus);
      await fetchProfile();
      
      if (newStatus === STATUS.AVAILABLE) {
        await fetchAvailableOrders();
      } else {
        setAvailableOrders([]);
      }
      setError(null);
    } catch (err) {
      console.error('Status update failed:', err);
      const message = err.response?.data?.message || 'Status update failed';
      setError(message);
      alert(message);
      if (profile?.status) setRiderStatus(profile.status);
    } finally {
      setLoading(false);
    }
  };

  const updateLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported');
      return Promise.reject('Geolocation not supported');
    }

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            await riderAPI.updateLocation({ latitude, longitude });
            await fetchProfile();
            if (riderStatus === STATUS.AVAILABLE) {
              await fetchAvailableOrders();
            }
            setError(null);
            resolve({ latitude, longitude });
          } catch (err) {
            setError('Failed to update location');
            reject(err);
          }
        },
        (err) => {
          const message = 'Please enable location permissions';
          setError(message);
          alert(message);
          reject(err);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    });
  }, [riderStatus, fetchProfile, fetchAvailableOrders]);

  const acceptOrder = async (orderId) => {
    try {
      setLoading(true);
      await riderAPI.acceptOrder(orderId);
      await Promise.all([fetchCurrentOrder(), fetchProfile()]);
      setError(null);
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to accept order';
      setError(message);
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  const handlePickup = async (otp) => {
    if (!currentOrder?.id) return;
    try {
      await riderAPI.pickupOrder(currentOrder.id, otp);
      await fetchCurrentOrder();
    } catch (err) {
      alert(err.response?.data?.message || 'Invalid OTP');
      throw err;
    }
  };

  const handleDeliver = async (otp) => {
    if (!currentOrder?.id) return;
    try {
      await riderAPI.deliverOrder(currentOrder.id, otp);
      await Promise.all([fetchCurrentOrder(), fetchProfile()]);
    } catch (err) {
      alert(err.response?.data?.message || 'Invalid OTP');
      throw err;
    }
  };

  // 🔴 Export STATUS for UI use
  return {
    profile,
    earnings,
    currentOrder,
    availableOrders,
    riderStatus,
    loading,
    error,
    updateStatus,
    updateLocation,
    acceptOrder,
    handlePickup,
    handleDeliver,
    logout,
    STATUS 
  };
};