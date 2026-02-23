import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, Eye, EyeOff, Phone, Store, Loader2 } from 'lucide-react';

const Signup = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    phone: '',
    role: 'ROLE_CUSTOMER' 
  });
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
    
    const result = await signup(formData);
    
    if (result.success) {
      alert('OTP sent! Please verify your email.');
      navigate('/verify-otp', { state: { email: formData.email } });
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 w-full">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
        <p className="text-gray-500 mt-2">Join QuickDish family</p>
      </div>

      {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-5">
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">I want to join as</label>
          <div className="grid grid-cols-2 gap-4">
            <label className={`cursor-pointer border-2 rounded-xl p-4 flex flex-col items-center transition-all ${
              formData.role === 'ROLE_CUSTOMER' 
                ? 'border-primary-500 bg-primary-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}>
              <input 
                type="radio" 
                name="role" 
                value="ROLE_CUSTOMER"
                checked={formData.role === 'ROLE_CUSTOMER'}
                onChange={handleChange}
                className="hidden"
              />
              <User className={`w-8 h-8 mb-2 ${formData.role === 'ROLE_CUSTOMER' ? 'text-primary-500' : 'text-gray-400'}`} />
              <span className="font-medium">Customer</span>
              <span className="text-xs text-gray-500">Order delicious food</span>
            </label>

            <label className={`cursor-pointer border-2 rounded-xl p-4 flex flex-col items-center transition-all ${
              formData.role === 'ROLE_RESTAURANT_OWNER' 
                ? 'border-primary-500 bg-primary-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}>
              <input 
                type="radio" 
                name="role" 
                value="ROLE_RESTAURANT_OWNER"
                checked={formData.role === 'ROLE_RESTAURANT_OWNER'}
                onChange={handleChange}
                className="hidden"
              />
              <Store className={`w-8 h-8 mb-2 ${formData.role === 'ROLE_RESTAURANT_OWNER' ? 'text-primary-500' : 'text-gray-400'}`} />
              <span className="font-medium">Restaurant Owner</span>
              <span className="text-xs text-gray-500">Sell your food</span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" name="name" value={formData.name} onChange={handleChange} required
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500"
              placeholder="Enter your full name" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="email" name="email" value={formData.email} onChange={handleChange} required
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500"
              placeholder="Enter your email" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500"
              placeholder="Enter your phone number" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} required minLength={6}
              className="w-full pl-12 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500"
              placeholder="Create a password" />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <button type="submit" disabled={loading}
          className="w-full py-3.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-semibold hover:from-primary-600 hover:to-primary-700 disabled:opacity-50 flex items-center justify-center">
          {loading ? <><Loader2 className="w-5 h-5 animate-spin mr-2" /><span>Creating...</span></> : <span>Create Account</span>}
        </button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-gray-600">Already have an account? <Link to="/login" className="text-primary-600 font-semibold">Sign In</Link></p>
      </div>
    </div>
  );
};

export default Signup;