import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { restaurantAPI, foodAPI } from '../services/api';
import { Search, Star, Clock, MapPin, ChevronRight, Flame, Percent, Bike } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [restaurantsRes] = await Promise.all([restaurantAPI.getAll()]);
      setRestaurants(restaurantsRes.data || []);
      const allCategories = ['All', ...new Set(restaurantsRes.data?.map(r => r.category) || [])];
      setCategories(allCategories);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRestaurants = selectedCategory === 'All' ? restaurants : restaurants.filter(r => r.category === selectedCategory);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/search?name=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="relative bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1920&q=80')] opacity-10 bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">Craving Something <span className="text-yellow-300">Delicious?</span></h1>
            <p className="text-lg md:text-xl text-white/90 mb-8">Order from your favorite restaurants and get food delivered in minutes</p>
            
            <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
              <div className="relative flex items-center">
                <input type="text" placeholder="Search for restaurants or dishes..." value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-14 pr-32 py-4 md:py-5 rounded-full text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-white/30 shadow-2xl" />
                <Search className="absolute left-5 w-6 h-6 text-gray-400" />
                <button type="submit" className="absolute right-2 px-6 py-2.5 md:py-3 bg-primary-500 text-white rounded-full font-semibold hover:bg-primary-600 transition-colors">Search</button>
              </div>
            </form>

            <div className="flex flex-wrap justify-center gap-6 md:gap-12 mt-12">
              <div className="flex items-center space-x-2">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center"><Bike className="w-6 h-6" /></div>
                <div className="text-left"><p className="font-bold text-xl">30 min</p><p className="text-sm text-white/80">Delivery</p></div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center"><Star className="w-6 h-6" /></div>
                <div className="text-left"><p className="font-bold text-xl">4.8</p><p className="text-sm text-white/80">Rating</p></div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center"><MapPin className="w-6 h-6" /></div>
                <div className="text-left"><p className="font-bold text-xl">500+</p><p className="text-sm text-white/80">Restaurants</p></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 bg-white shadow-sm sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-4 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => (
              <button key={category} onClick={() => setSelectedCategory(category)}
                className={`category-pill whitespace-nowrap ${selectedCategory === category ? 'active' : ''}`}>
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Restaurants */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Popular Restaurants</h2>
            <p className="text-gray-500 mt-1">Top rated restaurants near you</p>
          </div>
          <Link to="/restaurants" className="flex items-center text-primary-600 font-semibold hover:text-primary-700 transition-colors">View All <ChevronRight className="w-5 h-5 ml-1" /></Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
                <div className="h-48 bg-gray-200" />
                <div className="p-4 space-y-3">
                  <div className="h-6 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRestaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        )}
      </section>

      {/* Promotions */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">Special Offers</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <PromotionCard icon={Percent} title="50% OFF" description="On your first order above Rs299" color="bg-gradient-to-br from-accent-500 to-accent-600" />
            <PromotionCard icon={Flame} title="Free Delivery" description="On orders above Rs199" color="bg-gradient-to-br from-primary-500 to-primary-600" />
            <PromotionCard icon={Clock} title="Express Delivery" description="Get food in 20 minutes" color="bg-gradient-to-br from-secondary-500 to-secondary-600" />
          </div>
        </div>
      </section>
    </div>
  );
};

const RestaurantCard = ({ restaurant }) => (
  <Link to={`/restaurant/${restaurant.id}`} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 card-hover">
    <div className="relative h-48 overflow-hidden">
      <img src={restaurant.image?.[0] || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80'} alt={restaurant.name}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
      <div className="absolute top-3 left-3">
        <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-gray-800">{restaurant.category}</span>
      </div>
      <div className="absolute top-3 right-3">
        <span className="flex items-center px-2 py-1 bg-green-500 text-white rounded-lg text-sm font-semibold"><Star className="w-3 h-3 mr-1 fill-current" />4.5</span>
      </div>
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
        <p className="text-white text-sm font-medium flex items-center">
          <Clock className="w-4 h-4 mr-1" />30-40 min • ₹50 delivery</p>
      </div>
    </div>
    <div className="p-4">
      <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors">{restaurant.name}</h3>
      <p className="text-gray-500 text-sm mt-1 line-clamp-1">{restaurant.description}</p>
      <div className="flex items-center justify-between mt-3">
        <span className="text-sm text-gray-500 flex items-center">
          <MapPin className="w-4 h-4 mr-1" />{restaurant.location}
          </span>
        <span className="text-primary-600 font-semibold text-sm">View Menu</span>
      </div>
    </div>
  </Link>
);

const PromotionCard = ({ icon: Icon, title, description, color }) => (
  <div className={`${color} rounded-2xl p-6 text-white shadow-lg transform hover:scale-105 transition-transform duration-300`}>
    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
    <Icon className="w-6 h-6" />
    </div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-white/90 text-sm">{description}</p>
  </div>
);

export default Home;