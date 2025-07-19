import React, { useState } from 'react';
import { 
  Download, 
  Calendar, 
  Filter, 
  BarChart3, 
  FileText, 
  Globe, 
  DollarSign,
  Building2,
  Users,
  TrendingUp,
  Eye,
  RefreshCw,
  ChevronDown
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend } from 'recharts';
import { useTheme } from '../../contexts/ThemeContext';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import { ghanaRegions } from '../../utils/ghanaRegions';
import { filterByJurisdiction } from '../../utils/filterByJurisdiction';

// Mock data for reports
const nationalRevenueData = [
  { month: 'Jan', revenue: 3200000, target: 3000000 },
  { month: 'Feb', revenue: 4100000, target: 3500000 },
  { month: 'Mar', revenue: 3800000, target: 3200000 },
  { month: 'Apr', revenue: 4500000, target: 4000000 },
  { month: 'May', revenue: 5200000, target: 4500000 },
  { month: 'Jun', revenue: 4800000, target: 4200000 },
  { month: 'Jul', revenue: 5500000, target: 5000000 },
  { month: 'Aug', revenue: 6100000, target: 5500000 },
  { month: 'Sep', revenue: 5800000, target: 5200000 },
  { month: 'Oct', revenue: 6400000, target: 5800000 },
  { month: 'Nov', revenue: 7200000, target: 6500000 },
  { month: 'Dec', revenue: 8100000, target: 7000000 },
];

const regionPerformanceData = [
  { region: 'Greater Accra', revenue: 12500000, districts: 29, growth: 15.2 },
  { region: 'Ashanti', revenue: 9800000, districts: 43, growth: 12.8 },
  { region: 'Western', revenue: 7200000, districts: 22, growth: 18.5 },
  { region: 'Central', revenue: 6100000, districts: 20, growth: 9.3 },
  { region: 'Eastern', revenue: 5800000, districts: 33, growth: 14.7 },
  { region: 'Northern', revenue: 4200000, districts: 26, growth: 11.2 },
  { region: 'Volta', revenue: 3900000, districts: 25, growth: 13.4 },
  { region: 'Brong Ahafo', revenue: 3600000, districts: 27, growth: 10.8 },
  { region: 'Upper East', revenue: 2100000, districts: 15, growth: 8.9 },
  { region: 'Upper West', revenue: 1800000, districts: 11, growth: 7.5 }
];

const revenueTypeDistribution = [
  { name: 'Business Permits', value: 35, amount: 15750000, color: '#3B82F6' },
  { name: 'Market Tolls', value: 25, amount: 11250000, color: '#10B981' },
  { name: 'Property Rates', value: 20, amount: 9000000, color: '#F59E0B' },
  { name: 'Signage Permits', value: 12, amount: 5400000, color: '#EF4444' },
  { name: 'Others', value: 8, amount: 3600000, color: '#8B5CF6' },
];

// Replace mockMMDAs mapping with real data mapping using ghanaRegions
const districtToRegionMap = new Map<string, string>();
ghanaRegions.forEach(region => {
  if (region.districts) {
    region.districts.forEach(district => {
      districtToRegionMap.set(district.name, region.name);
    });
  }
});
const getRegionFromDistrict = (district: string) => {
  return districtToRegionMap.get(district) || 'Unknown';
};

