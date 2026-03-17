import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, User, Mail, Phone, Shield, Calendar,
  MapPin, Edit2, Camera, LogOut
} from 'lucide-react';
import { userAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const AdminProfile = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      if (user) {
        setProfile(user);
      } else {
        const response = await userAPI.getProfile();
        const data = response.data?.data || response.data || response;
        setProfile(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setProfile(JSON.parse(storedUser));
      }
    } finally {
      setLoading(false);
    }
  };

  const getInitials = () => {
    if (profile?.name) return profile.name.charAt(0).toUpperCase();
    if (profile?.email) return profile.email.charAt(0).toUpperCase();
    return 'A';
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="flex items-center justify-between p-4 sm:p-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">My Profile</h1>
              <p className="text-sm text-gray-500">Manage your account details</p>
            </div>
          </div>
        </div>
      </header>

      <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-6">
          {/* Cover Image */}
          <div className="h-32 bg-gradient-to-r from-orange-500 to-red-500"></div>
          
          {/* Profile Info */}
          <div className="px-6 pb-6">
            <div className="relative flex justify-between items-end -mt-12 mb-4">
              <div className="relative">
                <div className="w-24 h-24 bg-white rounded-full p-1">
                  <div className="w-full h-full bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                    {getInitials()}
                  </div>
                </div>
                <button className="absolute bottom-0 right-0 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-colors"
              >
                <Edit2 className="w-4 h-4" />
                <span>Edit Profile</span>
              </button>
            </div>

            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {profile?.name || 'Admin User'}
              </h2>
              <p className="text-gray-500 flex items-center gap-2 mt-1">
                <Shield className="w-4 h-4 text-purple-500" />
                <span className="text-purple-600 font-medium">Administrator</span>
              </p>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Mail className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email Address</p>
                    <p className="font-semibold text-gray-900">{profile?.email || 'N/A'}</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Phone className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone Number</p>
                    <p className="font-semibold text-gray-900">{profile?.phone || 'N/A'}</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <User className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">User ID</p>
                    <p className="font-semibold text-gray-900 font-mono text-sm">
                      {profile?.id || profile?._id || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Member Since</p>
                    <p className="font-semibold text-gray-900">
                      {profile?.createdAt 
                        ? new Date(profile.createdAt).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })
                        : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Account Actions */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-bold text-gray-900">Account Actions</h3>
          </div>
          
          <div className="p-6 space-y-3">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 p-4 text-red-600 hover:bg-red-50 rounded-xl transition-colors border border-red-200"
            >
              <LogOut className="w-5 h-5" />
              <div className="text-left">
                <p className="font-semibold">Logout</p>
                <p className="text-sm text-red-500">Sign out from your account</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;