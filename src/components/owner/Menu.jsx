import { useEffect, useState } from 'react';
import { foodAPI, restaurantAPI } from '../../services/api';  // ✅ FIXED: Added restaurantAPI
import { useAuth } from '../../context/AuthContext';

const Menu = () => {
  const [foods, setFoods] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const res = await restaurantAPI.getAll();  // ✅ Now works!
      const myRestaurants = res.data.filter(r => r.owner?.id === user?.id);
      setRestaurants(myRestaurants);
      if (myRestaurants.length > 0) {
        setSelectedRestaurant(myRestaurants[0].id);
        fetchFoods(myRestaurants[0].id);
      }
    } catch (err) {
      console.error('Failed to fetch restaurants:', err);
    }
  };

  const fetchFoods = async (restaurantId) => {
    try {
      const res = await foodAPI.getMyRestaurantFoods(restaurantId);
      setFoods(res.data);
    } catch (err) {
      console.error('Failed to fetch foods:', err);
    }
  };

  const handleRestaurantChange = (e) => {
    const id = e.target.value;
    setSelectedRestaurant(id);
    fetchFoods(id);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Manage Menu</h1>
      
      {restaurants.length > 0 && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Restaurant
          </label>
          <select 
            value={selectedRestaurant}
            onChange={handleRestaurantChange}
            className="w-full md:w-1/3 p-3 border rounded-lg"
          >
            {restaurants.map(r => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>
        </div>
      )}

      {foods.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-lg">
          <p className="text-gray-500">No food items yet</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {foods.map((food) => (
                <tr key={food.id}>
                  <td className="px-6 py-4">
                    <img src={food.image} alt={food.name} className="w-12 h-12 rounded object-cover" />
                  </td>
                  <td className="px-6 py-4 font-medium">{food.name}</td>
                  <td className="px-6 py-4">₹{food.price}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs ${
                      food.approved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {food.approved ? 'Approved' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-orange-600 hover:text-orange-800 mr-3">Edit</button>
                    <button className="text-red-600 hover:text-red-800">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Menu;