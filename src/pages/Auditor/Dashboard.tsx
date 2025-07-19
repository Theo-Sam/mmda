import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Shield, 
  Eye, 
  TrendingUp, 
  FileText, 
  Users, 
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  Flag,
  Search,
  Filter,
  Calendar,
  Download,
  BarChart3,
  Activity,
  Target,
  Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';
import StatCard from '../../components/Dashboard/StatCard';
import { useTheme } from '../../contexts/ThemeContext';

// Mock data for auditor dashboard
const auditStats = {
  totalTransactions: 2847,
  flaggedTransactions: 23,
  complianceScore: 94.2,
  auditLogsToday: 156,
  suspiciousActivity: 8,
  resolvedIssues: 15
};

const flaggedTransactions = [
  {
    id: '1',
    receiptId: 'RCP-2024-156',
    businessName: 'Tech Solutions Ltd',
    amount: 2500,
    collectorName: 'John Doe',
    flagReason: 'Amount exceeds normal range for business type',
    severity: 'high',
    date: '2024-12-01',
    status: 'pending'
  },
  {
    id: '2',
    receiptId: 'RCP-2024-142',
    businessName: 'Corner Shop',
    amount: 1200,
    collectorName: 'Mary Smith',
    flagReason: 'Payment recorded outside business hours',
    severity: 'medium',
    date: '2024-11-30',
    status: 'investigating'
  },
  {
    id: '3',
    receiptId: 'RCP-2024-138',
    businessName: 'Local Restaurant',
    amount: 800,
    collectorName: 'James Wilson',
    flagReason: 'Duplicate payment detected',
    severity: 'high',
    date: '2024-11-29',
    status: 'resolved'
  }
];

const recentAlerts = [
  {
    type: 'critical',
    title: 'Multiple payments from same IP',
    description: 'Detected 5 payments from same IP address within 10 minutes',
    time: '15 min ago',
    action: 'Investigate'
  },
  {
    type: 'warning',
    title: 'Unusual payment pattern',
    description: 'Collector recorded 15 payments in rapid succession',
    time: '1 hour ago',
    action: 'Review'
  },
  {
    type: 'info',
    title: 'Daily audit completed',
    description: 'Automated audit scan completed with 2 new flags',
    time: '2 hours ago',
    action: 'View Report'
  }
];

const complianceMetrics = [
  { metric: 'Payment Verification', score: 96.8, trend: 'up' },
  { metric: 'Documentation Completeness', score: 92.4, trend: 'up' },
  { metric: 'Process Adherence', score: 89.7, trend: 'down' },
  { metric: 'Data Integrity', score: 98.1, trend: 'up' }
];

