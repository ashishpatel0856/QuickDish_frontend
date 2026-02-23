import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { restaurantAPI } from '../services/api';
import { MapPin, Phone, Mail, Image, DollarSign, Navigation } from 'lucide-react';

const CATEGORIES = [
  'North Indian', 'South Indian', 'Chinese', 'Italian', 
  'Fast Food', 'Desserts', 'Biryani', 'Pizza', 'Burger'
];

const AddRestaurant = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    address: '',
    location: '',
    latitude: '',
    longitude: '',
    contact: '',
    email: '',
    image: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.latitude || !formData.longitude) {
      alert('Please provide latitude and longitude for delivery calculations');
      return;
    }

    try {
      setLoading(true);
      await restaurantAPI.create({
        ...formData,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        image: formData.image ? [formData.image] : []
      });
      navigate('/owner/dashboard');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to create restaurant');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent";

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-orange-500 p-6 text-white">
          <h1 className="text-2xl font-bold">Add New Restaurant</h1>
          <p className="text-orange-100">Partner with QuickDish and grow your business</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
            
            <div className="relative">
              <input
                type="text"
                placeholder="Restaurant Name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className={inputClass}
                required
              />
            </div>

            <textarea
              placeholder="Description (What makes your restaurant special?)"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg h-24 focus:ring-2 focus:ring-orange-500"
              required
            />

            <select
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              required
            >
              <option value="">Select Category</option>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-orange-500" />
              Location Details
            </h3>
            
            <input
              type="text"
              placeholder="Full Address"
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg"
              required
            />

            <input
              type="text"
              placeholder="City / Area"
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg"
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <Navigation className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  step="any"
                  placeholder="Latitude"
                  value={formData.latitude}
                  onChange={(e) => setFormData({...formData, latitude: e.target.value})}
                  className={inputClass}
                  required
                />
              </div>
              <div className="relative">
                <Navigation className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  step="any"
                  placeholder="Longitude"
                  value={formData.longitude}
                  onChange={(e) => setFormData({...formData, longitude: e.target.value})}
                  className={inputClass}
                  required
                />
              </div>
            </div>
            <p className="text-xs text-gray-500">
              * Latitude & Longitude required for delivery distance calculation
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
            
            <div className="relative">
              <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="tel"
                placeholder="Phone Number"
                value={formData.contact}
                onChange={(e) => setFormData({...formData, contact: e.target.value})}
                className={inputClass}
                required
              />
            </div>

            <div className="relative">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className={inputClass}
                required
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Restaurant Image</h3>
            <div className="relative">
              <Image className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="url"
                placeholder="Image URL (https://...)"
                value={formData.image}
                onChange={(e) => setFormData({...formData, image: e.target.value})}
                className={inputClass}
              />
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 text-white py-4 rounded-lg font-semibold hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? 'Creating Restaurant...' : 'Create Restaurant'}
            </button>
            <p className="text-center text-sm text-gray-500 mt-4">
              Your restaurant will be reviewed by our team before going live
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRestaurant;