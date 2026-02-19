import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';
import { User, Mail, Phone, MapPin, Edit2, Save, Loader2 } from 'lucide-react';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', address: { street: '', city: '', state: '', pinCode: '' } });

  useEffect(() => {
    if (user) {
      setFormData({ name: user.name || '', email: user.email || '', phone: user.phone || '', address: user.address || { street: '', city: '', state: '', pinCode: '' } });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({ ...prev, address: { ...prev.address, [field]: value } }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await userAPI.updateProfile(formData);
      updateUser({ ...user, ...formData });
      setEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      alert('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">{user?.name?.charAt(0)?.toUpperCase() || 'U'}</div>
              <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
              <p className="text-gray-500 text-sm">{user?.email}</p>
              <p className="text-gray-400 text-xs mt-1">Member since {new Date().getFullYear()}</p>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Personal Information</h3>
                <button onClick={() => editing ? handleSave() : setEditing(true)} disabled={saving}
                  className="flex items-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : editing ? <Save className="w-4 h-4 mr-2" /> : <Edit2 className="w-4 h-4 mr-2" />}
                  {editing ? 'Save Changes' : 'Edit Profile'}
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2"><User className="w-4 h-4 inline mr-2" />Full Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} disabled={!editing} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 disabled:bg-gray-50" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2"><Mail className="w-4 h-4 inline mr-2" />Email Address</label>
                    <input type="email" name="email" value={formData.email} disabled className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2"><Phone className="w-4 h-4 inline mr-2" />Phone Number</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} disabled={!editing} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 disabled:bg-gray-50" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2"><MapPin className="w-4 h-4 inline mr-2" />Address</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" name="address.street" value={formData.address.street} onChange={handleChange} disabled={!editing} placeholder="Street Address" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 disabled:bg-gray-50" />
                    <input type="text" name="address.city" value={formData.address.city} onChange={handleChange} disabled={!editing} placeholder="City" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 disabled:bg-gray-50" />
                    <input type="text" name="address.state" value={formData.address.state} onChange={handleChange} disabled={!editing} placeholder="State" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 disabled:bg-gray-50" />
                    <input type="text" name="address.pinCode" value={formData.address.pinCode} onChange={handleChange} disabled={!editing} placeholder="PIN Code" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 disabled:bg-gray-50" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;