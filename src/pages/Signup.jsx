import { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  User, Mail, Lock, Eye, EyeOff, Phone, Store, 
  Bike, CheckCircle2, Loader2, ChevronRight, ChevronLeft,
  ShieldCheck, FileText, CreditCard
} from 'lucide-react';

const BACKGROUND_IMAGE = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1920&q=80';

const Signup = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form state - properly initialized
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'ROLE_CUSTOMER',
    vehicleType: '',
    licenseNumber: '',
    vehicleNumber: '',
    gstNumber: '',
    panNumber: '',
    fssaiLicense: '',
    businessRegistrationNumber: '',
    bankAccountNumber: '',
    ifscCode: '',
    accountHolderName: '',
    bankName: ''
  });

  // Clear form on mount
  useEffect(() => {
    setFormData({
      name: '',
      email: '',
      password: '',
      phone: '',
      role: 'ROLE_CUSTOMER',
      vehicleType: '',
      licenseNumber: '',
      vehicleNumber: '',
      gstNumber: '',
      panNumber: '',
      fssaiLicense: '',
      businessRegistrationNumber: '',
      bankAccountNumber: '',
      ifscCode: '',
      accountHolderName: '',
      bankName: ''
    });
  }, []);

  // FIXED: Proper handleChange without event pooling issues
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  }, []);

  const validateStep1 = () => {
    if (!formData.name || !formData.email || !formData.password || !formData.phone) {
      setError('Please fill all required fields');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (formData.role === 'ROLE_RIDER') {
      if (!formData.vehicleType || !formData.licenseNumber || !formData.vehicleNumber) {
        setError('Please fill all rider details');
        return false;
      }
    }
    if (formData.role === 'ROLE_RESTAURANT_OWNER') {
      if (!formData.gstNumber || !formData.panNumber || !formData.fssaiLicense) {
        setError('GST, PAN and FSSAI are required');
        return false;
      }
      if (!formData.bankAccountNumber || !formData.ifscCode || !formData.accountHolderName) {
        setError('Bank details are required');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStep2()) {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      let submitData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        role: formData.role
      };

      if (formData.role === 'ROLE_RIDER') {
        submitData = {
          ...submitData,
          vehicleType: formData.vehicleType,
          licenseNumber: formData.licenseNumber,
          vehicleNumber: formData.vehicleNumber
        };
      }

      if (formData.role === 'ROLE_RESTAURANT_OWNER') {
        submitData = {
          ...submitData,
          gstNumber: formData.gstNumber,
          panNumber: formData.panNumber,
          fssaiLicense: formData.fssaiLicense,
          businessRegistrationNumber: formData.businessRegistrationNumber || '',
          bankAccountNumber: formData.bankAccountNumber,
          ifscCode: formData.ifscCode,
          accountHolderName: formData.accountHolderName,
          bankName: formData.bankName || ''
        };
      }

      const result = await signup(submitData);

      if (result.success) {
        navigate('/verify-otp', { 
          state: { 
            email: formData.email, 
            role: formData.role,
            message: result.message 
          } 
        });
      } else {
        setError(result.error || 'Signup failed. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isCustomer = formData.role === 'ROLE_CUSTOMER';
  const isRider = formData.role === 'ROLE_RIDER';
  const isOwner = formData.role === 'ROLE_RESTAURANT_OWNER';
  const progress = currentStep === 1 ? 50 : 100;

  //  Direct input rendering without complex wrapper
  const renderInput = (name, type = 'text', placeholder, required = false, Icon = null) => (
    <div className="relative">
      {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />}
      <input
        type={type}
        name={name}
        id={name}
        value={formData[name]}
        onChange={handleChange}
        required={required}
        autoComplete="off"
        className={`w-full ${Icon ? 'pl-12' : 'px-4'} pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all text-sm bg-gray-50 focus:bg-white`}
        placeholder={placeholder}
      />
    </div>
  );

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
      <div className="relative z-10 w-full max-w-lg p-6 sm:p-8 rounded-2xl 
                      bg-white/10 backdrop-blur-xl border border-white/20 
                      shadow-2xl mx-4 max-h-[90vh] overflow-y-auto">

        {/* Logo + QuickDish */}
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
        
        <p className="text-center text-white/70 mb-6 text-sm">Join India's fastest growing food delivery platform</p>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm font-medium text-white/90 mb-2">
            <span>Step {currentStep} of 2</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-orange-400 to-orange-600 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-400/40 rounded-xl text-red-200 text-sm flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 flex-shrink-0" />
            {error}
          </div>
        )}

        {/* Step 1: Basic Info */}
        {currentStep === 1 && (
          <div className="space-y-5">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-white">Create your account</h2>
              <p className="text-white/60 text-sm mt-1">Start your journey with QuickDish</p>
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-white/90 mb-3">I want to join as</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'ROLE_CUSTOMER', icon: User, label: 'Customer', desc: 'Order food' },
                  { id: 'ROLE_RESTAURANT_OWNER', icon: Store, label: 'Partner', desc: 'Sell food' },
                  { id: 'ROLE_RIDER', icon: Bike, label: 'Rider', desc: 'Deliver' }
                ].map((role) => (
                  <label 
                    key={role.id}
                    className={`cursor-pointer border-2 rounded-xl p-3 flex flex-col items-center transition-all hover:bg-white/10 ${
                      formData.role === role.id 
                        ? 'border-orange-400 bg-orange-500/20' 
                        : 'border-white/20 bg-white/5'
                    }`}
                  >
                    <input 
                      type="radio" 
                      name="role" 
                      value={role.id}
                      checked={formData.role === role.id}
                      onChange={handleChange}
                      className="hidden"
                    />
                    <role.icon className={`w-5 h-5 mb-1 ${formData.role === role.id ? 'text-orange-400' : 'text-white/60'}`} />
                    <span className={`font-semibold text-xs ${formData.role === role.id ? 'text-white' : 'text-white/80'}`}>{role.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                Full Name <span className="text-red-400">*</span>
              </label>
              {renderInput('name', 'text', 'Enter your full name', true, User)}
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  Email <span className="text-red-400">*</span>
                </label>
                {renderInput('email', 'email', 'your@email.com', true, Mail)}
              </div>
              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  Phone <span className="text-red-400">*</span>
                </label>
                {renderInput('phone', 'tel', '10-digit mobile', true, Phone)}
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                Password <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-12 py-3.5 rounded-xl bg-white/20 text-white placeholder-white/50 border border-white/30 focus:ring-2 focus:ring-orange-400 outline-none transition-all text-sm backdrop-blur-sm"
                  placeholder="Min 6 characters"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button 
              onClick={handleNext}
              disabled={loading}
              className="w-full mt-4 py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              Continue
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Step 2: Role Specific */}
        {currentStep === 2 && (
          <div className="space-y-5">
            <button 
              onClick={handleBack}
              className="flex items-center gap-2 text-white/70 hover:text-white mb-4 transition-colors text-sm"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>

            {/* RIDER FIELDS */}
            {isRider && (
              <>
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold text-white">Rider Details</h2>
                  <p className="text-white/60 text-sm mt-1">Tell us about your vehicle</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-2">
                      Vehicle Type <span className="text-red-400">*</span>
                    </label>
                    <select
                      name="vehicleType"
                      value={formData.vehicleType}
                      onChange={handleChange}
                      className="w-full px-4 py-3.5 rounded-xl bg-white/20 text-white border border-white/30 focus:ring-2 focus:ring-orange-400 outline-none text-sm backdrop-blur-sm [&>option]:text-black"
                    >
                      <option value="" className="text-black">Select vehicle type</option>
                      <option value="BIKE" className="text-black">Bike</option>
                      <option value="SCOOTER" className="text-black">Scooty</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white/90 mb-2">
                        Vehicle Number <span className="text-red-400">*</span>
                      </label>
                      {renderInput('vehicleNumber', 'text', 'DL01AB1234', true)}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/90 mb-2">
                        License Number <span className="text-red-400">*</span>
                      </label>
                      {renderInput('licenseNumber', 'text', 'DL1234567890', true)}
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* RESTAURANT OWNER FIELDS */}
            {isOwner && (
              <>
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold text-white">Business Details</h2>
                  <p className="text-white/60 text-sm mt-1">Enter your business information</p>
                </div>

                <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-1 custom-scrollbar">
                  {/* Business Documents */}
                  <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                    <h3 className="font-semibold text-white/90 flex items-center gap-2 mb-4 text-sm">
                      <FileText className="w-4 h-4 text-orange-400" />
                      Business Registration
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-white/80 mb-2">
                            GST Number <span className="text-red-400">*</span>
                          </label>
                          {renderInput('gstNumber', 'text', '22AAAAA0000A1Z5', true)}
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-white/80 mb-2">
                            PAN Number <span className="text-red-400">*</span>
                          </label>
                          {renderInput('panNumber', 'text', 'ABCDE1234F', true)}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-white/80 mb-2">
                            FSSAI License <span className="text-red-400">*</span>
                          </label>
                          {renderInput('fssaiLicense', 'text', '12345678901234', true)}
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-white/80 mb-2">
                            Business Reg. No.
                          </label>
                          {renderInput('businessRegistrationNumber', 'text', 'Optional', false)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bank Details */}
                  <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                    <h3 className="font-semibold text-white/90 flex items-center gap-2 mb-4 text-sm">
                      <CreditCard className="w-4 h-4 text-green-400" />
                      Bank Account for Payouts
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-white/80 mb-2">
                            Account Holder Name <span className="text-red-400">*</span>
                          </label>
                          {renderInput('accountHolderName', 'text', 'Full name as in bank', true)}
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-white/80 mb-2">
                            Bank Name
                          </label>
                          {renderInput('bankName', 'text', 'e.g., HDFC Bank', false)}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-white/80 mb-2">
                            Account Number <span className="text-red-400">*</span>
                          </label>
                          {renderInput('bankAccountNumber', 'text', '123456789012', true)}
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-white/80 mb-2">
                            IFSC Code <span className="text-red-400">*</span>
                          </label>
                          {renderInput('ifscCode', 'text', 'HDFC0001234', true)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* CUSTOMER */}
            {isCustomer && (
              <div className="text-center py-8">
                <CheckCircle2 className="w-16 h-16 text-green-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">You're all set!</h3>
                <p className="text-white/70 text-sm">Click below to verify your email.</p>
              </div>
            )}

            <button 
              onClick={handleNext}
              disabled={loading}
              className="w-full mt-4 py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 transition-all shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2"
            >
              {loading ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Creating Account...</>
              ) : (
                <><span>Complete Registration</span><ChevronRight className="w-5 h-5" /></>
              )}
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 text-center space-y-2">
          <p className="text-white/80 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-orange-400 font-semibold hover:text-orange-300">
              Login
            </Link>
          </p>
          <p className="text-white/50 text-xs">
            By signing up, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>

      </div>
    </div>
  );
};

export default Signup;
