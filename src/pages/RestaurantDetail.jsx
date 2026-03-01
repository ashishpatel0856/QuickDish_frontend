import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { restaurantAPI, foodAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Star, Clock, MapPin, Plus, Check, ShoppingBag, Heart, Share2, Info, IndianRupee } from 'lucide-react';

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

  // Helper: Get first image from array or string
  const getImage = (imageData) => {
    if (!imageData) return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80';
    if (Array.isArray(imageData) && imageData.length > 0) return imageData[0];
    if (typeof imageData === 'string') return imageData;
    return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80';
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

  const restaurantImage = getImage(restaurant.image);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Mobile Cart Button */}
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

      {/* Hero Section */}
      <div className="bg-white">
        <div className="relative h-48 sm:h-56 md:h-64 lg:h-80">
          <img 
            src={restaurantImage}
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          
          {/* Top Bar */}
          <div className="absolute top-3 left-3 right-3 flex justify-between">
            <button 
              onClick={() => navigate(-1)}
              className="p-2 bg-black/30 backdrop-blur-sm rounded-full text-white hover:bg-black/50 transition"
            >
              ←
            </button>
            <div className="flex gap-2">
              <button className="p-2 bg-black/30 backdrop-blur-sm rounded-full text-white hover:bg-black/50 transition">
                <Share2 className="w-5 h-5" />
              </button>
              <button className="p-2 bg-black/30 backdrop-blur-sm rounded-full text-white hover:bg-black/50 transition">
                <Heart className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Restaurant Info */}
          <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 text-white">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">{restaurant.name}</h1>
              <p className="text-white/90 mt-1 text-sm sm:text-base line-clamp-1">{restaurant.description}</p>
            </div>
          </div>
        </div>

        {/* Details Bar */}
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 border-b">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm">
            <span className="flex items-center bg-green-100 text-green-800 px-2 py-1 rounded font-semibold">
              <Star className="w-3 h-3 sm:w-4 sm:h-4 mr-1 fill-current" /> 4.5
            </span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-700 font-medium">{restaurant.category}</span>
            <span className="text-gray-400 hidden sm:inline">•</span>
            <span className="flex items-center text-gray-600">
              <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1" /> 30-40 min
            </span>
            <span className="text-gray-400 hidden sm:inline">•</span>
            <span className="flex items-center text-gray-600 truncate max-w-[120px] sm:max-w-none">
              <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" /> 
              <span className="truncate">{restaurant.location || restaurant.address}</span>
            </span>
            
            {isOwner() && (
              <div className="ml-auto flex gap-2">
                <button 
                  onClick={() => navigate(`/restaurant/${id}/edit`)}
                  className="px-2 sm:px-3 py-1 bg-gray-100 text-gray-700 rounded text-xs sm:text-sm font-medium hover:bg-gray-200"
                >
                  Edit
                </button>
                <button 
                  onClick={() => navigate(`/restaurant/${id}/add-food`)}
                  className="px-2 sm:px-3 py-1 bg-orange-500 text-white rounded text-xs sm:text-sm font-medium hover:bg-orange-600"
                >
                  + Add
                </button>
              </div>
            )}
          </div>
          
          {/* Offers */}
          <div className="mt-2 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <span className="flex items-center px-2 sm:px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-xs font-medium whitespace-nowrap">
              <Info className="w-3 h-3 mr-1" /> 50% off up to ₹100
            </span>
            <span className="flex items-center px-2 sm:px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium whitespace-nowrap">
              FREE DELIVERY
            </span>
          </div>
        </div>
      </div>

      {/* Menu Section */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
            Menu ({foods.length} items)
          </h2>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 bg-white border rounded-lg text-xs sm:text-sm font-medium text-gray-600 hover:bg-gray-50">
              Veg Only
            </button>
            <button className="px-3 py-1.5 bg-white border rounded-lg text-xs sm:text-sm font-medium text-gray-600 hover:bg-gray-50 hidden sm:block">
              Bestseller
            </button>
          </div>
        </div>
        
        {foods.length === 0 ? (
          <div className="text-center py-12 sm:py-16 bg-white rounded-xl sm:rounded-2xl">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
            </div>
            <p className="text-gray-500 text-base sm:text-lg mb-2">No food items yet</p>
            {isOwner() && (
              <button
                onClick={() => navigate(`/restaurant/${id}/add-food`)}
                className="text-orange-500 hover:text-orange-600 font-medium text-sm sm:text-base"
              >
                Add your first item →
              </button>
            )}
          </div>
        ) : (

          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
            {foods.map((food) => {
              const foodImage = getImage(food.images || food.image);
              const isAdding = addingToCart[food.id];
              const isAdded = addedItems[food.id];
              
              return (
                <div 
                  key={food.id} 
                  className="bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 group"
                >
                  {/* Image Container - Fixed Aspect Ratio */}
                  <div className="relative w-full aspect-[4/3] overflow-hidden">
                    <img 
                      src={foodImage}
                      alt={food.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {food.preparationTime && (
                      <span className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded font-medium">
                        {food.preparationTime} min
                      </span>
                    )}
                    {/* Veg/Non-veg Badge */}
                    <div className="absolute top-2 left-2">
                      <span className="w-5 h-5 bg-white rounded-sm border-2 border-green-500 flex items-center justify-center">
                        <span className="w-2.5 h-2.5 bg-green-500 rounded-full">

                        </span>
                      </span>
                    </div>
                    {/* Bestseller Tag */}
                    {food.bestseller && (
                      <span className="absolute top-2 right-2 bg-orange-500 text-white text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wide">
                        Bestseller
                      </span>
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className="p-3 sm:p-4">
                    <div className="flex justify-between items-start gap-2 mb-1">
                      <h3 className="font-bold text-gray-900 text-sm sm:text-base line-clamp-1 flex-1">
                        {food.name}
                      </h3>
                    </div>
                    
                    <p className="text-gray-500 text-xs sm:text-sm line-clamp-2 mb-2 sm:mb-3 h-8 sm:h-10">
                      {food.description}
                    </p>
                    
                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-2">
                      <Star className="w-3 h-3 text-green-600 fill-current" />
                      <span className="text-xs font-semibold text-green-600">4.2</span>
                      <span className="text-xs text-gray-400">(120)</span>
                    </div>
                    
                    {/* Price & Add Button */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <IndianRupee className="w-3 h-3 sm:w-4 sm:h-4 text-gray-700" />
                        <span className="text-base sm:text-lg font-bold text-gray-900">{food.price}</span>
                      </div>
                      
                      {food.available ? (
                        <button
                          onClick={() => handleAddToCart(food)}
                          disabled={isAdding || isAdded}
                          className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-bold text-xs sm:text-sm uppercase tracking-wide transition-all ${
                            isAdded 
                              ? 'bg-green-500 text-white' 
                              : 'bg-white text-green-600 border-2 border-green-600 hover:bg-green-50 shadow-sm'
                          } disabled:opacity-70`}
                        >
                          {isAdding ? (
                            <span className="flex items-center gap-1">
                              <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                              Add
                            </span>
                          ) : isAdded ? (
                            <span className="flex items-center gap-1">
                              <Check className="w-3 h-3 sm:w-4 sm:h-4" /> Added
                            </span>
                          ) : (
                            <span className="flex items-center gap-1">
                              <Plus className="w-3 h-3 sm:w-4 sm:h-4" /> Add
                            </span>
                          )}
                        </button>
                      ) : (
                        <span className="px-2 sm:px-3 py-1 sm:py-1.5 bg-gray-100 text-gray-500 rounded text-xs font-medium">
                          Out of Stock
                        </span>
                      )}
                    </div>
                    
                    {/* Owner Edit */}
                    {isOwner() && (
                      <button
                        onClick={() => navigate(`/restaurant/${id}/edit-food/${food.id}`)}
                        className="w-full mt-2 text-center text-xs text-gray-400 hover:text-orange-500 py-1 border-t border-gray-100"
                      >
                        Edit Item
                      </button>
                    )}
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