import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, cartTotal, updateQuantity, removeFromCart, loading } = useCart();
  const [updatingItems, setUpdatingItems] = useState({});

  const handleQuantityChange = async (cartId, currentQty, delta) => {
    const newQty = currentQty + delta;
    if (newQty < 1) return;
    setUpdatingItems({ ...updatingItems, [cartId]: true });
    await updateQuantity(cartId, newQty);
    setUpdatingItems({ ...updatingItems, [cartId]: false });
  };

  const handleRemove = async (cartId) => {
    if (window.confirm('Remove this item from cart?')) await removeFromCart(cartId);
  };

  const deliveryFee = cartTotal > 500 ? 0 : 50;
  const tax = cartTotal * 0.05;
  const total = cartTotal + deliveryFee + tax;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6"><ShoppingBag className="w-12 h-12 text-gray-400" /></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">Looks like you haven't added anything yet</p>
          <button onClick={() => navigate('/restaurants')} className="px-8 py-3 bg-primary-500 text-white rounded-full font-semibold hover:bg-primary-600">Browse Restaurants</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex gap-4">
                  <img src={item.foodItem?.image?.[0] || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&q=80'} alt={item.foodItem?.name} className="w-24 h-24 object-cover rounded-xl" />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">{item.foodItem?.name}</h3>
                        <p className="text-gray-500 text-sm mt-1">{item.foodItem?.description}</p>
                        <p className="text-primary-600 font-bold mt-2">₹{item.foodItem?.price}</p>
                      </div>
                      <button onClick={() => handleRemove(item.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-5 h-5" /></button>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center border border-gray-200 rounded-lg">
                        <button onClick={() => handleQuantityChange(item.id, item.quantity, -1)} disabled={updatingItems[item.id] || loading} className="p-2 hover:bg-gray-100 rounded-l-lg disabled:opacity-50"><Minus className="w-4 h-4" /></button>
                        <span className="px-4 font-medium">{item.quantity}</span>
                        <button onClick={() => handleQuantityChange(item.id, item.quantity, 1)} disabled={updatingItems[item.id] || loading} className="p-2 hover:bg-gray-100 rounded-r-lg disabled:opacity-50"><Plus className="w-4 h-4" /></button>
                      </div>
                      <p className="font-bold text-lg">₹{(item.foodItem?.price || 0) * item.quantity}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
              <h3 className="font-bold text-xl mb-6">Order Summary</h3>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>₹{cartTotal.toFixed(2)}</span></div>
                <div className="flex justify-between text-gray-600"><span>Delivery Fee</span><span>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span></div>
                <div className="flex justify-between text-gray-600"><span>Tax (5%)</span><span>₹{tax.toFixed(2)}</span></div>
                {deliveryFee === 0 && <p className="text-sm text-green-600">You saved ₹50 on delivery!</p>}
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between font-bold text-lg"><span>Total</span><span>₹{total.toFixed(2)}</span></div>
                </div>
              </div>
              <button onClick={() => navigate('/checkout')} className="w-full py-4 bg-primary-500 text-white rounded-xl font-bold text-lg hover:bg-primary-600 flex items-center justify-center">Proceed to Checkout<ArrowRight className="w-5 h-5 ml-2" /></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;