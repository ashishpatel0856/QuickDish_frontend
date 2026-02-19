import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { restaurantAPI, foodAPI, reviewAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { Star, Clock, MapPin, Phone, Mail, ChevronLeft, Plus, Minus, ShoppingCart, Heart, Share2, Info } from 'lucide-react';

const RestaurantDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, cartItems } = useCart();
  const [restaurant, setRestaurant] = useState(null);
  const [foodItems, setFoodItems] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [quantities, setQuantities] = useState({});

  useEffect(() => { fetchRestaurantData(); }, [id]);

  const fetchRestaurantData = async () => {
    try {
      setLoading(true);
      const [restRes, foodRes, reviewRes] = await Promise.all([
        restaurantAPI.getById(id),
        foodAPI.getByRestaurant(id),
        reviewAPI.getAll()
      ]);
      setRestaurant(restRes.data);
      setFoodItems(foodRes.data || []);
      setReviews(reviewRes.data?.filter(r => r.restaurantId === parseInt(id)) || []);
    } catch (error) { console.error('Failed to fetch:', error); }
    finally { setLoading(false); }
  };

  const handleQuantityChange = (foodId, delta) => {
    setQuantities(prev => ({ ...prev, [foodId]: Math.max(1, (prev[foodId] || 1) + delta) }));
  };

  const handleAddToCart = async (foodItem) => {
    const result = await addToCart(foodItem.id, quantities[foodItem.id] || 1);
    if (result.success) alert('Added to cart!');
    else alert(result.error || 'Failed to add');
  };

  const categories = ['all', ...new Set(foodItems.map(f => f.category).filter(Boolean))];
  const filteredFoods = activeCategory === 'all' ? foodItems : foodItems.filter(f => f.category === activeCategory);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-500"></div></div>;

  if (!restaurant) return <div className="min-h-screen flex items-center justify-center"><p>Restaurant not found</p></div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="relative h-64 md:h-80">
        <img src={restaurant.image?.[0] || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80'} alt={restaurant.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <button onClick={() => navigate(-1)} className="absolute top-4 left-4 p-2 bg-white/20 rounded-full text-white"><ChevronLeft className="w-6 h-6" /></button>
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{restaurant.name}</h1>
          <p className="mb-2">{restaurant.description}</p>
          <div className="flex gap-4 text-sm">
            <span className="flex items-center"><Star className="w-4 h-4 mr-1 text-yellow-400" />4.5 ({reviews.length})</span>
            <span className="flex items-center"><Clock className="w-4 h-4 mr-1" />30-40 min</span>
            <span className="flex items-center"><MapPin className="w-4 h-4 mr-1" />{restaurant.location}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
              {categories.map(cat => (
                <button key={cat} onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${activeCategory === cat ? 'bg-primary-500 text-white' : 'bg-white border'}`}>
                  {cat}
                </button>
              ))}
            </div>
            <div className="space-y-4">
              {filteredFoods.map(food => (
                <div key={food.id} className="bg-white rounded-2xl p-4 shadow-sm">
                  <div className="flex gap-4">
                    <img src={food.image?.[0] || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&q=80'} alt={food.name} className="w-24 h-24 object-cover rounded-xl" />
                    <div className="flex-1">
                      <h3 className="font-bold">{food.name}</h3>
                      <p className="text-gray-500 text-sm line-clamp-2">{food.description}</p>
                      <p className="text-lg font-bold mt-2">₹{food.price}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <button onClick={() => handleQuantityChange(food.id, -1)} className="p-1 border rounded"><Minus className="w-4 h-4" /></button>
                        <span>{quantities[food.id] || 1}</span>
                        <button onClick={() => handleQuantityChange(food.id, 1)} className="p-1 border rounded"><Plus className="w-4 h-4" /></button>
                        <button onClick={() => handleAddToCart(food)} className="ml-auto px-4 py-2 bg-primary-500 text-white rounded-lg text-sm">Add</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
              <h3 className="font-bold text-lg mb-4">Cart ({cartItems.length})</h3>
              {cartItems.length > 0 && (
                <button onClick={() => navigate('/cart')} className="w-full py-3 bg-primary-500 text-white rounded-xl">
                  View Cart
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetail;