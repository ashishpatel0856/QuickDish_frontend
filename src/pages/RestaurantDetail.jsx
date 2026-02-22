import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { restaurantAPI, foodAPI } from '../services/api';
import { useAuthStore } from '../stores/authStore';

const RestaurantDetail = () => {  
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isOwner, user } = useAuthStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const restRes = await restaurantAPI.getById(id);
        setRestaurant(restRes.data);

        const foodsRes = await foodAPI.getByRestaurant(id);
        setFoods(foodsRes.data);
        
      } catch (err) {
        console.error('Failed to fetch:', err);
        setError(err.response?.data?.message || 'Failed to load restaurant');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;
  if (!restaurant) return <div className="text-center py-10">Restaurant not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Restaurant Header */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <img 
          src={restaurant.image || '/default-restaurant.jpg'} 
          alt={restaurant.name}
          className="w-full h-64 object-cover"
        />
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{restaurant.name}</h1>
              <p className="text-gray-600 mt-2">{restaurant.description}</p>
              <div className="flex items-center mt-4 space-x-4 text-sm text-gray-500">
                <span>{restaurant.category}</span>
                <span>•</span>
                <span>{restaurant.address}</span>
              </div>
            </div>
            
            {isOwner() && restaurant.owner?.id === user?.id && (
              <button 
                onClick={() => navigate(`/restaurant/${id}/add-food`)}
                className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
              >
                + Add Food Item
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Menu Section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Menu</h2>
        
        {foods.length === 0 ? (
          <p className="text-gray-500 text-center py-10">No food items available</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {foods.map((food) => (
              <div key={food.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <img 
                  src={food.image || '/default-food.jpg'} 
                  alt={food.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold text-gray-900">{food.name}</h3>
                    <span className="text-orange-600 font-bold">₹{food.price}</span>
                  </div>
                  <p className="text-gray-600 text-sm mt-2">{food.description}</p>
                  
                  <div className="mt-4 flex items-center justify-between">
                    <span className={`text-xs px-2 py-1 rounded ${
                      food.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {food.available ? 'Available' : 'Not Available'}
                    </span>
                    
                    {useAuthStore.getState().isCustomer() && food.available && (
                      <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 text-sm">
                        Add to Cart
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantDetail;  