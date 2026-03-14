import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, Eye, EyeOff, Phone, Store, Bike, ShieldCheck, Loader2 } from 'lucide-react';

const Signup = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    phone: '',
    role: 'ROLE_CUSTOMER',
    // Rider specific fields
    vehicleType: '',
    licenseNumber: '',
    vehicleNumber: ''
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
    
    // Validation for rider
    if (formData.role === 'ROLE_RIDER') {
      if (!formData.vehicleType || !formData.licenseNumber || !formData.vehicleNumber) {
        setError('Please fill all rider details');
        setLoading(false);
        return;
      }
    }
    
    const result = await signup(formData);
    
    if (result.success) {
      alert(result.message || 'OTP sent! Please verify your email.');
      navigate('/verify-otp', { state: { email: formData.email, role: formData.role } });
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  const isRider = formData.role === 'ROLE_RIDER';
  const isRestaurantOwner = formData.role === 'ROLE_RESTAURANT_OWNER';

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 w-full max-w-md lg:max-w-lg">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Create Account</h2>
          <p className="text-gray-500 mt-2 text-sm sm:text-base">Join QuickDish family</p>
        </div>

        {error && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          
          {/* Role Selection - 2x2 Grid on mobile, 4 columns on desktop */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">I want to join as</label>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {/* Customer */}
              <label className={`cursor-pointer border-2 rounded-xl p-3 sm:p-4 flex flex-col items-center transition-all ${
                formData.role === 'ROLE_CUSTOMER' 
                  ? 'border-orange-500 bg-orange-50' 
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
                <User className={`w-6 h-6 sm:w-8 sm:h-8 mb-2 ${formData.role === 'ROLE_CUSTOMER' ? 'text-orange-500' : 'text-gray-400'}`} />
                <span className="font-medium text-xs sm:text-sm">Customer</span>
                <span className="text-[10px] sm:text-xs text-gray-500 text-center">Order food</span>
              </label>

              {/* Restaurant Owner */}
              <label className={`cursor-pointer border-2 rounded-xl p-3 sm:p-4 flex flex-col items-center transition-all ${
                formData.role === 'ROLE_RESTAURANT_OWNER' 
                  ? 'border-orange-500 bg-orange-50' 
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
                <Store className={`w-6 h-6 sm:w-8 sm:h-8 mb-2 ${formData.role === 'ROLE_RESTAURANT_OWNER' ? 'text-orange-500' : 'text-gray-400'}`} />
                <span className="font-medium text-xs sm:text-sm">Owner</span>
                <span className="text-[10px] sm:text-xs text-gray-500 text-center">Sell food</span>
              </label>

              {/* Rider - NEW */}
              <label className={`cursor-pointer border-2 rounded-xl p-3 sm:p-4 flex flex-col items-center transition-all ${
                formData.role === 'ROLE_RIDER' 
                  ? 'border-orange-500 bg-orange-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}>
                <input 
                  type="radio" 
                  name="role" 
                  value="ROLE_RIDER"
                  checked={formData.role === 'ROLE_RIDER'}
                  onChange={handleChange}
                  className="hidden"
                />
                <Bike className={`w-6 h-6 sm:w-8 sm:h-8 mb-2 ${formData.role === 'ROLE_RIDER' ? 'text-orange-500' : 'text-gray-400'}`} />
                <span className="font-medium text-xs sm:text-sm">Rider</span>
                <span className="text-[10px] sm:text-xs text-gray-500 text-center">Deliver</span>
              </label>

              {/* Admin - NEW */}
              <label className={`cursor-pointer border-2 rounded-xl p-3 sm:p-4 flex flex-col items-center transition-all ${
                formData.role === 'ROLE_ADMIN' 
                  ? 'border-orange-500 bg-orange-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}>
                <input 
                  type="radio" 
                  name="role" 
                  value="ROLE_ADMIN"
                  checked={formData.role === 'ROLE_ADMIN'}
                  onChange={handleChange}
                  className="hidden"
                />
                <ShieldCheck className={`w-6 h-6 sm:w-8 sm:h-8 mb-2 ${formData.role === 'ROLE_ADMIN' ? 'text-orange-500' : 'text-gray-400'}`} />
                <span className="font-medium text-xs sm:text-sm">Admin</span>
                <span className="text-[10px] sm:text-xs text-gray-500 text-center">Manage</span>
              </label>
            </div>
          </div>

          {/* Common Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  required
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                  placeholder="Full name" 
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="tel" 
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleChange} 
                  required
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                  placeholder="Phone number" 
                />
              </div>
            </div>
          </div>

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
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
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
                minLength={6}
                className="w-full pl-12 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                placeholder="Create password" 
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

          {/* Rider Specific Fields - Conditional */}
          {isRider && (
            <div className="space-y-4 p-4 bg-blue-50 rounded-xl border border-blue-100 animate-fade-in">
              <h3 className="font-semibold text-blue-800 flex items-center gap-2">
                <Bike className="w-5 h-5" />
                Rider Details
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Type</label>
                  <select
                    name="vehicleType"
                    value={formData.vehicleType}
                    onChange={handleChange}
                    required={isRider}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 text-sm bg-white"
                  >
                    <option value="">Select Vehicle</option>
                    <option value="BIKE">Bike</option>
                    <option value="SCOOTER">Scooter</option>
                    <option value="CYCLE">Cycle</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Number</label>
                  <input 
                    type="text" 
                    name="vehicleNumber" 
                    value={formData.vehicleNumber} 
                    onChange={handleChange} 
                    required={isRider}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 text-sm"
                    placeholder="e.g., DL01AB1234" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">License Number</label>
                <input 
                  type="text" 
                  name="licenseNumber" 
                  value={formData.licenseNumber} 
                  onChange={handleChange} 
                  required={isRider}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 text-sm"
                  placeholder="e.g., DL123456789" 
                />
              </div>
            </div>
          )}

          {/* Admin Note */}
          {formData.role === 'ROLE_ADMIN' && (
            <div className="p-4 bg-purple-50 rounded-xl border border-purple-100">
              <p className="text-sm text-purple-800 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5" />
                Admin accounts require special verification.
              </p>
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 disabled:opacity-50 flex items-center justify-center transition-all shadow-lg shadow-orange-500/30"
          >
            {loading ? (
              <><Loader2 className="w-5 h-5 animate-spin mr-2" /><span>Creating...</span></>
            ) : (
              <span>Create Account</span>
            )}
          </button>
        </form>

        <div className="mt-6 sm:mt-8 text-center">
          <p className="text-gray-600 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-orange-600 font-semibold hover:text-orange-700">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;