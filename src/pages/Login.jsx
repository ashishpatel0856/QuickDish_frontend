import { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';

const BACKGROUND_IMAGE = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1920&q=80';

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, user } = useAuth();
  
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const clearForm = useCallback(() => {
    setFormData({ email: '', password: '' });
    setShowPassword(false);
    setError('');
    
    if (emailRef.current) emailRef.current.value = '';
    if (passwordRef.current) passwordRef.current.value = '';
  }, []);

  useEffect(() => {
    clearForm();
  }, [clearForm]);

  useEffect(() => {
    if (isAuthenticated && user) {
      const userRoles = user?.roles || [];
      const isRider = userRoles.includes('ROLE_RIDER');
      const isOwner = userRoles.includes('ROLE_RESTAURANT_OWNER');
      const isAdmin = userRoles.includes('ROLE_ADMIN');

      if (isAdmin) {
        navigate('/admin/dashboard', { replace: true });
      } else if (isOwner) {
        navigate('/owner/dashboard', { replace: true });
      } else if (isRider) {
        const isVerified = user?.isRiderVerified || false;
        if (!isVerified) {
          alert('Your rider account is pending admin approval.');
          navigate('/rider/pending-approval', { replace: true });
        } else {
          navigate('/rider/dashboard', { replace: true });
        }
      } else {
        navigate('/', { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await login({
        email: formData.email,
        password: formData.password
      });

      if (result.success) {
        clearForm();
      } else {
        setError(result.error || 'Login failed. Please try again.');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
      
      {/* Full Screen Background */}
      <div 
        className="fixed inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${BACKGROUND_IMAGE})` }}
      />

      {/* Blur Overlay */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-md p-6 sm:p-8 rounded-2xl 
                      bg-white/10 backdrop-blur-xl border border-white/20 
                      shadow-2xl mx-4">

        {/* Logo and QuickDish */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center border border-white/30">
            <img 
              src="/QD.png" 
              alt="QuickDish" 
              className="h-8 w-auto object-contain"
            />
          </div>
          <h1 className="text-2xl font-bold text-white">QuickDish</h1>
        </div>
        
        <p className="text-center text-white/70 mb-6 text-sm">Delicious food delivered to your doorstep</p>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-400/40 rounded-xl text-red-200 text-sm flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-red-400/30 flex items-center justify-center text-xs font-bold">!</span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60 pointer-events-none" />
              <input
                ref={emailRef}
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
                autoComplete="new-password"
                className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/20 text-white placeholder-white/50 border border-white/30 focus:ring-2 focus:ring-orange-400 outline-none transition-all text-sm backdrop-blur-sm disabled:opacity-50"
                placeholder="Enter your email"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60 pointer-events-none" />
              <input
                ref={passwordRef}
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={loading}
                autoComplete="new-password"
                className="w-full pl-12 pr-12 py-3.5 rounded-xl bg-white/20 text-white placeholder-white/50 border border-white/30 focus:ring-2 focus:ring-orange-400 outline-none transition-all text-sm backdrop-blur-sm disabled:opacity-50"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Remember & Forgot */}
          <div className="flex items-center justify-between">
            <label className="flex items-center cursor-pointer">
              <input type="checkbox" className="w-4 h-4 text-orange-500 border-white/30 rounded bg-white/20 focus:ring-orange-400 focus:ring-offset-0" />
              <span className="ml-2 text-sm text-white/80">Remember me</span>
            </label>
            <Link to="/forgot-password" className="text-sm text-orange-400 hover:text-orange-300 font-medium">
              Forgot Password?
            </Link>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold hover:from-orange-600 hover:to-orange-700 focus:ring-4 focus:ring-orange-500/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-orange-500/30"
          >
            {loading ? (
              <><Loader2 className="w-5 h-5 animate-spin" /><span>Signing in...</span></>
            ) : (
              <span>Login</span>
            )}
          </button>
        </form>

        {/* Sign Up */}
        <div className="mt-6 text-center">
          <p className="text-white/80 text-sm">
            Don't have an account?{' '}
            <Link to="/signup" className="text-orange-400 font-semibold hover:text-orange-300">
              Sign Up
            </Link>
          </p>
        </div>

        <p className="text-center text-white/50 text-xs mt-6">@2026 QuickDish</p>
      </div>
    </div>
  );
};

export default Login;