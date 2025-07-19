import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Download, Calendar, TrendingUp, TrendingDown, MapPin } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { filterByJurisdiction } from '../utils/filterByJurisdiction';
import { ghanaRegions } from '../utils/ghanaRegions';

const monthlyData = [
  { month: 'Jan', revenue: 3200 },
  { month: 'Feb', revenue: 4100 },
  { month: 'Mar', revenue: 3800 },
  { month: 'Apr', revenue: 4500 },
  { month: 'May', revenue: 5200 },
  { month: 'Jun', revenue: 4800 },
  { month: 'Jul', revenue: 5500 },
  { month: 'Aug', revenue: 6100 },
  { month: 'Sep', revenue: 5800 },
  { month: 'Oct', revenue: 6400 },
  { month: 'Nov', revenue: 7200 },
  { month: 'Dec', revenue: 8100 },
];

const categoryData = [
  { name: 'Retail', value: 35, color: '#3B82F6' },
  { name: 'Food Service', value: 25, color: '#10B981' },
  { name: 'Electronics', value: 20, color: '#F59E0B' },
  { name: 'Services', value: 15, color: '#EF4444' },
  { name: 'Others', value: 5, color: '#8B5CF6' },
];

export default function Reports() {
  const { collections, businesses } = useApp();
  const { theme } = useTheme();
  const { user } = useAuth();
  const [dateRange, setDateRange] = useState('this-month');
  const [selectedMetric, setSelectedMetric] = useState('revenue');
  const [selectedRegion, setSelectedRegion] = useState('all');

  // Create a map for quick lookup of district to region
  const districtToRegionMap = useMemo(() => {
    const map = new Map<string, string>();
    ghanaRegions.forEach(region => {
      map.set(region.name, region.name);
    });
    return map;
  }, []);

  const getRegionFromDistrict = (district: string) => {
    return districtToRegionMap.get(district) || 'Unknown';
  };

  // Apply district-based filtering first
  const districtCollections = user ? filterByJurisdiction(user, collections) : collections;
  const districtBusinesses = user ? filterByJurisdiction(user, businesses) : businesses;

  // Filter by selected region
  const regionalCollections = selectedRegion === 'all'
    ? districtCollections
    : districtCollections.filter(c => getRegionFromDistrict(c.district) === selectedRegion);
  
  const regionalBusinesses = selectedRegion === 'all'
    ? districtBusinesses
    : districtBusinesses.filter(b => getRegionFromDistrict(b.district) === selectedRegion);

  const totalRevenue = regionalCollections.reduce((sum, collection) => sum + collection.amount, 0);
  const thisMonthRevenue = regionalCollections
    .filter(c => new Date(c.date).getMonth() === new Date().getMonth())
    .reduce((sum, collection) => sum + collection.amount, 0);
  const lastMonthRevenue = regionalCollections
    .filter(c => new Date(c.date).getMonth() === new Date().getMonth() - 1)
    .reduce((sum, collection) => sum + collection.amount, 0);
  
  const revenueGrowth = lastMonthRevenue > 0 
    ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 
    : 0;

  // Calculate data for regional performance
  const regionalPerformanceData = useMemo(() => {
    const dataByRegion: Record<string, { region: string; revenue: number; businesses: number; collections: number }> = {};

    ghanaRegions.forEach(region => {
      dataByRegion[region.name] = {
        region: region.name,
        revenue: 0,
        businesses: 0,
        collections: 0,
      };
    });

    districtCollections.forEach(collection => {
      const region = getRegionFromDistrict(collection.district);
      if (dataByRegion[region]) {
        dataByRegion[region].revenue += collection.amount;
        dataByRegion[region].collections += 1;
      }
    });

    districtBusinesses.forEach(business => {
      const region = getRegionFromDistrict(business.district);
      if (dataByRegion[region]) {
        dataByRegion[region].businesses += 1;
      }
    });

    return Object.values(dataByRegion).sort((a, b) => b.revenue - a.revenue);
  }, [districtCollections, districtBusinesses, getRegionFromDistrict]);

  const handleExport = (format: 'csv' | 'pdf') => {
    // Mock export functionality
    alert(`Exporting report as ${format.toUpperCase()}...`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reports & Analytics</h1>
          <p className="text-gray-600 dark:text-gray-400">Financial insights and business analytics</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
          >
            <option value="all">All Regions</option>
            {ghanaRegions.map(region => (
              <option key={region.name} value={region.name}>{region.name}</option>
            ))}
          </select>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
          >
            <option value="this-week">This Week</option>
            <option value="this-month">This Month</option>
            <option value="last-month">Last Month</option>
            <option value="this-year">This Year</option>
          </select>
          <button
            onClick={() => handleExport('csv')}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 dark:bg-green-500 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => handleExport('pdf')}
            className="flex items-center space-x-2 px-4 py-2 bg-red-600 dark:bg-red-500 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-600"
          >
            <Download className="w-4 h-4" />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                GHS {totalRevenue.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">This Month</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                GHS {thisMonthRevenue.toLocaleString()}
              </p>
              <p className={`text-sm ${revenueGrowth >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {revenueGrowth >= 0 ? '+' : ''}{revenueGrowth.toFixed(1)}% from last month
              </p>
            </div>
            <div className={`p-3 rounded-lg ${revenueGrowth >= 0 ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
              {revenueGrowth >= 0 ? (
                <TrendingUp className={`w-6 h-6 ${revenueGrowth >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`} />
              ) : (
                <TrendingDown className={`w-6 h-6 ${revenueGrowth >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`} />
              )}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Collections</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{regionalCollections.length}</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Businesses</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {regionalBusinesses.filter(b => b.status === 'active').length}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <TrendingUp className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Revenue Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Monthly Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
              <XAxis 
                dataKey="month" 
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
                formatter={(value) => [`GHS ${value}`, 'Revenue']}
              />
              <Bar dataKey="revenue" fill={theme === 'dark' ? '#60A5FA' : '#3B82F6'} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Business Category Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Revenue by Business Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}%`}
                labelLine={{ stroke: theme === 'dark' ? '#9CA3AF' : '#4B5563' }}
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: theme === 'dark' ? '#1F2937' : '#FFFFFF',
                  borderColor: theme === 'dark' ? '#374151' : '#E5E7EB',
                  color: theme === 'dark' ? '#F9FAFB' : '#111827'
                }}
                formatter={(value) => [`${value}%`, '']}
              />
              <Legend 
                formatter={(value) => <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Regional Performance */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Regional Performance</h2>
        
        {/* Regional Revenue Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Total Revenue by Region</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={regionalPerformanceData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
              <XAxis 
                type="number"
                tick={{ fill: theme === 'dark' ? '#9CA3AF' : '#4B5563' }}
                axisLine={{ stroke: theme === 'dark' ? '#374151' : '#E5E7EB' }}
                tickFormatter={(value) => `GHS ${Number(value).toLocaleString()}`}
              />
              <YAxis 
                type="category"
                dataKey="region"
                width={120}
                tick={{ fill: theme === 'dark' ? '#9CA3AF' : '#4B5563', fontSize: 12 }}
                axisLine={{ stroke: theme === 'dark' ? '#374151' : '#E5E7EB' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: theme === 'dark' ? '#1F2937' : '#FFFFFF',
                  borderColor: theme === 'dark' ? '#374151' : '#E5E7EB',
                  color: theme === 'dark' ? '#F9FAFB' : '#111827'
                }}
                formatter={(value) => [`GHS ${Number(value).toLocaleString()}`, 'Revenue']}
              />
              <Bar dataKey="revenue" fill={theme === 'dark' ? '#60A5FA' : '#3B82F6'} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Regional Data Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Regional Breakdown</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Region
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Total Revenue (GHS)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Businesses
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Collections
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {regionalPerformanceData.map((data) => (
                  <tr key={data.region}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span>{data.region}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {data.revenue.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {data.businesses.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {data.collections.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Top Performing Businesses */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Top Performing Businesses</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Business
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Total Payments
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Total Revenue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Last Payment
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {regionalBusinesses
                .map(business => {
                  const businessCollections = regionalCollections.filter(c => c.businessId === business.id);
                  const totalRevenue = businessCollections.reduce((sum, c) => sum + c.amount, 0);
                  const lastPayment = businessCollections.length > 0
                    ? new Date(businessCollections.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0].date).toLocaleDateString()
                    : 'N/A';
                  return {
                    ...business,
                    totalPayments: businessCollections.length,
                    totalRevenue,
                    lastPayment
                  };
                })
                .sort((a, b) => b.totalRevenue - a.totalRevenue)
                .slice(0, 10)
                .map(business => (
                  <tr key={business.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{business.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{business.ownerName}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                        {business.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {business.totalPayments}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600 dark:text-green-400">
                      GHS {business.totalRevenue.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {business.lastPayment}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}