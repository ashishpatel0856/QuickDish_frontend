import { Search, Filter, Store, Phone, CheckCircle, XCircle, MoreVertical, FileText } from 'lucide-react';
import LoadingSpinner from '../common/LoadingSpinner';

const OwnersTable = ({ owners, loading, activeTab, actions }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12">
        <LoadingSpinner text="Loading owners..." />
      </div>
    );
  }

  if (owners.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Store className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No owners found</h3>
        <p className="text-gray-500">No {activeTab.replace('owners-', '')} restaurant owners at the moment</p>
      </div>
    );
  }

  const getTitle = () => {
    if (activeTab === 'owners-pending') return 'Pending Restaurant Owners';
    if (activeTab === 'owners-approved') return 'Approved Restaurant Owners';
    return 'All Restaurant Owners';
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
              placeholder="Search owners..." 
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
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Owner</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase hidden sm:table-cell">Contact</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Business</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {owners.map((owner) => (
              <tr key={owner.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold">
                      {owner.name?.charAt(0) || 'O'}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{owner.name || 'Unknown'}</p>
                      <p className="text-sm text-gray-500">{owner.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 hidden sm:table-cell">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4" />
                    {owner.phone || 'N/A'}
                  </div>
                </td>
                <td className="px-6 py-4 hidden md:table-cell">
                  <p className="text-sm text-gray-900">{owner.ownerDocuments?.gstNumber || 'N/A'}</p>
                  <p className="text-xs text-gray-500">GST</p>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium w-fit ${
                      owner.isApproved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${owner.isApproved ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                      {owner.isApproved ? 'Approved' : 'Pending'}
                    </span>
                    {owner.ownerDocuments && (
                      <span className={`text-xs w-fit ${
                        owner.ownerDocuments.documentsVerified ? 'text-green-600' : 'text-orange-600'
                      }`}>
                        {owner.ownerDocuments.documentsVerified ? '✓ Docs Verified' : '⏳ Docs Pending'}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {!owner.isApproved ? (
                      <>
                        <button 
                          onClick={() => actions.onViewDocuments(owner)}
                          className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors" 
                          title="View Documents"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => actions.onApproveOwner(owner.id)} 
                          className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors" 
                          title="Approve"
                          disabled={!owner.ownerDocuments?.documentsVerified}
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => actions.onRejectOwner(owner.id)} 
                          className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors" 
                          title="Reject"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <button 
                        onClick={() => actions.onViewOwner(owner)} 
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

export default OwnersTable;