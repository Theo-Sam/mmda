import React, { useState } from 'react';
import { 
  Globe, 
  TrendingUp, 
  BarChart3, 
  Users, 
  Building2, 
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  Download,
  Filter,
  MapPin,
  Shield,
  Activity,
  Target,
  Zap,
  Database,
  FileText,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import StatCard from '../../components/Dashboard/StatCard';
import { useTheme } from '../../contexts/ThemeContext';

// Mock data for monitoring body dashboard
const nationalStats = {
  totalMMDAs: 260,
  activeMMDAs: 254,
  totalRevenue: 64800000, // GHS 64.8M
  totalBusinesses: 45678,
  totalUsers: 1247,
  complianceRate: 94.2,
  monthlyGrowth: 12.5
};

const topPerformingMMDAs = [
  { 
    name: 'Accra Metropolitan', 
    revenue: 2450000, 
    growth: 15.2, 
    businesses: 3456, 
    compliance: 96.8,
    region: 'Greater Accra'
  },
  { 
    name: 'Kumasi Metropolitan', 
    revenue: 1890000, 
    growth: 12.8, 
    businesses: 2789, 
    compliance: 94.5,
    region: 'Ashanti'
  },
  { 
    name: 'Tema Municipal', 
    revenue: 1650000, 
    growth: 18.5, 
    businesses: 1987, 
    compliance: 92.1,
    region: 'Greater Accra'
  },
  { 
    name: 'Cape Coast Metropolitan', 
    revenue: 1420000, 
    growth: 9.3, 
    businesses: 1654, 
    compliance: 89.7,
    region: 'Central'
  },
  { 
    name: 'Tamale Metropolitan', 
    revenue: 1280000, 
    growth: 14.7, 
    businesses: 1432, 
    compliance: 91.3,
    region: 'Northern'
  }
];

const performanceAlerts = [
  {
    type: 'warning',
    title: 'Low Performance Alert',
    message: '3 MMDAs below 80% revenue target this month',
    time: '2 hours ago',
    action: 'Review Performance',
    href: '/mmda-performance'
  },
  {
    type: 'critical',
    title: 'Compliance Issue',
    message: 'Northern Region showing declining compliance rates',
    time: '4 hours ago',
    action: 'Investigate',
    href: '/compliance-monitoring'
  },
  {
    type: 'info',
    title: 'Data Export Complete',
    message: 'Monthly performance report generated successfully',
    time: '6 hours ago',
    action: 'Download Report',
    href: '/reports-exports'
  },
  {
    type: 'success',
    title: 'Target Achievement',
    message: 'Greater Accra Region exceeded quarterly targets',
    time: '1 day ago',
    action: 'View Details',
    href: '/mmda-reports'
  }
];

const regionalPerformance = [
  { region: 'Greater Accra', mmdas: 29, revenue: 12500000, compliance: 95.2, performance: 'excellent' },
  { region: 'Ashanti', mmdas: 43, revenue: 9800000, compliance: 92.8, performance: 'good' },
  { region: 'Western', mmdas: 22, revenue: 7200000, compliance: 89.5, performance: 'good' },
  { region: 'Central', mmdas: 20, revenue: 6100000, compliance: 87.3, performance: 'average' },
  { region: 'Eastern', mmdas: 33, revenue: 5800000, compliance: 91.1, performance: 'good' },
  { region: 'Northern', mmdas: 26, revenue: 4200000, compliance: 84.7, performance: 'needs_attention' }
];

export default function MonitoringBodyDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('this-quarter');
  const { theme } = useTheme();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case 'excellent': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      case 'good': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300';
      case 'average': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
      case 'needs_attention': return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical': return <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />;
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">National Monitoring Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Oversee MMDA performance nationwide</p>
          <div className="flex items-center space-x-4 mt-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">Ministry of Local Government, Rural Development and Decentralization</span>
            <span className="text-sm text-gray-400 dark:text-gray-500">•</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">Real-time monitoring</span>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
          >
            <option value="this-month">This Month</option>
            <option value="this-quarter">This Quarter</option>
            <option value="this-year">This Year</option>
            <option value="custom">Custom Range</option>
          </select>
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Live Data</span>
          </div>
        </div>
      </div>

      {/* National Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue (National)"
          value={formatCurrency(nationalStats.totalRevenue)}
          icon={DollarSign}
          change={nationalStats.monthlyGrowth}
          color="green"
        />
        <StatCard
          title="Active MMDAs"
          value={`${nationalStats.activeMMDAs}/${nationalStats.totalMMDAs}`}
          icon={Globe}
          change={2.1}
          color="blue"
        />
        <StatCard
          title="Total Businesses"
          value={nationalStats.totalBusinesses.toLocaleString()}
          icon={Building2}
          change={8.3}
          color="yellow"
        />
        <StatCard
          title="Compliance Rate"
          value={`${nationalStats.complianceRate}%`}
          icon={Shield}
          change={1.8}
          color="red"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Monitoring Tools</h3>
          <span className="text-sm text-gray-500 dark:text-gray-400">National Oversight</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/mmda-reports"
            className="group relative overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-200 hover:border-blue-300 dark:hover:border-blue-700"
          >
            <div className="flex items-start space-x-4">
              <div className="p-3 rounded-lg bg-blue-600 dark:bg-blue-700 text-white">
                <BarChart3 className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  MMDA Reports
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Revenue & compliance data
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
            </div>
          </Link>

          <Link
            to="/collector-performance"
            className="group relative overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-200 hover:border-green-300 dark:hover:border-green-700"
          >
            <div className="flex items-start space-x-4">
              <div className="p-3 rounded-lg bg-green-600 dark:bg-green-700 text-white">
                <Target className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                  Collector Performance
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Regional effectiveness
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors" />
            </div>
          </Link>

          <Link
            to="/reports-exports"
            className="group relative overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-200 hover:border-purple-300 dark:hover:border-purple-700"
          >
            <div className="flex items-start space-x-4">
              <div className="p-3 rounded-lg bg-purple-600 dark:bg-purple-700 text-white">
                <Download className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  Reports & Exports
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Download oversight data
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors" />
            </div>
          </Link>

          <Link
            to="/audit-logs"
            className="group relative overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-200 hover:border-orange-300 dark:hover:border-orange-700"
          >
            <div className="flex items-start space-x-4">
              <div className="p-3 rounded-lg bg-orange-600 dark:bg-orange-700 text-white">
                <FileText className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                  Audit Trail
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  System activity logs
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
                  to="/mmda-reports"
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
                            <MapPin className="w-3 h-3" />
                            <span>{mmda.region}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Building2 className="w-3 h-3" />
                            <span>{mmda.businesses.toLocaleString()} businesses</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Shield className="w-3 h-3" />
                            <span>{mmda.compliance}% compliance</span>
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

        {/* Performance Alerts */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Performance Alerts</h3>
              <div className="flex items-center space-x-2">
                <Activity className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                  {performanceAlerts.filter(alert => alert.type === 'critical' || alert.type === 'warning').length}
                </span>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {performanceAlerts.map((alert, index) => (
                <div key={index} className={`flex items-start space-x-3 p-3 rounded-lg border ${getAlertStyle(alert.type)}`}>
                  {getAlertIcon(alert.type)}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{alert.title}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{alert.message}</p>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs text-gray-500 dark:text-gray-400">{alert.time}</p>
                      <Link 
                        to={alert.href}
                        className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
                      >
                        {alert.action} →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Regional Performance Overview */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Regional Performance Overview</h3>
            <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium">
              Export Regional Data
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Region
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  MMDAs
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Total Revenue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Compliance Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Performance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {regionalPerformance.map((region) => (
                <tr key={region.region} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{region.region}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {region.mmdas}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {formatCurrency(region.revenue)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-900 dark:text-white">{region.compliance}%</span>
                      <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            region.compliance >= 95 ? 'bg-green-600 dark:bg-green-500' :
                            region.compliance >= 85 ? 'bg-yellow-600 dark:bg-yellow-500' : 'bg-red-600 dark:bg-red-500'
                          }`}
                          style={{ width: `${region.compliance}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getPerformanceColor(region.performance)}`}>
                      {region.performance.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 mr-3">
                      View Details
                    </button>
                    <button className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300">
                      Export Data
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* System Health Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Database className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Data Quality</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">98.7%</p>
              <p className="text-sm text-green-600 dark:text-green-400">Excellent integrity</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">System Uptime</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">99.8%</p>
              <p className="text-sm text-blue-600 dark:text-blue-400">Highly available</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Users</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{nationalStats.totalUsers}</p>
              <p className="text-sm text-purple-600 dark:text-purple-400">Across all MMDAs</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}