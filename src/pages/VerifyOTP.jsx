import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2, Mail } from 'lucide-react';

const VerifyOTP = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { verifyOTP } = useAuth();
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const email = location.state?.email;

  // Agar email nahi hai toh login pe bhejo
  if (!email) {
    navigate('/login');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await verifyOTP({ email, otp: parseInt(otp) });

    if (result.success) {
      alert('Email verified! Please login.');
      navigate('/login');
    } else {
      setError(result.error || 'Invalid OTP');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-orange-50 to-secondary-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-primary-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Verify Email</h2>
          <p className="text-gray-500 mt-2">Enter OTP sent to {email}</p>
        </div>

        {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">OTP Code</label>
            <input 
              type="number" 
              value={otp} 
              onChange={(e) => setOtp(e.target.value)} 
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 text-center text-2xl tracking-widest"
              placeholder="000000"
              maxLength={6}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading || otp.length < 4}
            className="w-full py-3.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-semibold hover:from-primary-600 hover:to-primary-700 disabled:opacity-50 flex items-center justify-center"
          >
            {loading ? <><Loader2 className="w-5 h-5 animate-spin mr-2" /><span>Verifying...</span></> : <span>Verify OTP</span>}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            onClick={() => navigate('/signup')} 
            className="text-sm text-primary-600 hover:text-primary-700"
          >
            ← Back to Signup
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;