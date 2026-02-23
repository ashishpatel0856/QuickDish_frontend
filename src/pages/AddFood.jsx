import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { foodAPI } from '../services/api';
import { Plus, X } from 'lucide-react';

const AddFood = () => {
  const { id: restaurantId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    images: [], 
    preparationTime: '',
    quantity: '',
    available: true
  });

  const addImageField = () => {
    setFormData({...formData, images: [...formData.images, '']});
  };

  const removeImageField = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({...formData, images: newImages});
  };

  const updateImage = (index, value) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData({...formData, images: newImages});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Filter empty images
    const validImages = formData.images.filter(img => img.trim() !== '');
    
    try {
      setLoading(true);
      await foodAPI.create({
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        images: validImages, 
        preparationTime: parseInt(formData.preparationTime) || 0,
        quantity: parseInt(formData.quantity) || 0,
        available: formData.available,
        restaurantId: parseInt(restaurantId)
      });
      navigate(`/restaurant/${restaurantId}`);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to add food item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md mt-8">
      <h1 className="text-2xl font-bold mb-6">Add Food Item</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Food Name"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          className="w-full p-3 border rounded-lg"
          required
        />
        
        <textarea
          placeholder="Description"
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          className="w-full p-3 border rounded-lg"
          required
        />
        
        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            step="0.01"
            placeholder="Price (₹)"
            value={formData.price}
            onChange={(e) => setFormData({...formData, price: e.target.value})}
            className="w-full p-3 border rounded-lg"
            required
          />
          <input
            type="text"
            placeholder="Category"
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
            className="w-full p-3 border rounded-lg"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Food Images</label>
          {formData.images.map((img, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="url"
                placeholder={`Image URL ${index + 1}`}
                value={img}
                onChange={(e) => updateImage(index, e.target.value)}
                className="flex-1 p-3 border rounded-lg"
              />
              <button
                type="button"
                onClick={() => removeImageField(index)}
                className="p-3 text-red-500 hover:bg-red-50 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addImageField}
            className="flex items-center gap-2 text-orange-500 hover:text-orange-600"
          >
            <Plus className="w-4 h-4" /> Add Image
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            placeholder="Preparation Time (mins)"
            value={formData.preparationTime}
            onChange={(e) => setFormData({...formData, preparationTime: e.target.value})}
            className="w-full p-3 border rounded-lg"
          />
          <input
            type="number"
            placeholder="Quantity Available"
            value={formData.quantity}
            onChange={(e) => setFormData({...formData, quantity: e.target.value})}
            className="w-full p-3 border rounded-lg"
          />
        </div>

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={formData.available}
            onChange={(e) => setFormData({...formData, available: e.target.checked})}
            className="w-4 h-4"
          />
          <span>Available for ordering</span>
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 disabled:opacity-50"
        >
          {loading ? 'Adding...' : 'Add Food Item'}
        </button>
      </form>
    </div>
  );
};

export default AddFood;