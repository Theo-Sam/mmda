import React, { useState } from 'react';
import {
  Target,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  Calendar,
  Edit,
  Plus,
  Trash2,
  Eye,
  Download,
  Filter,
  Search,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  MapPin,
  Phone,
  Mail,
  MessageSquare,
  FileText,
  Award,
  Star,
  ArrowUp,
  ArrowDown,
  Play,
  Pause,
  RotateCcw,
  CheckSquare,
  Square,
  Clock3,
  AlertCircle,
  Info,
  Zap,
  Target as TargetIcon,
  Flag,
  Shield,
  TrendingUp as TrendingUpIcon,
  Building2
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  PieChart as RechartsPieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import { useTheme } from '../../contexts/ThemeContext';
import { useApp } from '../../contexts/AppContext';

export default function InterventionPlanningDashboard() {
  const { 
    interventionPlans, 
    regionalOversightData, 
    complianceData,
    realTimeAlerts,
    communicationLogs
  } = useApp();
  
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewIntervention, setShowNewIntervention] = useState(false);
  const { theme } = useTheme();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100 dark:bg-green-900/30';
      case 'in_progress': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30';
      case 'planned': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30';
      case 'overdue': return 'text-red-600 bg-red-100 dark:bg-red-900/30';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-600 bg-red-100 dark:bg-red-900/30';
      case 'high': return 'text-orange-600 bg-orange-100 dark:bg-orange-900/30';
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30';
      case 'low': return 'text-green-600 bg-green-100 dark:bg-green-900/30';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'text-green-600';
    if (progress >= 60) return 'text-blue-600';
    if (progress >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Filter interventions based on selected criteria
  const filteredInterventions = interventionPlans.filter(intervention => {
    const matchesStatus = selectedStatus === 'all' || intervention.status === selectedStatus;
    const matchesRegion = selectedRegion === 'all' || 
      regionalOversightData.some(region => 
        region.region.includes(selectedRegion) && 
        intervention.mmda.includes(region.region)
      );
    const matchesPriority = selectedPriority === 'all' || intervention.priority === selectedPriority;
    const matchesSearch = intervention.mmda.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         intervention.issue.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         intervention.action.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesRegion && matchesPriority && matchesSearch;
  });

  // Calculate intervention statistics
  const totalInterventions = interventionPlans.length;
  const completedInterventions = interventionPlans.filter(i => i.status === 'completed').length;
  const inProgressInterventions = interventionPlans.filter(i => i.status === 'in_progress').length;
  const overdueInterventions = interventionPlans.filter(i => i.status === 'overdue').length;
  const averageProgress = interventionPlans.reduce((sum, i) => sum + i.progress, 0) / totalInterventions;

  // Generate intervention performance data for charts
  const interventionPerformanceData = [
    { month: 'Jan', planned: 8, completed: 6, inProgress: 2 },
    { month: 'Feb', planned: 12, completed: 9, inProgress: 3 },
    { month: 'Mar', planned: 15, completed: 12, inProgress: 3 },
    { month: 'Apr', planned: 10, completed: 8, inProgress: 2 },
    { month: 'May', planned: 18, completed: 14, inProgress: 4 },
    { month: 'Jun', planned: 20, completed: 16, inProgress: 4 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Intervention Planning Dashboard</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Strategic intervention management for underperforming MMDAs
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setShowNewIntervention(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>New Intervention</span>
            </button>
            <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Export Report</span>
            </button>
          </div>
        </div>

        {/* Summary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-lg">
                <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-800 dark:text-blue-200">Total Interventions</p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{totalInterventions}</p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 dark:bg-green-800 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-green-800 dark:text-green-200">Completed</p>
                <p className="text-2xl font-bold text-green-900 dark:text-green-100">{completedInterventions}</p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-800 rounded-lg">
                <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">In Progress</p>
                <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">{inProgressInterventions}</p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-100 dark:bg-red-800 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-red-800 dark:text-red-200">Overdue</p>
                <p className="text-2xl font-bold text-red-900 dark:text-red-100">{overdueInterventions}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search interventions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex gap-3">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
            >
              <option value="all">All Status</option>
              <option value="planned">Planned</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="overdue">Overdue</option>
            </select>

            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
            >
              <option value="all">All Regions</option>
              <option value="Greater Accra">Greater Accra</option>
              <option value="Ashanti">Ashanti</option>
              <option value="Western">Western</option>
              <option value="Central">Central</option>
              <option value="Eastern">Eastern</option>
              <option value="Northern">Northern</option>
              <option value="Volta">Volta</option>
              <option value="Brong Ahafo">Brong Ahafo</option>
              <option value="Upper East">Upper East</option>
              <option value="Upper West">Upper West</option>
            </select>

            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
            >
              <option value="all">All Priorities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Intervention Performance Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Intervention Performance Trends</h3>
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Planned</span>
            <div className="w-3 h-3 bg-green-500 rounded-full ml-3"></div>
            <span>Completed</span>
            <div className="w-3 h-3 bg-yellow-500 rounded-full ml-3"></div>
            <span>In Progress</span>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={interventionPerformanceData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
            <XAxis 
              dataKey="month" 
              tick={{ fill: theme === 'dark' ? '#9CA3AF' : '#4B5563' }}
              axisLine={{ stroke: theme === 'dark' ? '#374151' : '#E5E7EB' }}
            />
            <YAxis 
              tick={{ fill: theme === 'dark' ? '#9CA3AF' : '#4B5563' }}
              axisLine={{ stroke: theme === 'dark' ? '#374151' : '#E5E7EB' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: theme === 'dark' ? '#1F2937' : '#FFFFFF',
                borderColor: theme === 'dark' ? '#374151' : '#E5E7EB',
                color: theme === 'dark' ? '#F9FAFB' : '#111827'
              }}
            />
            <Legend />
            <Bar dataKey="planned" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="completed" fill="#10B981" radius={[4, 4, 0, 0]} />
            <Bar dataKey="inProgress" fill="#F59E0B" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Interventions List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Active Interventions</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {filteredInterventions.length} interventions found
          </p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  MMDA
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Issue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Action Plan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Assigned To
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Deadline
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Progress
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredInterventions.map((intervention) => (
                <tr key={intervention.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                          <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {intervention.mmda}
                        </div>
                                                 <div className="text-sm text-gray-500 dark:text-gray-400">
                           {regionalOversightData.find((r: any) => r.region.includes(intervention.mmda.split(' ')[0]))?.region || 'Unknown Region'}
                         </div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 dark:text-white max-w-xs truncate">
                      {intervention.issue}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 dark:text-white max-w-xs truncate">
                      {intervention.action}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8">
                        <div className="h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                          <Users className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        </div>
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                     {intervention.assignedTo.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {formatDate(intervention.deadline)}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(intervention.deadline) < new Date() ? 'Overdue' : 'On Track'}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                                         <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(intervention.status)}`}>
                       {intervention.status.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                     </span>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-2">
                        <div 
                          className={`h-2 rounded-full ${getProgressColor(intervention.progress)}`}
                          style={{ width: `${intervention.progress}%` }}
                        ></div>
                      </div>
                      <span className={`text-sm font-medium ${getProgressColor(intervention.progress)}`}>
                        {intervention.progress}%
                      </span>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300">
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

      {/* Quick Actions and Communication */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full px-4 py-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-left hover:bg-blue-100 dark:hover:bg-blue-800">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-lg">
                  <MessageSquare className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="font-medium text-blue-900 dark:text-blue-100">Send Bulk Notifications</p>
                  <p className="text-sm text-blue-700 dark:text-blue-300">Notify all assigned teams</p>
                </div>
              </div>
            </button>

            <button className="w-full px-4 py-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-left hover:bg-green-100 dark:hover:bg-green-800">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 dark:bg-green-800 rounded-lg">
                  <Calendar className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="font-medium text-green-900 dark:text-green-100">Schedule Review Meeting</p>
                  <p className="text-sm text-green-700 dark:text-green-300">Plan intervention review</p>
                </div>
              </div>
            </button>

            <button className="w-full px-4 py-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg text-left hover:bg-yellow-100 dark:hover:bg-yellow-800">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-yellow-100 dark:bg-yellow-800 rounded-lg">
                  <Download className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <p className="font-medium text-yellow-900 dark:text-yellow-100">Generate Progress Report</p>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">Export current status</p>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Recent Communications */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Communications</h3>
          <div className="space-y-3">
            {communicationLogs.slice(0, 3).map((log) => (
              <div key={log.id} className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className={`p-1 rounded ${
                      log.type === 'email' ? 'bg-blue-100 dark:bg-blue-900/30' :
                      log.type === 'sms' ? 'bg-green-100 dark:bg-green-900/30' :
                      'bg-purple-100 dark:bg-purple-900/30'
                    }`}>
                      {log.type === 'email' && <Mail className="w-3 h-3 text-blue-600 dark:text-blue-400" />}
                      {log.type === 'sms' && <MessageSquare className="w-3 h-3 text-green-600 dark:text-green-400" />}
                      {log.type === 'report' && <FileText className="w-3 h-3 text-purple-600 dark:text-purple-400" />}
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {log.recipient}
                    </span>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    log.priority === 'critical' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                    log.priority === 'high' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300' :
                    'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                  }`}>
                    {log.priority}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{log.subject}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {formatDate(log.timestamp)} • {log.status}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
