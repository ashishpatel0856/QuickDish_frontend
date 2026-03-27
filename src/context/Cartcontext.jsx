import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
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
    const skipNextLoad = useRef(false);

  const currentUserId = user?.id;

  useEffect(() => {
    const storedId = localStorage.getItem('currentRestaurantId');
    console.log("CartContext mounted. Stored Restaurant ID:", storedId);
  }, []);

  useEffect(() => {
    if (skipNextLoad.current) {
      skipNextLoad.current = false;
      console.log("⏭️ Skipping loadCart due to clearCart");
      return;
    }
    
    if (isAuthenticated && currentUserId) loadCart();
    else {
      setCartItems([]);
      setCartSummary({ total: 0, itemCount: 0 });
    }
  }, [isAuthenticated, currentUserId]);

  const loadCart = async () => {
    if (!currentUserId) return;
    try {
      setLoading(true);
      const response = await cartAPI.getByUser(currentUserId);
      const cartData = response.data;
      
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

  const addToCart = async (foodItemId, quantity = 1, restaurantId) => {
    if (!isAuthenticated) return { success: false, error: 'Please login first' };
    
    if (restaurantId) {
      localStorage.setItem('currentRestaurantId', restaurantId);
    }
    
    try {
      setLoading(true);
      await cartAPI.add({ foodItemId, quantity, userId: currentUserId });
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

  const clearCart = useCallback(async () => {
    const userId = currentUserId;
    skipNextLoad.current = true;
    
    setCartItems([]);
    setCartSummary({ total: 0, itemCount: 0 });
    localStorage.removeItem('currentRestaurantId');
    
    
    if (userId) {
      try {
        await cartAPI.clear(userId);
      } catch (err) {
        console.error('Backend clear failed:', err);
      }
    }
  }, [currentUserId]);

  const cartCount = cartSummary.itemCount;
  const cartTotal = cartSummary.total;

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