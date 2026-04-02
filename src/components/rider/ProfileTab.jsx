import { useState } from 'react';
import { 
  MapPin, Navigation, Phone, Bike, Calendar, 
  CheckCircle, AlertCircle, Clock, MapPinned,
  Save, LocateFixed
} from 'lucide-react';

const ProfileTab = ({ profile, status, onStatusChange, onLocationUpdate }) => {
  const [editMode, setEditMode] = useState(false);
  const [location, setLocation] = useState({
    latitude: profile?.currentLocation?.latitude || '',
    longitude: profile?.currentLocation?.longitude || ''
  });
  const [saving, setSaving] = useState(false);
  const [locating, setLocating] = useState(false);

  const statusOptions = [
    { 
      value: 'AVAILABLE', 
      label: 'Available', 
      color: 'bg-green-500', 
      icon: CheckCircle, 
      desc: 'Ready for orders' 
    },
    { 
      value: 'OFFLINE', 
      label: 'Offline', 
      color: 'bg-gray-500', 
      icon: AlertCircle, 
      desc: 'Not accepting orders' 
    },
    { 
      value: 'BUSY', 
      label: 'Busy', 
      color: 'bg-orange-500', 
      icon: Clock, 
      desc: 'On delivery', 
      disabled: true
    }
  ];

  const getCurrentLocation = () => {
    setLocating(true);
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      setLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude.toFixed(6),
          longitude: position.coords.longitude.toFixed(6)
        });
        setLocating(false);
      },
      (error) => {
        alert('Unable to retrieve your location: ' + error.message);
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleSaveLocation = async () => {
    if (!location.latitude || !location.longitude) {
      alert('Please enter both latitude and longitude');
      return;
    }

    setSaving(true);
    try {
      await onLocationUpdate({
        latitude: parseFloat(location.latitude),
        longitude: parseFloat(location.longitude)
      });
      setEditMode(false);
      alert('Location updated successfully!');
    } catch (error) {
      alert('Failed to update location');
    } finally {
      setSaving(false);
    }
  };

  const fields = [
    { label: 'Phone', value: profile?.phone, icon: Phone },
    { label: 'Vehicle Number', value: profile?.vehicleNumber, isMono: true, icon: Bike },
    { label: 'License Number', value: profile?.licenseNumber, isMono: true, icon: Navigation },
    { label: 'Member Since', value: profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : '-', icon: Calendar }
  ];

  const currentStatus = statusOptions.find(s => s.value === status) || statusOptions[1];

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-red-400 rounded-full flex items-center justify-center text-white text-3xl font-bold">
            {profile?.name?.charAt(0) || 'R'}
          </div>

          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900">{profile?.name || 'Rider'}</h3>
            <p className="text-gray-500">{profile?.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className={`${currentStatus.color} text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1`}>
                <currentStatus.icon className="w-3 h-3" />
                {currentStatus.label}
              </span>
              <span className="text-sm text-gray-500">{profile?.vehicleType || 'Bike'}</span>
            </div>
          </div>

        </div>

        {/* Status Toggle Section */}
        <div className="border-t border-gray-100 pt-6 mb-6">
          <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <MapPinned className="w-4 h-4 text-orange-500" />
            Update Status
          </h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => !option.disabled && onStatusChange(option.value)}
                disabled={option.disabled}
                className={`p-3 rounded-xl border-2 transition-all text-left ${
                  status === option.value
                    ? `border-${option.color.replace('bg-', '')} bg-${option.color.replace('bg-', '')}/10`
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                } ${option.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              >

                <div className={`w-8 h-8 ${option.color} rounded-lg flex items-center justify-center mb-2`}>
                  <option.icon className="w-4 h-4 text-white" />
                </div>
                <p className={`font-semibold text-sm ${status === option.value ? 'text-gray-900' : 'text-gray-600'}`}>
                  {option.label}
                </p>
                <p className="text-xs text-gray-500 mt-1">{option.desc}</p>
              </button>
            ))}
          </div>
          
          <p className="text-xs text-gray-400 mt-3">
             Busy status is automatically set when you accept an order
          </p>
        </div>

        {/* Location Section */}
        <div className="border-t border-gray-100 pt-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-orange-500" />
              Current Location
            </h4>
            <button
              onClick={() => setEditMode(!editMode)}
              className="text-sm text-orange-600 hover:text-orange-700 font-medium"
            >
              {editMode ? 'Cancel' : 'Edit Location'}
            </button>
          </div>

          {editMode ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                  <input
                    type="number"
                    step="any"
                    value={location.latitude}
                    onChange={(e) => setLocation({ ...location, latitude: e.target.value })}
                    placeholder="e.g., 28.6139"
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                  <input
                    type="number"
                    step="any"
                    value={location.longitude}
                    onChange={(e) => setLocation({ ...location, longitude: e.target.value })}
                    placeholder="e.g., 77.2090"
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none font-mono"
                  />
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={getCurrentLocation}
                  disabled={locating}
                  className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                >
                  <LocateFixed className={`w-4 h-4 ${locating ? 'animate-spin' : ''}`} />
                  {locating ? 'Getting Location...' : 'Get Current Location'}
                </button>

                <button
                  onClick={handleSaveLocation}
                  disabled={saving}
                  className="flex-1 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-medium hover:from-orange-600 hover:to-red-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >

                  <Save className={`w-4 h-4 ${saving ? 'animate-pulse' : ''}`} />
                  {saving ? 'Saving...' : 'Save Location'}
                </button>
                
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-500 mb-1">Latitude</p>
                <p className="font-mono font-semibold text-gray-900">
                  {profile?.currentLocation?.latitude || 'Not set'}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-500 mb-1">Longitude</p>
                <p className="font-mono font-semibold text-gray-900">
                  {profile?.currentLocation?.longitude || 'Not set'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Other Profile Details */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <h4 className="text-sm font-semibold text-gray-900 mb-4">Profile Details</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {fields.map((field, idx) => (
            <div key={idx} className="p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-2 mb-1">
                <field.icon className="w-4 h-4 text-gray-400" />
                <p className="text-sm text-gray-500">{field.label}</p>
              </div>
              <p className={`font-semibold text-gray-900 ${field.isMono ? 'font-mono' : ''}`}>
                {field.value || 'N/A'}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileTab;