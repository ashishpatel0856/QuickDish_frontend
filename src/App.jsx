import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

import OwnerLayout from './components/owner/OwnerLayout';
import MainLayout from './components/common/MainLayout';
import AuthLayout from './components/common/AuthLayout';

import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import VerifyOTP from './pages/VerifyOTP';
import RestaurantList from './pages/RestaurantList';
import RestaurantDetail from './pages/RestaurantDetail';
import AddRestaurant from './pages/AddRestaurant';        
import EditRestaurant from './pages/EditRestaurant';      
import AddFood from './pages/AddFood';                    
import EditFood from './pages/EditFood';                  
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';
import Profile from './pages/Profile';
import SearchResults from './pages/SearchResults';
import NotFound from './pages/NotFound';

import PaymentSuccess from './pages/PaymentSuccess';
import PaymentFailed from './pages/PaymentFailed';

import OwnerDashboard from './components/owner/Dashboard';
import OwnerMenu from './components/owner/Menu';
import OwnerOrders from './components/owner/Orders';

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-500"></div>
  </div>
);

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, loading } = useAuth();
  
  if (loading) return <PageLoader />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  
  const userRoles = user?.roles || [user?.role].filter(Boolean);
  
  if (allowedRoles && !allowedRoles.some(role => userRoles.includes(role))) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (isAuthenticated) return <Navigate to="/" replace />;
  return children;
};

function App() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
      </Route>

      <Route element={<MainLayout />}>
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/restaurants" element={<ProtectedRoute><RestaurantList /></ProtectedRoute>} />
        
        <Route path="/restaurant/add" element={
          <ProtectedRoute allowedRoles={['ROLE_RESTAURANT_OWNER']}>
            <AddRestaurant />
          </ProtectedRoute>
        } />
        
        <Route path="/restaurant/:id/edit" element={
          <ProtectedRoute allowedRoles={['ROLE_RESTAURANT_OWNER']}>
            <EditRestaurant />
          </ProtectedRoute>
        } />
        
        <Route path="/restaurant/:id/add-food" element={
          <ProtectedRoute allowedRoles={['ROLE_RESTAURANT_OWNER']}>
            <AddFood />
          </ProtectedRoute>
        } />
        
        <Route path="/restaurant/:id/edit-food/:foodId" element={
          <ProtectedRoute allowedRoles={['ROLE_RESTAURANT_OWNER']}>
            <EditFood />
          </ProtectedRoute>
        } />
        
        <Route path="/restaurant/:id" element={<ProtectedRoute><RestaurantDetail /></ProtectedRoute>} />
        
        <Route path="/search" element={<ProtectedRoute><SearchResults /></ProtectedRoute>} />
        <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
        <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        
        <Route path="/payment/success" element={<ProtectedRoute><PaymentSuccess /></ProtectedRoute>} />
        <Route path="/payment/failed" element={<ProtectedRoute><PaymentFailed /></ProtectedRoute>} />
        
        <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
        <Route path="/orders/:id" element={<ProtectedRoute><OrderDetail /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      </Route>

      <Route path="/owner" element={
        <ProtectedRoute allowedRoles={['ROLE_RESTAURANT_OWNER']}>
          <OwnerLayout />
        </ProtectedRoute>
      }>
        <Route index element={<OwnerDashboard />} />
        <Route path="dashboard" element={<OwnerDashboard />} />
        <Route path="menu/:restaurantId" element={<OwnerMenu />} />
        <Route path="orders/:restaurantId" element={<OwnerOrders />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;