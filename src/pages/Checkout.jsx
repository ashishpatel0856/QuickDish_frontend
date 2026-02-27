import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { orderAPI } from '../services/api';
import { MapPin, CreditCard, Truck, Check, Loader2,IndianRupeeIcon } from 'lucide-react';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, cartTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [orderData, setOrderData] = useState({ deliveryAddress: '', notes: '', paymentMethod: 'cod' });

  const deliveryFee = cartTotal > 500 ? 0 : 50;
  const tax = cartTotal * 0.05;
  const total = cartTotal + deliveryFee + tax;

  const handleInputChange = (e) => setOrderData({ ...orderData, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!orderData.deliveryAddress.trim()) { alert('Please enter delivery address'); return; }
    setLoading(true);
    try {
      const restaurantId = cartItems[0]?.foodItem?.restaurantId || 1;
      await orderAPI.create({ restaurantId, totalPrice: total, deliveryAddress: orderData.deliveryAddress, notes: orderData.notes });
      clearCart();
      navigate('/orders');
    } catch (error) {
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="text-center"><h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2><button onClick={() => navigate('/restaurants')} className="px-8 py-3 bg-primary-500 text-white rounded-full font-semibold">Browse Restaurants</button></div></div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
        <div className="flex items-center justify-center mb-8">
          <div className={`flex items-center ${step >= 1 ? 'text-primary-600' : 'text-gray-400'}`}><div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-primary-500 text-white' : 'bg-gray-200'}`}><MapPin className="w-5 h-5" /></div><span className="ml-2 font-medium">Address</span></div>
          <div className="w-16 h-1 bg-gray-200 mx-4"></div>
          <div className={`flex items-center ${step >= 2 ? 'text-primary-600' : 'text-gray-400'}`}><div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-primary-500 text-white' : 'bg-gray-200'}`}><CreditCard className="w-5 h-5" /></div><span className="ml-2 font-medium">Payment</span></div>
          <div className="w-16 h-1 bg-gray-200 mx-4"></div>
          <div className={`flex items-center ${step >= 3 ? 'text-primary-600' : 'text-gray-400'}`}><div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-primary-500 text-white' : 'bg-gray-200'}`}><Check className="w-5 h-5" /></div><span className="ml-2 font-medium">Confirm</span></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {step === 1 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="font-bold text-xl mb-6">Delivery Address</h3>
                <div className="space-y-4">
                  <div><label className="block text-sm font-medium text-gray-700 mb-2">Full Address</label><textarea name="deliveryAddress" value={orderData.deliveryAddress} onChange={handleInputChange} rows={4} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500" placeholder="Enter your complete delivery address..." /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-2">Delivery Instructions (Optional)</label><input type="text" name="notes" value={orderData.notes} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500" placeholder="e.g., Ring the doorbell..." /></div>
                  <button onClick={() => setStep(2)} className="w-full py-3 bg-primary-500 text-white rounded-xl font-semibold hover:bg-primary-600">Continue to Payment</button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="font-bold text-xl mb-6">Payment Method</h3>
                <div className="space-y-4">
                  <label className="flex items-center p-4 border-2 border-primary-500 rounded-xl cursor-pointer bg-primary-50">
                    <input type="radio" name="paymentMethod" value="cod" checked={orderData.paymentMethod === 'cod'} onChange={handleInputChange} className="w-4 h-4 text-primary-600" />
                    <div className="ml-4"><p className="font-semibold">Cash on Delivery</p><p className="text-sm text-gray-500">Pay when your order arrives</p></div>
                    <Truck className="w-6 h-6 ml-auto text-primary-500" />
                  </label>
                </div>
                <div className="flex gap-4 mt-6">
                  <button onClick={() => setStep(1)} className="flex-1 py-3 border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50">Back</button>
                  <button onClick={() => setStep(3)} className="flex-1 py-3 bg-primary-500 text-white rounded-xl font-semibold hover:bg-primary-600">Review Order</button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="font-bold text-xl mb-6">Order Confirmation</h3>
                <div className="space-y-4 mb-6">
                  <div className="p-4 bg-gray-50 rounded-xl"><p className="text-sm text-gray-500 mb-1">Delivering to</p><p className="font-medium">{orderData.deliveryAddress}</p></div>
                  <div className="p-4 bg-gray-50 rounded-xl"><p className="text-sm text-gray-500 mb-1">Payment method</p><p className="font-medium">Cash on Delivery</p></div>
                </div>
                <div className="flex gap-4">
                  <button onClick={() => setStep(2)} className="flex-1 py-3 border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50">Back</button>
                  <button onClick={handleSubmit} disabled={loading} className="flex-1 py-3 bg-primary-500 text-white rounded-xl font-semibold hover:bg-primary-600 disabled:opacity-50 flex items-center justify-center">
                    {loading ? (<><Loader2 className="w-5 h-5 animate-spin mr-2" />Placing Order...</>) : 'Place Order'}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
              <h3 className="font-bold text-lg mb-4">Order Summary</h3>
              <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm"><span className="text-gray-600">{item.foodItem?.name} x {item.quantity}</span><span className="font-medium">₹{(item.foodItem?.price || 0) * item.quantity}</span></div>
                ))}
              </div>
            <div className="border-t border-gray-200 pt-4 space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="flex items-center">
                  <IndianRupeeIcon className="w-3 h-3 mr-0" />
                  {cartTotal.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>Delivery</span>
                <span
                  className={`flex items-center ${
                    deliveryFee === 0 ? 'text-green-600 font-medium' : ''
                  }`}
                >
                  {deliveryFee === 0 ? (
                    'FREE'
                  ) : (
                    <>
                      <IndianRupeeIcon className="w-3 h-3 mr-0" />
                      {deliveryFee}
                    </>
                  )}
                </span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>Tax</span>
                <span className="flex items-center">
                  <IndianRupeeIcon className="w-3 h-3 mr-0" />
                  {tax.toFixed(2)}
                </span>
              </div>

              <div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="flex items-center">
                  <IndianRupeeIcon className="w-4 h-4 mr-0" />
                  {total.toFixed(2)}
                </span>
              </div>

            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;