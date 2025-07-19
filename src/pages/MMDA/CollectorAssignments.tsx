import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  MapPin, 
  Users, 
  Building2, 
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  UserCheck,
  AlertTriangle,
  X
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Assignment } from '../../types';
import { filterByJurisdiction } from '../../utils/filterByJurisdiction';

interface AssignmentWithDetails extends Assignment {
  collectorName?: string;
  businessName?: string;
  zoneDetails?: string;
  businessCount?: number;
}

export default function CollectorAssignments() {
  const { user } = useAuth();
  const { assignments, setAssignments } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedAssignment, setSelectedAssignment] = useState<AssignmentWithDetails | null>(null);
  const [showNewAssignmentForm, setShowNewAssignmentForm] = useState(false);
  const { theme } = useTheme();

  // Mock data for collectors and zones
  const collectors = [
    { id: '3', name: 'Kwame Boateng', phone: '+233 24 345 6789', email: 'collector@accra.gov.gh' },
    { id: '8', name: 'Ama Mensah', phone: '+233 24 987 6543', email: 'ama.mensah@accra.gov.gh' },
    { id: '9', name: 'Kofi Owusu', phone: '+233 24 876 5432', email: 'kofi.owusu@accra.gov.gh' },
  ];

  const zones = [
    { id: '1', name: 'Makola Market Zone A', description: 'Main market area - stalls 1-50', businessCount: 45 },
    { id: '2', name: 'Kaneshie Commercial District', description: 'Commercial shops and offices', businessCount: 28 },
    { id: '3', name: 'Osu Business District', description: 'Restaurants and retail shops', businessCount: 35 },
    { id: '4', name: 'Accra Central Zone', description: 'Central business district shops', businessCount: 52 },
  ];

  // TODO: Ensure each assignment has a 'district' field for proper filtering
  const districtAssignments = user ? filterByJurisdiction(user, assignments) : [];
  // Enhance assignments with details
  const enhancedAssignments: AssignmentWithDetails[] = districtAssignments.map(assignment => {
    const collector = collectors.find(c => c.id === assignment.collectorId);
    
    if (assignment.businessId) {
      // Business assignment
      return {
        ...assignment,
        collectorName: collector?.name,
        businessName: 'Kofi\'s General Store', // Mock data
        type: 'business'
      };
    } else if (assignment.zone) {
      // Zone assignment
      const zone = zones.find(z => z.name === assignment.zone);
      return {
        ...assignment,
        collectorName: collector?.name,
        zoneDetails: zone?.description,
        businessCount: zone?.businessCount,
        type: 'zone'
      };
    }
    
    return assignment;
  });

  // Filter assignments
  const filteredAssignments = enhancedAssignments.filter(assignment => {
    const matchesSearch = (assignment.collectorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          assignment.businessName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          assignment.zone?.toLowerCase().includes(searchTerm.toLowerCase())) ?? false;
    const matchesType = filterType === 'all' || 
                       (filterType === 'business' && assignment.businessId) || 
                       (filterType === 'zone' && assignment.zone);
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && assignment.isActive) ||
                         (filterStatus === 'inactive' && !assignment.isActive);
    return matchesSearch && matchesType && matchesStatus;
  });

  // Form state for new assignment
  const [formData, setFormData] = useState({
    collectorId: '',
    assignmentType: 'business',
    businessId: '',
    zone: '',
    startDate: new Date().toISOString().split('T')[0]
  });

  const handleSubmitNewAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.collectorId || 
        (formData.assignmentType === 'business' && !formData.businessId) ||
        (formData.assignmentType === 'zone' && !formData.zone)) {
      alert('Please fill in all required fields');
      return;
    }
    
    // In a real app, this would create a new assignment
    alert('Assignment created successfully!');
    setShowNewAssignmentForm(false);
    
    // Reset form
    setFormData({
      collectorId: '',
      assignmentType: 'business',
      businessId: '',
      zone: '',
      startDate: new Date().toISOString().split('T')[0]
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Collector Assignments</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage collector assignments to businesses and zones</p>
        </div>
        <button
          onClick={() => setShowNewAssignmentForm(true)}
          className="flex items-center space-x-2 bg-blue-600 dark:bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Create Assignment</span>
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <UserCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Assignments</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{assignments.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Assignments</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {assignments.filter(a => a.isActive).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <Users className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Collectors</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{collectors.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <MapPin className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Collection Zones</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{zones.length}</p>
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
                placeholder="Search assignments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Types</option>
              <option value="business">Business</option>
              <option value="zone">Zone</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <Filter className="w-4 h-4" />
            <span>{filteredAssignments.length} assignments found</span>
          </div>
        </div>
      </div>

      {/* Assignments Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Collector
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Assignment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredAssignments.map((assignment) => (
                <tr key={assignment.id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {assignment.collectorName || `Collector ${assignment.collectorId}`}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {assignment.businessName || assignment.zone}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {assignment.zoneDetails || (assignment.businessId && 'Individual business')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      assignment.businessId 
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300' 
                        : 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300'
                    }`}>
                      {assignment.businessId ? 'Business' : 'Zone'}
                    </span>
                    {assignment.businessCount && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {assignment.businessCount} businesses
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {new Date(assignment.startDate).toLocaleDateString()}
                    </div>
                    {assignment.endDate && (
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        to {new Date(assignment.endDate).toLocaleDateString()}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      assignment.isActive 
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' 
                        : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                    }`}>
                      {assignment.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => setSelectedAssignment(assignment)}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300" title="Edit Assignment">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300" title="Delete Assignment">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assignment Details Modal */}
      {selectedAssignment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Assignment Details</h3>
              <button
                onClick={() => setSelectedAssignment(null)}
                className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Collector</label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedAssignment.collectorName || `Collector ${selectedAssignment.collectorId}`}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Assignment Type</label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    selectedAssignment.businessId 
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300' 
                      : 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300'
                  }`}>
                    {selectedAssignment.businessId ? 'Business' : 'Zone'}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {selectedAssignment.businessId ? 'Business' : 'Zone'}
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedAssignment.businessName || selectedAssignment.zone}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    selectedAssignment.isActive 
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' 
                      : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                  }`}>
                    {selectedAssignment.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              {/* Details */}
              <div>
                <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">Assignment Details</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Date</label>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {new Date(selectedAssignment.startDate).toLocaleDateString()}
                    </p>
                  </div>
                  {selectedAssignment.endDate && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Date</label>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {new Date(selectedAssignment.endDate).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                  {selectedAssignment.zoneDetails && (
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Zone Description</label>
                      <p className="text-sm text-gray-900 dark:text-white">{selectedAssignment.zoneDetails}</p>
                    </div>
                  )}
                  {selectedAssignment.businessCount && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Business Count</label>
                      <p className="text-sm text-gray-900 dark:text-white">{selectedAssignment.businessCount} businesses</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setSelectedAssignment(null)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Close
                </button>
                <button className="px-4 py-2 bg-green-600 dark:bg-green-500 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600">
                  Edit Assignment
                </button>
                {selectedAssignment.isActive ? (
                  <button className="px-4 py-2 bg-red-600 dark:bg-red-500 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-600">
                    Deactivate
                  </button>
                ) : (
                  <button className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600">
                    Activate
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Assignment Form Modal */}
      {showNewAssignmentForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Create New Assignment</h3>
              <button
                onClick={() => setShowNewAssignmentForm(false)}
                className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmitNewAssignment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Collector <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.collectorId}
                  onChange={(e) => setFormData(prev => ({ ...prev, collectorId: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
                  required
                >
                  <option value="">Select collector</option>
                  {collectors.map(collector => (
                    <option key={collector.id} value={collector.id}>
                      {collector.name} ({collector.email})
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Assignment Type <span className="text-red-500">*</span>
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="assignmentType"
                      value="business"
                      checked={formData.assignmentType === 'business'}
                      onChange={() => setFormData(prev => ({ ...prev, assignmentType: 'business' }))}
                      className="text-blue-600 dark:text-blue-400"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Business</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="assignmentType"
                      value="zone"
                      checked={formData.assignmentType === 'zone'}
                      onChange={() => setFormData(prev => ({ ...prev, assignmentType: 'zone' }))}
                      className="text-blue-600 dark:text-blue-400"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Zone</span>
                  </label>
                </div>
              </div>
              
              {formData.assignmentType === 'business' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Business <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.businessId}
                    onChange={(e) => setFormData(prev => ({ ...prev, businessId: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
                    required={formData.assignmentType === 'business'}
                  >
                    <option value="">Select business</option>
                    <option value="1">Kofi's General Store</option>
                    <option value="2">Ama's Restaurant</option>
                    <option value="3">Tech Solutions Ltd</option>
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Zone <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.zone}
                    onChange={(e) => setFormData(prev => ({ ...prev, zone: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
                    required={formData.assignmentType === 'zone'}
                  >
                    <option value="">Select zone</option>
                    {zones.map(zone => (
                      <option key={zone.id} value={zone.name}>
                        {zone.name} ({zone.businessCount} businesses)
                      </option>
                    ))}
                  </select>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
              
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => setShowNewAssignmentForm(false)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600"
                >
                  Create Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredAssignments.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
          <UserCheck className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No assignments found</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {searchTerm || filterType !== 'all' || filterStatus !== 'all'
              ? 'No assignments match your current filters.'
              : 'Start by creating your first collector assignment.'}
          </p>
          <button
            onClick={() => setShowNewAssignmentForm(true)}
            className="inline-flex items-center space-x-2 bg-blue-600 dark:bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600"
          >
            <Plus className="w-4 h-4" />
            <span>Create Assignment</span>
          </button>
        </div>
      )}
    </div>
  );
}