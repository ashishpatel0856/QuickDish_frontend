import { Search, Filter, Bike, Phone, CheckCircle, XCircle, MoreVertical } from 'lucide-react';
import LoadingSpinner from '../common/LoadingSpinner';

const RidersTable = ({ riders, loading, activeTab, actions }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12">
        <LoadingSpinner text="Loading riders..." />
      </div>
    );
  }

  if (riders.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Bike className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No riders found</h3>
        <p className="text-gray-500">No {activeTab.replace('riders-', '')} riders at the moment</p>
      </div>
    );
  }

  const getTitle = () => {
    if (activeTab === 'riders-pending') return 'Pending Riders';
    if (activeTab === 'riders-approved') return 'Approved Riders';
    return 'All Riders';
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 sm:p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h3 className="text-lg font-bold text-gray-900">{getTitle()}</h3>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search riders..." 
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 w-full sm:w-auto" 
            />
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-lg border border-gray-200">
            <Filter className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Rider</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase hidden sm:table-cell">Contact</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Vehicle</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {riders.map((rider) => (
              <tr key={rider.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-400 rounded-full flex items-center justify-center text-white font-bold">
                      {rider.user?.name?.charAt(0) || 'R'}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{rider.user?.name || 'Unknown'}</p>
                      <p className="text-sm text-gray-500">{rider.user?.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 hidden sm:table-cell">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4" />
                    {rider.user?.phone || 'N/A'}
                  </div>
                </td>
                <td className="px-6 py-4 hidden md:table-cell">
                  <p className="text-sm text-gray-900 capitalize">{rider.vehicleType?.toLowerCase()}</p>
                  <p className="text-xs text-gray-500 font-mono">{rider.vehicleNumber}</p>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                    rider.isVerifiedRider ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${rider.isVerifiedRider ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                    {rider.isVerifiedRider ? 'Approved' : 'Pending'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {!rider.isVerifiedRider ? (
                      <>
                        <button 
  onClick={() => actions.onApproveRider(rider.id)} 
  className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors" 
  title="Approve"
>
  <CheckCircle className="w-4 h-4" />
</button>
                        <button 
                          onClick={() => actions.onRejectRider(rider.id)} 
                          className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors" 
                          title="Reject"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <button 
                        onClick={() => actions.onViewRider(rider)} 
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <MoreVertical className="w-4 h-4 text-gray-600" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RidersTable;