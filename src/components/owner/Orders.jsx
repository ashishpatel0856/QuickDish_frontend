import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { orderAPI, restaurantAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  Bell, CheckCircle, XCircle, Clock, Package,
  Utensils, Truck, Home, IndianRupeeIcon,
  Phone, MapPin, ChevronDown, Filter, RefreshCw,
  TrendingUp, Users, ShoppingBag, AlertCircle,
  Menu, X
} from 'lucide-react';
import { useWebSocket } from '../../hooks/useWebSocket';

const OwnerOrders = () => {
  const { restaurantId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [orders, setOrders] = useState([]);
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('PENDING');
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    todayOrders: 0
  });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const [newOrderAlert, setNewOrderAlert] = useState(null);

  // WebSocket Connection
  const { connected } = useWebSocket(null, restaurantId, (message) => {
    console.log(' WebSocket message:', message);

    if (message.type === 'NEW_ORDER') {
      setNewOrderAlert(message.data);
      playNotificationSound();
      fetchOrders(false);
    }

    if (message.type === 'ORDER_STATUS_UPDATE') {
      fetchOrders(false);
    }
  });

  const playNotificationSound = () => {
    const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-software-interface-back-2575.mp3');
    audio.play().catch(() => { });
  };

  useEffect(() => {
    fetchRestaurantDetails();
    fetchOrders();

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
      new Audio('/sounds/success.mp3').play().catch(() => { });
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
    { id: 'PENDING', label: 'New', longLabel: 'New Orders', icon: Bell, count: stats.pendingOrders },
    { id: 'CONFIRMED', label: 'Confirmed', longLabel: 'Confirmed', icon: CheckCircle },
    { id: 'PREPARING', label: 'Cooking', longLabel: 'Preparing', icon: Utensils },
    { id: 'READY_FOR_PICKUP', label: 'Ready', longLabel: 'Ready', icon: Package },
    { id: 'OUT_FOR_DELIVERY', label: 'Delivery', longLabel: 'On Way', icon: Truck },
    { id: 'DELIVERED', label: 'Done', longLabel: 'Completed', icon: Home }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="p-2 sm:p-4 md:p-6 max-w-7xl mx-auto">
      {/*  Mobile Header */}
      <div className="md:hidden flex justify-between items-center mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-gray-900">{restaurant?.name}</h1>
            {/*  Live dot */}
            {connected && (
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" title="Live" />
            )}
          </div>
          <p className="text-xs text-gray-500">Manage orders</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => fetchOrders()}
            className="p-2 bg-gray-100 rounded-lg"
          >
            <RefreshCw className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="p-2 bg-orange-100 rounded-lg"
          >
            {showMobileMenu ? <X className="w-5 h-5 text-orange-600" /> : <Menu className="w-5 h-5 text-orange-600" />}
          </button>
        </div>
      </div>

      {/*  Desktop Header */}
      <div className="hidden md:block mb-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{restaurant?.name}</h1>
            <p className="text-gray-500 mt-1 text-sm md:text-base">Manage incoming orders and track deliveries</p>
          </div>
          <button
            onClick={() => fetchOrders()}
            className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* 🔥🔥🔥 Stats Cards - Responsive Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mb-4 md:mb-6">
        <div className="bg-white p-3 md:p-6 rounded-xl md:rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs md:text-sm">Today's Orders</p>
              <p className="text-lg md:text-2xl font-bold text-gray-900">{stats.todayOrders}</p>
            </div>
            <div className="w-8 h-8 md:w-12 md:h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <ShoppingBag className="w-4 h-4 md:w-6 md:h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-3 md:p-6 rounded-xl md:rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs md:text-sm">Pending</p>
              <p className="text-lg md:text-2xl font-bold text-yellow-600">{stats.pendingOrders}</p>
            </div>
            <div className="w-8 h-8 md:w-12 md:h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <Clock className="w-4 h-4 md:w-6 md:h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-3 md:p-6 rounded-xl md:rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs md:text-sm">Revenue</p>
              <p className="text-lg md:text-2xl font-bold text-green-600">₹{stats.totalRevenue.toFixed(0)}</p>
            </div>
            <div className="w-8 h-8 md:w-12 md:h-12 bg-green-100 rounded-full flex items-center justify-center">
              <IndianRupeeIcon className="w-4 h-4 md:w-6 md:h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-3 md:p-6 rounded-xl md:rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs md:text-sm">Total</p>
              <p className="text-lg md:text-2xl font-bold text-blue-600">{stats.totalOrders}</p>
            </div>
            <div className="w-8 h-8 md:w-12 md:h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-4 h-4 md:w-6 md:h-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* 🔥🔥🔥 Mobile Tab Menu */}
      {showMobileMenu && (
        <div className="md:hidden bg-white rounded-xl shadow-lg border border-gray-200 mb-4 overflow-hidden">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setShowMobileMenu(false);
                }}
                className={`flex items-center space-x-3 w-full px-4 py-3 ${activeTab === tab.id
                  ? 'bg-orange-50 text-orange-600'
                  : 'text-gray-600'
                  }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{tab.longLabel}</span>
                {tab.count > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full ml-auto">
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* 🔥🔥🔥 Desktop Tabs */}
      <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex overflow-x-auto border-b border-gray-200">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 lg:px-6 py-3 lg:py-4 font-medium whitespace-nowrap ${activeTab === tab.id
                  ? 'text-orange-600 border-b-2 border-orange-600 bg-orange-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.longLabel}</span>
                {tab.count > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 🔥🔥🔥 Mobile Active Tab Indicator */}
      <div className="md:hidden flex items-center justify-between bg-white rounded-lg p-3 mb-4 shadow-sm">
        <div className="flex items-center space-x-2">
          {(() => {
            const ActiveIcon = getStatusIcon(activeTab);
            return <ActiveIcon className="w-5 h-5 text-orange-600" />;
          })()}
          <span className="font-medium text-gray-900">
            {tabs.find(t => t.id === activeTab)?.longLabel}
          </span>
        </div>
        <span className="text-sm text-gray-500">{orders.length} orders</span>
      </div>

      {/* 🔥🔥🔥 Orders List */}
      <div className="bg-white md:rounded-2xl md:shadow-sm md:border md:border-gray-200">
        <div className="p-2 md:p-6">
          {orders.length === 0 ? (
            <div className="text-center py-8 md:py-16">
              <Package className="w-12 h-12 md:w-16 md:h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-base md:text-lg">No {activeTab.toLowerCase()} orders</p>
            </div>
          ) : (
            <div className="space-y-3 md:space-y-4">
              {orders.map((order) => {
                const StatusIcon = getStatusIcon(order.status);
                const isPending = order.status === 'PENDING';
                const nextStatus = getNextStatus(order.status);

                return (
                  <div
                    key={order.id}
                    className="bg-white border border-gray-200 rounded-xl p-3 md:p-6 hover:shadow-md transition-shadow"
                  >
                    {/* Header - Mobile: Stack, Desktop: Row */}
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-3 md:mb-4">
                      <div className="flex items-center space-x-3 mb-2 md:mb-0">
                        <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shrink-0 ${getStatusColor(order.status)}`}>
                          <StatusIcon className="w-5 h-5 md:w-6 md:h-6" />
                        </div>
                        <div>
                          <h3 className="font-bold text-base md:text-lg text-gray-900">
                            Order #{order.orderNumber || order.id}
                          </h3>
                          <p className="text-gray-500 text-xs md:text-sm">
                            {new Date(order.orderDate).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between md:text-right md:block">
                        <span className={`md:hidden inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status.replace(/_/g, ' ')}
                        </span>
                        <p className="text-xl md:text-2xl font-bold text-gray-900">
                          ₹{order.totalPrice.toFixed(0)}
                        </p>
                        <span className={`hidden md:inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status.replace(/_/g, ' ')}
                        </span>
                      </div>
                    </div>

                    {/* Customer Info */}
                    <div className="bg-gray-50 rounded-lg p-3 md:p-4 mb-3 md:mb-4">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                        <div className="mb-2 md:mb-0">
                          <p className="font-medium text-gray-900 flex items-center text-sm md:text-base">
                            <Users className="w-4 h-4 mr-2" />
                            {order.customer?.name || 'Customer'}
                          </p>
                          <p className="text-gray-500 text-xs md:text-sm mt-1 flex items-center">
                            <Phone className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                            {order.customer?.phone || 'N/A'}
                          </p>
                          <p className="text-gray-500 text-xs md:text-sm mt-1 flex items-start">
                            <MapPin className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2 mt-0.5" />
                            <span className="line-clamp-2">{order.deliveryAddress}</span>
                          </p>
                        </div>
                        {order.notes && (
                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2 md:p-3 md:max-w-xs">
                            <p className="text-xs md:text-sm text-yellow-800">
                              <AlertCircle className="w-3 h-3 md:w-4 md:h-4 inline mr-1" />
                              {order.notes}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Order Items - Horizontal Scroll on Mobile */}
                    <div className="flex items-center space-x-3 mb-3 md:mb-4 overflow-x-auto pb-2">
                      {order.orderItems?.slice(0, 4).map((item, idx) => (
                        <div key={idx} className="flex items-center space-x-2 bg-gray-50 rounded-lg px-2 py-1 md:px-3 md:py-2 shrink-0">
                          <img
                            src={item.foodItem?.images?.[0] || '/default-food.jpg'}
                            alt={item.foodItem?.name}
                            className="w-8 h-8 md:w-10 md:h-10 rounded object-cover"
                          />
                          <div>
                            <p className="font-medium text-xs md:text-sm text-gray-900">{item.foodItem?.name}</p>
                            <p className="text-xs text-gray-500">x{item.quantity}</p>
                          </div>
                        </div>
                      ))}
                      {order.orderItems?.length > 4 && (
                        <span className="text-gray-500 text-xs md:text-sm shrink-0">+{order.orderItems.length - 4} more</span>
                      )}
                    </div>

                    {/* Action Buttons - Responsive */}
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center pt-3 md:pt-4 border-t border-gray-200 space-y-2 md:space-y-0">
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowOrderModal(true);
                        }}
                        className="text-orange-600 font-medium hover:text-orange-700 text-sm md:text-base text-left md:text-center"
                      >
                        View Details
                      </button>

                      <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-3">
                        {isPending ? (
                          <>
                            <button
                              onClick={() => handleRejectOrder(order.id)}
                              className="flex items-center justify-center space-x-2 px-4 py-2 md:px-4 md:py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 text-sm md:text-base"
                            >
                              <XCircle className="w-4 h-4" />
                              <span>Reject</span>
                            </button>
                            <button
                              onClick={() => handleAcceptOrder(order.id)}
                              className="flex items-center justify-center space-x-2 px-4 py-2 md:px-6 md:py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm md:text-base"
                            >
                              <CheckCircle className="w-4 h-4" />
                              <span className="hidden sm:inline">Accept Order</span>
                              <span className="sm:hidden">Accept</span>
                            </button>
                          </>
                        ) : order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && (
                          <button
                            onClick={() => handleUpdateStatus(order.id, nextStatus)}
                            className="flex items-center justify-center space-x-2 px-4 py-2 md:px-6 md:py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 text-sm md:text-base w-full md:w-auto"
                          >
                            <StatusIcon className="w-4 h-4" />
                            <span className="hidden sm:inline">Mark as {nextStatus?.replace(/_/g, ' ')}</span>
                            <span className="sm:hidden">Update</span>
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

      {/* 🔥🔥🔥 Order Detail Modal - Responsive */}
      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2 md:p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[95vh] md:max-h-[90vh] overflow-y-auto">
            <div className="p-4 md:p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
              <h2 className="text-lg md:text-2xl font-bold text-gray-900">
                Order #{selectedOrder.orderNumber || selectedOrder.id}
              </h2>
              <button
                onClick={() => setShowOrderModal(false)}
                className="text-gray-500 hover:text-gray-700 p-1"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="p-4 md:p-6 space-y-4 md:space-y-6">
              {/* Customer Details */}
              <div>
                <h3 className="font-bold text-gray-900 mb-2 md:mb-3 text-sm md:text-base">Customer Details</h3>
                <div className="bg-gray-50 rounded-lg p-3 md:p-4 space-y-1 md:space-y-2">
                  <p className="font-medium text-sm md:text-base">{selectedOrder.customer?.name}</p>
                  <p className="text-gray-600 text-sm">{selectedOrder.customer?.phone}</p>
                  <p className="text-gray-600 text-sm">{selectedOrder.deliveryAddress}</p>
                </div>
              </div>

              {/* All Items */}
              <div>
                <h3 className="font-bold text-gray-900 mb-2 md:mb-3 text-sm md:text-base">Order Items</h3>
                <div className="space-y-2 md:space-y-3">
                  {selectedOrder.orderItems?.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 md:p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-2 md:space-x-3">
                        <img
                          src={item.foodItem?.images?.[0] || '/default-food.jpg'}
                          alt={item.foodItem?.name}
                          className="w-12 h-12 md:w-16 md:h-16 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-medium text-gray-900 text-sm md:text-base">{item.foodItem?.name}</p>
                          <p className="text-xs md:text-sm text-gray-500">₹{item.price} x {item.quantity}</p>
                        </div>
                      </div>
                      <p className="font-bold text-gray-900 text-sm md:text-base">₹{(item.price * item.quantity).toFixed(0)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bill Summary */}
              <div className="border-t border-gray-200 pt-3 md:pt-4">
                <div className="flex justify-between text-gray-600 mb-2 text-sm md:text-base">
                  <span>Subtotal</span>
                  <span>₹{selectedOrder.totalPrice.toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-gray-900 font-bold text-base md:text-lg">
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