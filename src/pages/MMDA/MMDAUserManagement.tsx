import React, { useState, useRef, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Users, 
  CheckCircle,
  XCircle,
  Clock,
  Mail,
  Phone,
  MapPin,
  UserCheck,
  ChevronDown,
  X,
  Eye,
  Shield,
  AlertTriangle
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { SystemUser } from '../../types/SystemUser';
import { useAuth } from '../../contexts/AuthContext';
import { Tooltip } from 'react-tooltip';
import { v4 as uuidv4 } from 'uuid';
import { useApp } from '../../contexts/AppContext';

const roleDisplayNames = {
  mmda_admin: 'MMDA Admin',
  finance: 'Finance Officer',
  collector: 'Collector',
  business_registration_officer: 'Business Registration Officer',
};

const allowedRoles = Object.keys(roleDisplayNames);

const roleColors = {
  finance: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
  collector: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300',
  business_registration_officer: 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300',
};

function SearchableDropdown({ options, value, onChange, placeholder, disabled = false, required = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  const filteredOptions = options.filter(option => option.toLowerCase().includes(searchTerm.toLowerCase()));
  const handleSelect = (option) => {
    onChange(option);
    setIsOpen(false);
    setSearchTerm('');
  };
  const displayValue = value || placeholder;
  return (
    <div className="relative" ref={dropdownRef} style={{ zIndex: 50 }}>
      <div 
        className={`flex items-center justify-between w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 ${disabled ? 'border-gray-300 cursor-not-allowed' : 'border-gray-300 cursor-pointer hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400'} transition-shadow`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        tabIndex={0}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setIsOpen(!isOpen); }}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className={`truncate ${!value ? 'text-gray-500' : 'text-gray-900 dark:text-white'} text-sm font-medium`}>{displayValue}</span>
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </div>
      {isOpen && (
        <div className="absolute z-50 min-w-[220px] w-max mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl transition-all animate-fade-in overflow-hidden">
          <div className="p-2 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="min-w-[200px] w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                placeholder={`Search ${placeholder.toLowerCase()}...`}
                onClick={(e) => e.stopPropagation()}
                autoFocus
              />
            </div>
          </div>
          <div className="max-h-60 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <div
                  key={option}
                  className={`px-5 py-3 min-w-[200px] cursor-pointer text-sm font-medium transition-colors ${option === value ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300' : 'text-gray-900 dark:text-gray-100'} hover:bg-blue-100 dark:hover:bg-blue-900/30`}
                  onClick={() => handleSelect(option)}
                  tabIndex={0}
                  onKeyDown={e => { if (e.key === 'Enter') handleSelect(option); }}
                  role="option"
                  aria-selected={option === value}
                >
                  {option}
                </div>
              ))
            ) : (
              <div className="px-5 py-3 text-gray-500 dark:text-gray-400 text-sm">No results found</div>
            )}
          </div>
          <div className="p-2 border-t border-gray-100 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/40">
              {filteredOptions.length} {filteredOptions.length === 1 ? 'result' : 'results'} found
            </div>
        </div>
      )}
      {required && !value && (
        <input type="text" required style={{ position: 'absolute', opacity: 0, height: 0, width: 0, zIndex: -1 }} />
      )}
    </div>
  );
}

