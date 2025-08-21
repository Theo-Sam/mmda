import React, { useState } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Eye, Building2 } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { PermissionManager } from '../utils/permissions';
import PermissionGate from '../components/Common/PermissionGate';
import { filterByJurisdiction } from '../utils/filterByJurisdiction';

export default function Businesses() {
  const { businesses } = useApp();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showNewBusinessForm, setShowNewBusinessForm] = useState(false);

  const permissionManager = user?.role ? new PermissionManager(user.role) : null;

  // Filter businesses based on user role and permissions
  const getFilteredBusinesses = () => {
    let filteredList = user ? filterByJurisdiction(user, businesses) : businesses;
    // For collectors, show only assigned businesses
    if (user?.role === 'collector') {
      // In a real app, this would filter based on actual assignments
      filteredList = filteredList.filter(b => b.status === 'active');
    }
    // For business owners, show only their own businesses
    if (user?.role === 'business_owner') {
      filteredList = filteredList.filter(b => b.ownerName === user.name);
    }
    // Apply search and status filters
    return filteredList.filter(business => {
      const matchesSearch = business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        business.ownerName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterStatus === 'all' || business.status === filterStatus;
      return matchesSearch && matchesFilter;
    });
  };

  const filteredBusinesses = getFilteredBusinesses();

  // Get page title based on user role
  const getPageTitle = () => {
    switch (user?.role) {
      case 'collector':
        return 'My Assigned Businesses';
      case 'business_owner':
        return 'My Business';
      case 'business_registration_officer':
        return 'Business Management';
      default:
        return 'Businesses';
    }
  };

  // Get page description based on user role
  const getPageDescription = () => {
    switch (user?.role) {
      case 'collector':
        return 'Businesses assigned to you for collection';
      case 'business_owner':
        return 'Manage your business information';
      case 'business_registration_officer':
        return 'Register and manage businesses in your district';
      default:
        return 'Manage registered businesses in your district';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {getPageTitle()}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {getPageDescription()}
          </p>
        </div>

        <PermissionGate permission="register_business">
          <button
            onClick={() => setShowNewBusinessForm(true)}
            className="flex items-center space-x-2 bg-blue-600 dark:bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600"
          >
            <Plus className="w-4 h-4" />
            <span>Register Business</span>
          </button>
        </PermissionGate>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Search businesses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
              <option value="pending">Pending</option>
            </select>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <Filter className="w-4 h-4" />
            <span>{filteredBusinesses.length} businesses found</span>
          </div>
        </div>
      </div>

      {/* Business List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Business
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Last Payment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredBusinesses.map((business) => (
                <tr key={business.id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {business.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {business.ownerName}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                      {business.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-gray-200">{business.phone}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{business.gpsLocation}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${business.status === 'active' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' :
                        business.status === 'inactive' ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300' :
                          business.status === 'suspended' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300' :
                            'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                      }`}>
                      {business.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                    {business.lastPayment ? new Date(business.lastPayment).toLocaleDateString() : 'No payments'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <PermissionGate permission={['view_business', 'view_my_business']}>
                        <button className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300" title="View Details">
                          <Eye className="w-4 h-4" />
                        </button>
                      </PermissionGate>

                      <PermissionGate permission="edit_business">
                        <button className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300" title="Edit Business">
                          <Edit className="w-4 h-4" />
                        </button>
                      </PermissionGate>

                      <PermissionGate permission="delete_business">
                        <button className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300" title="Delete Business">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </PermissionGate>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Business Reports & Analytics */}
      {user?.role === 'mmda_admin' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Business Reports & Analytics</h3>
            <p className="text-gray-600 dark:text-gray-400">Comprehensive reporting and insights for business management</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-md font-semibold text-blue-900 dark:text-blue-100">Business Overview</h4>
                  <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">View business statistics and performance metrics</p>
                <button className="w-full px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                  Generate Report
                </button>
              </div>

              <div className="p-4 bg-green-50 dark:bg-green-900/30 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-md font-semibold text-green-900 dark:text-green-100">Revenue Analysis</h4>
                  <Building2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <p className="text-sm text-green-800 dark:text-green-200 mb-3">Analyze business revenue and collection trends</p>
                <button className="w-full px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">
                  View Analysis
                </button>
              </div>

              <div className="p-4 bg-purple-50 dark:bg-purple-900/30 rounded-lg border border-purple-200 dark:border-purple-800">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-md font-semibold text-purple-900 dark:text-purple-100">Export Data</h4>
                  <Building2 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <p className="text-sm text-purple-800 dark:text-purple-200 mb-3">Export business data for external analysis</p>
                <button className="w-full px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm">
                  Export Data
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Business Form Modal */}
      {showNewBusinessForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Register New Business</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Business Name
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter business name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Owner Name
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter owner name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white">
                  <option>Select category</option>
                  <option>Retail</option>
                  <option>Food Service</option>
                  <option>Electronics</option>
                  <option>Services</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
                  placeholder="+233 XX XXX XXXX"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  GPS Location
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
                  placeholder="GA-XXX-XXXX"
                />
              </div>
              <div className="flex items-center justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowNewBusinessForm(false)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600"
                >
                  Register Business
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredBusinesses.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
          <Building2 className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No businesses found</h3>
          <p className="text-gray-600 dark:text-gray-400">
            {searchTerm || filterStatus !== 'all'
              ? 'No businesses match your current filters.'
              : 'Get started by registering your first business.'}
          </p>
        </div>
      )}
    </div>
  );
}