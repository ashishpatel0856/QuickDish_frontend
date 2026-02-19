import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { foodAPI } from '../services/api';
import { Search, ArrowLeft, Star } from 'lucide-react';

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('name') || '';
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(query);

  useEffect(() => { if (query) performSearch(query); }, [query]);

  const performSearch = async (searchTerm) => {
    setLoading(true);
    try {
      const response = await foodAPI.search(searchTerm);
      setResults(response.data || []);
    } catch (error) { console.error('Search failed:', error); }
    finally { setLoading(false); }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) setSearchParams({ name: searchQuery });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
          <Link to="/" className="flex items-center text-gray-600 hover:text-gray-900 w-fit"><ArrowLeft className="w-5 h-5 mr-1" />Back</Link>
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
            <div className="relative">
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search food items..." className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500" />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </form>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-6">{loading ? 'Searching...' : `${results.length} results for "${query}"`}</h1>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse"><div className="h-48 bg-gray-200" /><div className="p-4 space-y-3"><div className="h-6 bg-gray-200 rounded w-3/4" /><div className="h-4 bg-gray-200 rounded w-1/2" /></div></div>
            ))}
          </div>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((food) => (
              <Link key={food.id} to={`/restaurant/${food.restaurantId}`} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 card-hover">
                <div className="relative h-48 overflow-hidden">
                  <img src={food.image?.[0] || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80'} alt={food.name} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                  <div className="absolute top-3 right-3"><span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-sm font-bold text-gray-900">₹{food.price}</span></div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg text-gray-900">{food.name}</h3>
                  <p className="text-gray-500 text-sm mt-1 line-clamp-2">{food.description}</p>
                  <div className="flex items-center justify-between mt-4">
                    <span className="flex items-center text-sm text-gray-500"><Star className="w-4 h-4 mr-1 text-yellow-400 fill-current" />4.5</span>
                    <span className="text-primary-600 font-medium text-sm">View Restaurant →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6"><Search className="w-12 h-12 text-gray-400" /></div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">No results found</h2>
            <p className="text-gray-500">Try searching with different keywords</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;