export default function MMDAUserManagement() {
  const { user } = useAuth();
  const { users, setUsers } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showNewUserForm, setShowNewUserForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState<SystemUser | null>(null);
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    status: 'active',
    district: user?.district || '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState<SystemUser | null>(null);
  const [formErrors, setFormErrors] = useState({});

  const filteredUsers = users.filter(u =>
    (filterRole === 'all' || u.role === filterRole) &&
    (filterStatus === 'all' || u.status === filterStatus) &&
    (u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSubmitNewUser = (e) => {
    e.preventDefault();
    const errors = {};
    if (!formData.name) errors.name = 'Name is required';
    if (!formData.email) errors.email = 'Email is required';
    if (!formData.role) errors.role = 'Role is required';
    if (!formData.phone) errors.phone = 'Phone is required';
    if (!formData.password) errors.password = 'Password is required';
    if (formData.password !== formData.confirmPassword) errors.confirmPassword = 'Passwords do not match';
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;
    setUsers([...users, { ...formData, id: uuidv4() }]);
    setShowNewUserForm(false);
    setFormData({ name: '', email: '', role: '', status: 'active', district: user?.district || '', phone: '', password: '', confirmPassword: '' });
    setFormErrors({});
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">User Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage users in {user?.district}</p>
        </div>
        <button
          onClick={() => setShowNewUserForm(true)}
          className="flex items-center space-x-2 bg-blue-600 dark:bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
        >
          <Plus className="w-4 h-4" />
          <span>Add New User</span>
        </button>
      </div>

      {/* Search/Filter Bar */}
      <div className="flex flex-wrap items-center space-x-4 mb-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
          aria-label="Search users"
        />
        <SearchableDropdown
          options={[ 'all', ...allowedRoles.filter(r => r !== 'mmda_admin').map(r => roleDisplayNames[r]) ]}
          value={filterRole === 'all' ? 'All Roles' : roleDisplayNames[filterRole]}
          onChange={val => setFilterRole(Object.keys(roleDisplayNames).find(key => roleDisplayNames[key] === val) || 'all')}
          placeholder="Role"
        />
        <SearchableDropdown
          options={[ 'all', 'active', 'inactive' ]}
          value={filterStatus === 'all' ? 'All Statuses' : filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)}
          onChange={val => setFilterStatus(val === 'All Statuses' ? 'all' : val.toLowerCase())}
          placeholder="Status"
        />
        {(searchTerm || filterRole !== 'all' || filterStatus !== 'all') && (
          <button
            onClick={() => { setSearchTerm(''); setFilterRole('all'); setFilterStatus('all'); }}
            className="ml-2 px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Carded Table Container */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">MMDA</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Last Login</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400 dark:text-gray-500 text-lg">
                    <Users className="mx-auto mb-2 w-10 h-10 text-gray-300 dark:text-gray-600" />
                    No users found. Try adjusting your search or filters.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u, idx) => (
                  <tr key={u.id} className={idx % 2 === 0 ? 'bg-gray-50 dark:bg-gray-900/30 hover:bg-blue-50 dark:hover:bg-blue-900/20' : 'hover:bg-blue-50 dark:hover:bg-blue-900/20'}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 dark:text-blue-400 font-medium text-sm">
                            {u.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{u.name}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${roleColors[u.role] || 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'}`}>{roleDisplayNames[u.role] || u.role}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900 dark:text-white">{u.district}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {u.status === 'active' ? <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" /> :
                          u.status === 'inactive' ? <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" /> :
                          <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />}
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">{u.status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{u.lastLogin ? new Date(u.lastLogin).toLocaleDateString() : '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button className="p-2 rounded hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors" title="View Details" aria-label="View Details"><Eye className="w-4 h-4" /></button>
                        <button className="p-2 rounded hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors" title="Edit User" aria-label="Edit User" onClick={() => setSelectedUser(u)}><Edit className="w-4 h-4" /></button>
                        <span className="border-l border-gray-200 dark:border-gray-700 h-5 mx-1"></span>
                        <button className="p-2 rounded hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors" title="Manage Permissions" aria-label="Manage Permissions"><Shield className="w-4 h-4" /></button>
                        <button className="p-2 rounded hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors" title="Suspend User" aria-label="Suspend User" onClick={() => { setUserToDelete(u); setShowDeleteConfirm(true); }}><Trash2 className="w-4 h-4" /></button>
                      </div>
              </td>
            </tr>
                ))
              )}
        </tbody>
      </table>
        </div>
      </div>

      {/* Add New User Modal */}
      {showNewUserForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 transition-all" role="dialog" aria-modal="true" aria-labelledby="add-user-title">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 id="add-user-title" className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center"><UserCheck className="w-5 h-5 mr-2 text-blue-500" /> Add New User</h3>
            <form onSubmit={handleSubmitNewUser} className="space-y-4">
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name <span className="text-red-500">*</span></label>
                <div className="relative">
                  <UserCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className={`w-full pl-10 pr-3 py-2 border ${formErrors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white`}
                    placeholder="Enter full name"
                required
                    aria-invalid={!!formErrors.name}
                  />
                </div>
                {formErrors.name && <p className="text-xs text-red-500 mt-1">{formErrors.name}</p>}
              </div>
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className={`w-full pl-10 pr-3 py-2 border ${formErrors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white`}
                    placeholder="user@mmda.gov.gh"
                    required
                    aria-invalid={!!formErrors.email}
                  />
                </div>
                {formErrors.email && <p className="text-xs text-red-500 mt-1">{formErrors.email}</p>}
              </div>
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className={`w-full pl-10 pr-3 py-2 border ${formErrors.phone ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white`}
                    placeholder="+233 XX XXX XXXX"
                    required
                    aria-invalid={!!formErrors.phone}
                  />
                </div>
                {formErrors.phone && <p className="text-xs text-red-500 mt-1">{formErrors.phone}</p>}
              </div>
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role <span className="text-red-500">*</span></label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                  className={`w-full px-3 py-2 border ${formErrors.role ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white`}
                  required
                  aria-invalid={!!formErrors.role}
                >
                  <option value="">Select Role</option>
                  {allowedRoles.filter(r => r !== 'mmda_admin').map(r => (
                    <option key={r} value={r}>{roleDisplayNames[r]}</option>
                  ))}
                </select>
                {formErrors.role && <p className="text-xs text-red-500 mt-1">{formErrors.role}</p>}
              </div>
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password <span className="text-red-500">*</span></label>
                <div className="relative">
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    className={`w-full px-3 py-2 border ${formErrors.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white`}
                    placeholder="Set user password"
                required
                    aria-invalid={!!formErrors.password}
                  />
                </div>
                {formErrors.password && <p className="text-xs text-red-500 mt-1">{formErrors.password}</p>}
              </div>
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm Password <span className="text-red-500">*</span></label>
                <div className="relative">
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className={`w-full px-3 py-2 border ${formErrors.confirmPassword ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white`}
                    placeholder="Confirm password"
                required
                    aria-invalid={!!formErrors.confirmPassword}
                  />
                </div>
                {formErrors.confirmPassword && <p className="text-xs text-red-500 mt-1">{formErrors.confirmPassword}</p>}
              </div>
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">MMDA</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={user?.district || ''}
                    disabled
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                  />
                </div>
              </div>
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                <input
                  type="text"
                  value="active"
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                />
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors">Add User</button>
              <button type="button" className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors" onClick={() => setShowNewUserForm(false)}>Cancel</button>
            </form>
          </div>
        </div>
      )}
      {/* Edit User Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 transition-all">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md shadow-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Edit User</h2>
            <form onSubmit={e => { e.preventDefault(); setSelectedUser(null); }} className="space-y-4">
              <input
                type="text"
                value={selectedUser.name}
                onChange={e => setSelectedUser({ ...selectedUser, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
                required
              />
              <input
                type="email"
                value={selectedUser.email}
                onChange={e => setSelectedUser({ ...selectedUser, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
                required
              />
              <SearchableDropdown
                options={allowedRoles.map(r => roleDisplayNames[r])}
                value={roleDisplayNames[selectedUser.role]}
                onChange={val => setSelectedUser({ ...selectedUser, role: Object.keys(roleDisplayNames).find(key => roleDisplayNames[key] === val) || selectedUser.role })}
                placeholder="Role"
                required
              />
              <SearchableDropdown
                options={[ 'active', 'inactive' ]}
                value={selectedUser.status}
                onChange={val => setSelectedUser({ ...selectedUser, status: val })}
                placeholder="Status"
                required
              />
              <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors">Save Changes</button>
              <button type="button" className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors" onClick={() => setSelectedUser(null)}>Cancel</button>
            </form>
          </div>
        </div>
      )}
      {showDeleteConfirm && userToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-sm shadow-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center"><Trash2 className="w-5 h-5 mr-2 text-red-500" /> Confirm Action</h2>
            <p className="mb-4 text-gray-700 dark:text-gray-300">Are you sure you want to suspend <span className="font-semibold">{userToDelete.name}</span>?</p>
            <div className="flex justify-end space-x-2">
              <button onClick={() => setShowDeleteConfirm(false)} className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600">Cancel</button>
              <button onClick={() => { setUsers(users.filter(us => us.id !== userToDelete.id)); setShowDeleteConfirm(false); }} className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700">Suspend</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 