function ReportsCenter() {
  const [selectedPeriod, setSelectedPeriod] = useState('this-year');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isGenerating, setIsGenerating] = useState<string | null>(null);
  const { theme } = useTheme();
  const { user } = useAuth();
  const { collections, businesses, dashboardStats, loading, error } = useApp();

  // Jurisdiction-based filtering
  let filteredCollections = collections;
  let filteredBusinesses = businesses;
  if (user) {
    if (user.role === 'regional_admin') {
      filteredCollections = collections.filter(c => getRegionFromDistrict(c.district) === user.region);
      filteredBusinesses = businesses.filter(b => getRegionFromDistrict(b.district) === user.region);
    } else if (user.role !== 'super_admin') {
      filteredCollections = filterByJurisdiction(user, collections, 'district');
      filteredBusinesses = filterByJurisdiction(user, businesses, 'district');
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleGenerateReport = async (reportId: string) => {
    setIsGenerating(reportId);
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsGenerating(null);
    alert('Report generated successfully!');
  };

  const handleExportData = (format: 'csv' | 'pdf' | 'excel') => {
    alert(`Exporting data as ${format.toUpperCase()}...`);
  };

  const filteredReports = [];

  // Aggregate data by region (jurisdiction-aware)
  const dataByRegion: Record<string, { region: string; revenue: number; districts: Set<string>; growth: number }> = {};
  ghanaRegions.forEach(r => {
    dataByRegion[r] = { region: r, revenue: 0, districts: new Set(), growth: (Math.random() * 15).toFixed(2) };
  });

  filteredCollections.forEach(c => {
    const region = getRegionFromDistrict(c.district);
    if (dataByRegion[region]) {
      dataByRegion[region].revenue += c.amount;
      dataByRegion[region].districts.add(c.district);
    }
  });
  
  const regionalPerformanceData = Object.values(dataByRegion).map(r => ({
    ...r,
    districts: r.districts.size,
  })).filter(r => user?.role === 'super_admin' || (user?.role === 'regional_admin' ? r.region === user.region : true)).sort((a, b) => b.revenue - a.revenue);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">National Reports Center</h1>
          <p className="text-gray-600 dark:text-gray-400">Generate and export comprehensive reports across all MMDAs</p>
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
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total National Revenue</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(64800000)}
              </p>
              <p className="text-sm text-green-600 dark:text-green-400">+12.5% from last year</p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Districts</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">254/260</p>
              <p className="text-sm text-blue-600 dark:text-blue-400">97.7% operational</p>
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
              <p className="text-2xl font-bold text-gray-900 dark:text-white">45,678</p>
              <p className="text-sm text-green-600 dark:text-green-400">+8.3% this month</p>
            </div>
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <Building2 className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">System Users</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">1,247</p>
              <p className="text-sm text-purple-600 dark:text-purple-400">Across all MMDAs</p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* National Revenue Trend */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">National Revenue Trend</h3>
            <button
              onClick={() => handleExportData('csv')}
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
            >
              Export Data
            </button>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={nationalRevenueData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
              <XAxis 
                dataKey="month" 
                tick={{ fill: theme === 'dark' ? '#9CA3AF' : '#4B5563' }}
                axisLine={{ stroke: theme === 'dark' ? '#374151' : '#E5E7EB' }}
              />
              <YAxis 
                tickFormatter={(value) => `${value / 1000000}M`} 
                tick={{ fill: theme === 'dark' ? '#9CA3AF' : '#4B5563' }}
                axisLine={{ stroke: theme === 'dark' ? '#374151' : '#E5E7EB' }}
              />
              <Tooltip 
                formatter={(value) => [formatCurrency(value as number), '']}
                contentStyle={{ 
                  backgroundColor: theme === 'dark' ? '#1F2937' : '#FFFFFF',
                  borderColor: theme === 'dark' ? '#374151' : '#E5E7EB',
                  color: theme === 'dark' ? '#F9FAFB' : '#111827'
                }}
              />
              <Line type="monotone" dataKey="revenue" stroke={theme === 'dark' ? '#60A5FA' : '#3B82F6'} strokeWidth={3} name="Revenue" />
              <Line type="monotone" dataKey="target" stroke={theme === 'dark' ? '#34D399' : '#10B981'} strokeDasharray="5 5" name="Target" />
              <Legend 
                formatter={(value) => <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>{value}</span>}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue Type Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Revenue by Type</h3>
            <button
              onClick={() => handleExportData('pdf')}
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
            >
              Export Chart
            </button>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={revenueTypeDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}%`}
                labelLine={{ stroke: theme === 'dark' ? '#9CA3AF' : '#4B5563' }}
              >
                {revenueTypeDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value, name) => [`${value}%`, name]}
                contentStyle={{ 
                  backgroundColor: theme === 'dark' ? '#1F2937' : '#FFFFFF',
                  borderColor: theme === 'dark' ? '#374151' : '#E5E7EB',
                  color: theme === 'dark' ? '#F9FAFB' : '#111827'
                }}
              />
              <Legend 
                formatter={(value) => <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Regional Performance */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Regional Performance</h3>
          <button
            onClick={() => handleExportData('excel')}
            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
          >
            Export Table
          </button>
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={regionalPerformanceData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-gray-200 dark:stroke-gray-700" />
            <XAxis 
              dataKey="region" 
              angle={-45}
              textAnchor="end"
              interval={0}
              height={100}
              tick={{ fill: theme === 'dark' ? '#9CA3AF' : '#6B7280', fontSize: 12 }} 
              axisLine={false} 
              tickLine={false} 
            />
            <YAxis 
              tickFormatter={(value) => `${value / 1000000}M`} 
              tick={{ fill: theme === 'dark' ? '#9CA3AF' : '#6B7280' }} 
              axisLine={false} 
              tickLine={false} 
            />
            <Tooltip
              contentStyle={{
                backgroundColor: theme === 'dark' ? '#1F2937' : '#FFFFFF',
                borderColor: theme === 'dark' ? '#374151' : '#E5E7EB',
              }}
              formatter={(value, name) => [name === 'revenue' ? `GHS ${Number(value).toLocaleString()}` : value, name.charAt(0).toUpperCase() + name.slice(1)]}
            />
            <Bar dataKey="revenue" fill="#3b82f6" name="Revenue" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
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

export default ReportsCenter;