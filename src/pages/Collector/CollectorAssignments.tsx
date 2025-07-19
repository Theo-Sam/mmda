import React, { useState } from 'react';
import { 
  MapPin, 
  Building2, 
  Calendar, 
  User, 
  Phone, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Search,
  Filter,
  Eye,
  Navigation,
  Target,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { filterByJurisdiction } from '../../utils/filterByJurisdiction';
import { useApp } from '../../contexts/AppContext';

interface Assignment {
  id: string;
  type: 'business' | 'zone';
  businessId?: string;
  businessName?: string;
  businessOwner?: string;
  businessPhone?: string;
  businessLocation?: string;
  businessCategory?: string;
  zoneName?: string;
  zoneDescription?: string;
  businessCount?: number;
  startDate: string;
  endDate?: string;
  isActive: boolean;
  lastVisit?: string;
  totalCollections: number;
  monthlyTarget: number;
  completionRate: number;
}

export default function CollectorAssignments() {
  const { user } = useAuth();
  const { assignments, loading, error } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const { theme } = useTheme();

  const filteredAssignments = (user ? filterByJurisdiction(user, assignments) : assignments).filter(assignment => {
    const matchesSearch = (assignment.businessName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          assignment.zoneName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          assignment.businessOwner?.toLowerCase().includes(searchTerm.toLowerCase())) ?? false;
    const matchesType = filterType === 'all' || assignment.type === filterType;
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && assignment.isActive) ||
                         (filterStatus === 'inactive' && !assignment.isActive);
    return matchesSearch && matchesType && matchesStatus;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getCompletionColor = (rate: number) => {
    if (rate >= 90) return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30';
    if (rate >= 70) return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30';
    return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30';
  };

  const getStatusIcon = (assignment: Assignment) => {
    if (!assignment.isActive) return <Clock className="w-4 h-4 text-gray-600 dark:text-gray-400" />;
    if (assignment.completionRate >= 90) return <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />;
    if (assignment.completionRate >= 70) return <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />;
    return <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />;
  };

  // Calculate summary stats
  const activeAssignments = assignments.filter(a => a.isActive);
  const totalTarget = activeAssignments.reduce((sum, a) => sum + a.monthlyTarget, 0);
  const totalCollected = activeAssignments.reduce((sum, a) => sum + a.totalCollections, 0);
  const averageCompletion = activeAssignments.length > 0 
    ? activeAssignments.reduce((sum, a) => sum + a.completionRate, 0) / activeAssignments.length 
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Assignments</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your assigned businesses and collection zones</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600 dark:text-gray-400">Active Assignments</p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{activeAssignments.length}</p>
        </div>
      </div>

      {/* Performance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Monthly Target</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{formatCurrency(totalTarget)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Collected</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{formatCurrency(totalCollected)}</p>
              <p className="text-sm text-green-600 dark:text-green-400">
                {totalTarget > 0 ? Math.round((totalCollected / totalTarget) * 100) : 0}% of target
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <CheckCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg. Completion</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{Math.round(averageCompletion)}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <Building2 className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Businesses</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {assignments.filter(a => a.type === 'business').length + 
                 assignments.filter(a => a.type === 'zone').reduce((sum, a) => sum + (a.businessCount || 0), 0)}
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
              <option value="business">Individual Business</option>
              <option value="zone">Zone Assignment</option>
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

      {/* Assignments Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredAssignments.map((assignment) => (
          <div key={assignment.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${assignment.type === 'business' ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-purple-100 dark:bg-purple-900/30'}`}>
                  {assignment.type === 'business' ? (
                    <Building2 className={`w-5 h-5 ${assignment.type === 'business' ? 'text-blue-600 dark:text-blue-400' : 'text-purple-600 dark:text-purple-400'}`} />
                  ) : (
                    <MapPin className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {assignment.type === 'business' ? assignment.businessName : assignment.zoneName}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {assignment.type === 'business' 
                      ? assignment.businessCategory 
                      : `${assignment.businessCount} businesses`}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusIcon(assignment)}
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  assignment.isActive ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                }`}>
                  {assignment.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>

            {/* Assignment Details */}
            <div className="space-y-3 mb-4">
              {assignment.type === 'business' ? (
                <>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <User className="w-4 h-4" />
                    <span>{assignment.businessOwner}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <Phone className="w-4 h-4" />
                    <span>{assignment.businessPhone}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <MapPin className="w-4 h-4" />
                    <span>{assignment.businessLocation}</span>
                  </div>
                </>
              ) : (
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <p>{assignment.zoneDescription}</p>
                </div>
              )}
              
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <Calendar className="w-4 h-4" />
                <span>
                  Started: {new Date(assignment.startDate).toLocaleDateString()}
                  {assignment.endDate && ` - Ended: ${new Date(assignment.endDate).toLocaleDateString()}`}
                </span>
              </div>
              
              {assignment.lastVisit && (
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>Last visit: {new Date(assignment.lastVisit).toLocaleDateString()}</span>
                </div>
              )}
            </div>

            {/* Performance Metrics */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Monthly Target</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{formatCurrency(assignment.monthlyTarget)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Collected</p>
                  <p className="text-sm font-medium text-green-600 dark:text-green-400">{formatCurrency(assignment.totalCollections)}</p>
                </div>
              </div>
              
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Completion Rate</span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getCompletionColor(assignment.completionRate)}`}>
                    {assignment.completionRate}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      assignment.completionRate >= 90 ? 'bg-green-600 dark:bg-green-500' :
                      assignment.completionRate >= 70 ? 'bg-yellow-600 dark:bg-yellow-500' : 'bg-red-600 dark:bg-red-500'
                    }`}
                    style={{ width: `${Math.min(assignment.completionRate, 100)}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <button
                  onClick={() => setSelectedAssignment(assignment)}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium"
                >
                  View Details
                </button>
                <div className="flex items-center space-x-2">
                  <button className="p-1 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400" title="Navigate">
                    <Navigation className="w-4 h-4" />
                  </button>
                  <button className="p-1 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400" title="View Details">
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
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
              <div>
                <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">
                  {selectedAssignment.type === 'business' ? 'Business Information' : 'Zone Information'}
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {selectedAssignment.type === 'business' ? 'Business Name' : 'Zone Name'}
                    </label>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {selectedAssignment.type === 'business' ? selectedAssignment.businessName : selectedAssignment.zoneName}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                      selectedAssignment.type === 'business' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300' : 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300'
                    }`}>
                      {selectedAssignment.type === 'business' ? 'Individual Business' : 'Zone Assignment'}
                    </span>
                  </div>
                  
                  {selectedAssignment.type === 'business' ? (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Owner</label>
                        <p className="text-sm text-gray-900 dark:text-white">{selectedAssignment.businessOwner}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                        <p className="text-sm text-gray-900 dark:text-white">{selectedAssignment.businessCategory}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
                        <p className="text-sm text-gray-900 dark:text-white">{selectedAssignment.businessPhone}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location</label>
                        <p className="text-sm text-gray-900 dark:text-white">{selectedAssignment.businessLocation}</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                        <p className="text-sm text-gray-900 dark:text-white">{selectedAssignment.zoneDescription}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Business Count</label>
                        <p className="text-sm text-gray-900 dark:text-white">{selectedAssignment.businessCount} businesses</p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Performance Metrics */}
              <div>
                <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">Performance Metrics</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      <span className="text-sm font-medium text-blue-900 dark:text-blue-300">Monthly Target</span>
                    </div>
                    <p className="text-lg font-bold text-blue-900 dark:text-blue-300 mt-1">
                      {formatCurrency(selectedAssignment.monthlyTarget)}
                    </p>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="text-sm font-medium text-green-900 dark:text-green-300">Collected</span>
                    </div>
                    <p className="text-lg font-bold text-green-900 dark:text-green-300 mt-1">
                      {formatCurrency(selectedAssignment.totalCollections)}
                    </p>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      <span className="text-sm font-medium text-purple-900 dark:text-purple-300">Completion</span>
                    </div>
                    <p className="text-lg font-bold text-purple-900 dark:text-purple-300 mt-1">
                      {selectedAssignment.completionRate}%
                    </p>
                  </div>
                </div>
              </div>

              {/* Assignment Timeline */}
              <div>
                <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">Assignment Timeline</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Start Date:</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {new Date(selectedAssignment.startDate).toLocaleDateString()}
                    </span>
                  </div>
                  {selectedAssignment.endDate && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">End Date:</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {new Date(selectedAssignment.endDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  {selectedAssignment.lastVisit && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Last Visit:</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {new Date(selectedAssignment.lastVisit).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Status:</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      selectedAssignment.isActive ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                    }`}>
                      {selectedAssignment.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
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
                <button className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600">
                  Navigate to Location
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredAssignments.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
          <MapPin className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No assignments found</h3>
          <p className="text-gray-600 dark:text-gray-400">
            {searchTerm || filterType !== 'all' || filterStatus !== 'all'
              ? 'No assignments match your current filters.'
              : 'You don\'t have any assignments yet. Contact your supervisor for assignments.'}
          </p>
        </div>
      )}
    </div>
  );
}