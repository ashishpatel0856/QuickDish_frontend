import { Outlet } from 'react-router-dom';

const AuthLayout = () => (
  <div className="min-h-screen bg-gradient-to-br from-primary-50 via-orange-50 to-secondary-50 flex items-center justify-center p-4">
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold gradient-text mb-2">QuickDish</h1>
        <p className="text-gray-600">Delicious food delivered to your doorstep</p>
      </div>
      <Outlet />
    </div>
  </div>
);

export default AuthLayout;