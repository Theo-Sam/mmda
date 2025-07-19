import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { useTheme } from '../../contexts/ThemeContext';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import { ghanaRegions } from '../../utils/ghanaRegions';
import { CheckCircle, XCircle, Globe, DollarSign, Building2, Users, Download, Calendar, Filter, BarChart3, FileText, TrendingUp, Eye, RefreshCw, ChevronDown } from 'lucide-react';
import { LineChart, Line } from 'recharts';

// Helper to get region from district
const districtToRegionMap = new Map<string, string>();
ghanaRegions.forEach(region => {
  if (Array.isArray(region.districts)) {
    region.districts.forEach(district => {
      districtToRegionMap.set(district.name, region.name);
    });
  }
});
const getRegionFromDistrict = (district: string) => {
  return districtToRegionMap.get(district) || 'Unknown';
};

function RegionalReportCenter() {
  const [selectedPeriod, setSelectedPeriod] = useState('this-year');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isGenerating, setIsGenerating] = useState<string | null>(null);
  const { theme } = useTheme();
  const { user } = useAuth();
  const { collections, businesses, compliance, mmdas } = useApp();

  // Filter to region
  const region = user?.region || 'Unknown';
  const mmdasInRegion = mmdas.filter(mmda => mmda.region === region);
  const filteredCollections = collections.filter(c => getRegionFromDistrict(c.district) === region);
  const filteredBusinesses = businesses.filter(b => getRegionFromDistrict(b.district) === region);

  // Aggregate metrics
  const totalRevenue = filteredCollections.reduce((sum, c) => sum + c.amount, 0);
  const totalBusinesses = filteredBusinesses.length;
  const totalMMDAs = mmdasInRegion.length;

  // Compliance rate (mocked or from compliance data)
  let complianceRate = 0;
  if (compliance && compliance.length > 0) {
    const regionCompliance = compliance.filter(c => getRegionFromDistrict(c.district) === region);
    complianceRate = regionCompliance.length > 0 ? Math.round((regionCompliance.filter(c => c.compliant).length / regionCompliance.length) * 100) : 0;
  } else {
    complianceRate = 85;
  }

  // MMDA performance table data
  const mmdaPerformance = mmdasInRegion.map(mmda => {
    const mmdaRevenue = filteredCollections.filter(c => c.district === mmda.name).reduce((sum, c) => sum + c.amount, 0);
    const mmdaBusinesses = filteredBusinesses.filter(b => b.district === mmda.name).length;
    const mmdaCompliance = compliance && compliance.length > 0
      ? compliance.filter(c => c.district === mmda.name && c.compliant).length
      : Math.floor(Math.random() * 100);
    return {
      name: mmda.name,
      revenue: mmdaRevenue,
      businesses: mmdaBusinesses,
      compliance: mmdaCompliance,
    };
  });

  // Chart data
  const revenueByMMDA = mmdaPerformance.map(m => ({ name: m.name, revenue: m.revenue }));
  const businessesByMMDA = mmdaPerformance.map(m => ({ name: m.name, businesses: m.businesses }));

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleGenerateReport = async (reportId: string) => {
    setIsGenerating(reportId);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsGenerating(null);
    alert('Report generated successfully!');
  };

  const handleExportData = (format: 'csv' | 'pdf' | 'excel') => {
    alert(`Exporting data as ${format.toUpperCase()}...`);
  };

  // Only show templates for regional_admin
  const filteredReports = [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Regional Report Center</h1>
          <p className="text-gray-600 dark:text-gray-400">Generate and export comprehensive reports for all MMDAs in {region}</p>
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
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Regional Revenue</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(totalRevenue)}</p>
              <p className="text-sm text-green-600 dark:text-green-400">All MMDAs</p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">MMDAs in Region</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalMMDAs}</p>
              <p className="text-sm text-blue-600 dark:text-blue-400">In {region}</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Globe className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Businesses</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalBusinesses}</p>
              <p className="text-sm text-green-600 dark:text-green-400">In {region}</p>
            </div>
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <Building2 className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Compliance Rate</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{complianceRate}%</p>
              <p className="text-sm text-purple-600 dark:text-purple-400">(Mocked)</p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <CheckCircle className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue by MMDA */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Revenue by MMDA</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueByMMDA}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" interval={0} height={100} tick={{ fill: theme === 'dark' ? '#9CA3AF' : '#6B7280', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={value => `${value / 1000000}M`} tick={{ fill: theme === 'dark' ? '#9CA3AF' : '#6B7280' }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(value, name) => [name === 'revenue' ? `GHS ${Number(value).toLocaleString()}` : value, 'Revenue']} />
              <Bar dataKey="revenue" fill="#3b82f6" name="Revenue" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        {/* Businesses by MMDA */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Businesses by MMDA</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={businessesByMMDA}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" interval={0} height={100} tick={{ fill: theme === 'dark' ? '#9CA3AF' : '#6B7280', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={value => value} tick={{ fill: theme === 'dark' ? '#9CA3AF' : '#6B7280' }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(value, name) => [name === 'businesses' ? `${value} businesses` : value, 'Businesses']} />
              <Bar dataKey="businesses" fill="#10B981" name="Businesses" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* MMDA Performance Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">MMDA Performance Table</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">MMDA</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Revenue</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Businesses</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Compliance</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {mmdaPerformance.map((mmda, idx) => (
                <tr key={idx}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{mmda.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{formatCurrency(mmda.revenue)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{mmda.businesses}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                      {mmda.compliance}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
            <option value="Financial">Financial</option>
            <option value="Performance">Performance</option>
            <option value="System">System</option>
            <option value="Business">Business</option>
            <option value="Compliance">Compliance</option>
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

export default RegionalReportCenter; 