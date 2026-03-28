import { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { restaurantAPI } from '../services/api';
import { Search, Star, Clock, MapPin, ChevronRight,Flame, Percent, Bike, UtensilsCrossed} from 'lucide-react';

const DEFAULT_RESTAURANT_IMAGE = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80';
const HERO_BG_IMAGE = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1920&q=80';
const DELIVERY_TIME = '30-40 min';
const DELIVERY_FEE = '50';
const DEFAULT_RATING = '4.5';

const CategoryPill = memo(({ category, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`
      px-6 py-2.5 rounded-full text-sm font-medium whitespace-nowrap
      transition-all duration-200 ease-out 
      ${isActive 
        ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' 
        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
      }
    `} >
    {category}
  </button>
));

CategoryPill.displayName = 'CategoryPill';

// Restaurant Card Component
const RestaurantCard = memo(({ restaurant }) => {
  const imageUrl = restaurant.image?.[0] || DEFAULT_RESTAURANT_IMAGE;
  
  return (
    <Link 
      to={`/restaurant/${restaurant.id}`}
      className="group block bg-white rounded-2xl overflow-hidden shadow-sm   
       hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={imageUrl}
          alt={restaurant.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"/>
        
        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1.5 bg-white/95 backdrop-blur-sm rounded-full 
                         text-xs font-semibold text-gray-800 shadow-sm">
            {restaurant.category}
          </span>
        </div>
        
        {/* Rating Badge */}
        <div className="absolute top-3 right-3">
          <span className="flex items-center gap-1 px-2.5 py-1 bg-green-500 
                         text-white rounded-lg text-sm font-semibold shadow-sm">
            <Star className="w-3.5 h-3.5 fill-current" />
            {DEFAULT_RATING}
          </span>
        </div>
        
        {/* Delivery Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t 
                      from-black/70 via-black/40 to-transparent p-4">
          <p className="text-white text-sm font-medium flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            {DELIVERY_TIME} • {DELIVERY_FEE} delivery
          </p>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 group-hover:text-orange-500 
                     transition-colors line-clamp-1">
          {restaurant.name}
        </h3>
        <p className="text-gray-500 text-sm mt-1.5 line-clamp-1">
          {restaurant.description || 'Delicious food delivered to your doorstep'}
        </p>
        
        <div className="flex items-center justify-between mt-3">
          <span className="text-sm text-gray-500 flex items-center gap-1">
            <MapPin className="w-4 h-4 text-gray-400" />
            {restaurant.location || 'Nearby'}
          </span>
          <span className="text-orange-500 font-semibold text-sm flex items-center gap-1 
                         group-hover:gap-2 transition-all">
            View Menu
            <ChevronRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </Link>
  );
});

RestaurantCard.displayName = 'RestaurantCard';

// Promotion Card Component
const PromotionCard = memo(({ icon: Icon, title, description, gradient }) => (
  <div className={`${gradient} rounded-2xl p-6 text-white shadow-lg 
                  hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer`}>
    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 
                  backdrop-blur-sm">
      <Icon className="w-6 h-6" />
    </div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-white/90 text-sm leading-relaxed">{description}</p>
  </div>
));

PromotionCard.displayName = 'PromotionCard';

// Skeleton Loader Component
const RestaurantSkeleton = memo(() => (
  <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
    <div className="h-48 bg-gray-200 animate-pulse" />
    <div className="p-4 space-y-3">
      <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse" />
      <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
      <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
    </div>
  </div>
));

RestaurantSkeleton.displayName = 'RestaurantSkeleton';

// Hero Stats Component
const HeroStat = memo(({ icon: Icon, value, label }) => (
  <div className="flex items-center gap-3">
    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center 
                  backdrop-blur-sm">
      <Icon className="w-6 h-6 text-white" />
    </div>
    <div className="text-left">
      <p className="font-bold text-xl text-white">{value}</p>
      <p className="text-sm text-white/80">{label}</p>
    </div>
  </div>
));

HeroStat.displayName = 'HeroStat';

// Main Home Component
const Home = () => {
  const navigate = useNavigate();
  
  // State
  const [restaurants, setRestaurants] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Fetch data
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await restaurantAPI.getAll();
      const restaurantList = data || [];
      
      setRestaurants(restaurantList);  
      const uniqueCategories = [
        'All', 
        ...new Set(restaurantList.map(r => r.category).filter(Boolean))
      ];
      setCategories(uniqueCategories);
      
    } catch (err) {
      console.error('Failed to fetch restaurants:', err);
      setError('Unable to load restaurants. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);


  // Memoized filtered restaurants
  const filteredRestaurants = useMemo(() => {
    if (selectedCategory === 'All') return restaurants;
    return restaurants.filter(r => r.category === selectedCategory);
  }, [restaurants, selectedCategory]);

  // Handlers
  const handleSearch = useCallback((e) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (query) {
      navigate(`/search?name=${encodeURIComponent(query)}`);
    }
  }, [searchQuery, navigate]);

  const handleCategoryChange = useCallback((category) => {
    setSelectedCategory(category);
  }, []);

  
  // Promotion data
  const promotions = useMemo(() => [
    {
      icon: Percent,
      title: '50% OFF',
      description: 'On your first order above Rs299',
      gradient: 'bg-gradient-to-br from-rose-500 to-rose-600'
    },
    {
      icon: Bike,
      title: 'Free Delivery',
      description: 'On orders above Rs199',
      gradient: 'bg-gradient-to-br from-orange-500 to-red-500'
    },
    {
      icon: Flame,
      title: 'Express Delivery',
      description: 'Get food in 20 minutes',
      gradient: 'bg-gradient-to-br from-amber-500 to-orange-500'
    }
  ], []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 
                        text-white overflow-hidden">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{ backgroundImage: `url(${HERO_BG_IMAGE})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        
        {/* Hero Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Craving Something{' '}
              <span className="text-yellow-300">Delicious?</span>
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Order from your favorite restaurants and get food delivered in minutes
            </p>
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
              <div className="relative flex items-center bg-white rounded-full shadow-2xl 
                            p-2 focus-within:ring-4 focus-within:ring-white/30 transition-shadow">
                <Search className="absolute left-5 w-6 h-6 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for restaurants or dishes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-14 pr-32 py-3 md:py-4 rounded-full text-gray-900 
                           placeholder-gray-400 focus:outline-none bg-transparent"
                />
                <button
                  type="submit"
                  className="absolute right-2 px-6 py-2.5 md:py-3 bg-orange-500 text-white 
                           rounded-full font-semibold hover:bg-orange-600 transition-colors 
                           disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!searchQuery.trim()}
                >
                  Search
                </button>
              </div>
            </form>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 md:gap-12 mt-12">
              <HeroStat icon={Bike} value="30 min" label="Delivery" />
              <HeroStat icon={Star} value="4.8" label="Rating" />
              <HeroStat icon={MapPin} value="500+" label="Restaurants" />
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-6 bg-white shadow-sm sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide 
                        snap-x snap-mandatory">
            {categories.map((category) => (
              <div key={category} className="snap-start">
                <CategoryPill
                  category={category}
                  isActive={selectedCategory === category}
                  onClick={() => handleCategoryChange(category)}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Restaurants Section */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Popular Restaurants
            </h2>
            <p className="text-gray-500 mt-1">Top rated restaurants near you</p>
          </div>
          <Link 
            to="/restaurants" 
            className="flex items-center text-orange-500 font-semibold 
                     hover:text-orange-600 transition-colors group"
          >
            View All
            <ChevronRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Error State */}
        {error && (
          <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
            <UtensilsCrossed className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">{error}</p>
            <button 
              onClick={fetchData}
              className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-full 
                       hover:bg-orange-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Loading State */}
        {!error && loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <RestaurantSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!error && !loading && filteredRestaurants.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
            <UtensilsCrossed className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">No restaurants found</p>
            <p className="text-gray-400 text-sm mt-1">
              Try selecting a different category
            </p>
          </div>
        )}

        {/* Restaurant Grid */}
        {!error && !loading && filteredRestaurants.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRestaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        )}
      </section>

      {/* Promotions Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
            Special Offers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {promotions.map((promo, index) => (
              <PromotionCard key={index} {...promo} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;