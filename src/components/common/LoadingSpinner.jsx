const LoadingSpinner = ({ text = 'Loading...' }) => (
  <div className="text-center">
    <div className="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"></div>
    <p className="text-gray-500">{text}</p>
  </div>
);

export default LoadingSpinner;

export const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center"><LoadingSpinner size="xl" className="mx-auto mb-4" />
    <p className="text-gray-500">Loading...</p></div>
  </div>
);

export const SkeletonCard = () => (
  <div className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
    <div className="h-48 bg-gray-200" />
    <div className="p-4 space-y-3"><div className="h-6 bg-gray-200 rounded w-3/4" />
    <div className="h-4 bg-gray-200 rounded w-1/2" /></div>
  </div>
);