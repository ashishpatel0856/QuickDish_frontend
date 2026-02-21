import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

// ✅ Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    console.log('🔑 Token from localStorage:', token);
    
    if (token && token !== 'undefined' && token !== 'null' && token.trim() !== '') {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('✅ Authorization header set:', `Bearer ${token.substring(0, 20)}...`);
    } else {
      console.log('⚠️ No valid token found');
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ RESPONSE INTERCEPTOR - YEH IMPORTANT HAI
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API [${response.config.method?.toUpperCase()}] ${response.config.url}:`, response.data);
    
   
    if (response.data && 
        response.data.data !== undefined && 
        typeof response.data.data === 'object' &&
        response.data.timestamp !== undefined) {
      console.log('📦 Unwrapping response...');
      response.data = response.data.data; // Actual data nikaalo
    }
    
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    console.error(`❌ API Error [${error.config?.method?.toUpperCase()}] ${error.config?.url}:`, {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken || refreshToken === 'undefined') throw new Error('No refresh token');

        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, { token: refreshToken });
        const { accessToken, refreshToken: newRefreshToken } = response.data;
        
        if (!accessToken || accessToken === 'undefined') {
          throw new Error('Invalid access token received');
        }
        
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', newRefreshToken);
        api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        
        processQueue(null, accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

// API exports
export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  verifyOTP: (data) => api.post('/auth/otp', data),
  refreshToken: (token) => api.post('/auth/refresh', { token }),
};

export const restaurantAPI = {
  getAll: () => api.get('/restaurant'),
  getById: (id) => api.get(`/restaurant/${id}`),
  create: (data) => api.post('/restaurant/Create', data),

  update: (id, data) => api.put(`/restaurant/${id}`, data),
  delete: (id) => api.delete(`/restaurant/${id}`),
};

export const foodAPI = {
  getAll: () => api.get('/foods/restaurants'),
  getById: (id) => api.get(`/foods/restaurants/${id}`),
  getByRestaurant: (restaurantId) => api.get(`/foods/restaurants/${restaurantId}`),
  search: (name) => api.get(`/foods/restaurants/search?name=${name}`),
  create: (data) => api.post('/foods/restaurants', data),

  update: (id, data) => api.put(`/foods/restaurants/${id}`, data),
  delete: (id) => api.delete(`/foods/restaurants/${id}`),
};

export const cartAPI = {
  getByUser: (userId) => api.get(`/carts?userId=${userId}`),
  add: (data) => api.post('/carts', data),
  update: (cartId, quantity) => api.put(`/carts/${cartId}?quantity=${quantity}`),
  delete: (cartId) => api.delete(`/carts/${cartId}`),
};

export const orderAPI = {
  getAll: () => api.get('/orders/customers'),
  getById: (id) => api.get(`/orders/customers/${id}`),
  create: (data) => api.post('/orders/customers', data),
  updateStatus: (id, status) => api.put(`/orders/customers/${id}`, { status }),
};

export const reviewAPI = {
  getAll: () => api.get('/review'),
  getById: (id) => api.get(`/review/${id}`),
  create: (data) => api.post('/review', data),
  update: (id, data) => api.put(`/review/${id}`, data),
  delete: (id) => api.delete(`/review/${id}`),
};

export const paymentAPI = {
  initiate: (orderId) => api.post(`/payments/init/${orderId}`),
  webhook: (data) => api.post('/webhook', data),
};

export const userAPI = {
  getProfile: () => api.get('/users/user-profile'),
  updateProfile: (data) => api.patch('/users/profile', data),
};

export const addressAPI = {
  add: (userId, data) => api.post(`/address/add?userId=${userId}`, data),
  findNearest: (userId, restaurantId, addressId) => 
    api.post(`/locations/place?userId=${userId}&restaurantId=${restaurantId}&addressId=${addressId}`),
};

export default api;