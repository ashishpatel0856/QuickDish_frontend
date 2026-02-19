export const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12', xl: 'w-16 h-16' };
  return (
    <div className={`${sizes[size]} ${className}`}>
      <div className="animate-spin rounded-full h-full w-full border-t-2 border-b-2 border-primary-500"></div>
    </div>
  );
};

export const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center"><LoadingSpinner size="xl" className="mx-auto mb-4" /><p className="text-gray-500">Loading...</p></div>
  </div>
);

export const SkeletonCard = () => (
  <div className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
    <div className="h-48 bg-gray-200" />
    <div className="p-4 space-y-3"><div className="h-6 bg-gray-200 rounded w-3/4" /><div className="h-4 bg-gray-200 rounded w-1/2" /></div>
  </div>
);