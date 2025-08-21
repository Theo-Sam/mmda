import React from 'react';
import {
  Globe,
  Users,
  Building2,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowRight,
  BarChart3,
  Shield,
  Database,
  Activity,
  MapPin,
  FileText
} from 'lucide-react';
import { Link } from 'react-router-dom';
import StatCard from '../../components/Dashboard/StatCard';
import { useTheme } from '../../contexts/ThemeContext';

// Mock data for Super Admin dashboard
const nationalStats = {
  totalMMDAs: 260,
  totalRevenue: 45750000, // GHS 45.75M
  totalUsers: 1247,
  systemUptime: 99.8,
  activeMMDAs: 254,
  totalBusinesses: 45678,
  monthlyGrowth: 12.5
};

const topPerformingMMDAs = [
  { name: 'Accra Metropolitan', revenue: 2450000, growth: 15.2, businesses: 3456 },
  { name: 'Kumasi Metropolitan', revenue: 1890000, growth: 12.8, businesses: 2789 },
  { name: 'Tema Municipal', revenue: 1650000, growth: 18.5, businesses: 1987 },
  { name: 'Cape Coast Metropolitan', revenue: 1420000, growth: 9.3, businesses: 1654 },
  { name: 'Tamale Metropolitan', revenue: 1280000, growth: 14.7, businesses: 1432 }
];

const systemAlerts = [
  { type: 'critical', message: 'Server maintenance required in Northern Region', time: '2 hours ago' },
  { type: 'warning', message: '3 MMDAs reporting connectivity issues', time: '4 hours ago' },
  { type: 'info', message: 'Monthly backup completed successfully', time: '1 day ago' },
  { type: 'success', message: 'New MMDA onboarded: Ahafo Ano North', time: '2 days ago' }
];

export default function SuperAdminDashboard() {
  const { theme } = useTheme();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical': return <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />;
      case 'warning': return <Clock className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />;
      case 'success': return <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />;
      default: return <Activity className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
    }
  };

  const getAlertStyle = (type: string) => {
    switch (type) {
      case 'critical': return 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/30';
      case 'warning': return 'border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/30';
      case 'success': return 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/30';
      default: return 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/30';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">National Overview</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Monitor all MMDAs across Ghana</p>
          <div className="flex items-center space-x-4 mt-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">Last updated: {new Date().toLocaleString()}</span>
            <span className="text-sm text-gray-400 dark:text-gray-500">•</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">Real-time data</span>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="text-right">
            <p className="text-sm text-gray-600 dark:text-gray-400">System Status</p>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-green-600 dark:text-green-400">Operational</span>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue (National)"
          value={formatCurrency(nationalStats.totalRevenue)}
          icon={DollarSign}
          change={nationalStats.monthlyGrowth}
          color="green"
        />
        <StatCard
          title="Registered MMDAs"
          value={`${nationalStats.activeMMDAs}/${nationalStats.totalMMDAs}`}
          icon={Globe}
          color="blue"
        />
        <StatCard
          title="Total Users"
          value={nationalStats.totalUsers.toLocaleString()}
          icon={Users}
          color="yellow"
        />
        <StatCard
          title="System Uptime"
          value={`${nationalStats.systemUptime}%`}
          icon={Shield}
          color="red"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Actions</h3>
          <span className="text-sm text-gray-500 dark:text-gray-400">System Administration</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/districts"
            className="group relative overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-200 hover:border-blue-300 dark:hover:border-blue-700"
          >
            <div className="flex items-start space-x-4">
              <div className="p-3 rounded-lg bg-blue-600 dark:bg-blue-700 text-white">
                <Globe className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  Manage MMDAs
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Configure MMDA settings
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
            </div>
          </Link>

          <Link
            to="/system-users"
            className="group relative overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-200 hover:border-green-300 dark:hover:border-green-700"
          >
            <div className="flex items-start space-x-4">
              <div className="p-3 rounded-lg bg-green-600 dark:bg-green-700 text-white">
                <Users className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                  User Management
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Manage system users
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors" />
            </div>
          </Link>

          <Link
            to="/system-monitoring"
            className="group relative overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-200 hover:border-purple-300 dark:hover:border-purple-700"
          >
            <div className="flex items-start space-x-4">
              <div className="p-3 rounded-lg bg-purple-600 dark:bg-purple-700 text-white">
                <Activity className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  System Monitor
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Monitor performance
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors" />
            </div>
          </Link>

          <Link
            to="/reports"
            className="group relative overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-200 hover:border-orange-300 dark:hover:border-orange-700"
          >
            <div className="flex items-start space-x-4">
              <div className="p-3 rounded-lg bg-orange-600 dark:bg-orange-700 text-white">
                <BarChart3 className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                  National Reports
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Generate reports
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors" />
            </div>
          </Link>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Top Performing MMDAs */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Top Performing MMDAs</h3>
                <Link
                  to="/districts"
                  className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
                >
                  View All MMDAs
                </Link>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {topPerformingMMDAs.map((mmda, index) => (
                  <div key={mmda.name} className="flex items-center justify-between p-4 rounded-lg border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{mmda.name}</h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                          <span className="flex items-center space-x-1">
                            <Building2 className="w-3 h-3" />
                            <span>{mmda.businesses.toLocaleString()} businesses</span>
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900 dark:text-white">{formatCurrency(mmda.revenue)}</p>
                      <div className="flex items-center space-x-1 text-sm">
                        <TrendingUp className="w-3 h-3 text-green-600 dark:text-green-400" />
                        <span className="text-green-600 dark:text-green-400">+{mmda.growth}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* System Alerts */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">System Alerts</h3>
              <div className="flex items-center space-x-2">
                <Activity className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                  {systemAlerts.filter(alert => alert.type === 'critical').length}
                </span>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {systemAlerts.map((alert, index) => (
                <div key={index} className={`flex items-start space-x-3 p-3 rounded-lg border ${getAlertStyle(alert.type)}`}>
                  {getAlertIcon(alert.type)}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{alert.message}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{alert.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Link
                to="/system-monitoring"
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
              >
                View System Status →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Building2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Businesses</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{nationalStats.totalBusinesses.toLocaleString()}</p>
              <p className="text-sm text-green-600 dark:text-green-400">Across all MMDAs</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Database className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Data Integrity</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">98.7%</p>
              <p className="text-sm text-green-600 dark:text-green-400">System-wide accuracy</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <FileText className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Daily Transactions</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">2,847</p>
              <p className="text-sm text-green-600 dark:text-green-400">+12% from yesterday</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}