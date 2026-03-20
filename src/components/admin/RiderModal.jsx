import { X } from 'lucide-react';

const RiderModal = ({ rider, isOpen, onClose }) => {
  if (!isOpen || !rider) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-auto">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900">Rider Details</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-400 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {rider.user?.name?.charAt(0) || 'R'}
            </div>
            <div>
              <h4 className="text-lg font-bold text-gray-900">{rider.user?.name}</h4>
              <p className="text-gray-500">{rider.user?.email}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-500 mb-1">Phone</p>
              <p className="font-semibold text-gray-900">{rider.user?.phone}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-500 mb-1">Status</p>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                rider.isVerifiedRider ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
              }`}>
                {rider.isVerifiedRider ? 'Approved' : 'Pending'}
              </span>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-500 mb-1">Vehicle Type</p>
              <p className="font-semibold text-gray-900 capitalize">{rider.vehicleType?.toLowerCase()}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-500 mb-1">Vehicle Number</p>
              <p className="font-semibold text-gray-900 font-mono">{rider.vehicleNumber}</p>
            </div>
          </div>
          <div className="p-4 bg-blue-50 rounded-xl">
            <p className="text-sm text-gray-500 mb-1">License Number</p>
            <p className="font-semibold text-gray-900 font-mono">{rider.licenseNumber}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiderModal;