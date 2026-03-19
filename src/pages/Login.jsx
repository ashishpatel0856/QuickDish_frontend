import { useState, useEffect } from 'react';  
import { Link, useNavigate, useLocation } from 'react-router-dom';  
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();  
  const { login, isAuthenticated, user } = useAuth();  
  const [formData, setFormData] = useState({ 
    email: '', 
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated && user) {
      handleRoleBasedRedirect(user);
    }
  }, [isAuthenticated, user]);

  // 🆕 Role-based redirect function
  const handleRoleBasedRedirect = (userData) => {
    const userRoles = userData?.roles || [];
    
    const isRider = userRoles.includes('ROLE_RIDER');
    const isOwner = userRoles.includes('ROLE_RESTAURANT_OWNER');
    const isAdmin = userRoles.includes('ROLE_ADMIN');


    if (isAdmin) {
      navigate('/admin/dashboard', { replace: true });
    } else if (isOwner) {
      navigate('/owner/dashboard', { replace: true });
    } else if (isRider) {
      const isVerified = userData?.isRiderVerified || false;
      if (!isVerified) {
        alert('Your rider account is pending admin approval.');
        navigate('/rider/pending-approval', { replace: true });
      } else {
        navigate('/rider/dashboard', { replace: true });
      }
    } else {
      navigate('/', { replace: true });
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
      
      
      if (result.success && result.user) {
        console.log(' Login successful, waiting for state update...');
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 w-full max-w-md">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Welcome Back!</h2>
          <p className="text-gray-500 mt-2 text-sm sm:text-base">Sign in to your account</p>
        </div>

        {error && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                required
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-sm"
                placeholder="Enter your email" 
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type={showPassword ? 'text' : 'password'} 
                name="password" 
                value={formData.password} 
                onChange={handleChange} 
                required
                className="w-full pl-12 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-sm"
                placeholder="Enter your password" 
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)} 
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input 
                type="checkbox" 
                className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500" 
              />
              <span className="ml-2 text-sm text-gray-600">Remember me</span>
            </label>
            <Link to="/forgot-password" className="text-sm text-orange-600 hover:text-orange-700 font-medium">
              Forgot Password?
            </Link>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 focus:ring-4 focus:ring-orange-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-lg shadow-orange-500/30"
          >
            {loading ? (
              <><Loader2 className="w-5 h-5 animate-spin" /><span>Signing in...</span></>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        <div className="mt-6 sm:mt-8 text-center">
          <p className="text-gray-600 text-sm">
            Don't have an account?{' '}
            <Link to="/signup" className="text-orange-600 font-semibold hover:text-orange-700">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;