import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { restaurantAPI, foodAPI } from '../services/api';
import { Plus, Store, Utensils, ShoppingBag, DollarSign, MapPin, Phone } from 'lucide-react';

const OwnerDashboard = () => {
  const { user } = useAuth();
  const [restaurant, setRestaurant] = useState(null);
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showAddFood, setShowAddFood] = useState(false);

  // Forms
  const [restaurantForm, setRestaurantForm] = useState({
    name: '', description: '', location: '', category: '', contact: '', image: ''
  });
  
  const [foodForm, setFoodForm] = useState({
    name: '', description: '', price: '', category: '', image: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const restRes = await restaurantAPI.getAll();
      const myRest = restRes.data.find(r => r.owner?.id === user?.id || r.owner?.email === user?.email);
      setRestaurant(myRest);
      
      if (myRest) {
        const foodRes = await foodAPI.getByRestaurant(myRest.id);
        setFoods(foodRes.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch:', error);
    } finally {
      setLoading(false);
    }
  };

  const createRestaurant = async (e) => {
    e.preventDefault();
    try {
      await restaurantAPI.create({
        ...restaurantForm,
        image: restaurantForm.image ? [restaurantForm.image] : []
      });
      alert('✅ Restaurant created! Waiting for admin approval.');
      setShowCreateForm(false);
      fetchData();
    } catch (error) {
      alert('❌ Failed: ' + (error.response?.data?.message || error.message));
    }
  };

  const addFood = async (e) => {
    e.preventDefault();
    try {
      await foodAPI.create({
        ...foodForm,
        restaurantId: restaurant.id,
        price: parseFloat(foodForm.price),
        image: foodForm.image ? [foodForm.image] : []
      });
      alert('✅ Food added successfully!');
      setShowAddFood(false);
      setFoodForm({ name: '', description: '', price: '', category: '', image: '' });
      fetchData();
    } catch (error) {
      alert('❌ Failed: ' + (error.response?.data?.message || error.message));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-primary-500"></div>
      </div>
    );
  }

  // 👈 NO RESTAURANT - Show Create Form
  if (!restaurant) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <Store className="w-20 h-20 text-gray-300 mx-auto mb-6" />
        <h2 className="text-3xl font-bold text-gray-900 mb-2">No Restaurant Found</h2>
        <p className="text-gray-500 mb-8">Create your restaurant to start selling food</p>
        
        {!showCreateForm ? (
          <button 
            onClick={() => setShowCreateForm(true)}
            className="px-8 py-4 bg-primary-500 text-white rounded-xl font-bold text-lg hover:bg-primary-600 transition-colors"
          >
            <Plus className="w-6 h-6 inline mr-2" />
            Create Restaurant
          </button>
        ) : (
          <form onSubmit={createRestaurant} className="bg-white rounded-2xl shadow-lg p-8 text-left">
            <h3 className="text-2xl font-bold mb-6 text-center">Restaurant Details</h3>
            
            <div className="space-y-4">
              <input 
                placeholder="Restaurant Name *" 
                className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500" 
                required
                value={restaurantForm.name} 
                onChange={e => setRestaurantForm({...restaurantForm, name: e.target.value})} 
              />
              
              <input 
                placeholder="Category (e.g., Indian, Chinese, Pizza) *" 
                className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500" 
                required
                value={restaurantForm.category} 
                onChange={e => setRestaurantForm({...restaurantForm, category: e.target.value})} 
              />
              
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  placeholder="Location/Address *" 
                  className="w-full pl-12 p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500" 
                  required
                  value={restaurantForm.location} 
                  onChange={e => setRestaurantForm({...restaurantForm, location: e.target.value})} 
                />
              </div>
              
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  placeholder="Contact Number" 
                  className="w-full pl-12 p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500" 
                  value={restaurantForm.contact} 
                  onChange={e => setRestaurantForm({...restaurantForm, contact: e.target.value})} 
                />
              </div>
              
              <input 
                placeholder="Image URL" 
                className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500" 
                value={restaurantForm.image} 
                onChange={e => setRestaurantForm({...restaurantForm, image: e.target.value})} 
              />
              
              <textarea 
                placeholder="Description *" 
                className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500" 
                rows="3" 
                required
                value={restaurantForm.description} 
                onChange={e => setRestaurantForm({...restaurantForm, description: e.target.value})} 
              />
            </div>

            <div className="flex gap-4 mt-6">
              <button type="submit" className="flex-1 py-4 bg-primary-500 text-white rounded-xl font-bold hover:bg-primary-600">
                Submit for Approval
              </button>
              <button 
                type="button" 
                onClick={() => setShowCreateForm(false)} 
                className="flex-1 py-4 border border-gray-200 rounded-xl hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    );
  }

  // 👈 HAS RESTAURANT - Show Dashboard
  return (
    <div>
      {/* Restaurant Header */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{restaurant.name}</h1>
            <p className="text-gray-500 mt-1 flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              {restaurant.location}
            </p>
          </div>
          <span className={`px-4 py-2 rounded-full text-sm font-medium ${
            restaurant.approved 
              ? 'bg-green-100 text-green-700' 
              : 'bg-yellow-100 text-yellow-700'
          }`}>
            {restaurant.approved ? '🟢 Live' : '🟡 Pending Approval'}
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <ShoppingBag className="w-10 h-10 text-blue-500 mb-3" />
          <h3 className="text-gray-500 text-sm">Total Orders</h3>
          <p className="text-3xl font-bold">0</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <DollarSign className="w-10 h-10 text-green-500 mb-3" />
          <h3 className="text-gray-500 text-sm">Revenue</h3>
          <p className="text-3xl font-bold">₹0</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <Utensils className="w-10 h-10 text-orange-500 mb-3" />
          <h3 className="text-gray-500 text-sm">Menu Items</h3>
          <p className="text-3xl font-bold">{foods.length}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <Store className="w-10 h-10 text-purple-500 mb-3" />
          <h3 className="text-gray-500 text-sm">Rating</h3>
          <p className="text-3xl font-bold">4.5</p>
        </div>
      </div>

      {/* Menu Section */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Menu Items</h2>
          <button 
            onClick={() => setShowAddFood(!showAddFood)}
            className="px-4 py-2 bg-primary-500 text-white rounded-lg flex items-center hover:bg-primary-600"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Food
          </button>
        </div>

        {/* Add Food Form */}
        {showAddFood && (
          <form onSubmit={addFood} className="bg-gray-50 rounded-xl p-6 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <input 
              placeholder="Food Name *" 
              className="p-3 border border-gray-200 rounded-xl" 
              required
              value={foodForm.name} 
              onChange={e => setFoodForm({...foodForm, name: e.target.value})} 
            />
            <input 
              placeholder="Price (₹) *" 
              type="number" 
              className="p-3 border border-gray-200 rounded-xl" 
              required
              value={foodForm.price} 
              onChange={e => setFoodForm({...foodForm, price: e.target.value})} 
            />
            <input 
              placeholder="Category *" 
              className="p-3 border border-gray-200 rounded-xl" 
              required
              value={foodForm.category} 
              onChange={e => setFoodForm({...foodForm, category: e.target.value})} 
            />
            <input 
              placeholder="Image URL" 
              className="p-3 border border-gray-200 rounded-xl" 
              value={foodForm.image} 
              onChange={e => setFoodForm({...foodForm, image: e.target.value})} 
            />
            <textarea 
              placeholder="Description *" 
              className="md:col-span-2 p-3 border border-gray-200 rounded-xl" 
              rows="2" 
              required
              value={foodForm.description} 
              onChange={e => setFoodForm({...foodForm, description: e.target.value})} 
            />
            <div className="md:col-span-2 flex gap-4">
              <button type="submit" className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600">
                Add to Menu
              </button>
              <button 
                type="button" 
                onClick={() => setShowAddFood(false)} 
                className="px-6 py-2 border border-gray-200 rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Food Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {foods.map(food => (
            <div key={food.id} className="border border-gray-100 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
              <img 
                src={food.image?.[0] || 'https://via.placeholder.com/400x300'} 
                alt={food.name} 
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg">{food.name}</h3>
                  <span className="text-primary-600 font-bold">₹{food.price}</span>
                </div>
                <p className="text-gray-500 text-sm mb-2">{food.category}</p>
                <p className="text-gray-600 text-sm line-clamp-2">{food.description}</p>
                <div className="mt-3">
                  <span className={`px-2 py-1 rounded text-xs ${
                    food.available 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {food.available ? '✅ Available' : '❌ Not Available'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {foods.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Utensils className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p>No food items yet. Add your first item!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerDashboard;