import { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  RefreshCw,
  Cpu,
  HardDrive,
  Shield,
  Zap,
  Bell,
  Settings,
  Download,
  BarChart3
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useTheme } from '../../contexts/ThemeContext';

// Enhanced system metrics data with capacity planning
const systemMetrics = {
  uptime: 99.8,
  totalRequests: 2847293,
  activeUsers: 1247,
  responseTime: 245,
  errorRate: 0.02,
  dataIntegrity: 98.7,
  // New capacity metrics
  cpuUsage: 72,
  memoryUsage: 68,
  storageUsage: 45,
  networkLatency: 45,
  databaseConnections: 156,
  activeSessions: 892
};

// Capacity thresholds for proactive alerts
const capacityThresholds = {
  cpu: { warning: 70, critical: 85 },
  memory: { warning: 75, critical: 90 },
  storage: { warning: 80, critical: 90 },
  database: { warning: 80, critical: 90 }
};

const performanceData = [
  { time: '00:00', cpu: 45, memory: 62, requests: 120, storage: 42, network: 23 },
  { time: '04:00', cpu: 38, memory: 58, requests: 95, storage: 43, network: 18 },
  { time: '08:00', cpu: 72, memory: 75, requests: 280, storage: 44, network: 45 },
  { time: '12:00', cpu: 85, memory: 82, requests: 450, storage: 45, network: 67 },
  { time: '16:00', cpu: 78, memory: 79, requests: 380, storage: 46, network: 58 },
  { time: '20:00', cpu: 65, memory: 71, requests: 220, storage: 47, network: 34 },
];

const districtStatus = [
  { name: 'Accra Metropolitan', status: 'online', uptime: 99.9, lastSync: '2 min ago', users: 45, performance: 98.5, alerts: 0 },
  { name: 'Kumasi Metropolitan', status: 'online', uptime: 99.7, lastSync: '1 min ago', users: 38, performance: 97.2, alerts: 1 },
  { name: 'Tema Municipal', status: 'online', uptime: 99.5, lastSync: '3 min ago', users: 32, performance: 96.8, alerts: 0 },
  { name: 'Cape Coast Metropolitan', status: 'warning', uptime: 97.2, lastSync: '15 min ago', users: 28, performance: 89.3, alerts: 3 },
  { name: 'Tamale Metropolitan', status: 'online', uptime: 99.1, lastSync: '1 min ago', users: 25, performance: 95.7, alerts: 1 },
  { name: 'Sekondi-Takoradi', status: 'offline', uptime: 0, lastSync: '2 hours ago', users: 0, performance: 0, alerts: 5 },
];

// Enhanced system alerts with proactive monitoring
const systemAlerts = [
  { id: 1, type: 'critical', message: 'Database connection timeout in Northern Region', time: '5 min ago', resolved: false, priority: 'high', affected: 'Northern Region MMDAs' },
  { id: 2, type: 'warning', message: 'High memory usage on server cluster 2', time: '12 min ago', resolved: false, priority: 'medium', affected: 'Server Cluster 2' },
  { id: 3, type: 'info', message: 'Scheduled maintenance completed successfully', time: '1 hour ago', resolved: true, priority: 'low', affected: 'All Systems' },
  { id: 4, type: 'warning', message: 'API rate limit approaching for external services', time: '2 hours ago', resolved: false, priority: 'medium', affected: 'External APIs' },
  { id: 5, type: 'critical', message: 'Storage capacity reaching 85% threshold', time: '30 min ago', resolved: false, priority: 'high', affected: 'Primary Storage' },
  { id: 6, type: 'warning', message: 'CPU usage trending upward - capacity planning needed', time: '1 hour ago', resolved: false, priority: 'medium', affected: 'Application Servers' },
];

// Disaster recovery status
const disasterRecoveryStatus = {
  lastBackup: '2 hours ago',
  backupSize: '2.4 GB',
  backupStatus: 'success',
  recoveryTimeObjective: '4 hours',
  recoveryPointObjective: '1 hour',
  nextScheduledBackup: '6 hours from now',
  backupRetention: '30 days',
  dataIntegrity: 'verified'
};

// Capacity planning data
const capacityPlanning = {
  currentUtilization: {
    cpu: 72,
    memory: 68,
    storage: 45,
    network: 45
  },
  projectedGrowth: {
    cpu: 8.5,
    memory: 12.3,
    storage: 15.7,
    network: 6.2
  },
  recommendedUpgrades: [
    { component: 'CPU', current: '72%', projected: '85%', recommendation: 'Consider scaling within 3 months' },
    { component: 'Memory', current: '68%', projected: '82%', recommendation: 'Monitor closely, upgrade in 2 months' },
    { component: 'Storage', current: '45%', projected: '58%', recommendation: 'Adequate for next 6 months' }
  ]
};

export default function SystemMonitoring() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [] = useState('cpu');
  const [showProactiveAlerts, setShowProactiveAlerts] = useState(true);
  const [] = useState('24h');
  useTheme();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsRefreshing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30';
      case 'warning': return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30';
      case 'offline': return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30';
      default: return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online': return <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />;
      case 'offline': return <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />;
      default: return <Clock className="w-4 h-4 text-gray-600 dark:text-gray-400" />;
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical': return <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />;
      case 'info': return <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      default: return <Activity className="w-4 h-4 text-gray-600 dark:text-gray-400" />;
    }
  };

  const getAlertStyle = (type: string) => {
    switch (type) {
      case 'critical': return 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/30';
      case 'warning': return 'border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/30';
      case 'info': return 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/30';
      default: return 'border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/30';
    }
  };

  const getCapacityColor = (value: number, threshold: { warning: number; critical: number }) => {
    if (value >= threshold.critical) return 'text-red-600 dark:text-red-400';
    if (value >= threshold.warning) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-green-600 dark:text-green-400';
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'low': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">System Monitoring & Health</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Real-time system performance and proactive monitoring</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
            <Settings className="w-4 h-4" />
            <span>Configure Alerts</span>
          </button>
        </div>
      </div>

      {/* Proactive Alerts Section */}
      {showProactiveAlerts && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Bell className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Proactive Alerts</h2>
              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 text-sm rounded-full">
                {systemAlerts.filter(alert => !alert.resolved).length} Active
              </span>
            </div>
            <button
              onClick={() => setShowProactiveAlerts(false)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              ×
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {systemAlerts.filter(alert => !alert.resolved).slice(0, 6).map(alert => (
              <div key={alert.id} className={`p-4 rounded-lg border ${getAlertStyle(alert.type)}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    {getAlertIcon(alert.type)}
                    <span className={`px-2 py-1 text-xs rounded-full ${getPriorityBadge(alert.priority)}`}>
                      {alert.priority}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">{alert.time}</span>
                </div>
                <p className="text-sm font-medium mt-2">{alert.message}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Affected: {alert.affected}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* System Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">System Uptime</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{systemMetrics.uptime}%</p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm">
              <span>Target: 99.9%</span>
              <span className={systemMetrics.uptime >= 99.9 ? 'text-green-600' : 'text-yellow-600'}>
                {systemMetrics.uptime >= 99.9 ? '✓' : '⚠'}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">CPU Usage</p>
              <p className={`text-2xl font-bold ${getCapacityColor(systemMetrics.cpuUsage, capacityThresholds.cpu)}`}>
                {systemMetrics.cpuUsage}%
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Cpu className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${systemMetrics.cpuUsage >= capacityThresholds.cpu.critical ? 'bg-red-500' :
                  systemMetrics.cpuUsage >= capacityThresholds.cpu.warning ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                style={{ width: `${systemMetrics.cpuUsage}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Memory Usage</p>
              <p className={`text-2xl font-bold ${getCapacityColor(systemMetrics.memoryUsage, capacityThresholds.memory)}`}>
                {systemMetrics.memoryUsage}%
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <HardDrive className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${systemMetrics.memoryUsage >= capacityThresholds.memory.critical ? 'bg-red-500' :
                  systemMetrics.memoryUsage >= capacityThresholds.memory.warning ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                style={{ width: `${systemMetrics.memoryUsage}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Response Time</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{systemMetrics.responseTime}ms</p>
            </div>
            <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
              <Zap className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm">
              <span>Target: &lt;300ms</span>
              <span className={systemMetrics.responseTime < 300 ? 'text-green-600' : 'text-yellow-600'}>
                {systemMetrics.responseTime < 300 ? '✓' : '⚠'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">System Performance Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="cpu" stroke="#3B82F6" strokeWidth={2} />
              <Line type="monotone" dataKey="memory" stroke="#8B5CF6" strokeWidth={2} />
              <Line type="monotone" dataKey="storage" stroke="#10B981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Capacity Utilization</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={[
              { name: 'CPU', usage: systemMetrics.cpuUsage, threshold: capacityThresholds.cpu.warning },
              { name: 'Memory', usage: systemMetrics.memoryUsage, threshold: capacityThresholds.memory.warning },
              { name: 'Storage', usage: systemMetrics.storageUsage, threshold: capacityThresholds.storage.warning },
              { name: 'Network', usage: systemMetrics.networkLatency, threshold: 80 }
            ]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="usage" fill="#3B82F6" />
              <Bar dataKey="threshold" fill="#EF4444" opacity={0.3} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* MMDA Status Grid */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">MMDA System Status</h3>
          <p className="text-gray-600 dark:text-gray-400">Real-time status of all MMDA systems</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">MMDA</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Uptime</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Performance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Last Sync</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Active Users</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Alerts</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {districtStatus.map((district, index) => (
                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{district.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(district.status)}`}>
                      {getStatusIcon(district.status)}
                      <span className="ml-1 capitalize">{district.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {district.uptime}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-2">
                        <div
                          className={`h-2 rounded-full ${district.performance >= 95 ? 'bg-green-500' :
                            district.performance >= 85 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                          style={{ width: `${district.performance}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-900 dark:text-white">{district.performance}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {district.lastSync}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {district.users}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {district.alerts > 0 ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                        {district.alerts}
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        0
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Enhanced Analytics & Performance Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Performance Analytics</h3>
          <div className="space-y-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-blue-900 dark:text-blue-100">Overall Performance Score</span>
                <span className="text-lg font-bold text-blue-900 dark:text-blue-100">87.5</span>
              </div>
              <div className="text-xs text-blue-800 dark:text-blue-200">+12.3% from last period</div>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-900/30 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-green-900 dark:text-green-100">User Growth Trend</span>
                <span className="text-lg font-bold text-green-900 dark:text-green-100">+35%</span>
              </div>
              <div className="text-xs text-green-800 dark:text-green-200">Projected for next 6 months</div>
            </div>
            <div className="p-3 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-purple-900 dark:text-purple-100">System Efficiency</span>
                <span className="text-lg font-bold text-purple-900 dark:text-purple-100">94.2%</span>
              </div>
              <div className="text-xs text-purple-800 dark:text-purple-200">Based on 5 key metrics</div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Regional Performance</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <span className="text-sm font-medium text-gray-900 dark:text-white">Greater Accra</span>
              <span className="text-sm font-bold text-green-600 dark:text-green-400">92.5</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <span className="text-sm font-medium text-gray-900 dark:text-white">Ashanti</span>
              <span className="text-sm font-bold text-green-600 dark:text-green-400">88.3</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <span className="text-sm font-medium text-gray-900 dark:text-white">Western</span>
              <span className="text-sm font-bold text-yellow-600 dark:text-yellow-400">85.1</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <span className="text-sm font-medium text-gray-900 dark:text-white">Central</span>
              <span className="text-sm font-bold text-green-600 dark:text-green-400">82.7</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
            <button className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
              <BarChart3 className="w-4 h-4 inline mr-2" />
              View Detailed Analytics
            </button>
          </div>
        </div>
      </div>

      {/* Disaster Recovery & Capacity Planning */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Disaster Recovery Status</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Last Backup</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">{disasterRecoveryStatus.lastBackup}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Backup Size</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">{disasterRecoveryStatus.backupSize}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Recovery Time Objective</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">{disasterRecoveryStatus.recoveryTimeObjective}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Data Integrity</span>
              <span className="text-sm font-medium text-green-600 dark:text-green-400">{disasterRecoveryStatus.dataIntegrity}</span>
            </div>
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <Download className="w-4 h-4 inline mr-2" />
                Initiate Backup
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Capacity Planning</h3>
          <div className="space-y-4">
            {capacityPlanning.recommendedUpgrades.map((upgrade, index) => (
              <div key={index} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{upgrade.component}</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {upgrade.current} → {upgrade.projected}
                  </span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">{upgrade.recommendation}</p>
              </div>
            ))}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                <BarChart3 className="w-4 h-4 inline mr-2" />
                Generate Capacity Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}