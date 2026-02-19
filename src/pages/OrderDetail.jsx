import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { orderAPI } from '../services/api';
import { ChevronLeft, MapPin, Phone, Clock, Package, CheckCircle, Circle, Truck, Home } from 'lucide-react';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchOrderDetail(); }, [id]);

  const fetchOrderDetail = async () => {
    try {
      const response = await orderAPI.getById(id);
      setOrder(response.data);
    } catch (error) { console.error('Failed to fetch order:', error); }
    finally { setLoading(false); }
  };

  const getStatusSteps = (currentStatus) => {
    const steps = [
      { status: 'PENDING', label: 'Order Placed', icon: Package },
      { status: 'CONFIRMED', label: 'Confirmed', icon: CheckCircle },
      { status: 'PREPARING', label: 'Preparing', icon: Clock },
      { status: 'READY_FOR_PICKUP', label: 'Ready', icon: Package },
      { status: 'OUT_FOR_DELIVERY', label: 'On the Way', icon: Truck },
      { status: 'DELIVERED', label: 'Delivered', icon: Home }
    ];
    const currentIndex = steps.findIndex(s => s.status === currentStatus);
    return steps.map((step, index) => ({ ...step, completed: index <= currentIndex, active: index === currentIndex }));
  };

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-500"></div></div>;

  if (!order) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><p className="text-gray-500">Order not found</p></div>;

  const statusSteps = getStatusSteps(order.status);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <button onClick={() => navigate('/orders')} className="flex items-center text-gray-600 hover:text-gray-900 mb-6"><ChevronLeft className="w-5 h-5 mr-1" />Back to Orders</button>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="bg-primary-500 text-white p-6">
            <div className="flex justify-between items-start">
              <div><p className="text-primary-100 text-sm mb-1">Order #{order.id}</p><h1 className="text-2xl font-bold">{order.status?.replace(/_/g, ' ')}</h1></div>
              <div className="text-right"><p className="text-3xl font-bold">₹{order.totalPrice}</p><p className="text-primary-100 text-sm">{order.items?.length || 0} items</p></div>
            </div>
          </div>

          <div className="p-6 border-b border-gray-100">
            <h3 className="font-bold text-lg mb-6">Order Status</h3>
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
              <div className="space-y-6">
                {statusSteps.map((step) => (
                  <div key={step.status} className="relative flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${step.completed ? 'bg-primary-500 text-white' : 'bg-gray-200 text-gray-400'}`}><step.icon className="w-4 h-4" /></div>
                    <div className="ml-4"><p className={`font-medium ${step.completed ? 'text-gray-900' : 'text-gray-400'}`}>{step.label}</p>{step.active && <p className="text-sm text-primary-600">In Progress</p>}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-6 border-b border-gray-100">
            <h3 className="font-bold text-lg mb-4">Delivery Details</h3>
            <div className="space-y-3">
              <div className="flex items-start"><MapPin className="w-5 h-5 text-gray-400 mr-3 mt-0.5" /><div><p className="font-medium">Delivery Address</p><p className="text-gray-500 text-sm">{order.deliveryAddress}</p></div></div>
              {order.notes && <div className="flex items-start"><Package className="w-5 h-5 text-gray-400 mr-3 mt-0.5" /><div><p className="font-medium">Instructions</p><p className="text-gray-500 text-sm">{order.notes}</p></div></div>}
            </div>
          </div>

          <div className="p-6">
            <h3 className="font-bold text-lg mb-4">Order Items</h3>
            <div className="space-y-4">
              {order.items?.map((item, index) => (
                <div key={index} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-4"><span className="text-gray-500 font-medium">{item.quantity}x</span></div>
                    <div><p className="font-medium">{item.foodItem?.name}</p><p className="text-sm text-gray-500">₹{item.foodItem?.price} each</p></div>
                  </div>
                  <p className="font-bold">₹{item.price * item.quantity}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex justify-between items-center"><span className="text-lg font-bold">Total</span><span className="text-2xl font-bold text-primary-600">₹{order.totalPrice}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;