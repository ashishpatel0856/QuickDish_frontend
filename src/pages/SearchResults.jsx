import { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { foodAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Search, ArrowLeft, Star, IndianRupee, Plus, Check, ShoppingBag, Clock, Heart, Share2 } from 'lucide-react';

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('name') || '';
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(query);
  const [addingToCart, setAddingToCart] = useState({});
  const [addedItems, setAddedItems] = useState({});
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => { 
    if (query) performSearch(query); 
  }, [query]);

  const performSearch = async (searchTerm) => {
    setLoading(true);
    try {
      const response = await foodAPI.search(searchTerm);
      setResults(response.data || []);
    } catch (error) { 
      console.error('Search failed:', error); 
    } finally { 
      setLoading(false); 
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) setSearchParams({ name: searchQuery });
  };

  const getImage = (imageData) => {
    if (!imageData) return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80';
    if (Array.isArray(imageData) && imageData.length > 0) return imageData[0];
    if (typeof imageData === 'string') return imageData;
    return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80';
  };

  const handleAddToCart = async (e, food) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/search?name=${query}` } });
      return;
    }
    setAddingToCart({ ...addingToCart, [food.id]: true });
    
    const result = await addToCart(food.id, 1);
    
    if (result.success) {
      setAddedItems({ ...addedItems, [food.id]: true });
      setCartCount(prev => prev + 1);
      setTimeout(() => {
        setAddedItems(prev => ({ ...prev, [food.id]: false }));
      }, 2000);
    } else {
      alert(result.error || 'Failed to add to cart');
    }
    
    setAddingToCart({ ...addingToCart, [food.id]: false });
  };

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

      {/* Header - Swiggy Style */}
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <Link to="/" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </Link>
            
            <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
              <div className="relative">
                <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                <input 
                  type="text" 
                  value={searchQuery} 
                  onChange={(e) => setSearchQuery(e.target.value)} 
                  placeholder="Search for food, restaurants..." 
                  className="w-full pl-9 sm:pl-12 pr-4 py-2.5 sm:py-3 bg-gray-100 border-transparent focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-200 rounded-xl transition-all outline-none text-sm sm:text-base" 
                />
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
            {loading ? 'Searching...' : `${results.length} results for "${query}"`}
          </h1>
          
          {/* Filter Buttons */}
          {!loading && results.length > 0 && (
            <div className="flex gap-2">
              <button className="px-3 py-1.5 bg-white border rounded-lg text-xs sm:text-sm font-medium text-gray-600 hover:bg-gray-50">
                Veg Only
              </button>
              <button className="px-3 py-1.5 bg-white border rounded-lg text-xs sm:text-sm font-medium text-gray-600 hover:bg-gray-50 hidden sm:block">
                Rating 4+
              </button>
            </div>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-sm animate-pulse">
                <div className="aspect-[4/3] bg-gray-200" />
                <div className="p-3 sm:p-4 space-y-2">
                  <div className="h-4 sm:h-5 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 sm:h-4 bg-gray-200 rounded w-1/2" />
                  <div className="flex justify-between pt-2">
                    <div className="h-4 sm:h-5 bg-gray-200 rounded w-16" />
                    <div className="h-8 sm:h-9 bg-gray-200 rounded w-20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : results.length > 0 ? (
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
            {results.map((food) => {
              const foodImage = getImage(food.image || food.images);
              const isAdding = addingToCart[food.id];
              const isAdded = addedItems[food.id];
              
              return (
                <div 
                  key={food.id} 
                  className="bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 group"
                >
                  {/* Image Container - Aspect Ratio */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Link to={`/restaurant/${food.restaurantId}`}>
                      <img 
                        src={foodImage}
                        alt={food.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </Link>
                    
                    {/* Veg/Non-veg Badge */}
                    <div className="absolute top-2 left-2">
                      <span className="w-4 h-4 sm:w-5 sm:h-5 bg-white rounded-sm border-2 border-green-500 flex items-center justify-center">
                        <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 bg-green-500 rounded-full"></span>
                      </span>
                    </div>
                    
                    {/* Bestseller Tag */}
                    {food.bestseller && (
                      <span className="absolute top-2 right-2 bg-orange-500 text-white text-[10px] sm:text-xs px-2 py-0.5 rounded font-bold uppercase tracking-wide">
                        Bestseller
                      </span>
                    )}
                    
                    {/* Time Badge */}
                    <span className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded font-medium">
                      25-30 min
                    </span>
                  </div>
                  
                 

                  <div className="p-3 sm:p-4">
                    <div className="flex justify-between items-start gap-2 mb-1">
                      <Link 
                        to={`/restaurant/${food.restaurantId}`}
                        className="flex-1 min-w-0"
                      >
                        <h3 className="font-bold text-gray-900 text-sm sm:text-base line-clamp-1 hover:text-orange-500 transition-colors">
                          {food.name}
                        </h3>
                      </Link>
                      <div className="flex items-center text-gray-900 font-bold text-sm sm:text-base flex-shrink-0">
                        <IndianRupee className="w-3 sm:w-4 h-3 sm:h-4" />
                        {food.price}
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-500 text-xs sm:text-sm line-clamp-2 mb-2 sm:mb-3 h-8 sm:h-10">
                      {food.description}
                    </p>

                    {/* Restaurant Name */}
                    {/* <p className="text-gray-400 text-xs font-medium mb-2 sm:mb-3">
                      {food.restaurantName || 'QuickDish Restaurant'}
                    </p> */}

                    
                    <div className="flex items-center gap-1 mb-2 sm:mb-3">
                      <Star className="w-3 h-3 text-green-600 fill-current" />
                      <span className="text-xs font-semibold text-green-600">4.2</span>
                      <span className="text-xs text-gray-400">(120 ratings)</span>
                    </div>

                    
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      {food.available !== false ? (
                        <button
                          onClick={(e) => handleAddToCart(e, food)}
                          disabled={isAdding || isAdded}
                          className={`flex-1 py-2 rounded-lg font-bold text-xs sm:text-sm uppercase tracking-wide transition-all ${
                            isAdded 
                              ? 'bg-green-500 text-white' 
                              : 'bg-white text-green-600 border-2 border-green-600 hover:bg-green-50 shadow-sm'
                          } disabled:opacity-70`}
                        >
                          {isAdding ? (
                            <span className="flex items-center justify-center gap-1">
                              <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                              Add
                            </span>
                          ) : isAdded ? (
                            <span className="flex items-center justify-center gap-1">
                              <Check className="w-3 h-3 sm:w-4 sm:h-4" /> Added
                            </span>
                          ) : (
                            <span className="flex items-center justify-center gap-1">
                              <Plus className="w-3 h-3 sm:w-4 sm:h-4" /> Add
                            </span>
                          )}
                        </button>
                      ) : (
                        <span className="flex-1 py-2 bg-gray-100 text-gray-500 rounded-lg text-xs sm:text-sm font-medium text-center">
                          Out of Stock
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-12 sm:py-16">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <Search className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">No results found</h2>
            <p className="text-gray-500 text-sm sm:text-base">Try searching with different keywords</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;