import React from 'react';
import { 
  Building2, 
  Users, 
  FileText, 
  CheckCircle, 
  Clock, 
  Plus,
  ArrowRight,
  Search,
  Edit,
  Trash2,
  Eye,
  Filter,
  Calendar
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import StatCard from '../../components/Dashboard/StatCard';
import RecentActivity from '../../components/Dashboard/RecentActivity';
import { filterByJurisdiction } from '../../utils/filterByJurisdiction';

export default function BusinessRegistrationOfficerDashboard() {
  const { user } = useAuth();
  const { businesses, auditLogs } = useApp();
  
  // Filter businesses for this district
  const districtBusinesses = user ? filterByJurisdiction(user, businesses) : [];
  
  // Calculate statistics
  const activeBusinesses = districtBusinesses.filter(b => b.status === 'active').length;
  const pendingBusinesses = districtBusinesses.filter(b => b.status === 'pending').length;
  const inactiveBusinesses = districtBusinesses.filter(b => b.status === 'inactive').length;
  
  // Filter recent business-related activities
  const recentBusinessActivities = user
    ? filterByJurisdiction(user, auditLogs).filter(log => log.action.includes('Business')).slice(0, 5)
    : [];

  // Get recent businesses
  const recentBusinesses = districtBusinesses
    .sort((a, b) => new Date(b.registrationDate).getTime() - new Date(a.registrationDate).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Business Registration Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage business registrations and updates</p>
          <div className="flex items-center space-x-4 mt-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">Welcome back, {user?.name}</span>
            <span className="text-sm text-gray-400 dark:text-gray-500">•</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">{user?.district}</span>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
          <Calendar className="w-4 h-4" />
          <span>{new Date().toLocaleDateString('en-GB', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</span>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Businesses"
          value={districtBusinesses.length.toString()}
          icon={Building2}
          color="blue"
        />
        <StatCard
          title="Active Businesses"
          value={activeBusinesses.toString()}
          icon={CheckCircle}
          color="green"
        />
        <StatCard
          title="Pending Registrations"
          value={pendingBusinesses.toString()}
          icon={Clock}
          color="yellow"
        />
        <StatCard
          title="Inactive Businesses"
          value={inactiveBusinesses.toString()}
          icon={Building2}
          color="red"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Actions</h3>
          <span className="text-sm text-gray-500 dark:text-gray-400">Business Management Tools</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/businesses"
            className="group relative overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-200 hover:border-blue-300 dark:hover:border-blue-700"
          >
            <div className="flex items-start space-x-4">
              <div className="p-3 rounded-lg bg-blue-600 dark:bg-blue-700 text-white">
                <Plus className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  Register New Business
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Add a new business to the system
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
            </div>
          </Link>

          <Link
            to="/businesses"
            className="group relative overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-200 hover:border-green-300 dark:hover:border-green-700"
          >
            <div className="flex items-start space-x-4">
              <div className="p-3 rounded-lg bg-green-600 dark:bg-green-700 text-white">
                <Search className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                  Find Business
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Search and view business details
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors" />
            </div>
          </Link>

          <Link
            to="/reports"
            className="group relative overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-200 hover:border-purple-300 dark:hover:border-purple-700"
          >
            <div className="flex items-start space-x-4">
              <div className="p-3 rounded-lg bg-purple-600 dark:bg-purple-700 text-white">
                <FileText className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  Business Reports
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  View registration statistics
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors" />
            </div>
          </Link>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Businesses */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recently Registered Businesses</h3>
                <Link 
                  to="/businesses"
                  className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
                >
                  View All
                </Link>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentBusinesses.length > 0 ? (
                  recentBusinesses.map((business) => (
                    <div key={business.id} className="flex items-center justify-between p-4 rounded-lg border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                          <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">{business.name}</h4>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                            <span>{business.ownerName}</span>
                            <span>•</span>
                            <span>{business.category}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          business.status === 'active' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' :
                          business.status === 'pending' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300' :
                          'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                        }`}>
                          {business.status}
                        </span>
                        <div className="flex items-center space-x-1">
                          <button className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300">
                            <Edit className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Building2 className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No businesses yet</h4>
                    <p className="text-gray-600 dark:text-gray-400">Start by registering a new business</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentBusinessActivities.length > 0 ? (
                recentBusinessActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                      <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.action}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{activity.details}</p>
                      <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400 mt-1">
                        <Clock className="w-3 h-3" />
                        <span>{new Date(activity.timestamp).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No recent activity</h4>
                  <p className="text-gray-600 dark:text-gray-400">Your activities will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Business Categories */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Business Categories</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {['Retail', 'Food Service', 'Electronics', 'Services'].map((category) => {
            const count = districtBusinesses.filter(b => b.category === category).length;
            return (
              <div key={category} className="bg-gray-50 dark:bg-gray-750 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900 dark:text-white">{category}</h4>
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-400">{count}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full" 
                    style={{ width: `${Math.min((count / districtBusinesses.length) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}