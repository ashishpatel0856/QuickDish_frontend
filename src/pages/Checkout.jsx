import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { orderAPI } from '../services/api';
import { MapPin, CreditCard, Truck, Check, Loader2, IndianRupeeIcon, Wallet } from 'lucide-react';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, cartTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [orderData, setOrderData] = useState({ 
    deliveryAddress: '', 
    notes: '', 
    paymentMethod: 'COD' // cash or online
  });

  const deliveryFee = cartTotal > 500 ? 0 : 40;
  const platformFee = 10;
  const tax = cartTotal * 0.05;
  const total = cartTotal + deliveryFee + platformFee + tax;

  const handleInputChange = (e) => {
    setOrderData({ ...orderData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async () => {
    if (!orderData.deliveryAddress.trim()) {
      alert('Please enter delivery address');
      return;
    }
    
    setLoading(true);
    try {
      const orderItems = cartItems.map(item => ({
        foodItemId: item.foodItem.id,
        quantity: item.quantity
      }));

      const payload = {
        restaurantId: cartItems[0]?.foodItem?.restaurant?.id || cartItems[0]?.foodItem?.restaurantId,
        orderItems: orderItems, 
        totalPrice: total,
        deliveryAddress: orderData.deliveryAddress,
        notes: orderData.notes,
        paymentMethod: orderData.paymentMethod 
      };

      console.log('Sending order:', payload);
      const response = await orderAPI.create(payload);
      console.log('Order response:', response.data);

      if (orderData.paymentMethod === 'ONLINE' && response.data.paymentUrl) {
        window.location.href = response.data.paymentUrl; 
      } else {
        clearCart();
        navigate(`/order-success/${response.data.id}`);
      }
    } catch (error) {
      console.error('Order error:', error);
      alert('Failed to place order: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
          <button 
            onClick={() => navigate('/restaurants')} 
            className="px-8 py-3 bg-orange-500 text-white rounded-full font-semibold hover:bg-orange-600"
          >
            Browse Restaurants
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
        
        <div className="flex items-center justify-center mb-8">
          <div className={`flex items-center ${step >= 1 ? 'text-orange-600' : 'text-gray-400'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-orange-500 text-white' : 'bg-gray-200'}`}>
              <MapPin className="w-5 h-5" />
            </div>
            <span className="ml-2 font-medium">Address</span>
          </div>
          <div className="w-16 h-1 bg-gray-200 mx-4"></div>
          <div className={`flex items-center ${step >= 2 ? 'text-orange-600' : 'text-gray-400'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-orange-500 text-white' : 'bg-gray-200'}`}>
              <CreditCard className="w-5 h-5" />
            </div>
            <span className="ml-2 font-medium">Payment</span>
          </div>
          <div className="w-16 h-1 bg-gray-200 mx-4"></div>
          <div className={`flex items-center ${step >= 3 ? 'text-orange-600' : 'text-gray-400'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-orange-500 text-white' : 'bg-gray-200'}`}>
              <Check className="w-5 h-5" />
            </div>
            <span className="ml-2 font-medium">Confirm</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            
            {step === 1 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="font-bold text-xl mb-6">Delivery Address</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Address</label>
                    <textarea 
                      name="deliveryAddress" 
                      value={orderData.deliveryAddress} 
                      onChange={handleInputChange} 
                      rows={4} 
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="House no., Building, Street, Area, City, PIN Code..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Instructions (Optional)</label>
                    <input 
                      type="text" 
                      name="notes" 
                      value={orderData.notes} 
                      onChange={handleInputChange} 
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500"
                      placeholder="e.g., Ring doorbell, Leave at gate..." 
                    />
                  </div>
                  <button 
                    onClick={() => setStep(2)} 
                    className="w-full py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-colors"
                  >
                    Continue to Payment
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="font-bold text-xl mb-6">Payment Method</h3>
                <div className="space-y-4">
                  
                  <label className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${orderData.paymentMethod === 'ONLINE' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-orange-300'}`}>
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="ONLINE" 
                      checked={orderData.paymentMethod === 'ONLINE'} 
                      onChange={handleInputChange} 
                      className="w-4 h-4 text-orange-600"
                    />
                    <div className="ml-4 flex-1">
                      <p className="font-semibold">Pay Online</p>
                      <p className="text-sm text-gray-500">Credit/Debit Card, UPI, NetBanking</p>
                    </div>
                    <Wallet className="w-6 h-6 text-orange-500" />
                  </label>

                  <label className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${orderData.paymentMethod === 'COD' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-orange-300'}`}>
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="COD" 
                      checked={orderData.paymentMethod === 'COD'} 
                      onChange={handleInputChange} 
                      className="w-4 h-4 text-orange-600"
                    />
                    <div className="ml-4 flex-1">
                      <p className="font-semibold">Cash on Delivery</p>
                      <p className="text-sm text-gray-500">Pay when your order arrives</p>
                    </div>
                    <Truck className="w-6 h-6 text-orange-500" />
                  </label>

                </div>
                <div className="flex gap-4 mt-6">
                  <button 
                    onClick={() => setStep(1)} 
                    className="flex-1 py-3 border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50"
                  >
                    Back
                  </button>
                  <button 
                    onClick={() => setStep(3)} 
                    className="flex-1 py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600"
                  >
                    Review Order
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="font-bold text-xl mb-6">Order Summary</h3>
                <div className="space-y-4 mb-6">
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-500 mb-1">Delivering to</p>
                    <p className="font-medium">{orderData.deliveryAddress}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-500 mb-1">Payment method</p>
                    <p className="font-medium">
                      {orderData.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online Payment (Card/UPI)'}
                    </p>
                  </div>
                  {orderData.notes && (
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <p className="text-sm text-gray-500 mb-1">Instructions</p>
                      <p className="font-medium">{orderData.notes}</p>
                    </div>
                  )}
                </div>
                <div className="flex gap-4">
                  <button 
                    onClick={() => setStep(2)} 
                    className="flex-1 py-3 border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50"
                  >
                    Back
                  </button>
                  <button 
                    onClick={handlePlaceOrder} 
                    disabled={loading} 
                    className="flex-1 py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 disabled:opacity-50 flex items-center justify-center"
                  >
                    {loading ? (
                      <><Loader2 className="w-5 h-5 animate-spin mr-2" />Processing...</>
                    ) : (
                      `Pay ₹${total.toFixed(0)}`
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
              <h3 className="font-bold text-lg mb-4">Bill Details</h3>
              
              <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {item.foodItem?.name} x {item.quantity}
                    </span>
                    <span className="font-medium">₹{((item.foodItem?.price || 0) * item.quantity).toFixed(0)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-3">
                <div className="flex justify-between text-gray-600 text-sm">
                  <span>Item Total</span>
                  <span>₹{cartTotal.toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-gray-600 text-sm">
                  <span>Delivery Fee</span>
                  <span className={deliveryFee === 0 ? 'text-green-600 font-medium' : ''}>
                    {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600 text-sm">
                  <span>Platform Fee</span>
                  <span>₹{platformFee}</span>
                </div>
                <div className="flex justify-between text-gray-600 text-sm">
                  <span>GST & Charges</span>
                  <span>₹{tax.toFixed(0)}</span>
                </div>
                
                <div className="border-t border-gray-200 pt-3 flex justify-between font-bold text-lg">
                  <span>To Pay</span>
                  <span className="text-orange-600">₹{total.toFixed(0)}</span>
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