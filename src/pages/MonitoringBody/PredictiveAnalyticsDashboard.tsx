import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  PieChart,
  Download,
  RefreshCw,
  Eye,
  Target,
  DollarSign,
  Calendar,
  Activity,
  Zap,
  Brain,
  ChartBar,
  LineChart,
  ArrowUp,
  ArrowDown,
  Info,
  Star,
  Clock,
  AlertCircle
} from 'lucide-react';
import { 
  LineChart as RechartsLineChart, 
  Line, 
  BarChart, 
  Bar, 
  AreaChart,
  Area,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend,
  PieChart as RechartsPieChart,
  Pie,
  Cell
} from 'recharts';
import { useTheme } from '../../contexts/ThemeContext';
import { useApp } from '../../contexts/AppContext';

export default function PredictiveAnalyticsDashboard() {
  const { 
    predictiveAnalytics, 
    nationalRevenueOversight, 
    regionalOversightData,
    advancedInsights 
  } = useApp();
  
  const [selectedTimeframe, setSelectedTimeframe] = useState('6months');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedMetric, setSelectedMetric] = useState('revenue');
  const { theme } = useTheme();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return 'text-green-600 bg-green-100 dark:bg-green-900/30';
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30';
      case 'high': return 'text-red-600 bg-red-100 dark:bg-red-900/30';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-600';
    if (confidence >= 80) return 'text-blue-600';
    if (confidence >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Calculate prediction accuracy based on historical data
  const calculatePredictionAccuracy = () => {
    // This would normally calculate based on historical predictions vs actuals
    return 87.3; // Mock accuracy percentage
  };

  // Generate seasonal analysis data
  const seasonalAnalysisData = [
    { month: 'Jan', actual: 3200000, predicted: 3150000, accuracy: 98.4 },
    { month: 'Feb', actual: 4100000, predicted: 4050000, accuracy: 98.8 },
    { month: 'Mar', actual: 3800000, predicted: 3750000, accuracy: 98.7 },
    { month: 'Apr', actual: 4500000, predicted: 4400000, accuracy: 97.8 },
    { month: 'May', actual: 5200000, predicted: 5100000, accuracy: 98.1 },
    { month: 'Jun', actual: 4800000, predicted: 4700000, accuracy: 97.9 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Predictive Analytics Dashboard</h2>
            <p className="text-gray-600 dark:text-gray-400">
              AI-powered revenue predictions, risk assessments, and trend analysis
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800">
              <RefreshCw className="w-5 h-5" />
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Export Report</span>
            </button>
          </div>
        </div>

        {/* Prediction Accuracy Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 dark:bg-green-800 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-green-800 dark:text-green-200">Prediction Accuracy</p>
                <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                  {calculatePredictionAccuracy()}%
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-lg">
                <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-800 dark:text-blue-200">Growth Forecast</p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">+12.8%</p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-800 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Risk Alerts</p>
                <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">3</p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-800 rounded-lg">
                <Brain className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-purple-800 dark:text-purple-200">AI Confidence</p>
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">94.2%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Predictions Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Revenue Predictions (Next 6 Months)</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              AI-powered revenue forecasting with confidence intervals
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
            >
              <option value="3months">3 Months</option>
              <option value="6months">6 Months</option>
              <option value="12months">12 Months</option>
            </select>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={400}>
          <RechartsLineChart data={predictiveAnalytics}>
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
                name === 'predictedRevenue' ? 'Predicted Revenue' : 'Confidence'
              ]}
              labelFormatter={(label) => `${label}`}
              contentStyle={{
                backgroundColor: theme === 'dark' ? '#1F2937' : '#FFFFFF',
                borderColor: theme === 'dark' ? '#374151' : '#E5E7EB',
                color: theme === 'dark' ? '#F9FAFB' : '#111827'
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="predictedRevenue" 
              stroke="#3B82F6" 
              strokeWidth={3} 
              name="Predicted Revenue"
              dot={{ fill: '#3B82F6', strokeWidth: 2, r: 5 }}
            />
            <Line 
              type="monotone" 
              dataKey="confidence" 
              stroke="#10B981" 
              strokeWidth={2} 
              name="Confidence %"
              strokeDasharray="5 5"
              yAxisId={1}
            />
          </RechartsLineChart>
        </ResponsiveContainer>

        {/* Prediction Factors */}
        <div className="mt-6">
          <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-3">Key Prediction Factors</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {predictiveAnalytics.map((prediction, index) => (
              <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-medium text-gray-900 dark:text-white">{prediction.month}</h5>
                  <span className={`px-2 py-1 text-xs rounded-full ${getRiskColor(prediction.riskLevel)}`}>
                    {prediction.riskLevel} Risk
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {formatCurrency(prediction.predictedRevenue)}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Confidence: <span className={`font-medium ${getConfidenceColor(prediction.confidence)}`}>
                    {prediction.confidence}%
                  </span>
                </p>
                <div className="space-y-1">
                  {prediction.factors.map((factor, factorIndex) => (
                    <div key={factorIndex} className="flex items-center space-x-2 text-xs text-gray-600 dark:text-gray-400">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                      <span className="capitalize">{factor}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Risk Assessment Matrix */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Risk Assessment Matrix</h3>
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Low Risk</span>
            <div className="w-3 h-3 bg-yellow-500 rounded-full ml-3"></div>
            <span>Medium Risk</span>
            <div className="w-3 h-3 bg-red-500 rounded-full ml-3"></div>
            <span>High Risk</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Risk by Region */}
          <div>
            <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4">Risk by Region</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={regionalOversightData}>
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
                  formatter={(value) => [`${value}%`, 'Achievement']}
                  contentStyle={{
                    backgroundColor: theme === 'dark' ? '#1F2937' : '#FFFFFF',
                    borderColor: theme === 'dark' ? '#374151' : '#E5E7EB',
                    color: theme === 'dark' ? '#F9FAFB' : '#111827'
                  }}
                />
                <Bar 
                  dataKey="achievement" 
                  fill={(entry) => {
                    if (entry.achievement >= 110) return '#10B981'; // Green
                    if (entry.achievement >= 100) return '#3B82F6'; // Blue
                    if (entry.achievement >= 90) return '#F59E0B'; // Yellow
                    return '#EF4444'; // Red
                  }}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Risk Distribution */}
          <div>
            <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4">Risk Distribution</h4>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={[
                    { name: 'Low Risk', value: 6, color: '#10B981' },
                    { name: 'Medium Risk', value: 3, color: '#F59E0B' },
                    { name: 'High Risk', value: 1, color: '#EF4444' }
                  ]}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {[
                    { name: 'Low Risk', value: 6, color: '#10B981' },
                    { name: 'Medium Risk', value: 3, color: '#F59E0B' },
                    { name: 'High Risk', value: 1, color: '#EF4444' }
                  ].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Seasonal Analysis */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Seasonal Pattern Analysis</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Historical accuracy of predictions vs actual revenue
            </p>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={seasonalAnalysisData}>
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
                name === 'actual' ? 'Actual Revenue' : 'Predicted Revenue'
              ]}
              contentStyle={{
                backgroundColor: theme === 'dark' ? '#1F2937' : '#FFFFFF',
                borderColor: theme === 'dark' ? '#374151' : '#E5E7EB',
                color: theme === 'dark' ? '#F9FAFB' : '#111827'
              }}
            />
            <Legend />
            <Area 
              type="monotone" 
              dataKey="actual" 
              stackId="1"
              stroke="#10B981" 
              fill="#10B981" 
              fillOpacity={0.6}
              name="Actual Revenue"
            />
            <Area 
              type="monotone" 
              dataKey="predicted" 
              stackId="2"
              stroke="#3B82F6" 
              fill="#3B82F6" 
              fillOpacity={0.4}
              name="Predicted Revenue"
            />
          </AreaChart>
        </ResponsiveContainer>

        {/* Accuracy Metrics */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {seasonalAnalysisData.reduce((sum, item) => sum + item.accuracy, 0) / seasonalAnalysisData.length}%
            </p>
            <p className="text-sm text-green-700 dark:text-green-300">Average Prediction Accuracy</p>
          </div>
          <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {seasonalAnalysisData.length}
            </p>
            <p className="text-sm text-blue-700 dark:text-blue-300">Months Analyzed</p>
          </div>
          <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {seasonalAnalysisData.filter(item => item.accuracy >= 98).length}
            </p>
            <p className="text-sm text-purple-700 dark:text-purple-300">High Accuracy Predictions</p>
          </div>
        </div>
      </div>

      {/* AI Insights and Recommendations */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">AI Insights & Recommendations</h3>
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <Zap className="w-4 h-4 text-yellow-500" />
            <span>Powered by Machine Learning</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {advancedInsights.map((insight) => (
            <div key={insight.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className={`p-2 rounded-lg ${
                    insight.type === 'trend' ? 'bg-blue-100 dark:bg-blue-900/30' :
                    insight.type === 'correlation' ? 'bg-green-100 dark:bg-green-900/30' :
                    insight.type === 'anomaly' ? 'bg-yellow-100 dark:bg-yellow-900/30' :
                    'bg-red-100 dark:bg-red-900/30'
                  }`}>
                    {insight.type === 'trend' && <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                    {insight.type === 'correlation' && <BarChart3 className="w-4 h-4 text-green-600 dark:text-green-400" />}
                    {insight.type === 'anomaly' && <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />}
                    {insight.type === 'risk' && <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />}
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">{insight.title}</h4>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  insight.impact === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                  insight.impact === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                  'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                }`}>
                  {insight.impact} Impact
                </span>
              </div>
              
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{insight.description}</p>
              
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Confidence: <span className={`font-medium ${getConfidenceColor(insight.confidence)}`}>
                    {insight.confidence}%
                  </span>
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  <Clock className="w-3 h-3 inline mr-1" />
                  Just now
                </span>
              </div>

              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">Recommendation:</p>
                <p className="text-sm text-blue-700 dark:text-blue-300">{insight.recommendation}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
