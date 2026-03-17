import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/AdminDashboard';
import RiderDashboard from './pages/RiderDashboard';
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) return <Navigate to="/login" />;
  
  if (allowedRoles && !allowedRoles.some(role => user?.roles?.includes(role))) {
    return <Navigate to="/" />;
  }
  
  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      
      {/* Admin Routes */}
      <Route 
        path="/admin/dashboard" 
        element={
          <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />
      
      {/* Rider Routes */}
      <Route 
        path="/rider/dashboard" 
        element={
          <ProtectedRoute allowedRoles={['ROLE_RIDER']}>
            <RiderDashboard />
          </ProtectedRoute>
        } 
      />
      
      {/* Default */}
      <Route path="/" element={<Navigate to="/login" />} />
    </Routes>
  );
};

export default AppRoutes;