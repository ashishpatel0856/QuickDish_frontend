import { X, FileText, CreditCard, Shield, Building2, CheckCircle2 } from 'lucide-react';

const DocumentsModal = ({ owner, isOpen, onClose, onVerify }) => {
  if (!isOpen || !owner) return null;

  const documents = owner.ownerDocuments || {};
  
  const docList = [
    { label: 'GST Certificate', url: documents.gstCertificateUrl, icon: FileText },
    { label: 'PAN Card', url: documents.panCardUrl, icon: CreditCard },
    { label: 'FSSAI License', url: documents.fssaiCertificateUrl, icon: Shield },
    { label: 'Bank Proof', url: documents.bankProofUrl, icon: Building2 }
  ];

  const handleReject = () => {
    const reason = prompt('Enter rejection reason:');
    if (reason) {
      onVerify(owner.id, false, reason);
      onClose();
    }
  };

  const handleApprove = () => {
    onVerify(owner.id, true);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-auto">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900">Verify Documents</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold">
              {owner.name?.charAt(0) || 'O'}
            </div>
            <div>
              <h4 className="font-bold text-gray-900">{owner.name}</h4>
              <p className="text-sm text-gray-500">{owner.email}</p>
            </div>
          </div>

          {documents ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {docList.map((doc, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <doc.icon className="w-5 h-5 text-orange-500" />
                      <span className="font-medium text-gray-900">{doc.label}</span>
                    </div>
                    {doc.url ? (
                      <a 
                        href={doc.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-orange-600 hover:text-orange-700 underline"
                      >
                        View Document
                      </a>
                    ) : (
                      <span className="text-sm text-gray-400">Not uploaded</span>
                    )}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl">
                <div>
                  <p className="text-sm text-gray-500">GST Number</p>
                  <p className="font-semibold font-mono">{documents.gstNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">PAN Number</p>
                  <p className="font-semibold font-mono">{documents.panNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">FSSAI License</p>
                  <p className="font-semibold font-mono">{documents.fssaiLicense}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Bank Account</p>
                  <p className="font-semibold font-mono">{documents.bankAccountNumber}</p>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  onClick={handleApprove}
                  className="flex-1 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  Verify & Approve
                </button>
                <button 
                  onClick={handleReject}
                  className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <X className="w-5 h-5" />
                  Reject Documents
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No documents uploaded yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentsModal;