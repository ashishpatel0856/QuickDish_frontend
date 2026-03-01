import { useNavigate, useSearchParams } from 'react-router-dom';
import { XCircle, RefreshCcw } from 'lucide-react';

const PaymentFailed = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8 max-w-md">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <XCircle className="w-10 h-10 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold mb-2 text-red-700">Payment Failed</h1>
        <p className="text-gray-500 mb-6">
          Your payment could not be processed. Don't worry, your order is saved and you can retry payment.
        </p>
        
        <div className="space-y-3">
          <button 
            onClick={() => navigate(`/orders/${orderId}`)} 
            className="w-full py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 flex items-center justify-center gap-2"
          >
            <RefreshCcw className="w-4 h-4" />
            Retry Payment
          </button>
          <button 
            onClick={() => navigate('/orders')} 
            className="w-full py-3 border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50"
          >
            View Orders
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailed;