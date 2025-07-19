import React, { useState } from 'react';
import { 
  Download, 
  FileText, 
  Calendar, 
  Filter, 
  RefreshCw, 
  Database, 
  BarChart3, 
  Users, 
  Building2,
  DollarSign,
  CheckCircle,
  Clock,
  Eye,
  X
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface ExportTemplate {
  id: string;
  name: string;
  description: string;
  category: 'Financial' | 'Operational' | 'Compliance' | 'Administrative';
  format: 'CSV' | 'Excel' | 'PDF';
  lastGenerated?: string;
  frequency: 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'On Demand';
  estimatedSize: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const exportTemplates: ExportTemplate[] = [
  {
    id: '1',
    name: 'Revenue Collection Report',
    description: 'Complete revenue collection data with payment details',
    category: 'Financial',
    format: 'Excel',
    lastGenerated: '2024-12-01',
    frequency: 'Daily',
    estimatedSize: '2.4 MB',
    icon: DollarSign,
    color: 'bg-green-600 dark:bg-green-500'
  },
  {
    id: '2',
    name: 'Business Registry Export',
    description: 'Complete list of registered businesses with details',
    category: 'Operational',
    format: 'CSV',
    lastGenerated: '2024-11-30',
    frequency: 'Weekly',
    estimatedSize: '3.8 MB',
    icon: Building2,
    color: 'bg-blue-600 dark:bg-blue-500'
  },
  {
    id: '3',
    name: 'Collector Performance Report',
    description: 'Performance metrics for all revenue collectors',
    category: 'Administrative',
    format: 'Excel',
    lastGenerated: '2024-11-28',
    frequency: 'Monthly',
    estimatedSize: '1.2 MB',
    icon: Users,
    color: 'bg-purple-600 dark:bg-purple-500'
  },
  {
    id: '4',
    name: 'Financial Summary',
    description: 'Summary of all financial transactions and balances',
    category: 'Financial',
    format: 'PDF',
    lastGenerated: '2024-11-25',
    frequency: 'Monthly',
    estimatedSize: '0.8 MB',
    icon: BarChart3,
    color: 'bg-orange-600 dark:bg-orange-500'
  },
  {
    id: '5',
    name: 'Revenue Type Analysis',
    description: 'Breakdown of revenue by type and category',
    category: 'Financial',
    format: 'Excel',
    lastGenerated: '2024-11-20',
    frequency: 'Monthly',
    estimatedSize: '1.5 MB',
    icon: BarChart3,
    color: 'bg-indigo-600 dark:bg-indigo-500'
  },
  {
    id: '6',
    name: 'Payment Method Distribution',
    description: 'Analysis of payment methods used for collections',
    category: 'Operational',
    format: 'CSV',
    lastGenerated: '2024-11-15',
    frequency: 'Monthly',
    estimatedSize: '0.9 MB',
    icon: DollarSign,
    color: 'bg-red-600 dark:bg-red-500'
  },
  {
    id: '7',
    name: 'Compliance Report',
    description: 'Business compliance status and issues',
    category: 'Compliance',
    format: 'PDF',
    lastGenerated: '2024-11-10',
    frequency: 'Quarterly',
    estimatedSize: '1.7 MB',
    icon: CheckCircle,
    color: 'bg-teal-600 dark:bg-teal-500'
  },
  {
    id: '8',
    name: 'Custom Data Export',
    description: 'Create a custom data export with selected fields',
    category: 'Administrative',
    format: 'CSV',
    frequency: 'On Demand',
    estimatedSize: 'Varies',
    icon: Database,
    color: 'bg-gray-600 dark:bg-gray-500'
  }
];

const recentExports = [
  { 
    id: '1', 
    name: 'Revenue Collection Report', 
    date: '2024-12-01T10:30:00Z', 
    format: 'Excel', 
    size: '2.4 MB', 
    status: 'completed',
    downloadUrl: '#'
  },
  { 
    id: '2', 
    name: 'Business Registry Export', 
    date: '2024-11-30T14:15:00Z', 
    format: 'CSV', 
    size: '3.8 MB', 
    status: 'completed',
    downloadUrl: '#'
  },
  { 
    id: '3', 
    name: 'Collector Performance Report', 
    date: '2024-11-28T09:45:00Z', 
    format: 'Excel', 
    size: '1.2 MB', 
    status: 'completed',
    downloadUrl: '#'
  },
  { 
    id: '4', 
    name: 'Custom Data Export', 
    date: '2024-12-01T11:20:00Z', 
    format: 'CSV', 
    size: '5.1 MB', 
    status: 'processing'
  }
];

export default function DataExports() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedFormat, setSelectedFormat] = useState('all');
  const [isGenerating, setIsGenerating] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<ExportTemplate | null>(null);
  const [showCustomExport, setShowCustomExport] = useState(false);
  const { theme } = useTheme();

  const filteredTemplates = exportTemplates.filter(template => 
    (selectedCategory === 'all' || template.category === selectedCategory) &&
    (selectedFormat === 'all' || template.format === selectedFormat)
  );

  const handleGenerateExport = async (templateId: string) => {
    setIsGenerating(templateId);
    // Simulate export generation
    await new Promise(resolve => setTimeout(resolve, 2500));
    setIsGenerating(null);
    alert('Export generated successfully! You can download it from Recent Exports.');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Data Exports</h1>
          <p className="text-gray-600 dark:text-gray-400">Generate and download data exports for analysis</p>
        </div>
        <button
          onClick={() => setShowCustomExport(true)}
          className="flex items-center space-x-2 bg-blue-600 dark:bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600"
        >
          <Database className="w-4 h-4" />
          <span>Custom Export</span>
        </button>
      </div>

      {/* Export Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Available Templates</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{exportTemplates.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Download className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Exports This Month</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">24</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <Database className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Data Size</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">18.7 GB</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Processing</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {recentExports.filter(e => e.status === 'processing').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Categories</option>
              <option value="Financial">Financial</option>
              <option value="Operational">Operational</option>
              <option value="Compliance">Compliance</option>
              <option value="Administrative">Administrative</option>
            </select>
            <select
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Formats</option>
              <option value="CSV">CSV</option>
              <option value="Excel">Excel</option>
              <option value="PDF">PDF</option>
            </select>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <Filter className="w-4 h-4" />
            <span>{filteredTemplates.length} templates found</span>
          </div>
        </div>
      </div>

      {/* Export Templates */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <div key={template.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start space-x-4">
              <div className={`p-3 rounded-lg ${template.color} text-white`}>
                <template.icon className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{template.name}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{template.description}</p>
                
                <div className="space-y-2 text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center justify-between">
                    <span>Category:</span>
                    <span className="font-medium text-gray-700 dark:text-gray-300">{template.category}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Format:</span>
                    <span className="font-medium text-gray-700 dark:text-gray-300">{template.format}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Frequency:</span>
                    <span className="font-medium text-gray-700 dark:text-gray-300">{template.frequency}</span>
                  </div>
                  {template.lastGenerated && (
                    <div className="flex items-center justify-between">
                      <span>Last Generated:</span>
                      <span className="font-medium text-gray-700 dark:text-gray-300">{new Date(template.lastGenerated).toLocaleDateString()}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span>Size:</span>
                    <span className="font-medium text-gray-700 dark:text-gray-300">{template.estimatedSize}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 mt-4">
                  <button
                    onClick={() => handleGenerateExport(template.id)}
                    disabled={isGenerating === template.id}
                    className="flex items-center space-x-1 px-3 py-1.5 bg-blue-600 dark:bg-blue-500 text-white text-sm rounded hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50"
                  >
                    {isGenerating === template.id ? (
                      <RefreshCw className="w-3 h-3 animate-spin" />
                    ) : (
                      <Download className="w-3 h-3" />
                    )}
                    <span>{isGenerating === template.id ? 'Generating...' : 'Generate'}</span>
                  </button>
                  <button
                    onClick={() => setSelectedTemplate(template)}
                    className="flex items-center space-x-1 px-3 py-1.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm rounded hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <Eye className="w-3 h-3" />
                    <span>Details</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Exports */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Exports</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Export Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Date
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
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {recentExports.map((export_) => (
                <tr key={export_.id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{export_.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">{new Date(export_.date).toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                      {export_.format}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">{export_.size}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {export_.status === 'completed' ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Completed
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                        <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                        Processing
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {export_.status === 'completed' ? (
                      <a 
                        href={export_.downloadUrl} 
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                      >
                        Download
                      </a>
                    ) : (
                      <span className="text-gray-400 dark:text-gray-500">Pending</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Template Details Modal */}
      {selectedTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Export Template Details</h3>
              <button
                onClick={() => setSelectedTemplate(null)}
                className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-lg ${selectedTemplate.color} text-white`}>
                  <selectedTemplate.icon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 dark:text-white">{selectedTemplate.name}</h4>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">{selectedTemplate.description}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                  <p className="text-sm text-gray-900 dark:text-white">{selectedTemplate.category}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Format</label>
                  <p className="text-sm text-gray-900 dark:text-white">{selectedTemplate.format}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Frequency</label>
                  <p className="text-sm text-gray-900 dark:text-white">{selectedTemplate.frequency}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Estimated Size</label>
                  <p className="text-sm text-gray-900 dark:text-white">{selectedTemplate.estimatedSize}</p>
                </div>
                {selectedTemplate.lastGenerated && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Last Generated</label>
                    <p className="text-sm text-gray-900 dark:text-white">{new Date(selectedTemplate.lastGenerated).toLocaleDateString()}</p>
                  </div>
                )}
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h5 className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-2">Data Included:</h5>
                <ul className="space-y-1 text-sm text-blue-800 dark:text-blue-300">
                  <li>• Complete transaction records</li>
                  <li>• Payment details and methods</li>
                  <li>• Collector information</li>
                  <li>• Business details</li>
                  <li>• Revenue type categorization</li>
                </ul>
              </div>
              
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setSelectedTemplate(null)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleGenerateExport(selectedTemplate.id);
                    setSelectedTemplate(null);
                  }}
                  className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600"
                >
                  Generate Export
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Export Modal */}
      {showCustomExport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Create Custom Export</h3>
              <button
                onClick={() => setShowCustomExport(false)}
                className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Export Name
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter a name for this export"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Data Category
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white">
                  <option>Financial Data</option>
                  <option>Business Data</option>
                  <option>Collector Data</option>
                  <option>Revenue Type Data</option>
                  <option>User Data</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Date Range
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Start Date</label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">End Date</label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Export Format
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center space-x-2">
                    <input type="radio" name="format" className="text-blue-600 dark:text-blue-400" defaultChecked />
                    <span className="text-sm text-gray-700 dark:text-gray-300">CSV</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="radio" name="format" className="text-blue-600 dark:text-blue-400" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Excel</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="radio" name="format" className="text-blue-600 dark:text-blue-400" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">PDF</span>
                  </label>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Fields to Include
                </label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="text-blue-600 dark:text-blue-400" defaultChecked />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Transaction ID</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="text-blue-600 dark:text-blue-400" defaultChecked />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Date</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="text-blue-600 dark:text-blue-400" defaultChecked />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Amount</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="text-blue-600 dark:text-blue-400" defaultChecked />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Payment Method</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="text-blue-600 dark:text-blue-400" defaultChecked />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Business Name</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="text-blue-600 dark:text-blue-400" defaultChecked />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Collector Name</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="text-blue-600 dark:text-blue-400" defaultChecked />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Revenue Type</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="text-blue-600 dark:text-blue-400" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Receipt Number</span>
                  </label>
                </div>
              </div>
              
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setShowCustomExport(false)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowCustomExport(false);
                    alert('Custom export job started! You will be notified when it is ready for download.');
                  }}
                  className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600"
                >
                  Generate Export
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}