export default function AuditorDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  const { theme } = useTheme();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800';
      case 'medium': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800';
      case 'low': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      case 'investigating': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
      case 'pending': return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical': return <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />;
      case 'warning': return <Flag className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />;
      case 'info': return <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      default: return <Activity className="w-4 h-4 text-gray-600 dark:text-gray-400" />;
    }
  };

  const getAlertStyle = (type: string) => {
    switch (type) {
      case 'critical': return 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/30';
      case 'warning': return 'border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/30';
      case 'info': return 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/30';
      default: return 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Audit Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Monitor compliance and system integrity</p>
          <div className="flex items-center space-x-4 mt-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">Last audit: {new Date().toLocaleString()}</span>
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
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
          </select>
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Live Monitoring</span>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Flagged Transactions"
          value={auditStats.flaggedTransactions}
          icon={AlertTriangle}
          change={-12.5}
          color="red"
        />
        <StatCard
          title="Compliance Score"
          value={`${auditStats.complianceScore}%`}
          icon={Shield}
          change={2.1}
          color="green"
        />
        <StatCard
          title="Audit Logs Today"
          value={auditStats.auditLogsToday}
          icon={FileText}
          change={8.3}
          color="blue"
        />
        <StatCard
          title="Suspicious Activity"
          value={auditStats.suspiciousActivity}
          icon={Eye}
          change={-25.0}
          color="yellow"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Actions</h3>
          <span className="text-sm text-gray-500 dark:text-gray-400">Audit Tools</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/transaction-review"
            className="group relative overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-200 hover:border-red-300 dark:hover:border-red-700"
          >
            <div className="flex items-start space-x-4">
              <div className="p-3 rounded-lg bg-red-600 dark:bg-red-700 text-white">
                <Search className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                  Review Transactions
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Analyze suspicious payments
                </p>
              </div>
            </div>
          </Link>

          <Link
            to="/audit-logs"
            className="group relative overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-200 hover:border-blue-300 dark:hover:border-blue-700"
          >
            <div className="flex items-start space-x-4">
              <div className="p-3 rounded-lg bg-blue-600 dark:bg-blue-700 text-white">
                <FileText className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  Audit Logs
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  View audit trails
                </p>
              </div>
            </div>
          </Link>

          <Link
            to="/compliance"
            className="group relative overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-200 hover:border-green-300 dark:hover:border-green-700"
          >
            <div className="flex items-start space-x-4">
              <div className="p-3 rounded-lg bg-green-600 dark:bg-green-700 text-white">
                <Shield className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                  Compliance Check
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Run compliance audit
                </p>
              </div>
            </div>
          </Link>

          <Link
            to="/reports"
            className="group relative overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-200 hover:border-purple-300 dark:hover:border-purple-700"
          >
            <div className="flex items-start space-x-4">
              <div className="p-3 rounded-lg bg-purple-600 dark:bg-purple-700 text-white">
                <BarChart3 className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  Audit Reports
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Generate audit reports
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Flagged Transactions */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Flagged Transactions</h3>
                <Link 
                  to="/transaction-review"
                  className="text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-medium"
                >
                  View All Flags
                </Link>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {flaggedTransactions.map((transaction) => (
                  <div key={transaction.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="font-medium text-gray-900 dark:text-white">{transaction.receiptId}</h4>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getSeverityColor(transaction.severity)}`}>
                            {transaction.severity} risk
                          </span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                            {transaction.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{transaction.businessName}</p>
                        <p className="text-sm text-red-600 dark:text-red-400 mb-2">{transaction.flagReason}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                          <span>Amount: {formatCurrency(transaction.amount)}</span>
                          <span>•</span>
                          <span>Collector: {transaction.collectorName}</span>
                          <span>•</span>
                          <span>{new Date(transaction.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium">
                          Investigate
                        </button>
                        <button className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 text-sm font-medium">
                          Resolve
                        </button>
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
                  {recentAlerts.filter(alert => alert.type === 'critical').length}
                </span>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentAlerts.map((alert, index) => (
                <div key={index} className={`flex items-start space-x-3 p-3 rounded-lg border ${getAlertStyle(alert.type)}`}>
                  {getAlertIcon(alert.type)}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{alert.title}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{alert.description}</p>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs text-gray-500 dark:text-gray-400">{alert.time}</p>
                      <button className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium">
                        {alert.action} →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Compliance Metrics */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Compliance Metrics</h3>
          <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium">
            View Detailed Report
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {complianceMetrics.map((metric, index) => (
            <div key={index} className="text-center">
              <div className="relative w-20 h-20 mx-auto mb-3">
                <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-gray-200 dark:text-gray-700"
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className={metric.score >= 95 ? 'text-green-500 dark:text-green-400' : metric.score >= 90 ? 'text-yellow-500 dark:text-yellow-400' : 'text-red-500 dark:text-red-400'}
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    fill="none"
                    strokeDasharray={`${metric.score}, 100`}
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold text-gray-900 dark:text-white">{metric.score}%</span>
                </div>
              </div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">{metric.metric}</h4>
              <div className="flex items-center justify-center space-x-1">
                {metric.trend === 'up' ? (
                  <TrendingUp className="w-3 h-3 text-green-600 dark:text-green-400" />
                ) : (
                  <TrendingUp className="w-3 h-3 text-red-600 dark:text-red-400 transform rotate-180" />
                )}
                <span className={`text-xs ${metric.trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {metric.trend === 'up' ? 'Improving' : 'Declining'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}