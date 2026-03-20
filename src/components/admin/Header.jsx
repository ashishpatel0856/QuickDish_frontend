import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, ChevronDown, Shield, Phone, Mail, User, LogOut } from 'lucide-react';
import { useClickOutside } from '../../hooks/useClickOutside';

const Header = ({ activeTab, adminProfile, onMenuClick, onLogout }) => {
  const navigate = useNavigate();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useClickOutside(dropdownRef, () => setShowProfileDropdown(false));

  const getTitle = () => {
    const titles = {
      'riders-pending': 'Pending Riders',
      'riders-approved': 'Approved Riders',
      'riders-all': 'All Riders',
      'owners-pending': 'Pending Restaurant Owners',
      'owners-approved': 'Approved Restaurant Owners',
      'owners-all': 'All Restaurant Owners'
    };
    return titles[activeTab] || 'Dashboard';
  };

  const getSubtitle = () => {
    return activeTab.startsWith('riders-') 
      ? 'Manage delivery partners' 
      : 'Manage restaurant partners';
  };

  const getAdminInitials = () => {
    if (adminProfile?.name) return adminProfile.name.charAt(0).toUpperCase();
    if (adminProfile?.email) return adminProfile.email.charAt(0).toUpperCase();
    return 'A';
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="flex items-center justify-between p-4 sm:p-6">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            <Menu className="w-6 h-6 text-gray-600" />
          </button>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{getTitle()}</h2>
            <p className="text-sm text-gray-500 hidden sm:block">{getSubtitle()}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-gray-700">System Online</span>
          </div>
          
          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="flex items-center gap-2 p-1 pr-3 rounded-full hover:bg-gray-100 transition-colors border border-gray-200"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {getAdminInitials()}
              </div>
              <span className="hidden sm:block text-sm font-medium text-gray-700 max-w-[100px] truncate">
                {adminProfile?.name || 'Admin'}
              </span>
              <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showProfileDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showProfileDropdown && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {getAdminInitials()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate">{adminProfile?.name || 'Admin'}</p>
                      <p className="text-xs text-gray-500 truncate">{adminProfile?.email}</p>
                      <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                        <Shield className="w-3 h-3" />
                        Administrator
                      </span>
                    </div>
                  </div>
                </div>

                <div className="px-4 py-3 space-y-2">
                  {adminProfile?.phone && (
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center">
                        <Phone className="w-4 h-4" />
                      </div>
                      <span>{adminProfile.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center">
                      <Mail className="w-4 h-4" />
                    </div>
                    <span className="truncate">{adminProfile?.email}</span>
                  </div>
                </div>

                <div className="border-t border-gray-100 mt-2 pt-2">
                  <button
                    onClick={() => {
                      setShowProfileDropdown(false);
                      navigate('/admin/profile');
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <User className="w-4 h-4" />
                    <span>My Profile</span>
                  </button>
                </div>

                <div className="border-t border-gray-100 mt-2 pt-2 px-2">
                  <button
                    onClick={onLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;