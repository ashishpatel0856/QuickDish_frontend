import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');
  const result = await login(formData);
  if (result.success) {
    const userRoles = result.user?.roles || [];  
    
    console.log(' User roles:', userRoles);
        const isOwner = userRoles.includes('ROLE_RESTAURANT_OWNER');
    
    if (isOwner) {
      console.log('🏪 Owner detected, going to /owner');
      navigate('/owner');
    } else {
      console.log('👤 Customer detected, going to /');
      navigate('/');
    }
  } else {
    setError(result.error);
  }
  
  setLoading(false);
};

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 w-full">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Welcome Back!</h2>
        <p className="text-gray-500 mt-2">Sign in to continue your food journey</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="email" name="email" value={formData.email} onChange={handleChange} required
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              placeholder="Enter your email" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} required
              className="w-full pl-12 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              placeholder="Enter your password" />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input type="checkbox" className="w-4 h-4 text-primary-500 border-gray-300 rounded focus:ring-primary-500" />
            <span className="ml-2 text-sm text-gray-600">Remember me</span>
          </label>
          <Link to="/forgot-password" className="text-sm text-primary-600 hover:text-primary-700 font-medium">Forgot Password?</Link>
        </div>

        <button type="submit" disabled={loading}
          className="w-full py-3.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-semibold hover:from-primary-600 hover:to-primary-700 focus:ring-4 focus:ring-primary-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 btn-shine">
          {loading ? (<><Loader2 className="w-5 h-5 animate-spin" /><span>Signing in...</span></>) : (<span>Sign In</span>)}
        </button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-gray-600">Don't have an account?{' '}<Link to="/signup" className="text-primary-600 font-semibold hover:text-primary-700">Sign Up</Link></p>
      </div>

      <div className="mt-8">
        <div className="relative">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
          <div className="relative flex justify-center text-sm"><span className="px-4 bg-white text-gray-500">Or continue with</span></div>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-4">
          <button className="flex items-center justify-center px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5 mr-2" />
            <span className="text-sm font-medium text-gray-700">Google</span>
          </button>
          <button className="flex items-center justify-center px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
            <img src="https://www.svgrepo.com/show/448234/facebook.svg" alt="Facebook" className="w-5 h-5 mr-2" />
            <span className="text-sm font-medium text-gray-700">Facebook</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;