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
    else setCartItems([]);
  }, [isAuthenticated, user?.id]);

  const loadCart = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const response = await cartAPI.getByUser(user.id);
      const cartData = response.data;
      
      setCartItems(cartData?.items || []);
      setCartSummary({
        total: cartData?.totalAmount || 0,
        itemCount: cartData?.itemCount || 0
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
      return { success: false, error: error.response?.data?.message || 'Failed to add' };
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (cartId, quantity) => {
    try {
      setLoading(true);
      await cartAPI.update(cartId, quantity);
      await loadCart();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (cartId) => {
    try {
      setLoading(true);
      await cartAPI.delete(cartId);
      await loadCart();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  const clearCart = () => {
    setCartItems([]);
    setCartSummary({ total: 0, itemCount: 0 });
  };

  // ✅ LINE 83-86: Updated with null safety
  const cartCount = (cartItems || []).reduce((sum, item) => sum + (item.quantity || 0), 0);
  const cartTotal = (cartItems || []).reduce((sum, item) => {
    const price = item.unitPrice || item.foodItem?.price || item.price || 0;
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