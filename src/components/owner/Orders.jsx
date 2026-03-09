// owner/Orders.jsx - Complete Swiggy-Style
import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { orderAPI, restaurantAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { 
  Bell, CheckCircle, XCircle, Clock, Package, 
  Utensils, Truck, Home, IndianRupeeIcon, 
  Phone, MapPin, ChevronDown, Filter, RefreshCw,
  TrendingUp, Users, ShoppingBag, AlertCircle
} from 'lucide-react';

const OwnerOrders = () => {
  const { restaurantId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [orders, setOrders] = useState([]);
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('PENDING'); // PENDING, CONFIRMED, PREPARING, READY, OUT_FOR_DELIVERY, DELIVERED
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    todayOrders: 0
  });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);

  // 🔥🔥🔥 WebSocket for real-time orders
  useEffect(() => {
    fetchRestaurantDetails();
    fetchOrders();
    
    // Poll every 10 seconds for new orders
    const interval = setInterval(() => {
      fetchOrders(false);
    }, 10000);
    
    return () => clearInterval(interval);
  }, [restaurantId, activeTab]);

  const fetchRestaurantDetails = async () => {
    try {
      const res = await restaurantAPI.getById(restaurantId);
      setRestaurant(res.data);
    } catch (err) {
      console.error('Failed to fetch restaurant:', err);
    }
  };

  const fetchOrders = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const res = await orderAPI.getRestaurantOrders(restaurantId, activeTab);
      setOrders(res.data);
      
      // Calculate stats
      const allRes = await orderAPI.getRestaurantOrders(restaurantId);
      const allOrders = allRes.data;
      setStats({
        totalOrders: allOrders.length,
        totalRevenue: allOrders.reduce((sum, o) => sum + o.totalPrice, 0),
        pendingOrders: allOrders.filter(o => o.status === 'PENDING').length,
        todayOrders: allOrders.filter(o => {
          const orderDate = new Date(o.orderDate);
          const today = new Date();
          return orderDate.toDateString() === today.toDateString();
        }).length
      });
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  const handleAcceptOrder = async (orderId) => {
    try {
      await orderAPI.acceptOrder(orderId);
      fetchOrders(false);
      // 🔥 Play notification sound
      new Audio('/sounds/success.mp3').play().catch(() => {});
    } catch (err) {
      alert('Failed to accept order: ' + err.message);
    }
  };

  const handleRejectOrder = async (orderId) => {
    const reason = prompt('Enter rejection reason:');
    if (!reason) return;
    
    try {
      await orderAPI.rejectOrder(orderId, reason);
      fetchOrders(false);
    } catch (err) {
      alert('Failed to reject order: ' + err.message);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await orderAPI.updateOrderStatus(orderId, newStatus);
      fetchOrders(false);
      setShowOrderModal(false);
    } catch (err) {
      alert('Failed to update status: ' + err.message);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'PENDING': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'CONFIRMED': 'bg-blue-100 text-blue-800 border-blue-200',
      'PREPARING': 'bg-orange-100 text-orange-800 border-orange-200',
      'READY_FOR_PICKUP': 'bg-purple-100 text-purple-800 border-purple-200',
      'OUT_FOR_DELIVERY': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      'DELIVERED': 'bg-green-100 text-green-800 border-green-200',
      'CANCELLED': 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    const icons = {
      'PENDING': Clock,
      'CONFIRMED': CheckCircle,
      'PREPARING': Utensils,
      'READY_FOR_PICKUP': Package,
      'OUT_FOR_DELIVERY': Truck,
      'DELIVERED': Home,
      'CANCELLED': XCircle
    };
    return icons[status] || Clock;
  };

  const getNextStatus = (currentStatus) => {
    const flow = {
      'CONFIRMED': 'PREPARING',
      'PREPARING': 'READY_FOR_PICKUP',
      'READY_FOR_PICKUP': 'OUT_FOR_DELIVERY',
      'OUT_FOR_DELIVERY': 'DELIVERED'
    };
    return flow[currentStatus];
  };

  const tabs = [
    { id: 'PENDING', label: 'New Orders', icon: Bell, count: stats.pendingOrders },
    { id: 'CONFIRMED', label: 'Confirmed', icon: CheckCircle },
    { id: 'PREPARING', label: 'Preparing', icon: Utensils },
    { id: 'READY_FOR_DELIVERY', label: 'Ready', icon: Package },
    { id: 'OUT_FOR_DELIVERY', label: 'On Way', icon: Truck },
    { id: 'DELIVERED', label: 'Completed', icon: Home }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* 🔥🔥🔥 Header with Stats */}
      <div className="mb-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{restaurant?.name}</h1>
            <p className="text-gray-500 mt-1">Manage incoming orders and track deliveries</p>
          </div>
          <button 
            onClick={() => fetchOrders()}
            className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Today's Orders</p>
                <p className="text-2xl font-bold text-gray-900">{stats.todayOrders}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pendingOrders}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Revenue</p>
                <p className="text-2xl font-bold text-green-600">₹{stats.totalRevenue.toFixed(0)}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <IndianRupeeIcon className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Orders</p>
                <p className="text-2xl font-bold text-blue-600">{stats.totalOrders}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🔥🔥🔥 Tabs */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex overflow-x-auto border-b border-gray-200">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-4 font-medium whitespace-nowrap ${
                  activeTab === tab.id 
                    ? 'text-orange-600 border-b-2 border-orange-600 bg-orange-50' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
                {tab.count > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* 🔥🔥🔥 Orders List */}
        <div className="p-6">
          {orders.length === 0 ? (
            <div className="text-center py-16">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No {activeTab.toLowerCase()} orders</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const StatusIcon = getStatusIcon(order.status);
                const isPending = order.status === 'PENDING';
                const nextStatus = getNextStatus(order.status);

                return (
                  <div 
                    key={order.id} 
                    className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getStatusColor(order.status)}`}>
                          <StatusIcon className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-gray-900">
                            Order #{order.orderNumber || order.id}
                          </h3>
                          <p className="text-gray-500 text-sm">
                            {new Date(order.orderDate).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">
                          ₹{order.totalPrice.toFixed(0)}
                        </p>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status.replace(/_/g, ' ')}
                        </span>
                      </div>
                    </div>

                    {/* Customer Info */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-gray-900 flex items-center">
                            <Users className="w-4 h-4 mr-2" />
                            {order.customer?.name || 'Customer'}
                          </p>
                          <p className="text-gray-500 text-sm mt-1 flex items-center">
                            <Phone className="w-4 h-4 mr-2" />
                            {order.customer?.phone || 'N/A'}
                          </p>
                          <p className="text-gray-500 text-sm mt-1 flex items-start">
                            <MapPin className="w-4 h-4 mr-2 mt-0.5" />
                            {order.deliveryAddress}
                          </p>
                        </div>
                        {order.notes && (
                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 max-w-xs">
                            <p className="text-sm text-yellow-800">
                              <AlertCircle className="w-4 h-4 inline mr-1" />
                              {order.notes}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Order Items Preview */}
                    <div className="flex items-center space-x-4 mb-4 overflow-x-auto pb-2">
                      {order.orderItems?.slice(0, 3).map((item, idx) => (
                        <div key={idx} className="flex items-center space-x-2 bg-gray-50 rounded-lg px-3 py-2">
                          <img 
                            src={item.foodItem?.images?.[0] || '/default-food.jpg'} 
                            alt={item.foodItem?.name}
                            className="w-10 h-10 rounded object-cover"
                          />
                          <div>
                            <p className="font-medium text-sm text-gray-900">{item.foodItem?.name}</p>
                            <p className="text-xs text-gray-500">x{item.quantity}</p>
                          </div>
                        </div>
                      ))}
                      {order.orderItems?.length > 3 && (
                        <span className="text-gray-500 text-sm">+{order.orderItems.length - 3} more</span>
                      )}
                    </div>

                    {/* 🔥🔥🔥 Action Buttons */}
                    <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowOrderModal(true);
                        }}
                        className="text-orange-600 font-medium hover:text-orange-700"
                      >
                        View Details
                      </button>

                      <div className="flex space-x-3">
                        {isPending ? (
                          <>
                            <button
                              onClick={() => handleRejectOrder(order.id)}
                              className="flex items-center space-x-2 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
                            >
                              <XCircle className="w-4 h-4" />
                              <span>Reject</span>
                            </button>
                            <button
                              onClick={() => handleAcceptOrder(order.id)}
                              className="flex items-center space-x-2 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                            >
                              <CheckCircle className="w-4 h-4" />
                              <span>Accept Order</span>
                            </button>
                          </>
                        ) : order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && (
                          <button
                            onClick={() => handleUpdateStatus(order.id, nextStatus)}
                            className="flex items-center space-x-2 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                          >
                            <StatusIcon className="w-4 h-4" />
                            <span>Mark as {nextStatus?.replace(/_/g, ' ')}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* 🔥🔥🔥 Order Detail Modal */}
      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">
                Order #{selectedOrder.orderNumber || selectedOrder.id}
              </h2>
              <button 
                onClick={() => setShowOrderModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Customer Details */}
              <div>
                <h3 className="font-bold text-gray-900 mb-3">Customer Details</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <p className="font-medium">{selectedOrder.customer?.name}</p>
                  <p className="text-gray-600">{selectedOrder.customer?.phone}</p>
                  <p className="text-gray-600">{selectedOrder.deliveryAddress}</p>
                </div>
              </div>

              {/* All Items */}
              <div>
                <h3 className="font-bold text-gray-900 mb-3">Order Items</h3>
                <div className="space-y-3">
                  {selectedOrder.orderItems?.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <img 
                          src={item.foodItem?.images?.[0] || '/default-food.jpg'}
                          alt={item.foodItem?.name}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-medium text-gray-900">{item.foodItem?.name}</p>
                          <p className="text-sm text-gray-500">₹{item.price} x {item.quantity}</p>
                        </div>
                      </div>
                      <p className="font-bold text-gray-900">₹{(item.price * item.quantity).toFixed(0)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bill Summary */}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between text-gray-600 mb-2">
                  <span>Subtotal</span>
                  <span>₹{selectedOrder.totalPrice.toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-gray-900 font-bold text-lg">
                  <span>Total</span>
                  <span>₹{selectedOrder.totalPrice.toFixed(0)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerOrders;