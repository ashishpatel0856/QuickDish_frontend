import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { orderAPI } from '../services/api';
import { CheckCircle, Loader2, Clock } from 'lucide-react';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying');  // status of payment
  const orderId = searchParams.get('orderId');

  useEffect(() => {
    if (!orderId) {
      navigate('/orders');
      return;
    }
    verifyPayment();
  }, [orderId]);

  const verifyPayment = async () => {
    try {
      let attempts = 0;
      const checkInterval = setInterval(async () => {
        try {
          const response = await orderAPI.verifyPayment(orderId);
          const order = response.data;
          
          if (order.paid === true || order.paymentStatus === 'PAID') {
            clearInterval(checkInterval);
            setStatus('success');
            setTimeout(() => navigate(`/orders/${orderId}`), 2000);
          }
          
          attempts++;
          if (attempts > 15) { 
            clearInterval(checkInterval);
            setStatus('failed');
          }
        } catch (err) {
          console.error('Verification error:', err);
        }
      }, 2000);
    } catch (error) {
      console.error(error);
      setStatus('failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8">
        {status === 'verifying' && (
          <>
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-10 h-10 text-blue-500" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Verifying Payment...</h1>
            <p className="text-gray-500">Please wait while we confirm your payment</p>
            <Loader2 className="w-6 h-6 animate-spin mx-auto mt-4 text-blue-500" />
          </>
        )}
        
        {status === 'success' && (
          <>
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h1 className="text-2xl font-bold mb-2 text-green-700">Payment Successful!</h1>
            <p className="text-gray-500">Your order has been confirmed</p>
            <p className="text-sm text-gray-400 mt-2">Redirecting to your order...</p>
          </>
        )}
        
        {status === 'failed' && (
          <>
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">❌</span>
            </div>
            <h1 className="text-2xl font-bold mb-2 text-red-700">Verification Failed</h1>
            <p className="text-gray-500 mb-4">We couldn't verify your payment</p>
            <button 
              onClick={() => navigate('/orders')} 
              className="px-6 py-2 bg-orange-500 text-white rounded-lg"
            >
              View My Orders
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;