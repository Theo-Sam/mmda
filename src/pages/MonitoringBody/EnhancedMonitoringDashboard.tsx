import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Activity,
  Globe,
  Target,
  DollarSign,
  Shield,
  Users,
  BarChart3,
  PieChart,
  Eye,
  Download,
  Bell,
  MapPin,
  Clock,
  Zap,
  Database,
  FileText,
  Settings,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  AlertCircle,
  Star,
  Award,
  Calendar,
  Filter,
  Search,
  Plus,
  Edit,
  Trash2,
  Play,
  Pause,
  Stop,
  RotateCcw,
  Wifi,
  WifiOff,
  Smartphone,
  Monitor,
  Server,
  Cloud,
  Lock,
  Unlock
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
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
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';

export default function EnhancedMonitoringDashboard() {
  const { 
    nationalRevenueOversight, 
    regionalOversightData, 
    realTimeAlerts, 
    predictiveAnalytics,
    complianceData,
    performanceBenchmarks,
    interventionPlans,
    communicationLogs,
    dataQualityMetrics,
    advancedInsights,
    fieldMonitoringData,
    systemIntegrationStatus
  } = useApp();
  
  const [selectedView, setSelectedView] = useState('overview');
  const [refreshInterval, setRefreshInterval] = useState(30000); // 30 seconds
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');
  const { theme } = useTheme();
  const { user } = useAuth();

  // Auto-refresh effect
  useEffect(() => {
    if (!isAutoRefresh) return;
    
    const interval = setInterval(() => {
      // In a real app, this would refresh data from the server
      console.log('Auto-refreshing data...');
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [isAutoRefresh, refreshInterval]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-GH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical': return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'warning': return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case 'info': return <CheckCircle className="w-5 h-5 text-blue-600" />;
      default: return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'critical': return 'border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800';
      case 'warning': return 'border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800';
      case 'info': return 'border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800';
      default: return 'border-gray-200 bg-gray-50 dark:bg-gray-900/20 dark:border-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600 bg-green-100 dark:bg-green-900/30';
      case 'good': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30';
      case 'average': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30';
      case 'needs_improvement': return 'text-red-600 bg-red-100 dark:bg-red-900/30';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Enhanced MMDA Monitoring Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Next-generation oversight and intervention system
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Auto-refresh controls */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsAutoRefresh(!isAutoRefresh)}
                  className={`p-2 rounded-lg ${isAutoRefresh ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}
                >
                  {isAutoRefresh ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                </button>
                <select
                  value={refreshInterval / 1000}
                  onChange={(e) => setRefreshInterval(Number(e.target.value) * 1000)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
                >
                  <option value={15}>15s</option>
                  <option value={30}>30s</option>
                  <option value={60}>1m</option>
                  <option value={300}>5m</option>
                </select>
              </div>

              {/* Time range selector */}
              <select
                value={selectedTimeRange}
                onChange={(e) => setSelectedTimeRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
              >
                <option value="1h">Last Hour</option>
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
              </select>

              {/* Export button */}
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Export Report</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="px-6">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: Globe },
              { id: 'realtime', label: 'Real-time Monitoring', icon: Activity },
              { id: 'predictive', label: 'Predictive Analytics', icon: TrendingUp },
              { id: 'compliance', label: 'Compliance & Audit', icon: Shield },
              { id: 'benchmarks', label: 'Performance Benchmarks', icon: Award },
              { id: 'interventions', label: 'Interventions', icon: Target },
              { id: 'field', label: 'Field Monitoring', icon: MapPin },
              { id: 'insights', label: 'AI Insights', icon: Zap },
              { id: 'quality', label: 'Data Quality', icon: Database },
              { id: 'integrations', label: 'System Status', icon: Server }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedView(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  selectedView === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-6">
        {/* Overview Dashboard */}
        {selectedView === 'overview' && (
          <div className="space-y-6">
            {/* Executive Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Alerts</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {realTimeAlerts.filter(alert => alert.status === 'active').length}
                    </p>
                  </div>
                  <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
                    <Bell className="w-6 h-6 text-red-600 dark:text-red-400" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <span className="text-red-600 dark:text-red-400 font-medium">
                      {realTimeAlerts.filter(alert => alert.type === 'critical').length} Critical
                    </span>
                    <span className="mx-2">•</span>
                    <span className="text-yellow-600 dark:text-yellow-400 font-medium">
                      {realTimeAlerts.filter(alert => alert.type === 'warning').length} Warnings
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">System Health</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {dataQualityMetrics.overallScore}%
                    </p>
                  </div>
                  <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <Database className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <span className="text-green-600 dark:text-green-400 font-medium">
                      {systemIntegrationStatus.bankingSystems.status === 'connected' ? 'Connected' : 'Disconnected'}
                    </span>
                    <span className="mx-2">•</span>
                    <span className="text-blue-600 dark:text-blue-400 font-medium">
                      Real-time Sync
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Field Inspections</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {fieldMonitoringData.length}
                    </p>
                  </div>
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <MapPin className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <span className="text-green-600 dark:text-green-400 font-medium">
                      {fieldMonitoringData.filter(item => item.status === 'completed').length} Completed
                    </span>
                    <span className="mx-2">•</span>
                    <span className="text-yellow-600 dark:text-yellow-400 font-medium">
                      {fieldMonitoringData.filter(item => item.status === 'in_progress').length} Active
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">AI Insights</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {advancedInsights.length}
                    </p>
                  </div>
                  <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <Zap className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <span className="text-red-600 dark:text-red-400 font-medium">
                      {advancedInsights.filter(insight => insight.impact === 'high').length} High Impact
                    </span>
                    <span className="mx-2">•</span>
                    <span className="text-blue-600 dark:text-blue-400 font-medium">
                      {advancedInsights.filter(insight => insight.confidence > 90).length} High Confidence
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Real-time Alerts */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Real-time Alerts</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active monitoring alerts and notifications</p>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {realTimeAlerts.filter(alert => alert.status === 'active').map((alert) => (
                    <div key={alert.id} className={`p-4 rounded-lg border ${getAlertColor(alert.type)}`}>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          {getAlertIcon(alert.type)}
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">{alert.title}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{alert.message}</p>
                            <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                              <span>MMDA: {alert.mmda}</span>
                              <span>Assigned: {alert.assignedTo}</span>
                              <span>{formatDate(alert.timestamp)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700">
                            Take Action
                          </button>
                          <button className="px-3 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700">
                            Dismiss
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Intervention Planning</h4>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Manage and track intervention plans for underperforming MMDAs
                </p>
                <button 
                  onClick={() => setSelectedView('interventions')}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  View Interventions
                </button>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Predictive Analytics</h4>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  View AI-powered revenue predictions and risk assessments
                </p>
                <button 
                  onClick={() => setSelectedView('predictive')}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  View Predictions
                </button>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <Zap className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">AI Insights</h4>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Discover actionable insights and recommendations
                </p>
                <button 
                  onClick={() => setSelectedView('insights')}
                  className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  View Insights
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Real-time Monitoring View */}
        {selectedView === 'realtime' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Live System Status</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(systemIntegrationStatus).map(([system, status]: [string, any]) => (
                  <div key={system} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900 dark:text-white capitalize">
                        {system.replace(/([A-Z])/g, ' $1').trim()}
                      </h4>
                      <div className={`w-3 h-3 rounded-full ${
                        status.status === 'connected' ? 'bg-green-500' : 'bg-red-500'
                      }`} />
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Status: <span className="font-medium capitalize">{status.status}</span>
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Sync: <span className="font-medium">{status.syncFrequency}</span>
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Quality: <span className="font-medium capitalize">{status.dataQuality}</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Placeholder for other views */}
        {selectedView !== 'overview' && selectedView !== 'realtime' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-12 shadow-sm border border-gray-200 dark:border-gray-700 text-center">
            <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Settings className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {selectedView.charAt(0).toUpperCase() + selectedView.slice(1)} Dashboard
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              This comprehensive monitoring view is being implemented. It will include advanced analytics, 
              predictive modeling, compliance tracking, and real-time intervention capabilities.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
