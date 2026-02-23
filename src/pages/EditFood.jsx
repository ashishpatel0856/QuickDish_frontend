import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { foodAPI } from '../services/api';

const EditFood = () => {
  const { id: restaurantId, foodId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFood();
  }, [foodId]);

  const fetchFood = async () => {
    try {
      const res = await foodAPI.getById(foodId);
      setFormData(res.data);
    } catch (error) {
      alert('Failed to fetch food item');
      navigate(`/restaurant/${restaurantId}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await foodAPI.update(foodId, formData);
      navigate(`/restaurant/${restaurantId}`);
    } catch (error) {
      alert('Failed to update food item');
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (!formData) return null;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md mt-8">
      <h1 className="text-2xl font-bold mb-6">Edit Food Item</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          className="w-full p-3 border rounded-lg"
        />
        <input
          type="number"
          value={formData.price}
          onChange={(e) => setFormData({...formData, price: e.target.value})}
          className="w-full p-3 border rounded-lg"
        />
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={formData.available}
            onChange={(e) => setFormData({...formData, available: e.target.checked})}
            className="w-4 h-4"
          />
          <span>Available</span>
        </label>
        <button
          type="submit"
          className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600"
        >
          Update Food Item
        </button>
      </form>
    </div>
  );
};

export default EditFood;