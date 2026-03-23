import { Package, Clock, MapPin, ArrowRight } from 'lucide-react';

const AvailableOrders = ({ orders, onAccept }) => {
  if (orders.length === 0) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Available Orders</h3>
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No orders available</h3>
          <p className="text-gray-500">Stay online to receive delivery requests</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Available Orders</h3>
      {orders.map((order) => (
        <div key={order.orderId} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-1 rounded-full">
                  ₹{order.deliveryFee}
                </span>
                <span className="text-gray-500 text-sm">{order.distance} km</span>
                <span className="text-gray-500 text-sm flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {order.estimatedTime} min
                </span>
              </div>
              <h4 className="font-bold text-gray-900 mb-1">{order.restaurantName}</h4>
              <p className="text-sm text-gray-500 mb-3">{order.restaurantAddress}</p>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span>Deliver to: {order.deliveryAddress}</span>
              </div>
            </div>
            <button
              onClick={() => onAccept(order.orderId)}
              className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl font-bold hover:from-orange-600 hover:to-red-600 transition-all shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2"
            >
              Accept
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AvailableOrders;