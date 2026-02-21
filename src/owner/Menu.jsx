import { useState, useEffect } from 'react';
import { foodAPI } from '../services/api';
import { Plus, Edit2, Trash2, CheckCircle, Clock } from 'lucide-react';

const OwnerMenu = () => {
  const [foods, setFoods] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '', description: '', price: '', category: '', image: ''
  });

  const restaurantId = 1; // TODO: Get from user context

  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    const res = await foodAPI.getByRestaurant(restaurantId);
    setFoods(res.data || []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await foodAPI.create({
      ...formData,
      restaurantId,
      price: parseFloat(formData.price),
      image: [formData.image]
    });
    alert('Added! Waiting for approval.');
    setShowForm(false);
    setFormData({ name: '', description: '', price: '', category: '', image: '' });
    fetchFoods();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Menu Management</h2>
        <button onClick={() => setShowForm(!showForm)} className="bg-primary-500 text-white px-4 py-2 rounded-lg">
          + Add Food
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm mb-6">
          <div className="grid grid-cols-2 gap-4">
            <input placeholder="Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="border p-3 rounded-xl" required />
            <input placeholder="Price" type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="border p-3 rounded-xl" required />
            <input placeholder="Category" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="border p-3 rounded-xl" required />
            <input placeholder="Image URL" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className="border p-3 rounded-xl" />
          </div>
          <textarea placeholder="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full border p-3 rounded-xl mt-4" rows="3" required />
          <button type="submit" className="bg-primary-500 text-white px-6 py-2 rounded-xl mt-4">Submit for Approval</button>
        </form>
      )}

      <div className="grid grid-cols-3 gap-6">
        {foods.map(food => (
          <div key={food.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="relative h-48">
              <img src={food.image?.[0]} alt={food.name} className="w-full h-full object-cover" />
              <span className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs text-white ${food.approved ? 'bg-green-500' : 'bg-yellow-500'}`}>
                {food.approved ? <><CheckCircle className="w-3 h-3 inline mr-1" /> Live</> : <><Clock className="w-3 h-3 inline mr-1" /> Pending</>}
              </span>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg">{food.name}</h3>
              <p className="text-gray-500">{food.category}</p>
              <p className="text-xl font-bold text-primary-600 mt-2">₹{food.price}</p>
              <div className="flex gap-2 mt-4">
                <button className="flex-1 py-2 border rounded-lg text-sm"><Edit2 className="w-4 h-4 inline mr-1" /> Edit</button>
                <button className="flex-1 py-2 border border-red-200 text-red-600 rounded-lg text-sm"><Trash2 className="w-4 h-4 inline mr-1" /> Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OwnerMenu;