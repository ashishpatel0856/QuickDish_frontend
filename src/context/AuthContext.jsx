import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api, { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const initAuth = () => {
      try {
        const token = localStorage.getItem('accessToken');
        const storedUser = localStorage.getItem('user');

        if (token && token !== 'undefined' && token !== 'null' && storedUser) {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);
          console.log('✅ Auth initialized from localStorage');
        } else {
          console.log('⚠️ No valid auth data in localStorage');
        }
      } catch (error) {
        console.error('❌ Error initializing auth:', error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    try {
      console.log('🔐 Attempting login...');
      const response = await authAPI.login(credentials);
      
      // 🔥 IMPORTANT: Response unwrap karo (api.js interceptor se bhi ho jayega, but double check)
      const responseData = response.data?.data || response.data;
      console.log('📦 Login response data:', responseData);

      const { accessToken, refreshToken, ...userData } = responseData;

      // ✅ STRICT VALIDATION
      if (!accessToken || accessToken === 'undefined' || accessToken === 'null') {
        console.error('❌ Invalid accessToken:', accessToken);
        console.error('Full response:', responseData);
        return { success: false, error: 'Server error: Invalid token received' };
      }

      // ✅ Store karo
      localStorage.setItem('accessToken', accessToken);
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }
      localStorage.setItem('user', JSON.stringify(userData));

      // ✅ Header set karo
      api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

      // ✅ State update karo
      setUser(userData);
      setIsAuthenticated(true);

      console.log('✅ Login successful:', userData.name || userData.email);
      return { success: true, user: userData };
      
    } catch (error) {
      console.error('❌ Login error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || error.message || 'Login failed' 
      };
    }
  };

  const signup = async (userData) => {
    try {
      const response = await authAPI.signup(userData);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('❌ Signup error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Signup failed' 
      };
    }
  };

  const verifyOTP = async (otpData) => {
    try {
      const response = await authAPI.verifyOTP(otpData);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('❌ OTP verification error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'OTP verification failed' 
      };
    }
  };

  const logout = useCallback(() => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    setIsAuthenticated(false);
    console.log('👋 Logged out successfully');
    window.location.href = '/login';
  }, []);

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    signup,
    logout,
    verifyOTP,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;