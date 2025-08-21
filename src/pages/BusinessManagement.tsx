import React, { useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Building2,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  Phone,
  Mail,
  User,
  Calendar,
  X,
  FileText,
  Upload
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { PermissionManager } from '../utils/permissions';
import PermissionGate from '../components/Common/PermissionGate';
import { Business } from '../types';
import { filterByJurisdiction } from '../utils/filterByJurisdiction';

export default function BusinessManagement() {
  const { businesses, addBusiness, updateBusiness, addAuditLog } = useApp();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showNewBusinessForm, setShowNewBusinessForm] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showDocumentUpload, setShowDocumentUpload] = useState(false);
  const [documentType, setDocumentType] = useState('Business License');
  const [documentFile, setDocumentFile] = useState<File | null>(null);

  const permissionManager = user?.role ? new PermissionManager(user.role) : null;

  // Form state for new business
  const [formData, setFormData] = useState({
    name: '',
    ownerName: '',
    category: '',
    phone: '',
    email: '',
    gpsLocation: '',
    physicalAddress: '',
    businessLicense: '',
    tinNumber: ''
  });

  // Get all businesses for this district
  const districtBusinesses = user ? filterByJurisdiction(user, businesses) : [];

  // Filter businesses based on search and filters
  const filteredBusinesses = districtBusinesses.filter(business => {
    const matchesSearch = business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      business.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      business.gpsLocation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || business.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || business.category === filterCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Get unique categories for filter
  const categories = Array.from(new Set(businesses.map(b => b.category)));

  const handleSubmitNewBusiness = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.ownerName || !formData.category || !formData.phone || !formData.gpsLocation) {
      alert('Please fill in all required fields');
      return;
    }

    if (isEditing && selectedBusiness) {
      // Update existing business
      updateBusiness(selectedBusiness.id, {
        ...formData,
        status: selectedBusiness.status
      });

      if (user) {
        addAuditLog({
          userId: user.id,
          userName: user.name,
          userRole: user.role,
          action: 'Business Updated',
          details: `Updated business: ${formData.name}`,
          district: user.district
        });
      }

      setIsEditing(false);
      setSelectedBusiness(null);
    } else {
      // Add new business
      const newBusiness: Omit<Business, 'id'> = {
        ...formData,
        status: 'active',
        registrationDate: new Date().toISOString().split('T')[0],
        district: user?.district
      };

      addBusiness(newBusiness);

      if (user) {
        addAuditLog({
          userId: user.id,
          userName: user.name,
          userRole: user.role,
          action: 'Business Registered',
          details: `Registered new business: ${formData.name}`,
          district: user.district
        });
      }
    }

    setShowNewBusinessForm(false);

    // Reset form
    setFormData({
      name: '',
      ownerName: '',
      category: '',
      phone: '',
      email: '',
      gpsLocation: '',
      physicalAddress: '',
      businessLicense: '',
      tinNumber: ''
    });

    alert(`Business ${isEditing ? 'updated' : 'registered'} successfully!`);
  };

  const handleEditBusiness = (business: Business) => {
    setSelectedBusiness(business);
    setFormData({
      name: business.name,
      ownerName: business.ownerName,
      category: business.category,
      phone: business.phone,
      email: business.email || '',
      gpsLocation: business.gpsLocation,
      physicalAddress: business.physicalAddress || '',
      businessLicense: business.businessLicense || '',
      tinNumber: business.tinNumber || ''
    });
    setIsEditing(true);
    setShowNewBusinessForm(true);
  };

  const handleViewBusiness = (business: Business) => {
    setSelectedBusiness(business);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      case 'inactive': return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
      case 'suspended': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
      case 'pending': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300';
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />;
      case 'inactive': return <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />;
      case 'suspended': return <Clock className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />;
      case 'pending': return <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      default: return <Clock className="w-4 h-4 text-gray-600 dark:text-gray-400" />;
    }
  };

  const businessCategories = [
    'Retail', 'Food Service', 'Electronics', 'Technology', 'Healthcare',
    'Education', 'Construction', 'Transportation', 'Manufacturing', 'Services', 'Other'
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Business Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Register and manage businesses in your district</p>
        </div>

        <PermissionGate permission="register_business">
          <button
            onClick={() => {
              setIsEditing(false);
              setSelectedBusiness(null);
              setFormData({
                name: '',
                ownerName: '',
                category: '',
                phone: '',
                email: '',
                gpsLocation: '',
                physicalAddress: '',
                businessLicense: '',
                tinNumber: ''
              });
              setShowNewBusinessForm(true);
            }}
            className="flex items-center space-x-2 bg-blue-600 dark:bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600"
          >
            <Plus className="w-4 h-4" />
            <span>Register Business</span>
          </button>
        </PermissionGate>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Registered Businesses</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{districtBusinesses.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Businesses</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {districtBusinesses.filter(b => b.status === 'active').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Registrations</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {districtBusinesses.filter(b => b.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Inactive Businesses</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {districtBusinesses.filter(b => b.status === 'inactive' || b.status === 'suspended').length}
              </p>
            </div>
          </div>
        </div>
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
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
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
                  Registration Date
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
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(business.status)}
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(business.status)}`}>
                        {business.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                    {new Date(business.registrationDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <PermissionGate permission={['view_business', 'view_my_business']}>
                        <button
                          onClick={() => handleViewBusiness(business)}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </PermissionGate>

                      <PermissionGate permission="edit_business">
                        <button
                          onClick={() => handleEditBusiness(business)}
                          className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300"
                          title="Edit Business"
                        >
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

      {/* Business Registration Reports & Analytics */}
      {user?.role === 'business_registration_officer' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Registration Reports & Analytics</h3>
            <p className="text-gray-600 dark:text-gray-400">Comprehensive business registration reports and insights</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-md font-semibold text-blue-900 dark:text-blue-100">Registration Summary</h4>
                  <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">Generate business registration summary reports</p>
                <button className="w-full px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                  Generate Report
                </button>
              </div>

              <div className="p-4 bg-green-50 dark:bg-green-900/30 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-md font-semibold text-green-900 dark:text-green-100">Category Analysis</h4>
                  <Building2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <p className="text-sm text-green-800 dark:text-green-200 mb-3">Analyze business registrations by category</p>
                <button className="w-full px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">
                  View Analysis
                </button>
              </div>

              <div className="p-4 bg-purple-50 dark:bg-purple-900/30 rounded-lg border border-purple-200 dark:border-purple-800">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-md font-semibold text-purple-900 dark:text-purple-100">Export Data</h4>
                  <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <p className="text-sm text-purple-800 dark:text-purple-200 mb-3">Export business registration data</p>
                <button className="w-full px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm">
                  Export Data
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New/Edit Business Form Modal */}
      {showNewBusinessForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {isEditing ? 'Edit Business' : 'Register New Business'}
              </h3>
              <button
                onClick={() => setShowNewBusinessForm(false)}
                className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitNewBusiness} className="space-y-6">
              {/* Business Information */}
              <div>
                <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">Business Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Business Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
                      placeholder="Enter business name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Owner Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.ownerName}
                      onChange={(e) => setFormData(prev => ({ ...prev, ownerName: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
                      placeholder="Enter owner name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
                      required
                    >
                      <option value="">Select category</option>
                      {businessCategories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
                      placeholder="+233 XX XXX XXXX"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
                      placeholder="business@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      GPS Location <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.gpsLocation}
                      onChange={(e) => setFormData(prev => ({ ...prev, gpsLocation: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
                      placeholder="GA-XXX-XXXX"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Physical Address
                    </label>
                    <textarea
                      value={formData.physicalAddress}
                      onChange={(e) => setFormData(prev => ({ ...prev, physicalAddress: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
                      placeholder="Enter physical address"
                    />
                  </div>
                </div>
              </div>

              {/* Legal Information */}
              <div>
                <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">Legal Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Business License Number
                    </label>
                    <input
                      type="text"
                      value={formData.businessLicense}
                      onChange={(e) => setFormData(prev => ({ ...prev, businessLicense: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
                      placeholder="Enter license number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      TIN Number
                    </label>
                    <input
                      type="text"
                      value={formData.tinNumber}
                      onChange={(e) => setFormData(prev => ({ ...prev, tinNumber: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
                      placeholder="Enter TIN number"
                    />
                  </div>
                </div>
              </div>

              {/* Document Upload Section */}
              <div>
                <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">Upload Documents</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Document Type
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
                      value={documentType}
                      onChange={e => setDocumentType(e.target.value)}
                    >
                      <option>Business License</option>
                      <option>Tax Certificate</option>
                      <option>Insurance Certificate</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Upload File
                    </label>
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center cursor-pointer">
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="hidden"
                        id="document-upload-input-form"
                        onChange={e => setDocumentFile(e.target.files?.[0] || null)}
                      />
                      <label htmlFor="document-upload-input-form">
                        <Upload className="w-8 h-8 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
                        <p className="text-sm text-gray-600 dark:text-gray-400">Click to upload or drag and drop</p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">PDF, JPG, PNG up to 10MB</p>
                        {documentFile && <p className="mt-2 text-xs text-green-600">Selected: {documentFile.name}</p>}
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => {
                    setShowNewBusinessForm(false);
                    setIsEditing(false);
                    setSelectedBusiness(null);
                    setDocumentFile(null);
                  }}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600"
                  disabled={!formData.name || !formData.ownerName || !formData.category || !formData.phone || !formData.gpsLocation}
                >
                  {isEditing ? 'Update Business' : 'Register Business'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Business Details Modal */}
      {selectedBusiness && !isEditing && !showNewBusinessForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Business Details</h3>
              <button
                onClick={() => setSelectedBusiness(null)}
                className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Business Status Card */}
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-750 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">{selectedBusiness.name}</h2>
                    <p className="text-gray-600 dark:text-gray-400">{selectedBusiness.category}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(selectedBusiness.status)}
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(selectedBusiness.status)}`}>
                    {selectedBusiness.status}
                  </span>
                </div>
              </div>

              {/* Business Information */}
              <div>
                <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">Business Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Owner Name</label>
                    </div>
                    <p className="text-sm text-gray-900 dark:text-white">{selectedBusiness.ownerName}</p>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <Phone className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number</label>
                    </div>
                    <p className="text-sm text-gray-900 dark:text-white">{selectedBusiness.phone}</p>
                  </div>
                  {selectedBusiness.email && (
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <Mail className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
                      </div>
                      <p className="text-sm text-gray-900 dark:text-white">{selectedBusiness.email}</p>
                    </div>
                  )}
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <MapPin className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">GPS Location</label>
                    </div>
                    <p className="text-sm text-gray-900 dark:text-white">{selectedBusiness.gpsLocation}</p>
                  </div>
                  {selectedBusiness.physicalAddress && (
                    <div className="md:col-span-2">
                      <div className="flex items-center space-x-2 mb-1">
                        <MapPin className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Physical Address</label>
                      </div>
                      <p className="text-sm text-gray-900 dark:text-white">{selectedBusiness.physicalAddress}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Legal Information */}
              <div>
                <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">Legal Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <FileText className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Business License</label>
                    </div>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {selectedBusiness.businessLicense || 'Not provided'}
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <FileText className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">TIN Number</label>
                    </div>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {selectedBusiness.tinNumber || 'Not provided'}
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Registration Date</label>
                    </div>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {new Date(selectedBusiness.registrationDate).toLocaleDateString()}
                    </p>
                  </div>
                  {selectedBusiness.lastPayment && (
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Last Payment</label>
                      </div>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {new Date(selectedBusiness.lastPayment).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setSelectedBusiness(null)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Close
                </button>
                <button
                  onClick={() => setShowDocumentUpload(true)}
                  className="px-4 py-2 bg-purple-600 dark:bg-purple-500 text-white rounded-lg hover:bg-purple-700 dark:hover:bg-purple-600 flex items-center space-x-2"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload Documents</span>
                </button>
                <PermissionGate permission="edit_business">
                  <button
                    onClick={() => handleEditBusiness(selectedBusiness)}
                    className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600"
                  >
                    Edit Business
                  </button>
                </PermissionGate>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Document Upload Modal */}
      {showDocumentUpload && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Upload Documents</h3>
              <button
                onClick={() => setShowDocumentUpload(false)}
                className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Document Type
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
                  value={documentType}
                  onChange={e => setDocumentType(e.target.value)}
                >
                  <option>Business License</option>
                  <option>Tax Certificate</option>
                  <option>Insurance Certificate</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Upload File
                </label>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center cursor-pointer">
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                    id="document-upload-input"
                    onChange={e => setDocumentFile(e.target.files?.[0] || null)}
                  />
                  <label htmlFor="document-upload-input">
                    <Upload className="w-8 h-8 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">PDF, JPG, PNG up to 10MB</p>
                    {documentFile && <p className="mt-2 text-xs text-green-600">Selected: {documentFile.name}</p>}
                  </label>
                </div>
              </div>
              <div className="flex items-center justify-end space-x-3 pt-4">
                <button
                  onClick={() => setShowDocumentUpload(false)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowDocumentUpload(false);
                    setDocumentFile(null);
                    alert('Document uploaded! (not actually saved, demo only)');
                  }}
                  className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600"
                  disabled={!documentFile}
                >
                  Upload Document
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredBusinesses.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
          <Building2 className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No businesses found</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {searchTerm || filterStatus !== 'all' || filterCategory !== 'all'
              ? 'No businesses match your current filters.'
              : 'Get started by registering your first business.'}
          </p>
          <PermissionGate permission="register_business">
            <button
              onClick={() => {
                setIsEditing(false);
                setSelectedBusiness(null);
                setFormData({
                  name: '',
                  ownerName: '',
                  category: '',
                  phone: '',
                  email: '',
                  gpsLocation: '',
                  physicalAddress: '',
                  businessLicense: '',
                  tinNumber: ''
                });
                setShowNewBusinessForm(true);
              }}
              className="inline-flex items-center space-x-2 bg-blue-600 dark:bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600"
            >
              <Plus className="w-4 h-4" />
              <span>Register Business</span>
            </button>
          </PermissionGate>
        </div>
      )}
    </div>
  );
}