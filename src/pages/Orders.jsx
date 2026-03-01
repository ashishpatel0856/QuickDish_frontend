import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderAPI } from '../services/api';
import { Package, Clock, CheckCircle, ChevronRight, RefreshCw ,IndianRupeeIcon} from 'lucide-react';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    try {
      const response = await orderAPI.getAll();
      setOrders(response.data || []);
    } catch (error) { console.error('Failed to fetch orders:', error); }
    finally { setLoading(false); }
  };

  const getStatusColor = (status) => {
    const colors = {
      'PENDING': 'bg-yellow-100 text-yellow-800', 'CONFIRMED': 'bg-blue-100 text-blue-800',
      'PREPARING': 'bg-orange-100 text-orange-800', 'READY_FOR_PICKUP': 'bg-purple-100 text-purple-800',
      'OUT_FOR_DELIVERY': 'bg-indigo-100 text-indigo-800', 'DELIVERED': 'bg-green-100 text-green-800',
      'CANCELLED': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    if (status === 'DELIVERED') return <CheckCircle className="w-5 h-5" />;
    if (status === 'PENDING') return <Clock className="w-5 h-5" />;
    return <RefreshCw className="w-5 h-5" />;
  };

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-500"></div></div>;

  if (orders.length === 0) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">No orders yet</h2>
        <p className="text-gray-500 mb-6">Start ordering your favorite food!</p>
        <Link to="/restaurants" className="px-8 py-3 bg-primary-500 text-white rounded-full font-semibold hover:bg-primary-600">Browse Restaurants</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>
        <div className="space-y-4">
          {orders.map((order) => (
            <Link key={order.id} to={`/orders/${order.id}`} className="block bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-bold text-lg text-gray-900">Order #{order.id}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(order.status)}`}>{getStatusIcon(order.status)}{order.status?.replace(/_/g, ' ')}</span>
                  </div>
                  <p className="text-gray-500 text-sm mb-3">{new Date(order.createdAt).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>{order.items?.length || 0} items</span>
                    <span>•</span>
                    <span className="flex items-center font-medium">
                        <IndianRupeeIcon className="w-3 h-3 mr-0" />
                        {Number(order.totalPrice).toFixed(2)}
                  </span>
                  </div>
                </div>
                <ChevronRight className="w-6 h-6 text-gray-400" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Orders;
