import React, { useState } from 'react';
import {
  BarChart3,
  Download,
  Filter,
  Search,
  Eye,
  TrendingUp,
  TrendingDown,
  MapPin,
  Building2,
  DollarSign,
  Shield,
  Users,
  Calendar,
  FileText,
  AlertTriangle,
  CheckCircle,
  Target,
  BarChart,
  PieChart,
  Activity,
  Globe,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart as RechartsPieChart, Pie, Cell, Legend } from 'recharts';
import { ghanaRegions, mmdaByRegion } from '../../utils/ghanaRegions';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { filterByJurisdiction } from '../../utils/filterByJurisdiction';
import { useApp } from '../../contexts/AppContext';

interface MMDAData {
  id: string;
  name: string;
  code: string;
  region: string;
  revenue: number;
  target: number;
  businesses: number;
  compliance: number;
  growth: number;
  lastUpdate: string;
  status: 'excellent' | 'good' | 'average' | 'poor';
}

export default function MMDAReports() {
  const { mmdas, nationalRevenueOversight, regionalOversightData, loading, error } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRegion, setFilterRegion] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedMMDA, setSelectedMMDA] = useState<MMDAData | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState('this-year');
  const { theme } = useTheme();
  const { user } = useAuth();

  const districtMMDAs = user ? filterByJurisdiction(user, mmdas, 'name') : mmdas;
  const filteredMMDAs = districtMMDAs.filter(mmda => {
    const matchesSearch = mmda.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mmda.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = filterRegion === 'all' || mmda.region === filterRegion;
    const matchesStatus = filterStatus === 'all' || mmda.status === filterStatus;
    return matchesSearch && matchesRegion && matchesStatus;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      case 'good': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300';
      case 'average': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
      case 'poor': return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent': return <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />;
      case 'good': return <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      case 'average': return <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />;
      case 'poor': return <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />;
      default: return <AlertTriangle className="w-4 h-4 text-gray-600 dark:text-gray-400" />;
    }
  };

  const exportData = (format: 'csv' | 'pdf' | 'excel') => {
    alert(`Exporting MMDA data as ${format.toUpperCase()}...`);
  };

  // Calculate oversight metrics
  const currentMonthData = nationalRevenueOversight[nationalRevenueOversight.length - 1];
  const previousMonthData = nationalRevenueOversight[nationalRevenueOversight.length - 2];
  
  const totalAnnualRevenue = nationalRevenueOversight.reduce((sum, month) => sum + month.actual, 0);
  const totalAnnualTarget = nationalRevenueOversight.reduce((sum, month) => sum + month.target, 0);
  const annualAchievement = (totalAnnualRevenue / totalAnnualTarget) * 100;
  
  const monthlyGrowth = previousMonthData ? 
    ((currentMonthData.actual - previousMonthData.actual) / previousMonthData.actual) * 100 : 0;
  
  const mmdasBelowTarget = currentMonthData?.mmdasBelowTarget || 0;
  const mmdasOnTarget = currentMonthData?.mmdasOnTarget || 0;
  
  const getPerformanceColor = (achievement: number) => {
    if (achievement >= 110) return 'text-green-600 dark:text-green-400';
    if (achievement >= 100) return 'text-blue-600 dark:text-blue-400';
    if (achievement >= 90) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getPerformanceIcon = (achievement: number) => {
    if (achievement >= 110) return <ArrowUp className="w-4 h-4 text-green-600 dark:text-green-400" />;
    if (achievement >= 100) return <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
    if (achievement >= 90) return <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />;
    return <TrendingDown className="w-4 h-4 text-red-600 dark:text-red-400" />;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">MMDA Reports</h1>
          <p className="text-gray-600 dark:text-gray-400">Revenue per district and compliance rates</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => exportData('csv')}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => exportData('pdf')}
            className="flex items-center space-x-2 bg-blue-600 dark:bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600"
          >
            <FileText className="w-4 h-4" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-blue-900 dark:text-blue-100">MMDA Revenue Oversight Summary</h3>
            <p className="text-blue-700 dark:text-blue-300">National performance overview for {new Date().getFullYear()}</p>
          </div>
          <div className="p-3 bg-blue-100 dark:bg-blue-800 rounded-lg">
            <Globe className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
              {annualAchievement.toFixed(1)}%
            </p>
            <p className="text-sm text-blue-700 dark:text-blue-300">Annual Target Achievement</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {formatCurrency(totalAnnualRevenue)}
            </p>
            <p className="text-sm text-green-700 dark:text-green-300">Total Revenue Collected</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {mmdasOnTarget}/{mmdas.length}
            </p>
            <p className="text-sm text-purple-700 dark:text-purple-300">MMDAs Meeting Targets</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {monthlyGrowth.toFixed(1)}%
            </p>
            <p className="text-sm text-orange-700 dark:text-orange-300">Monthly Growth Rate</p>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Registered MMDAs</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{mmdas.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Annual Revenue</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(totalAnnualRevenue)}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Target: {formatCurrency(totalAnnualTarget)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <Target className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Target Achievement</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {annualAchievement.toFixed(1)}%
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {mmdasBelowTarget} MMDAs below target
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Monthly Growth</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {monthlyGrowth.toFixed(1)}%
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                vs previous month
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* National Revenue vs Target Monitoring */}
      <div className="space-y-6">
        {/* Header with Period Selector */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">National Revenue vs Target Monitoring</h3>
            <p className="text-gray-600 dark:text-gray-400">Comprehensive oversight of MMDA revenue performance across Ghana</p>
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
            >
              <option value="this-year">This Year</option>
              <option value="last-year">Last Year</option>
              <option value="custom">Custom Range</option>
            </select>
          <button
            onClick={() => exportData('excel')}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600"
          >
              <Download className="w-4 h-4" />
              <span>Export Data</span>
          </button>
        </div>
        </div>

        {/* Key Performance Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Current Month Achievement</p>
                <p className={`text-2xl font-bold ${getPerformanceColor(currentMonthData?.achievement || 0)}`}>
                  {currentMonthData?.achievement?.toFixed(1)}%
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {formatCurrency(currentMonthData?.actual || 0)} / {formatCurrency(currentMonthData?.target || 0)}
                </p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                {getPerformanceIcon(currentMonthData?.achievement || 0)}
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">MMDAs Performance</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {mmdasOnTarget}/{mmdas.length}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {mmdasBelowTarget} below target
                </p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Monthly Variance</p>
                <p className={`text-2xl font-bold ${currentMonthData?.variance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {currentMonthData?.variance >= 0 ? '+' : ''}{formatCurrency(currentMonthData?.variance || 0)}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  vs target
                </p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Activity className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Revenue vs Target Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Monthly Revenue Performance</h4>
            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>Actual Revenue</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                <span>Target</span>
              </div>
            </div>
        </div>
        <ResponsiveContainer width="100%" height={400}>
            <LineChart data={nationalRevenueOversight}>
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
                formatter={(value, name) => [
                  formatCurrency(value as number), 
                  name === 'actual' ? 'Actual Revenue' : 'Target'
                ]}
                labelFormatter={(label) => `${label} 2024`}
              contentStyle={{
                backgroundColor: theme === 'dark' ? '#1F2937' : '#FFFFFF',
                borderColor: theme === 'dark' ? '#374151' : '#E5E7EB',
                color: theme === 'dark' ? '#F9FAFB' : '#111827'
              }}
            />
              <Line 
                type="monotone" 
                dataKey="target" 
                stroke={theme === 'dark' ? '#94A3B8' : '#94A3B8'} 
                strokeDasharray="5 5" 
                name="Target"
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey="actual" 
                stroke={theme === 'dark' ? '#60A5FA' : '#3B82F6'} 
                strokeWidth={3} 
                name="Actual Revenue"
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
              />
          </LineChart>
        </ResponsiveContainer>
        </div>

        {/* Regional Performance Overview */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Regional Performance Overview</h4>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Target achievement by region
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ResponsiveContainer width="100%" height={300}>
              <RechartsBarChart data={regionalOversightData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                <XAxis 
                  dataKey="region" 
                  tick={{ fill: theme === 'dark' ? '#9CA3AF' : '#4B5563' }}
                  axisLine={{ stroke: theme === 'dark' ? '#374151' : '#E5E7EB' }}
                />
                <YAxis 
                  tickFormatter={(value) => `${value}%`}
                  tick={{ fill: theme === 'dark' ? '#9CA3AF' : '#4B5563' }}
                  axisLine={{ stroke: theme === 'dark' ? '#374151' : '#E5E7EB' }}
                />
                <Tooltip
                  formatter={(value, name) => [
                    `${value}%`, 
                    name === 'achievement' ? 'Target Achievement' : 'Compliance Rate'
                  ]}
                  contentStyle={{
                    backgroundColor: theme === 'dark' ? '#1F2937' : '#FFFFFF',
                    borderColor: theme === 'dark' ? '#374151' : '#E5E7EB',
                    color: theme === 'dark' ? '#F9FAFB' : '#111827'
                  }}
                />
                <Bar 
                  dataKey="achievement" 
                  fill={theme === 'dark' ? '#60A5FA' : '#3B82F6'} 
                  radius={[4, 4, 0, 0]}
                />
              </RechartsBarChart>
            </ResponsiveContainer>
            
            <div className="space-y-4">
              <h5 className="font-medium text-gray-900 dark:text-white">Top Performing Regions</h5>
              {regionalOversightData
                .sort((a, b) => b.achievement - a.achievement)
                .slice(0, 5)
                .map((region, index) => (
                  <div key={region.region} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        index === 0 ? 'bg-yellow-500 text-white' :
                        index === 1 ? 'bg-gray-400 text-white' :
                        index === 2 ? 'bg-orange-500 text-white' : 'bg-gray-300 text-gray-700'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{region.region}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{region.mmdas} MMDAs</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${getPerformanceColor(region.achievement)}`}>
                        {region.achievement.toFixed(1)}%
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {formatCurrency(region.revenue)}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Performance Alerts & Insights */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Performance Alerts & Insights</h4>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {mmdasBelowTarget} MMDAs need attention
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Alert Summary */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              <div>
                <p className="font-medium text-yellow-800 dark:text-yellow-200">Performance Alert</p>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  {mmdasBelowTarget} MMDAs are below their revenue targets this month
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <div>
                <p className="font-medium text-blue-800 dark:text-blue-200">Growth Trend</p>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  National revenue grew by {monthlyGrowth.toFixed(1)}% compared to last month
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              <div>
                <p className="font-medium text-green-800 dark:text-green-200">Target Achievement</p>
                <p className="text-sm text-green-700 dark:text-green-300">
                  {mmdasOnTarget} MMDAs are meeting or exceeding their targets
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-4">
            <h5 className="font-medium text-gray-900 dark:text-white">Quick Actions</h5>
            <div className="grid grid-cols-1 gap-3">
              <button className="flex items-center justify-between p-3 text-left bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors">
                <div className="flex items-center space-x-3">
                  <Eye className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span className="font-medium text-gray-900 dark:text-white">View Detailed Reports</span>
                </div>
                <ArrowUp className="w-4 h-4 text-gray-400" />
              </button>
              
              <button className="flex items-center justify-between p-3 text-left bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors">
                <div className="flex items-center space-x-3">
                  <Download className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <span className="font-medium text-gray-900 dark:text-white">Export Performance Data</span>
                </div>
                <ArrowUp className="w-4 h-4 text-gray-400" />
              </button>
              
              <button className="flex items-center justify-between p-3 text-left bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                  <span className="font-medium text-gray-900 dark:text-white">Review Underperforming MMDAs</span>
                </div>
                <ArrowUp className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Performance Breakdown */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Monthly Performance Breakdown</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">Detailed monthly revenue vs target analysis</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Month
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Target
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actual Revenue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Variance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Achievement %
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  MMDAs on Target
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {nationalRevenueOversight.map((month) => (
                <tr key={month.month} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{month.month} 2024</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {formatCurrency(month.target)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatCurrency(month.actual)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-medium ${
                      month.variance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`}>
                      {month.variance >= 0 ? '+' : ''}{formatCurrency(month.variance)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-medium ${getPerformanceColor(month.achievement)}`}>
                      {month.achievement.toFixed(1)}%
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {month.mmdasOnTarget}/{mmdas.length}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      month.achievement >= 110 ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' :
                      month.achievement >= 100 ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300' :
                      month.achievement >= 90 ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300' :
                      'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                    }`}>
                      {month.achievement >= 110 ? 'Excellent' :
                       month.achievement >= 100 ? 'Good' :
                       month.achievement >= 90 ? 'Average' : 'Poor'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Search MMDAs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <select
              value={filterRegion}
              onChange={(e) => setFilterRegion(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Regions</option>
              {ghanaRegions.map(region => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Performance</option>
              <option value="excellent">Excellent</option>
              <option value="good">Good</option>
              <option value="average">Average</option>
              <option value="poor">Poor</option>
            </select>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <Filter className="w-4 h-4" />
            <span>{filteredMMDAs.length} MMDAs found</span>
          </div>
        </div>
      </div>

      {/* MMDA Performance Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Individual MMDA Performance</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">Detailed performance metrics for each MMDA</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  MMDA
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Revenue Performance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Businesses
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Compliance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Growth
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
              {filteredMMDAs.map((mmda) => (
                <tr key={mmda.id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {mmda.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {mmda.code} • {mmda.region}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {formatCurrency(mmda.revenue)}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Target: {formatCurrency(mmda.target)}
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
                        <div
                          className={`h-2 rounded-full ${mmda.revenue >= mmda.target ? 'bg-green-600 dark:bg-green-500' : 'bg-yellow-600 dark:bg-yellow-500'
                            }`}
                          style={{ width: `${Math.min((mmda.revenue / mmda.target) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-1">
                      <Building2 className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                      <span className="text-sm text-gray-900 dark:text-white">{mmda.businesses.toLocaleString()}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-900 dark:text-white">{mmda.compliance}%</span>
                      <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${mmda.compliance >= 95 ? 'bg-green-600 dark:bg-green-500' :
                            mmda.compliance >= 85 ? 'bg-yellow-600 dark:bg-yellow-500' : 'bg-red-600 dark:bg-red-500'
                            }`}
                          style={{ width: `${mmda.compliance}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-1">
                      {mmda.growth >= 0 ? (
                        <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-600 dark:text-red-400" />
                      )}
                      <span className={`text-sm font-medium ${mmda.growth >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                        }`}>
                        {mmda.growth >= 0 ? '+' : ''}{mmda.growth}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(mmda.status)}
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(mmda.status)}`}>
                        {mmda.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setSelectedMMDA(mmda)}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => exportData('pdf')}
                        className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300"
                        title="Export Data"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MMDA Details Modal */}
      {selectedMMDA && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">MMDA Performance Details</h3>
              <button
                onClick={() => setSelectedMMDA(null)}
                className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400"
              >
                ×
              </button>
            </div>

            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">MMDA Name</label>
                  <p className="text-sm text-gray-900 dark:text-white">{selectedMMDA.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Code</label>
                  <p className="text-sm text-gray-900 dark:text-white">{selectedMMDA.code}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Region</label>
                  <p className="text-sm text-gray-900 dark:text-white">{selectedMMDA.region}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(selectedMMDA.status)}
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(selectedMMDA.status)}`}>
                      {selectedMMDA.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Performance Metrics */}
              <div>
                <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">Performance Metrics</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="text-sm font-medium text-green-900 dark:text-green-300">Revenue</span>
                    </div>
                    <p className="text-lg font-bold text-green-900 dark:text-green-300 mt-1">
                      {formatCurrency(selectedMMDA.revenue)}
                    </p>
                    <p className="text-xs text-green-700 dark:text-green-400">
                      Target: {formatCurrency(selectedMMDA.target)}
                    </p>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      <span className="text-sm font-medium text-blue-900 dark:text-blue-300">Businesses</span>
                    </div>
                    <p className="text-lg font-bold text-blue-900 dark:text-blue-300 mt-1">
                      {selectedMMDA.businesses.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Shield className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                      <span className="text-sm font-medium text-yellow-900 dark:text-yellow-300">Compliance</span>
                    </div>
                    <p className="text-lg font-bold text-yellow-900 dark:text-yellow-300 mt-1">
                      {selectedMMDA.compliance}%
                    </p>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      <span className="text-sm font-medium text-purple-900 dark:text-purple-300">Growth</span>
                    </div>
                    <p className="text-lg font-bold text-purple-900 dark:text-purple-300 mt-1">
                      {selectedMMDA.growth >= 0 ? '+' : ''}{selectedMMDA.growth}%
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setSelectedMMDA(null)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Close
                </button>
                <button
                  onClick={() => exportData('pdf')}
                  className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600"
                >
                  Export MMDA Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Collector Performance Section */}
      {user?.role === 'monitoring_body' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Collector Performance & Analytics</h3>
            <p className="text-gray-600 dark:text-gray-400">Monitor collector performance across all MMDAs</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-md font-semibold text-blue-900 dark:text-blue-100">Performance Overview</h4>
                  <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">View national collector performance metrics</p>
                <button className="w-full px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                  View Performance
                </button>
              </div>

              <div className="p-4 bg-green-50 dark:bg-green-900/30 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-md font-semibold text-green-900 dark:text-green-100">Efficiency Analysis</h4>
                  <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <p className="text-sm text-green-800 dark:text-green-200 mb-3">Analyze collection efficiency and trends</p>
                <button className="w-full px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">
                  View Analysis
                </button>
              </div>

              <div className="p-4 bg-purple-50 dark:bg-purple-900/30 rounded-lg border border-purple-200 dark:border-purple-800">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-md font-semibold text-purple-900 dark:text-purple-100">Comparative Report</h4>
                  <BarChart3 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <p className="text-sm text-purple-800 dark:text-purple-200 mb-3">Compare collector performance across MMDAs</p>
                <button className="w-full px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm">
                  Generate Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Reports & Data Export Section */}
      {user?.role === 'monitoring_body' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">National Reports & Data Exports</h3>
            <p className="text-gray-600 dark:text-gray-400">Generate comprehensive reports and export data for analysis</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-md font-semibold text-blue-900 dark:text-blue-100">Revenue Reports</h4>
                  <DollarSign className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">National revenue summary and trends</p>
                <button className="w-full px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                  <Download className="w-4 h-4 inline mr-1" />
                  Export PDF
                </button>
              </div>

              <div className="p-4 bg-green-50 dark:bg-green-900/30 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-md font-semibold text-green-900 dark:text-green-100">Performance Data</h4>
                  <Target className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <p className="text-sm text-green-800 dark:text-green-200 mb-3">MMDA and collector performance data</p>
                <button className="w-full px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">
                  <Download className="w-4 h-4 inline mr-1" />
                  Export Excel
                </button>
              </div>

              <div className="p-4 bg-purple-50 dark:bg-purple-900/30 rounded-lg border border-purple-200 dark:border-purple-800">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-md font-semibold text-purple-900 dark:text-purple-100">Compliance Reports</h4>
                  <Shield className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <p className="text-sm text-purple-800 dark:text-purple-200 mb-3">Compliance and audit findings</p>
                <button className="w-full px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm">
                  <Download className="w-4 h-4 inline mr-1" />
                  Export PDF
                </button>
              </div>

              <div className="p-4 bg-orange-50 dark:bg-orange-900/30 rounded-lg border border-orange-200 dark:border-orange-800">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-md font-semibold text-orange-900 dark:text-orange-100">Custom Reports</h4>
                  <FileText className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                </div>
                <p className="text-sm text-orange-800 dark:text-orange-200 mb-3">Generate custom analytical reports</p>
                <button className="w-full px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm">
                  <Download className="w-4 h-4 inline mr-1" />
                  Custom Export
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}