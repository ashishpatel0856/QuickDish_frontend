import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  User, Mail, Lock, Eye, EyeOff, Phone, Store, 
  Bike, CheckCircle2, Loader2, ChevronRight, ChevronLeft,
  ShieldCheck, Building2, FileText, CreditCard
} from 'lucide-react';

const Signup = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    //  Basic Info
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'ROLE_CUSTOMER',
    
    //  Rider Fields
    vehicleType: '',
    licenseNumber: '',
    vehicleNumber: '',
    
    //  Restaurant Owner Fields 
    gstNumber: '',
    panNumber: '',
    fssaiLicense: '',
    businessRegistrationNumber: '',
    
    // Bank Details
    bankAccountNumber: '',
    ifscCode: '',
    accountHolderName: '',
    bankName: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

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
        setError('GST Number, PAN Number and FSSAI License are required');
        return false;
      }
      if (!formData.bankAccountNumber || !formData.ifscCode || !formData.accountHolderName) {
        setError('Bank details are required for payouts');
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
          // Business Documents 
          gstNumber: formData.gstNumber,
          panNumber: formData.panNumber,
          fssaiLicense: formData.fssaiLicense,
          businessRegistrationNumber: formData.businessRegistrationNumber || '',
          
          // Bank Details 
          bankAccountNumber: formData.bankAccountNumber,
          ifscCode: formData.ifscCode,
          accountHolderName: formData.accountHolderName,
          bankName: formData.bankName || '',
          
          // Document URLs (Optional for now - can be added later)
          gstCertificateUrl: '',
          panCardUrl: '',
          fssaiCertificateUrl: '',
          bankProofUrl: ''
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
      console.error('Signup error:', err);
    } finally {
      setLoading(false);
    }
  };

  const isCustomer = formData.role === 'ROLE_CUSTOMER';
  const isRider = formData.role === 'ROLE_RIDER';
  const isOwner = formData.role === 'ROLE_RESTAURANT_OWNER';

  const progress = currentStep === 1 ? 50 : 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
              <Store className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              QuickDish
            </h1>
          </div>
          <p className="text-gray-600">Join India's fastest growing food delivery platform</p>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm font-medium text-gray-600 mb-2">
            <span>Step {currentStep} of 2</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          
          {/*  Basic Info */}
          {currentStep === 1 && (
            <div className="p-6 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Create your account</h2>
              <p className="text-gray-500 mb-6">Start your journey with QuickDish</p>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5" />
                  {error}
                </div>
              )}

              {/* Role Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">I want to join as</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'ROLE_CUSTOMER', icon: User, label: 'Customer', desc: 'Order food', color: 'blue' },
                    { id: 'ROLE_RESTAURANT_OWNER', icon: Store, label: 'Partner', desc: 'Sell food', color: 'orange' },
                    { id: 'ROLE_RIDER', icon: Bike, label: 'Rider', desc: 'Deliver', color: 'green' }
                  ].map((role) => (
                    <label 
                      key={role.id}
                      className={`cursor-pointer border-2 rounded-xl p-3 sm:p-4 flex flex-col items-center transition-all hover:shadow-md ${
                        formData.role === role.id 
                          ? 'border-orange-500 bg-orange-50 shadow-md' 
                          : 'border-gray-200 hover:border-gray-300'
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
                      <role.icon className={`w-6 h-6 mb-2 ${formData.role === role.id ? 'text-orange-500' : 'text-gray-400'}`} />
                      <span className="font-semibold text-xs sm:text-sm">{role.label}</span>
                      <span className="text-[10px] sm:text-xs text-gray-500 text-center">{role.desc}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input 
                      type="text" 
                      name="name" 
                      value={formData.name} 
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input 
                        type="email" 
                        name="email" 
                        value={formData.email} 
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input 
                        type="tel" 
                        name="phone" 
                        value={formData.phone} 
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                        placeholder="10-digit mobile"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input 
                      type={showPassword ? 'text' : 'password'} 
                      name="password" 
                      value={formData.password} 
                      onChange={handleChange}
                      className="w-full pl-12 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                      placeholder="Min 6 characters"
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
              </div>

              <button 
                onClick={handleNext}
                className="w-full mt-6 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2"
              >
                Continue
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* STEP 2: Role Specific */}
          {currentStep === 2 && (
            <div className="p-6 sm:p-8">
              <button 
                onClick={handleBack}
                className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-4 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
                Back
              </button>

              {/* RIDER FIELDS */}
              {isRider && (
                <>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Rider Details</h2>
                  <p className="text-gray-500 mb-6">Tell us about your vehicle</p>

                  {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5" />
                      {error}
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Type *</label>
                      <select
                        name="vehicleType"
                        value={formData.vehicleType}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none bg-white"
                      >
                        <option value="">Select vehicle type</option>
                        <option value="BIKE">Bike</option>
                        <option value="SCOOTER">Scooter</option>
                        <option value="CYCLE">Cycle</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Number *</label>
                        <input 
                          type="text" 
                          name="vehicleNumber" 
                          value={formData.vehicleNumber}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none uppercase"
                          placeholder="DL01AB1234"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">License Number *</label>
                        <input 
                          type="text" 
                          name="licenseNumber" 
                          value={formData.licenseNumber}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none uppercase"
                          placeholder="DL1234567890"
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* RESTAURANT OWNER FIELDS - With Required Documents */}
              {isOwner && (
                <>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Business Details</h2>
                  <p className="text-gray-500 mb-6">Enter your business information for verification</p>

                  {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5" />
                      {error}
                    </div>
                  )}

                  <div className="space-y-6">
                    {/* Business Documents */}
                    <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
                      <h3 className="font-semibold text-blue-800 flex items-center gap-2 mb-4">
                        <FileText className="w-5 h-5" />
                        Business Registration *
                      </h3>
                      
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">GST Number *</label>
                            <input 
                              type="text" 
                              name="gstNumber" 
                              value={formData.gstNumber}
                              onChange={handleChange}
                              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none uppercase"
                              placeholder="22AAAAA0000A1Z5"
                            />
                            <p className="text-xs text-gray-500 mt-1">15 digit GST number</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">PAN Number *</label>
                            <input 
                              type="text" 
                              name="panNumber" 
                              value={formData.panNumber}
                              onChange={handleChange}
                              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none uppercase"
                              placeholder="ABCDE1234F"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">FSSAI License *</label>
                            <input 
                              type="text" 
                              name="fssaiLicense" 
                              value={formData.fssaiLicense}
                              onChange={handleChange}
                              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                              placeholder="12345678901234"
                            />
                            <p className="text-xs text-gray-500 mt-1">14 digit food license</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Business Reg. No.</label>
                            <input 
                              type="text" 
                              name="businessRegistrationNumber" 
                              value={formData.businessRegistrationNumber}
                              onChange={handleChange}
                              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                              placeholder="Optional"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bank Details */}
                    <div className="bg-green-50 rounded-xl p-5 border border-green-100">
                      <h3 className="font-semibold text-green-800 flex items-center gap-2 mb-4">
                        <CreditCard className="w-5 h-5" />
                        Bank Account for Payouts *
                      </h3>
                      
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Account Holder Name *</label>
                            <input 
                              type="text" 
                              name="accountHolderName" 
                              value={formData.accountHolderName}
                              onChange={handleChange}
                              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                              placeholder="Full name as in bank"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Bank Name</label>
                            <input 
                              type="text" 
                              name="bankName" 
                              value={formData.bankName}
                              onChange={handleChange}
                              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                              placeholder="e.g., HDFC Bank"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Account Number *</label>
                            <input 
                              type="text" 
                              name="bankAccountNumber" 
                              value={formData.bankAccountNumber}
                              onChange={handleChange}
                              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                              placeholder="123456789012"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">IFSC Code *</label>
                            <input 
                              type="text" 
                              name="ifscCode" 
                              value={formData.ifscCode}
                              onChange={handleChange}
                              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none uppercase"
                              placeholder="HDFC0001234"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Info Note */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                      <p className="text-sm text-yellow-800">
                        {/* <strong> Document Upload:</strong> You'll need to upload scanned copies of GST certificate, PAN card, FSSAI license and cancelled cheque in your dashboard after email verification. */}
                      </p>
                    </div>
                  </div>
                </>
              )}

              {/* CUSTOMER */}
              {isCustomer && (
                <div className="text-center py-8">
                  <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">You're all set!</h3>
                  <p className="text-gray-600">Click below to verify your email.</p>
                </div>
              )}

              <button 
                onClick={handleNext}
                disabled={loading}
                className="w-full mt-6 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 disabled:opacity-50 transition-all shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Creating Account...</>
                ) : (
                  <><span>Complete Registration</span><ChevronRight className="w-5 h-5" /></>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-orange-600 font-semibold hover:text-orange-700">
              Sign In
            </Link>
          </p>
          <p className="text-xs text-gray-400 mt-4">
            By signing up, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;