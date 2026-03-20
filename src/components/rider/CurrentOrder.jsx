import { Navigation, CheckCircle, MapPin, Phone } from 'lucide-react';

const CurrentOrder = ({ order, onPickup, onDeliver }) => {
  return (
    <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 text-white mb-8 shadow-lg shadow-orange-500/30">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <Navigation className="w-5 h-5" />
          Current Delivery
        </h3>
        <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
          {order.status}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
          <p className="text-white/70 text-sm mb-1">Pickup From</p>
          <p className="font-semibold">{order.restaurantName}</p>
          <p className="text-sm text-white/80">{order.restaurantAddress}</p>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
          <p className="text-white/70 text-sm mb-1">Deliver To</p>
          <p className="font-semibold">{order.customerName}</p>
          <p className="text-sm text-white/80">{order.deliveryAddress}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        {order.status === 'ASSIGNED' && (
          <button
            onClick={onPickup}
            className="flex-1 sm:flex-none bg-white text-orange-600 px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-5 h-5" />
            Pickup Order
          </button>
        )}
        {order.status === 'PICKED_UP' && (
          <button
            onClick={onDeliver}
            className="flex-1 sm:flex-none bg-white text-orange-600 px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
          >
            <MapPin className="w-5 h-5" />
            Deliver Order
          </button>
        )}
        <a 
          href={`tel:${order.customerPhone}`}
          className="flex-1 sm:flex-none bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl font-bold hover:bg-white/30 transition-colors flex items-center justify-center gap-2"
        >
          <Phone className="w-5 h-5" />
          Call Customer
        </a>
      </div>
    </div>
  );
};

export default CurrentOrder;