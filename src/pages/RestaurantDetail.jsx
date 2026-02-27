import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { restaurantAPI, foodAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Star, Clock, MapPin, Plus, Check, ShoppingBag, Heart, Share2, Info ,IndianRupeeIcon } from 'lucide-react';

const RestaurantDetail = () => {  
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  
  const [restaurant, setRestaurant] = useState(null);
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingToCart, setAddingToCart] = useState({});
  const [addedItems, setAddedItems] = useState({});
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    if (!id || id === 'add' || isNaN(Number(id))) {
      setError('Invalid Restaurant ID');
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const [restRes, foodsRes] = await Promise.all([
          restaurantAPI.getById(id),
          foodAPI.getByRestaurant(id)
        ]);
        setRestaurant(restRes.data);
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

  const handleAddToCart = async (foodItem) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/restaurant/${id}` } });
      return;
    }

    setAddingToCart({ ...addingToCart, [foodItem.id]: true });
    
    const result = await addToCart(foodItem.id, 1);
    
    if (result.success) {
      setAddedItems({ ...addedItems, [foodItem.id]: true });
      setCartCount(prev => prev + 1);
      setTimeout(() => {
        setAddedItems(prev => ({ ...prev, [foodItem.id]: false }));
      }, 2000);
    } else {
      alert(result.error || 'Failed to add to cart');
    }
    
    setAddingToCart({ ...addingToCart, [foodItem.id]: false });
  };

  const isOwner = () => {
    return user?.role?.includes('ROLE_RESTAURANT_OWNER') && restaurant?.owner?.id === user?.id;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-500"></div>
      </div>
    );
  }
  
  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <p className="text-red-500 text-lg">{error}</p>
        <button onClick={() => navigate('/')} className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-lg">
          Go Home
        </button>
      </div>
    </div>
  );
  
  if (!restaurant) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <p className="text-gray-500">Restaurant not found</p>
    </div>
  );

  const restaurantImage = Array.isArray(restaurant.image) 
    ? restaurant.image[0] 
    : restaurant.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80';

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
    {cartCount > 0 && (
        <div className="fixed bottom-4 left-4 right-4 z-50 md:hidden">
          <button 
            onClick={() => navigate('/cart')}
            className="w-full bg-orange-500 text-white py-3 rounded-full shadow-lg flex items-center justify-center font-bold"
          >
            <ShoppingBag className="w-5 h-5 mr-2" />
            {cartCount} items • View Cart
          </button>
        </div>
      )}

      <div className="bg-white">
        <div className="relative h-64 md:h-80">
          <img 
            src={restaurantImage}
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          
          <div className="absolute top-4 left-4 right-4 flex justify-between">
            <button 
              onClick={() => navigate(-1)}
              className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30"
            >
              ←
            </button>
            <div className="flex gap-2">
              <button className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30">
                <Share2 className="w-5 h-5" />
              </button>
              <button className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30">
                <Heart className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-3xl md:text-4xl font-bold">{restaurant.name}</h1>
              <p className="text-white/90 mt-1">{restaurant.description}</p>
            </div>
          </div>
        </div>

        {/* Restaurant Details Bar */}
        <div className="max-w-7xl mx-auto px-4 py-4 border-b">
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <span className="flex items-center bg-green-100 text-green-800 px-2 py-1 rounded font-medium">
              <Star className="w-4 h-4 mr-1 fill-current" /> 4.5
            </span>
            <span className="text-gray-800">•</span>
            <span className="text-gray-800">{restaurant.category}</span>
            <span className="text-gray-800">•</span>
            <span className="flex items-center text-gray-600">
              <Clock className="w-4 h-4 mr-1" /> 30-40 min
            </span>
            <span className="text-gray-600">•</span>
            <span className="flex items-center text-gray-800">
              <MapPin className="w-4 h-4 mr-1" /> {restaurant.location || restaurant.address}
            </span>
            <span className="text-gray-600">•</span>
            <span className="flex items-center text-gray-800">
              <IndianRupeeIcon className="w-4 h-4 mr-0 text-gray-600" />
              200 for two
            </span>            
            {isOwner() && (
              <div className="ml-auto flex gap-2">
                <button 
                  onClick={() => navigate(`/restaurant/${id}/edit`)}
                  className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200"
                >
                  Edit
                </button>
                <button 
                  onClick={() => navigate(`/restaurant/${id}/add-food`)}
                  className="px-3 py-1.5 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600"
                >
                  + Add Food
                </button>
              </div>
            )}
          </div>
          
          {/* Offers */}
          <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
            <span className="flex items-center px-3 py-1.5 bg-orange-50 text-orange-700 rounded-full text-sm whitespace-nowrap">
              <Info className="w-4 h-4 mr-1" /> 50% off up to 100
            </span>
            <span className="flex items-center px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm whitespace-nowrap">
              FREE DELIVERY
            </span>
          </div>
        </div>
      </div>

      {/* Menu Section */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Menu ({foods.length})</h2>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-white border rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">
              Veg Only 
            </button>
            <button className="px-4 py-2 bg-white border rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">
              Bestseller 
            </button>
          </div>
        </div>
        
        {foods.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-10 h-10 text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg mb-2">No food items yet</p>
            {isOwner() && (
              <button
                onClick={() => navigate(`/restaurant/${id}/add-food`)}
                className="text-orange-500 hover:text-orange-600 font-medium"
              >
                Add your first item →
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {foods.map((food) => {
              const foodImage = Array.isArray(food.images) && food.images.length > 0
                ? food.images[0] 
                : 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80';
              
              const isAdding = addingToCart[food.id];
              const isAdded = addedItems[food.id];
              
              return (
                <div 
                  key={food.id} 
                  className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all border border-gray-100"
                >
                  <div className="flex gap-4">
                    {/* Food Image */}
                    <div className="relative w-28 h-28 flex-shrink-0">
                      <img 
                        src={foodImage}
                        alt={food.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                      {food.preparationTime && (
                        <span className="absolute bottom-1 left-1 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
                          {food.preparationTime} min
                        </span>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex-1">
                          {/* Veg/Non-veg indicator */}
                          <div className="flex items-center gap-2 mb-1">
                            <span className="w-4 h-4 border-2 border-green-500 rounded-sm flex items-center justify-center">
                              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                            </span>
                            <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">Bestseller</span>
                          </div>
                          
                          <h3 className="font-bold text-gray-900 text-lg">{food.name}</h3>
                          <p className="text-gray-500 text-sm mt-1 line-clamp-2">{food.description}</p>
                          
                          <div className="flex items-center gap-2 mt-2">
                            <span className="flex items-center text-lg font-bold text-gray-900">
                              <IndianRupeeIcon className="w-4 h-4 text-gray-600 mr-0" />
                              {food.price}
                            </span>
                            {food.quantity > 0 && (
                              <span className="text-xs text-gray-500">
                                {food.quantity} left
                              </span>
                            )}
                          </div>
                        </div>
                        
                        {/* Add Button */}
                        <div className="flex-shrink-0">
                          {food.available ? (
                            <button
                              onClick={() => handleAddToCart(food)}
                              disabled={isAdding || isAdded}
                              className={`relative px-6 py-2 rounded-lg font-bold text-sm uppercase tracking-wide transition-all ${
                                isAdded 
                                  ? 'bg-green-500 text-white' 
                                  : 'bg-white text-green-600 border-2 border-green-600 hover:bg-green-50'
                              } disabled:opacity-70 shadow-sm`}
                            >
                              {isAdding ? (
                                <span className="flex items-center">
                                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-1" />
                                  Add
                                </span>
                              ) : isAdded ? (
                                <span className="flex items-center">
                                  <Check className="w-4 h-4 mr-1" /> ADDED
                                </span>
                              ) : (
                                <span className="flex items-center">
                                  <Plus className="w-4 h-4 mr-1" /> ADD
                                </span>
                              )}
                            </button>
                          ) : (
                            <span className="px-4 py-2 bg-gray-100 text-gray-500 rounded-lg text-sm font-medium">
                              Out of Stock
                            </span>
                          )}
                          
                          {isOwner() && (
                            <button
                              onClick={() => navigate(`/restaurant/${id}/edit-food/${food.id}`)}
                              className="block mt-2 text-center text-xs text-gray-400 hover:text-gray-600"
                            >
                              Edit
                            </button>
                          )}
                        </div>
                      </div>
                      
                      {/* Rating */}
                      <div className="flex items-center gap-1 mt-2">
                        <Star className="w-3 h-3 text-green-600 fill-current" />
                        <span className="text-xs font-medium text-green-600">4.2</span>
                        <span className="text-xs text-gray-400">(120 ratings)</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantDetail;