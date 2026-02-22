import { useEffect, useState } from 'react';
import { restaurantAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchMyRestaurants();
  }, []);

  const fetchMyRestaurants = async () => {
    try {
      const res = await restaurantAPI.getAll(); 
      const myRestaurants = res.data.filter(r => r.owner?.id === user?.id);
      setRestaurants(myRestaurants);
    } catch (err) {
      console.error('Failed to fetch:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Restaurants</h1>
        <Link 
          to="/restaurant/add"
          className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 font-medium"
        >
          + Add Restaurant
        </Link>
      </div>

      {restaurants.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-lg shadow">
          <p className="text-gray-500 text-lg mb-4">No restaurants yet</p>
          <Link to="/restaurant/add" className="text-orange-500 hover:underline">
            Add your first restaurant →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {restaurants.map((restaurant) => (
            <div key={restaurant.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold">{restaurant.name}</h3>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  restaurant.approved 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {restaurant.approved ? 'Approved' : 'Pending'}
                </span>
              </div>
              
              <p className="text-gray-600 mb-4">{restaurant.description}</p>
              
              <div className="flex space-x-3">
                <Link 
                  to={`/restaurant/${restaurant.id}/manage`}
                  className="flex-1 text-center bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600"
                >
                  Manage
                </Link>
                <Link 
                  to={`/restaurant/${restaurant.id}/add-food`}
                  className="flex-1 text-center bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200"
                >
                  Add Food
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;