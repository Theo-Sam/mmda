import React, { useState } from 'react';
import { 
  Download, 
  FileText, 
  Calendar, 
  Filter, 
  BarChart3, 
  Globe, 
  Users, 
  DollarSign,
  Building2,
  Shield,
  TrendingUp,
  Eye,
  RefreshCw,
  Database,
  Activity,
  Target,
  CheckCircle
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  category: 'Performance' | 'Compliance' | 'Financial' | 'Operational' | 'Comparative';
  frequency: 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Annual';
  lastGenerated: string;
  size: string;
  format: 'PDF' | 'Excel' | 'CSV';
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const reportTemplates: ReportTemplate[] = [
  {
    id: '1',
    name: 'National Revenue Summary',
    description: 'Comprehensive revenue report across all MMDAs',
    category: 'Financial',
    frequency: 'Monthly',
    lastGenerated: '2024-12-01',
    size: '2.4 MB',
    format: 'PDF',
    icon: DollarSign,
    color: 'bg-green-600 dark:bg-green-500'
  },
  {
    id: '2',
    name: 'MMDA Performance Comparison',
    description: 'Comparative analysis of all MMDA performance metrics',
    category: 'Performance',
    frequency: 'Quarterly',
    lastGenerated: '2024-11-30',
    size: '3.1 MB',
    format: 'Excel',
    icon: BarChart3,
    color: 'bg-blue-600 dark:bg-blue-500'
  },
  {
    id: '3',
    name: 'Regional Compliance Report',
    description: 'Compliance rates and issues by region',
    category: 'Compliance',
    frequency: 'Monthly',
    lastGenerated: '2024-11-28',
    size: '1.8 MB',
    format: 'PDF',
    icon: Shield,
    color: 'bg-purple-600 dark:bg-purple-500'
  },
  {
    id: '4',
    name: 'Collector Effectiveness Analysis',
    description: 'Performance metrics for all revenue collectors',
    category: 'Performance',
    frequency: 'Monthly',
    lastGenerated: '2024-11-25',
    size: '2.7 MB',
    format: 'Excel',
    icon: Users,
    color: 'bg-orange-600 dark:bg-orange-500'
  },
  {
    id: '5',
    name: 'Business Registration Trends',
    description: 'New business registrations and growth patterns',
    category: 'Operational',
    frequency: 'Weekly',
    lastGenerated: '2024-12-01',
    size: '1.2 MB',
    format: 'CSV',
    icon: Building2,
    color: 'bg-indigo-600 dark:bg-indigo-500'
  },
  {
    id: '6',
    name: 'System Activity Overview',
    description: 'User activity and system usage statistics',
    category: 'Operational',
    frequency: 'Daily',
    lastGenerated: '2024-12-01',
    size: '0.9 MB',
    format: 'CSV',
    icon: Activity,
    color: 'bg-red-600 dark:bg-red-500'
  },
  {
    id: '7',
    name: 'Cross-Regional Analysis',
    description: 'Comparative performance across all regions',
    category: 'Comparative',
    frequency: 'Quarterly',
    lastGenerated: '2024-11-15',
    size: '4.2 MB',
    format: 'PDF',
    icon: Globe,
    color: 'bg-teal-600 dark:bg-teal-500'
  },
  {
    id: '8',
    name: 'Target Achievement Report',
    description: 'Revenue targets vs actual performance',
    category: 'Performance',
    frequency: 'Monthly',
    lastGenerated: '2024-11-30',
    size: '2.1 MB',
    format: 'Excel',
    icon: Target,
    color: 'bg-pink-600 dark:bg-pink-500'
  }
];

const quickExports = [
  {
    id: 'mmda-summary',
    name: 'MMDA Summary Data',
    description: 'Current performance data for all MMDAs',
    icon: Building2,
    estimatedSize: '1.5 MB'
  },
  {
    id: 'collector-data',
    name: 'Collector Performance Data',
    description: 'Performance metrics for all collectors',
    icon: Users,
    estimatedSize: '2.2 MB'
  },
  {
    id: 'revenue-data',
    name: 'Revenue Collection Data',
    description: 'Complete revenue collection records',
    icon: DollarSign,
    estimatedSize: '3.8 MB'
  },
  {
    id: 'compliance-data',
    name: 'Compliance Status Data',
    description: 'Compliance rates and audit findings',
    icon: Shield,
    estimatedSize: '1.1 MB'
  }
];

export default function ReportsExports() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('this-month');
  const [isGenerating, setIsGenerating] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState<string | null>(null);
  const { theme } = useTheme();

  const filteredReports = [];

  const handleGenerateReport = async (reportId: string) => {
    setIsGenerating(reportId);
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsGenerating(null);
    alert('Report generated successfully!');
  };

  const handleQuickExport = async (exportId: string, format: 'csv' | 'excel' | 'pdf') => {
    setIsExporting(exportId);
    // Simulate export
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsExporting(null);
    alert(`Data exported as ${format.toUpperCase()} successfully!`);
  };

  const handleBulkExport = async (format: 'csv' | 'excel' | 'pdf') => {
    setIsExporting('bulk');
    // Simulate bulk export
    await new Promise(resolve => setTimeout(resolve, 5000));
    setIsExporting(null);
    alert(`Bulk export completed as ${format.toUpperCase()}!`);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reports & Exports</h1>
          <p className="text-gray-600 dark:text-gray-400">Download oversight reports and export monitoring data</p>
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

      {/* Export Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Available Reports</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{reportTemplates.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Download className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Downloads Today</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">47</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <Database className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Data Size</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">24.8 GB</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <CheckCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Success Rate</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">99.2%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Export Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Exports</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleBulkExport('csv')}
              disabled={isExporting === 'bulk'}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
            >
              {isExporting === 'bulk' ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              <span>{isExporting === 'bulk' ? 'Exporting...' : 'Bulk Export'}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickExports.map((exportItem) => (
            <div key={exportItem.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <exportItem.icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-white text-sm">{exportItem.name}</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{exportItem.description}</p>
                </div>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                Est. size: {exportItem.estimatedSize}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleQuickExport(exportItem.id, 'csv')}
                  disabled={isExporting === exportItem.id}
                  className="flex-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-1 px-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50"
                >
                  CSV
                </button>
                <button
                  onClick={() => handleQuickExport(exportItem.id, 'excel')}
                  disabled={isExporting === exportItem.id}
                  className="flex-1 text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 py-1 px-2 rounded hover:bg-green-200 dark:hover:bg-green-900/50 disabled:opacity-50"
                >
                  Excel
                </button>
                <button
                  onClick={() => handleQuickExport(exportItem.id, 'pdf')}
                  disabled={isExporting === exportItem.id}
                  className="flex-1 text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 py-1 px-2 rounded hover:bg-red-200 dark:hover:bg-red-900/50 disabled:opacity-50"
                >
                  PDF
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Report Templates */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Report Templates</h3>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
          >
            <option value="all">All Categories</option>
            <option value="Performance">Performance</option>
            <option value="Compliance">Compliance</option>
            <option value="Financial">Financial</option>
            <option value="Operational">Operational</option>
            <option value="Comparative">Comparative</option>
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
                      <span>Format:</span>
                      <span className="font-medium text-gray-700 dark:text-gray-300">{report.format}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Size:</span>
                      <span className="font-medium text-gray-700 dark:text-gray-300">{report.size}</span>
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

      {/* Export History */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Recent Exports</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Report Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Generated
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Format
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Size
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
              {reportTemplates.slice(0, 5).map((report) => (
                <tr key={report.id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${report.color} text-white`}>
                        <report.icon className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{report.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {new Date(report.lastGenerated).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                      {report.format}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {report.size}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Ready
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300">
                        <Download className="w-4 h-4" />
                      </button>
                      <button className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300">
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Export Guidelines */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-4">Export Guidelines</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800 dark:text-blue-300">
          <div>
            <h4 className="font-medium mb-2">Data Formats:</h4>
            <ul className="space-y-1">
              <li>• <strong>CSV:</strong> Raw data for analysis</li>
              <li>• <strong>Excel:</strong> Formatted reports with charts</li>
              <li>• <strong>PDF:</strong> Print-ready documents</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Best Practices:</h4>
            <ul className="space-y-1">
              <li>• Export during off-peak hours for large datasets</li>
              <li>• Use date filters to reduce file sizes</li>
              <li>• Verify data integrity before sharing</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}