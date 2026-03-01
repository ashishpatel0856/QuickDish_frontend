import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { orderAPI } from '../services/api';
import { 
  ChevronLeft, MapPin, Phone, Clock, Package, CheckCircle, 
  Truck, Home, IndianRupeeIcon, Loader2, RefreshCw 
} from 'lucide-react';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderDetail();
    
    const interval = setInterval(() => {
      if (order && order.status !== 'DELIVERED' && order.status !== 'CANCELLED') {
        fetchOrderDetail(false); 
      }
    }, 10000); 
    
    return () => clearInterval(interval);
  }, [id]);

  useEffect(() => {
    if (order?.status === 'DELIVERED' || order?.status === 'CANCELLED') {
    }
  }, [order?.status]);

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
      { status: 'PENDING', label: 'Order Placed', icon: Package, description: 'We have received your order' },
      { status: 'CONFIRMED', label: 'Confirmed', icon: CheckCircle, description: 'Restaurant accepted your order' },
      { status: 'PREPARING', label: 'Preparing', icon: Clock, description: 'Your food is being prepared' },
      { status: 'READY_FOR_PICKUP', label: 'Ready', icon: Package, description: 'Ready for pickup' },
      { status: 'OUT_FOR_DELIVERY', label: 'On the Way', icon: Truck, description: 'Delivery partner is on the way' },
      { status: 'DELIVERED', label: 'Delivered', icon: Home, description: 'Enjoy your meal!' }
    ];
    
    const currentIndex = steps.findIndex(s => s.status === currentStatus);
    return steps.map((step, index) => ({ 
      ...step, 
      completed: index <= currentIndex, 
      active: index === currentIndex 
    }));
  };

  const getLastUpdated = () => {
    if (!order) return '';
    const timestamps = {
      'CONFIRMED': order.confirmedAt,
      'PREPARING': order.preparingAt,
      'READY_FOR_PICKUP': order.readyAt,
      'OUT_FOR_DELIVERY': order.outForDeliveryAt,
      'DELIVERED': order.deliveredAt
    };
    return timestamps[order.status] || order.orderDate;
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <button 
          onClick={() => navigate('/orders')} 
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Back to Orders
        </button>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          
          <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-orange-100 text-sm mb-1">Order #{order.orderNumber || order.id}</p>
                <h1 className="text-2xl font-bold capitalize">
                  {order.status?.replace(/_/g, ' ').toLowerCase()}
                </h1>
                {order.status === 'OUT_FOR_DELIVERY' && (
                  <p className="text-orange-100 text-sm mt-1 flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    Arriving in ~10 mins
                  </p>
                )}
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold">₹{order.totalPrice?.toFixed(0)}</p>
                <p className="text-orange-100 text-sm">{order.orderItems?.length || 0} items</p>
              </div>
            </div>
          </div>

          <div className="p-6 border-b border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg">Order Status</h3>
              <button 
                onClick={() => fetchOrderDetail(false)}
                className="text-sm text-orange-500 flex items-center gap-1 hover:text-orange-600"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>
            
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
              
              <div className="space-y-6">
                {statusSteps.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <div key={step.status} className="relative flex items-start">
                      <div className={`
                        w-8 h-8 rounded-full flex items-center justify-center z-10 shrink-0
                        ${step.completed ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-400'}
                        ${step.active ? 'ring-4 ring-orange-100 animate-pulse' : ''}
                      `}>
                        <Icon className="w-4 h-4" />
                      </div>
                      
                      <div className="ml-4 flex-1">
                        <p className={`font-medium ${step.completed ? 'text-gray-900' : 'text-gray-400'}`}>
                          {step.label}
                        </p>
                        <p className="text-sm text-gray-500">{step.description}</p>
                        {step.active && (
                          <p className="text-xs text-orange-600 mt-1 font-medium">
                            In Progress • Updated {new Date(getLastUpdated()).toLocaleTimeString()}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="p-6 border-b border-gray-100">
            <h3 className="font-bold text-lg mb-4">Delivery Details</h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <MapPin className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <p className="font-medium">Delivery Address</p>
                  <p className="text-gray-500 text-sm">{order.deliveryAddress}</p>
                </div>
              </div>
              
              {order.notes && (
                <div className="flex items-start">
                  <Package className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium">Instructions</p>
                    <p className="text-gray-500 text-sm">{order.notes}</p>
                  </div>
                </div>
              )}

              <div className="flex items-start">
                <IndianRupeeIcon className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <p className="font-medium">Payment</p>
                  <p className="text-gray-500 text-sm">
                    {order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online Payment'}
                    {order.paid && ' • Paid'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            <h3 className="font-bold text-lg mb-4">Order Items</h3>
            <div className="space-y-4">
              {order.orderItems?.map((item, index) => (
                <div key={index} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                      <span className="text-gray-500 font-medium">{item.quantity}x</span>
                    </div>
                    <div>
                      <p className="font-medium">{item.foodItem?.name}</p>
                      <p className="flex items-center text-sm text-gray-500">
                        <IndianRupeeIcon className="w-3 h-3 mr-1" />
                        {Number(item.foodItem?.price || 0).toFixed(0)} each
                      </p>
                    </div>
                  </div>
                  <p className="flex items-center font-bold">
                    <IndianRupeeIcon className="w-3 h-3 mr-0" />
                    {(item.price * item.quantity).toFixed(0)}
                  </p>
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold">Total Paid</span>
                <span className="flex items-center text-2xl font-bold text-orange-600">
                  <IndianRupeeIcon className="w-5 h-5 mr-0" />
                  {Number(order.totalPrice).toFixed(0)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;