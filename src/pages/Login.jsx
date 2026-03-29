import { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';

const BACKGROUND_IMAGE = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1920&q=80';

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, user } = useAuth();
  
  // Refs for inputs to clear them forcefully
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Force clear inputs function
  const clearForm = useCallback(() => {
    setFormData({ email: '', password: '' });
    setShowPassword(false);
    setError('');
    
    // Force clear input elements
    if (emailRef.current) emailRef.current.value = '';
    if (passwordRef.current) passwordRef.current.value = '';
  }, []);

  // Clear on mount (page refresh)
  useEffect(() => {
    clearForm();
  }, [clearForm]);

  // Handle redirect after login
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
    <div className="fixed inset-0 w-full h-full overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat bg-fixed"
        style={{ backgroundImage: `url(${BACKGROUND_IMAGE})` }}
      />
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70 backdrop-blur-sm" />

      {/* Content */}
      <div className="relative z-10 w-full h-full overflow-y-auto flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md">
          
          {/* Logo + QuickDish in one row */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20 shadow-2xl">
              <img 
                src="/QD.png" 
                alt="QuickDish" 
                className="h-10 w-auto object-contain"
              />
            </div>
            <h1 className="text-3xl font-bold text-white">QuickDish</h1>
          </div>
          
          <p className="text-center text-white/80 mb-6">Delicious food delivered to your doorstep</p>

          {/* Login Card */}
          <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Welcome Back!</h2>
              <p className="text-gray-500 mt-2 text-sm sm:text-base">Sign in to your account</p>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center text-xs font-bold">!</span>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    ref={emailRef}
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    autoComplete="new-password"
                    className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-sm bg-gray-50 focus:bg-white disabled:opacity-50"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    ref={passwordRef}
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    autoComplete="new-password"
                    className="w-full pl-12 pr-12 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-sm bg-gray-50 focus:bg-white disabled:opacity-50"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Remember & Forgot */}
              <div className="flex items-center justify-between">
                <label className="flex items-center cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500" />
                  <span className="ml-2 text-sm text-gray-600">Remember me</span>
                </label>
                <Link to="/forgot-password" className="text-sm text-orange-600 hover:text-orange-700 font-medium">
                  Forgot Password?
                </Link>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 focus:ring-4 focus:ring-orange-500/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg"
              >
                {loading ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /><span>Signing in...</span></>
                ) : (
                  <span>Sign In</span>
                )}
              </button>
            </form>

            {/* Sign Up */}
            <div className="mt-6 text-center">
              <p className="text-gray-600 text-sm">
                Don't have an account?{' '}
                <Link to="/signup" className="text-orange-600 font-semibold hover:text-orange-700">
                  Sign Up
                </Link>
              </p>
            </div>
          </div>

          <p className="text-center text-white/60 text-sm mt-6">© 2024 QuickDish</p>
        </div>
      </div>
    </div>
  );
};

export default Login;