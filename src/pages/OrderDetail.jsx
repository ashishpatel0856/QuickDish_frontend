import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { orderAPI } from '../services/api';
import {
  ChevronLeft, MapPin, Phone, Clock, Package, CheckCircle,
  Truck, Home, IndianRupeeIcon, Loader2, RefreshCw, Star,
  Utensils, MessageSquare, HelpCircle, Receipt
} from 'lucide-react';
import { useWebSocket } from '../hooks/useWebSocket';
import { useAuth } from '../context/AuthContext';


// websocket for live updates
const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const { connected } = useWebSocket(user?.id, null, (message) => {
    if (message.data?.id === Number(id)) {
      setOrder(message.data);
      console.log(' Live update:', message.data.status);
    }
  });

  useEffect(() => {
    fetchOrderDetail();
    const interval = setInterval(() => {
      if (order && order.status !== 'DELIVERED' && order.status !== 'CANCELLED') {
        fetchOrderDetail(false);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [id]);


  const fetchOrderDetail = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const response = await orderAPI.getById(id);
      setOrder(response.data);
    } catch (error) {
      console.error('Failed to fetch order:', error);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  const getStatusSteps = (currentStatus) => {
    const steps = [
      { status: 'PENDING', label: 'Order Placed', icon: Package, time: 'Just now' },
      { status: 'CONFIRMED', label: 'Confirmed', icon: CheckCircle, time: '1 min' },
      { status: 'PREPARING', label: 'Preparing', icon: Utensils, time: '5 mins' },
      { status: 'READY_FOR_PICKUP', label: 'Ready', icon: Package, time: '2 mins' },
      { status: 'OUT_FOR_DELIVERY', label: 'On the Way', icon: Truck, time: '15 mins' },
      { status: 'DELIVERED', label: 'Delivered', icon: Home, time: 'Delivered' }
    ];

    const currentIndex = steps.findIndex(s => s.status === currentStatus);
    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex,
      active: index === currentIndex,
      pending: index > currentIndex
    }));
  };

  const getStatusColor = (status) => {
    const colors = {
      'PENDING': 'bg-yellow-500',
      'CONFIRMED': 'bg-blue-500',
      'PREPARING': 'bg-orange-500',
      'READY_FOR_PICKUP': 'bg-purple-500',
      'OUT_FOR_DELIVERY': 'bg-indigo-500',
      'DELIVERED': 'bg-green-500',
      'CANCELLED': 'bg-red-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-500"></div>
    </div>
  );

  if (!order) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-gray-500">Order not found</p>
    </div>
  );

  const statusSteps = getStatusSteps(order.status);
  const activeStepIndex = statusSteps.findIndex(s => s.active);
  const progressPercent = ((activeStepIndex + 1) / statusSteps.length) * 100;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/orders')}
            className="flex items-center text-gray-700 hover:text-gray-900"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-gray-900">Order #{order?.orderNumber || order?.id}</h1>
            {connected && (
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" title="Live tracking" />
            )}
          </div>

          <button
            onClick={() => fetchOrderDetail(false)}
            className="text-orange-500"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
        {/*  Live Status Card */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {/* Progress Bar */}
          <div className="h-1 bg-gray-200 w-full">
            <div
              className={`h-full ${getStatusColor(order.status)} transition-all duration-500`}
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>

          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Order Status</p>
                <h2 className="text-2xl font-bold text-gray-900 capitalize">
                  {order.status === 'OUT_FOR_DELIVERY' ? 'On the Way' : order.status?.replace(/_/g, ' ').toLowerCase()}
                </h2>
                {order.status === 'OUT_FOR_DELIVERY' && (
                  <p className="text-orange-600 text-sm mt-1 flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    Arriving in 10-15 mins
                  </p>
                )}
              </div>
              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${getStatusColor(order.status)} bg-opacity-10`}>
                {order.status === 'DELIVERED' ? (
                  <CheckCircle className="w-8 h-8 text-green-600" />
                ) : order.status === 'OUT_FOR_DELIVERY' ? (
                  <Truck className="w-8 h-8 text-indigo-600" />
                ) : (
                  <Clock className="w-8 h-8 text-orange-600" />
                )}
              </div>
            </div>

            {/* Timeline */}
            <div className="relative mt-6">
              <div className="flex justify-between items-center">
                {statusSteps.map((step, index) => {
                  const Icon = step.icon;
                  const isLast = index === statusSteps.length - 1;

                  return (
                    <div key={step.status} className="flex flex-col items-center relative z-10">
                      <div className={`
                        w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all
                        ${step.completed ? 'bg-orange-500 border-orange-500 text-white' :
                          step.active ? 'bg-white border-orange-500 text-orange-500 animate-pulse' :
                            'bg-gray-100 border-gray-300 text-gray-400'}
                      `}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <p className={`text-xs mt-2 font-medium text-center w-16 ${step.completed || step.active ? 'text-gray-900' : 'text-gray-400'}`}>
                        {step.label}
                      </p>
                      {step.active && (
                        <p className="text-xs text-orange-600 mt-1">{step.time}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Restaurant Info Card */}
        {order.restaurant && (
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-start gap-4">
              <img
                src={order.restaurant.imageUrl || 'https://via.placeholder.com/80?text=Restaurant'}
                alt={order.restaurant.name}
                className="w-20 h-20 rounded-xl object-cover"
              />
              <div className="flex-1">
                <h3 className="font-bold text-lg text-gray-900">{order.restaurant.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="flex items-center bg-green-100 text-green-700 px-2 py-0.5 rounded text-sm font-medium">
                    <Star className="w-3 h-3 mr-1 fill-current" />
                    {order.restaurant.rating || '4.2'}
                  </span>
                  <span className="text-gray-500 text-sm">•</span>
                  <span className="text-gray-500 text-sm">{order.restaurant.cuisine || 'Multi Cuisine'}</span>
                </div>
                <p className="text-gray-500 text-sm mt-1">{order.restaurant.address}</p>

                <div className="flex gap-3 mt-3">
                  <button className="flex items-center gap-1 text-orange-600 text-sm font-medium">
                    <Phone className="w-4 h-4" />
                    Call
                  </button>
                  <button className="flex items-center gap-1 text-orange-600 text-sm font-medium">
                    <MessageSquare className="w-4 h-4" />
                    Chat
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/*  Order Items with Images */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <Receipt className="w-5 h-5 text-gray-600" />
              Order Items ({order.orderItems?.length || 0})
            </h3>
          </div>

          <div className="divide-y divide-gray-100">
            {order.orderItems?.map((item, index) => (
              <div key={index} className="p-4 flex items-center gap-4">
                {/*  Food Image */}
                <div className="relative">
                  <img
                    src={item.foodItem?.imageUrl || item.foodItem?.image || 'https://via.placeholder.com/80?text=Food'}
                    alt={item.foodItem?.name}
                    className="w-24 h-24 rounded-xl object-cover"
                  />
                  {item.foodItem?.isVeg && (
                    <div className="absolute top-1 left-1 w-5 h-5 bg-white rounded flex items-center justify-center">
                      <div className="w-3 h-3 border-2 border-green-500 rounded-sm"></div>
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <h4 className="font-bold text-gray-900">{item.foodItem?.name}</h4>
                  <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                    {item.foodItem?.description || 'Delicious food item'}
                  </p>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center bg-gray-100 rounded-lg px-3 py-1">
                      <span className="text-gray-700 font-medium">{item.quantity}x</span>
                    </div>
                    <div className="text-right">
                      <p className="flex items-center font-bold text-gray-900">
                        <IndianRupeeIcon className="w-4 h-4 mr-0" />
                        {Number(item.price * item.quantity).toFixed(0)}
                      </p>
                      <p className="text-gray-500 text-sm">
                        ₹{Number(item.price).toFixed(0)} each
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bill Summary */}
          <div className="bg-gray-50 p-6 space-y-3">
            <div className="flex justify-between text-gray-600">
              <span>Item Total</span>
              <span className="flex items-center">
                <IndianRupeeIcon className="w-3 h-3 mr-1" />
                {Number(order.subTotal || order.totalPrice * 0.85).toFixed(0)}
              </span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Delivery Fee</span>
              <span className={order.deliveryFee === 0 ? 'text-green-600 font-medium' : ''}>
                {order.deliveryFee === 0 ? 'FREE' : `₹${order.deliveryFee || 40}`}
              </span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Platform Fee</span>
              <span>₹{order.platformFee || 10}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>GST & Charges</span>
              <span>₹{Number(order.tax || order.totalPrice * 0.05).toFixed(0)}</span>
            </div>

            <div className="border-t border-gray-300 pt-3 flex justify-between items-center">
              <span className="font-bold text-lg text-gray-900">Grand Total</span>
              <span className="flex items-center text-xl font-bold text-gray-900">
                <IndianRupeeIcon className="w-5 h-5 mr-1" />
                {Number(order.totalPrice).toFixed(0)}
              </span>
            </div>
          </div>
        </div>

        {/*  Delivery & Payment Info */}
        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <MapPin className="w-5 h-5 text-gray-600" />
            Delivery Details
          </h3>

          <div className="bg-gray-50 rounded-xl p-4">
            <p className="font-medium text-gray-900">Delivering to</p>
            <p className="text-gray-600 mt-1 leading-relaxed">{order.deliveryAddress}</p>
            {order.notes && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-sm text-gray-500">Note: {order.notes}</p>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                {order.paymentMethod === 'COD' ? (
                  <IndianRupeeIcon className="w-6 h-6 text-gray-600" />
                ) : (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                )}
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  {order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online Payment'}
                </p>
                <p className="text-sm text-gray-500">
                  {order.paid ? 'Paid' : 'To be paid'}
                </p>
              </div>
            </div>
            <span className="text-lg font-bold text-gray-900">
              ₹{Number(order.totalPrice).toFixed(0)}
            </span>
          </div>
        </div>

        {/*  Help Section */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-gray-600" />
            Need Help?
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <button className="p-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 text-left">
              I haven't received my order
            </button>
            <button className="p-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 text-left">
              Items are missing
            </button>
            <button className="p-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 text-left">
              Quality was not good
            </button>
            <button className="p-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 text-left">
              Wrong item delivered
            </button>
          </div>
        </div>

        {/* Order Placed Time */}
        <div className="text-center text-gray-500 text-sm pb-8">
          <p>Order placed on {new Date(order.orderDate).toLocaleString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}</p>
        </div>

      </div>
    </div>
  );
};

export default OrderDetail;