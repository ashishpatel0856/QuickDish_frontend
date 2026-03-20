import { X } from 'lucide-react';

const OwnerModal = ({ owner, isOpen, onClose }) => {
  if (!isOpen || !owner) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-auto">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900">Restaurant Owner Details</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {owner.name?.charAt(0) || 'O'}
            </div>
            <div>
              <h4 className="text-lg font-bold text-gray-900">{owner.name}</h4>
              <p className="text-gray-500">{owner.email}</p>
            </div>
          </div>
          
          {owner.ownerDocuments && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-500 mb-1">GST Number</p>
                  <p className="font-semibold text-gray-900 font-mono">{owner.ownerDocuments.gstNumber}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-500 mb-1">PAN Number</p>
                  <p className="font-semibold text-gray-900 font-mono">{owner.ownerDocuments.panNumber}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-500 mb-1">FSSAI License</p>
                  <p className="font-semibold text-gray-900 font-mono">{owner.ownerDocuments.fssaiLicense}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-500 mb-1">Account Holder</p>
                  <p className="font-semibold text-gray-900">{owner.ownerDocuments.accountHolderName}</p>
                </div>
              </div>
              
              <div className="p-4 bg-green-50 rounded-xl">
                <p className="text-sm text-gray-500 mb-1">Bank Details</p>
                <p className="font-semibold text-gray-900">{owner.ownerDocuments.bankName}</p>
                <p className="text-sm text-gray-600 font-mono">A/C: {owner.ownerDocuments.bankAccountNumber}</p>
                <p className="text-sm text-gray-600 font-mono">IFSC: {owner.ownerDocuments.ifscCode}</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default OwnerModal;