import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { restaurantAPI } from '../services/api';
import { Star, Clock, MapPin, Filter, Search } from 'lucide-react';

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const response = await restaurantAPI.getAll();
      setRestaurants(response.data || []);
    } catch (error) {
      console.error('Failed to fetch restaurants:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRestaurants = restaurants.filter(r => {
    const matchesFilter = filter === 'all' || r.category?.toLowerCase() === filter;
    const matchesSearch = r.name?.toLowerCase().includes(searchQuery.toLowerCase()) || r.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const categories = ['all', ...new Set(restaurants.map(r => r.category?.toLowerCase()).filter(Boolean))];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">All Restaurants</h1>
          <p className="text-gray-500">Discover the best food from over {restaurants.length} restaurants</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="text" placeholder="Search restaurants..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
            </div>
            <div className="flex items-center space-x-2 overflow-x-auto pb-2 md:pb-0">
              <Filter className="w-5 h-5 text-gray-400 flex-shrink-0" />
              {categories.map((cat) => (
                <button key={cat} onClick={() => setFilter(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${filter === cat ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
                <div className="h-48 bg-gray-200" />
                <div className="p-4 space-y-3"><div className="h-6 bg-gray-200 rounded w-3/4" /><div className="h-4 bg-gray-200 rounded w-1/2" /></div>
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

        {!loading && filteredRestaurants.length === 0 && (
          <div className="text-center py-12"><p className="text-gray-500 text-lg">No restaurants found matching your criteria</p></div>
        )}
      </div>
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
    </div>
    <div className="p-4">
      <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors">{restaurant.name}</h3>
      <p className="text-gray-500 text-sm mt-1 line-clamp-2">{restaurant.description}</p>
      <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
        <span className="flex items-center"><Clock className="w-4 h-4 mr-1" />30-40 min</span>
        <span className="flex items-center"><MapPin className="w-4 h-4 mr-1" />{restaurant.location}</span>
      </div>
    </div>
  </Link>
);

export default RestaurantList;