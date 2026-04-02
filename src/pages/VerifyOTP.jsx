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

  const BACKGROUND_IMAGE = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1920&q=80';

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
  <div className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">

    {/* Full Screen Background */}
    <div 
      className="fixed inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${BACKGROUND_IMAGE})` }}
    />

    {/* Blur Overlay */}
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />

    {/* Content */}
    <div className="relative z-10 w-full max-w-md p-8 rounded-2xl 
                    bg-white/10 backdrop-blur-xl border border-white/20 
                    shadow-2xl">

      {/* Your existing UI */}
      <div className="text-center mb-8 text-white">
        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="w-8 h-8 text-white" />
        </div>

        <h2 className="text-2xl font-bold">Verify Email</h2>
        <p className="text-gray-200 mt-2">
          Enter OTP sent to {email}
        </p>
      </div>

      {error && (
        <div className="mb-6 p-3 bg-red-500/20 border border-red-400/40 rounded-lg text-red-200 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <input 
          type="number"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="000000"
          className="w-full px-4 py-3 rounded-xl bg-white/20 text-white text-center text-2xl tracking-widest border border-white/30 focus:ring-2 focus:ring-orange-400"
        />

        <button 
          type="submit"
          disabled={loading || otp.length < 4}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              Verifying...
            </span>
          ) : "Verify OTP"}
        </button>
      </form>

      <div className="mt-6 text-center">
        <button 
          onClick={() => navigate('/signup')}
          className="text-orange-300 hover:text-orange-200"
        >
          Back to Signup
        </button>
      </div>
    </div>
  </div>
);
};

export default VerifyOTP;