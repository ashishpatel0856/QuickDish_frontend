const OtpModal = ({ isOpen, type, value, onChange, onSubmit, onClose }) => {
  if (!isOpen) return null;

  const title = type === 'pickup' ? 'Enter Pickup OTP' : 'Enter Delivery OTP';
  const subtitle = type === 'pickup' 
    ? 'Ask the restaurant for the OTP code' 
    : 'Ask the customer for the OTP code';

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-500 mb-6">{subtitle}</p>
        
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter 4-digit OTP"
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-center text-2xl font-bold tracking-widest focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none mb-6"
          maxLength={4}
        />
        
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold hover:from-orange-600 hover:to-red-600 transition-all"
          >
            Verify
          </button>
        </div>
      </div>
    </div>
  );
};

export default OtpModal;