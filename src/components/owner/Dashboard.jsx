import { useEffect, useState } from 'react';
import { restaurantAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Edit, UtensilsCrossed, ShoppingBag, Star } from 'lucide-react';

const Dashboard = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyRestaurants();
  }, []);

  const fetchMyRestaurants = async () => {
    try {
      const res = await restaurantAPI.getMyRestaurants(); 
      setRestaurants(res.data);
    } catch (err) {
      console.error('Failed to fetch:', err);
      try {
        const allRes = await restaurantAPI.getAll();
        const myRestaurants = allRes.data.filter(r => r.owner?.id === user?.id);
        setRestaurants(myRestaurants);
      } catch (fallbackErr) {
        console.error('Fallback also failed:', fallbackErr);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Restaurants</h1>
          <p className="text-gray-500 mt-1">Manage your restaurants and menus</p>
        </div>
        <Link 
          to="/restaurant/add"
          className="flex items-center space-x-2 bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Add Restaurant</span>
        </Link>
      </div>

      {restaurants.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
          <div className="mb-4">
            <UtensilsCrossed className="w-16 h-16 text-gray-300 mx-auto" />
          </div>
          <p className="text-gray-500 text-lg mb-4">No restaurants yet</p>
          <Link 
            to="/restaurant/add" 
            className="text-orange-500 hover:text-orange-600 font-medium inline-flex items-center"
          >
            Add your first restaurant <Plus className="w-4 h-4 ml-1" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((restaurant) => (
            <div key={restaurant.id} className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
             
              <div className="relative h-48">
                <img 
                  src={Array.isArray(restaurant.image) ? restaurant.image[0] : restaurant.image || '/default-restaurant.jpg'}
                  alt={restaurant.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    restaurant.approved 
                      ? 'bg-green-500 text-white' 
                      : 'bg-yellow-500 text-white'
                  }`}>
                    {restaurant.approved ? 'Approved' : 'Pending'}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{restaurant.name}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{restaurant.description}</p>
                
                <div className="flex items-center text-sm text-gray-500 mb-4 space-x-4">
                  <span className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 mr-1 fill-current" />
                    4.5
                  </span>
                  <span>{restaurant.category}</span>
                </div>

               

                <div className="grid grid-cols-2 gap-3 mb-3">
                  <button
                    onClick={() => navigate(`/owner/menu/${restaurant.id}`)}
                    className="flex items-center justify-center space-x-2 bg-orange-50 text-orange-600 py-2 rounded-lg hover:bg-orange-100 transition-colors"
                  >
                    <UtensilsCrossed className="w-4 h-4" />
                    <span className="font-medium">Menu</span>
                  </button>
                  <button
                    onClick={() => navigate(`/owner/orders/${restaurant.id}`)}
                    className="flex items-center justify-center space-x-2 bg-blue-50 text-blue-600 py-2 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span className="font-medium">Orders</span>
                  </button>
                </div>

               

                <div className="flex space-x-2 pt-3 border-t">
                  <button
                    onClick={() => navigate(`/restaurant/${restaurant.id}`)}
                    className="flex-1 text-center py-2 text-gray-600 hover:text-gray-900 text-sm font-medium"
                  >
                    View
                  </button>
                  <button
                    onClick={() => navigate(`/restaurant/${restaurant.id}/edit`)}
                    className="flex-1 flex items-center justify-center space-x-1 py-2 text-gray-600 hover:text-gray-900 text-sm font-medium"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => navigate(`/restaurant/${restaurant.id}/add-food`)}
                    className="flex-1 text-center py-2 text-orange-500 hover:text-orange-600 text-sm font-medium"
                  >
                    + Add Food
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;