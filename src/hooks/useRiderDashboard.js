import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { riderAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

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
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async () => {
    try {
      const { data } = await riderAPI.getProfile();
      if (data) {
        setProfile(data);
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
    console.log('Fetching earnings...');
    const { data } = await riderAPI.getTodayEarnings();
    console.log('Earnings data:', data);
    if (data) {
      setEarnings({
        today: data.totalEarnings || 0,
        week: 0, 
        total: 0
      });
    }
  } catch (err) {
    console.error('Earnings fetch error:', err);
    console.error('Error response:', err.response);
  }
}, []);



  const fetchCurrentOrder = useCallback(async () => {
    try {
      const { data } = await riderAPI.getCurrentOrder();
      setCurrentOrder(data);
      return data;
    } catch (err) {
      console.error('Current order error:', err);
      setCurrentOrder(null);
      return null;
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
    }, 5000);
    return () => clearInterval(interval);
  }, [riderStatus, fetchCurrentOrder, fetchAvailableOrders]);

  const updateStatus = async (newStatus) => {
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
      const message = err.response?.data?.message || 'Status update failed';
      setError(message);
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  const updateLocation = useCallback(async (locationData) => {
    const latitude = parseFloat(locationData?.latitude);
    const longitude = parseFloat(locationData?.longitude);
    if (isNaN(latitude) || isNaN(longitude)) {
      const msg = 'Invalid coordinates';
      setError(msg);
      return Promise.reject(msg);
    }
    try {
      setLoading(true);
      await riderAPI.updateLocation({ latitude, longitude });
      await fetchProfile();
      if (riderStatus === STATUS.AVAILABLE) {
        await fetchAvailableOrders();
      }
      setError(null);
      return { latitude, longitude };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update location';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [riderStatus, fetchProfile, fetchAvailableOrders]);

  const acceptOrder = async (orderId) => {
    try {
      setActionLoading(true);
      await riderAPI.acceptOrder(orderId);
      await fetchCurrentOrder();
      await fetchProfile();
      setAvailableOrders([]);
      alert(' Order accepted! Check your email for Pickup OTP.');
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to accept order';
      alert(message);
    } finally {
      setActionLoading(false);
    }
  };



  const arriveAtRestaurant = useCallback(async () => {
    if (!currentOrder?.assignmentId) {
      alert('No active order');
      return;
    }
    try {
      setActionLoading(true);
      await riderAPI.arriveAtRestaurant(currentOrder.assignmentId);
      alert(' Restaurant notified! Check email sent to restaurant.');
      await fetchCurrentOrder();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to notify restaurant');
    } finally {
      setActionLoading(false);
    }
  }, [currentOrder, fetchCurrentOrder]);



  const handlePickup = async (otp) => {
    if (!currentOrder?.assignmentId) {
      alert('No active order');
      return;
    }
    try {
      setActionLoading(true);
      await riderAPI.pickupOrder(currentOrder.assignmentId, otp);
      await fetchCurrentOrder();
      alert('Order picked up successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Invalid OTP');
      throw err;
    } finally {
      setActionLoading(false);
    }
  };



  const arriveAtCustomer = useCallback(async () => {
    if (!currentOrder?.assignmentId) {
      alert('No active order');
      return;
    }
    try {
      setActionLoading(true);
      await riderAPI.arriveAtCustomer(currentOrder.assignmentId);
      alert(' Customer notified! Check email sent to customer.');
      await fetchCurrentOrder();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to notify customer');
    } finally {
      setActionLoading(false);
    }
  }, [currentOrder, fetchCurrentOrder]);




  const handleDeliver = async (otp) => {
    if (!currentOrder?.assignmentId) {
      alert('No active order');
      return;
    }
    try {
      setActionLoading(true);
      await riderAPI.deliverOrder(currentOrder.assignmentId, otp);
      await Promise.all([fetchCurrentOrder(), fetchProfile(), fetchEarnings()]);
      alert(' Order delivered successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Invalid OTP');
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  // Get current action based on order status
  const getCurrentAction = useCallback(() => {
    if (!currentOrder) return null;

    switch (currentOrder.status) {
      case 'ASSIGNED':
        return {
          type: 'ARRIVE_AT_RESTAURANT',
          label: " I've Arrived at Restaurant",
          description: "Click to send OTP to restaurant",
          action: arriveAtRestaurant,
          color: 'orange'
        };
      case 'PICKED_UP':
        return {
          type: 'ARRIVE_AT_CUSTOMER',
          label: "I've Reached Customer",
          description: "Click to notify customer",
          action: arriveAtCustomer,
          color: 'blue'
        };
      default:
        return null;
    }
  }, [currentOrder, arriveAtRestaurant, arriveAtCustomer]);

  return {
    profile,
    earnings,
    currentOrder,
    availableOrders,
    riderStatus,
    loading,
    actionLoading,
    error,
    updateStatus,
    updateLocation,
    acceptOrder,
    arriveAtRestaurant,
    arriveAtCustomer,
    handlePickup,
    handleDeliver,
    getCurrentAction,
    logout,
    STATUS
  };
};