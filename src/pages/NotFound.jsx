import { Link } from 'react-router-dom';
import { Home, AlertCircle } from 'lucide-react';

const NotFound = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
    <div className="text-center max-w-md">
      <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6"><AlertCircle className="w-12 h-12 text-primary-500" /></div>
      <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h2>
      <p className="text-gray-500 mb-8">The page you're looking for doesn't exist or has been moved.</p>
      <Link to="/" className="inline-flex items-center px-8 py-3 bg-primary-500 text-white rounded-full font-semibold hover:bg-primary-600 transition-colors"><Home className="w-5 h-5 mr-2" />Go Home</Link>
    </div>
  </div>
);

export default NotFound;