import React, { useState } from 'react';
import { 
  Download, 
  FileText, 
  BarChart3, 
  Calendar, 
  Filter, 
  Eye, 
  RefreshCw,
  Shield,
  AlertTriangle,
  Users,
  DollarSign,
  Building2,
  Activity,
  TrendingUp,
  Clock,
  CheckCircle
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { filterByJurisdiction } from '../../utils/filterByJurisdiction';

export default function AuditorReportsCenter() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('this-month');
  const [isGenerating, setIsGenerating] = useState<string | null>(null);
  const { theme } = useTheme();
  const { user } = useAuth();

  const filteredReports = auditReports.filter(report => 
    selectedCategory === 'all' || report.category === selectedCategory
  );

  const handleGenerateReport = async (reportId: string) => {
    setIsGenerating(reportId);
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsGenerating(null);
    alert('Report generated successfully!');
  };

  const handleExportData = (format: 'csv' | 'pdf' | 'excel') => {
    alert(`Exporting audit data as ${format.toUpperCase()}...`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      case 'in_progress': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
      case 'failed': return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'in_progress': return <Clock className="w-4 h-4" />;
      case 'failed': return <AlertTriangle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Audit Reports Center</h1>
          <p className="text-gray-600 dark:text-gray-400">Generate and export comprehensive audit reports</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
          >
            <option value="this-week">This Week</option>
            <option value="this-month">This Month</option>
            <option value="this-quarter">This Quarter</option>
            <option value="this-year">This Year</option>
            <option value="custom">Custom Range</option>
          </select>
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600">
            <RefreshCw className="w-4 h-4" />
            <span>Refresh Data</span>
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Audits</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">24</p>
              <p className="text-sm text-green-600 dark:text-green-400">+3 this month</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Findings</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">92</p>
              <p className="text-sm text-yellow-600 dark:text-yellow-400">18 critical</p>
            </div>
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Compliance Score</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">95.3%</p>
              <p className="text-sm text-green-600 dark:text-green-400">+2.1% improvement</p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Resolved Issues</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">74</p>
              <p className="text-sm text-blue-600 dark:text-blue-400">80.4% resolution rate</p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <CheckCircle className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Compliance Trend */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Compliance Trend</h3>
            <button
              onClick={() => handleExportData('csv')}
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
            >
              Export Data
            </button>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={complianceData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
              <XAxis 
                dataKey="month" 
                tick={{ fill: theme === 'dark' ? '#9CA3AF' : '#4B5563' }}
                axisLine={{ stroke: theme === 'dark' ? '#374151' : '#E5E7EB' }}
              />
              <YAxis 
                domain={[85, 100]} 
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
              <Line type="monotone" dataKey="score" stroke="#3B82F6" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Findings by Category */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Findings by Category</h3>
            <button
              onClick={() => handleExportData('pdf')}
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
            >
              Export Chart
            </button>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={findingsData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
              <XAxis 
                dataKey="category" 
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
              <Bar dataKey="count" fill={theme === 'dark' ? '#60A5FA' : '#3B82F6'} />
              <Bar dataKey="critical" fill={theme === 'dark' ? '#F87171' : '#EF4444'} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Risk Trend Analysis */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Risk Trend Analysis</h3>
          <button
            onClick={() => handleExportData('excel')}
            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
          >
            Export Table
          </button>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={riskTrendData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
            <XAxis 
              dataKey="week" 
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
            <Bar dataKey="high" stackId="a" fill={theme === 'dark' ? '#F87171' : '#EF4444'} />
            <Bar dataKey="medium" stackId="a" fill={theme === 'dark' ? '#FBBF24' : '#F59E0B'} />
            <Bar dataKey="low" stackId="a" fill={theme === 'dark' ? '#34D399' : '#10B981'} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Report Templates */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Audit Report Templates</h3>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
          >
            <option value="all">All Categories</option>
            <option value="Compliance">Compliance</option>
            <option value="Financial">Financial</option>
            <option value="Security">Security</option>
            <option value="Regulatory">Regulatory</option>
            <option value="Technical">Technical</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReports.map((report) => (
            <div key={report.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-lg ${report.color} text-white`}>
                  <report.icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{report.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{report.description}</p>
                  
                  <div className="space-y-2 text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center justify-between">
                      <span>Category:</span>
                      <span className="font-medium text-gray-700 dark:text-gray-300">{report.category}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Frequency:</span>
                      <span className="font-medium text-gray-700 dark:text-gray-300">{report.frequency}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Last Generated:</span>
                      <span className="font-medium text-gray-700 dark:text-gray-300">{new Date(report.lastGenerated).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Status:</span>
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(report.status)}
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                          {report.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Findings:</span>
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        {report.findings} total
                        {report.critical > 0 && (
                          <span className="text-red-600 dark:text-red-400 ml-1">({report.critical} critical)</span>
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 mt-4">
                    <button
                      onClick={() => handleGenerateReport(report.id)}
                      disabled={isGenerating === report.id}
                      className="flex items-center space-x-1 px-3 py-1.5 bg-blue-600 dark:bg-blue-500 text-white text-sm rounded hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50"
                    >
                      {isGenerating === report.id ? (
                        <RefreshCw className="w-3 h-3 animate-spin" />
                      ) : (
                        <Download className="w-3 h-3" />
                      )}
                      <span>{isGenerating === report.id ? 'Generating...' : 'Generate'}</span>
                    </button>
                    <button className="flex items-center space-x-1 px-3 py-1.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm rounded hover:bg-gray-50 dark:hover:bg-gray-700">
                      <Eye className="w-3 h-3" />
                      <span>Preview</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Export Options */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Bulk Export Options</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => handleExportData('csv')}
            className="flex items-center justify-center space-x-2 p-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
          >
            <FileText className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <span>Export as CSV</span>
          </button>
          <button
            onClick={() => handleExportData('pdf')}
            className="flex items-center justify-center space-x-2 p-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
          >
            <FileText className="w-5 h-5 text-red-600 dark:text-red-400" />
            <span>Export as PDF</span>
          </button>
          <button
            onClick={() => handleExportData('excel')}
            className="flex items-center justify-center space-x-2 p-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
          >
            <FileText className="w-5 h-5 text-green-600 dark:text-green-400" />
            <span>Export as Excel</span>
          </button>
        </div>
      </div>
    </div>
  );
}