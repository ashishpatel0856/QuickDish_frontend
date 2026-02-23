import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartSummary, setCartSummary] = useState({ total: 0, itemCount: 0 });
  const [loading, setLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user?.id) loadCart();
    else {
      setCartItems([]);
      setCartSummary({ total: 0, itemCount: 0 });
    }
  }, [isAuthenticated, user?.id]);

  const loadCart = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const response = await cartAPI.getByUser(user.id);
      const cartData = response.data;
      
      // ✅ FIX: Handle both array and object response
      const items = Array.isArray(cartData) ? cartData : (cartData?.items || []);
      const total = Array.isArray(cartData) 
        ? items.reduce((sum, item) => sum + (item.totalPrice || 0), 0)
        : (cartData?.totalAmount || 0);
      
      setCartItems(items);
      setCartSummary({
        total: total,
        itemCount: items.length
      });
    } catch (error) {
      console.error('Failed to load cart:', error);
      setCartItems([]);
      setCartSummary({ total: 0, itemCount: 0 });
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (foodItemId, quantity = 1) => {
    if (!isAuthenticated) return { success: false, error: 'Please login first' };
    try {
      setLoading(true);
      await cartAPI.add({ foodItemId, quantity, userId: user.id });
      await loadCart();
      return { success: true };
    } catch (error) {
      console.error('Add to cart error:', error);
      return { success: false, error: error.response?.data?.message || 'Failed to add' };
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (cartItemId, quantity) => {
    if (quantity < 1) return removeFromCart(cartItemId);
    try {
      setLoading(true);
      await cartAPI.update(cartItemId, quantity);
      await loadCart();
      return { success: true };
    } catch (error) {
      console.error('Update quantity error:', error);
      return { success: false, error: error.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (cartItemId) => {
    try {
      setLoading(true);
      await cartAPI.delete(cartItemId);
      await loadCart();
      return { success: true };
    } catch (error) {
      console.error('Remove from cart error:', error);
      return { success: false, error: error.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  const clearCart = () => {
    setCartItems([]);
    setCartSummary({ total: 0, itemCount: 0 });
  };

  // Calculate from items for real-time updates
  const cartCount = (cartItems || []).reduce((sum, item) => sum + (item.quantity || 0), 0);
  const cartTotal = (cartItems || []).reduce((sum, item) => {
    const price = item.unitPrice || item.foodItem?.price || 0;
    return sum + (price * (item.quantity || 0));
  }, 0);

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      cartCount, 
      cartTotal, 
      cartSummary,
      loading, 
      addToCart, 
      updateQuantity, 
      removeFromCart, 
      clearCart, 
      refreshCart: loadCart 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;