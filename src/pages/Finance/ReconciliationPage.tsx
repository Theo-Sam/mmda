import React, { useState } from 'react';
import { 
  RefreshCw, 
  CheckCircle, 
  AlertTriangle, 
  Calendar, 
  DollarSign, 
  FileText, 
  Download, 
  Search,
  Filter,
  ArrowRight,
  Clock,
  XCircle,
  Eye,
  BarChart3,
  Calculator
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { filterByJurisdiction } from '../../utils/filterByJurisdiction';
import { useApp } from '../../contexts/AppContext';

interface ReconciliationItem {
  id: string;
  date: string;
  collectorName: string;
  collectorId: string;
  reportedAmount: number;
  actualAmount: number;
  variance: number;
  variancePercentage: number;
  status: 'matched' | 'minor_discrepancy' | 'major_discrepancy' | 'pending';
  notes?: string;
  paymentMethod: string;
  receiptCount: number;
}

export default function ReconciliationPage() {
  const { reconciliationData, loading, error } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDate, setFilterDate] = useState('');
  const [selectedItem, setSelectedItem] = useState<ReconciliationItem | null>(null);
  const [isReconciling, setIsReconciling] = useState(false);
  const { theme } = useTheme();
  const { user } = useAuth();

  const districtReconciliationData = user ? filterByJurisdiction(user, reconciliationData) : reconciliationData;
  const filteredData = districtReconciliationData.filter(item => {
    const matchesSearch = item.collectorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.collectorId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    const matchesDate = !filterDate || item.date === filterDate;
    return matchesSearch && matchesStatus && matchesDate;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'matched': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      case 'minor_discrepancy': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
      case 'major_discrepancy': return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
      case 'pending': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300';
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'matched': return <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />;
      case 'minor_discrepancy': return <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />;
      case 'major_discrepancy': return <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />;
      case 'pending': return <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      default: return <Clock className="w-4 h-4 text-gray-600 dark:text-gray-400" />;
    }
  };

  const getVarianceColor = (variance: number) => {
    if (variance === 0) return 'text-green-600 dark:text-green-400';
    if (variance > 0) return 'text-blue-600 dark:text-blue-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getVarianceIcon = (variance: number) => {
    if (variance === 0) return <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />;
    if (variance > 0) return <ArrowRight className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
    return <ArrowRight className="w-4 h-4 text-red-600 dark:text-red-400 transform rotate-180" />;
  };

  const handleRunReconciliation = async () => {
    setIsReconciling(true);
    // Simulate reconciliation process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Update pending items to random statuses
    const updatedData = reconciliationData.map(item => {
      if (item.status === 'pending') {
        const statuses = ['matched', 'minor_discrepancy', 'major_discrepancy'];
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
        const randomVariance = randomStatus === 'matched' ? 0 : 
                              (randomStatus === 'minor_discrepancy' ? 
                                (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 100) : 
                                (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 500));
        const actualAmount = item.reportedAmount + randomVariance;
        const variancePercentage = (randomVariance / item.reportedAmount) * 100;
        
        return {
          ...item,
          status: randomStatus as any,
          variance: randomVariance,
          actualAmount,
          variancePercentage
        };
      }
      return item;
    });
    
    setIsReconciling(false);
    alert('Reconciliation completed successfully!');
  };

  const handleResolveDiscrepancy = (id: string) => {
    const updatedData = reconciliationData.map(item => 
      item.id === id ? { ...item, status: 'matched', notes: item.notes + ' - Manually resolved' } : item
    );
    setSelectedItem(null);
  };

  // Calculate summary stats
  const totalReported = reconciliationData.reduce((sum, item) => sum + item.reportedAmount, 0);
  const totalActual = reconciliationData.reduce((sum, item) => sum + item.actualAmount, 0);
  const totalVariance = totalActual - totalReported;
  const matchedCount = reconciliationData.filter(item => item.status === 'matched').length;
  const discrepancyCount = reconciliationData.filter(item => 
    item.status === 'minor_discrepancy' || item.status === 'major_discrepancy'
  ).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Financial Reconciliation</h1>
          <p className="text-gray-600 dark:text-gray-400">Verify and reconcile collector payments with system records</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleRunReconciliation}
            disabled={isReconciling}
            className="flex items-center space-x-2 bg-blue-600 dark:bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50"
          >
            {isReconciling ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Calculator className="w-4 h-4" />
            )}
            <span>{isReconciling ? 'Processing...' : 'Run Reconciliation'}</span>
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <DollarSign className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Reported Amount</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{formatCurrency(totalReported)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Calculator className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Actual Amount</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{formatCurrency(totalActual)}</p>
              <p className={`text-sm ${getVarianceColor(totalVariance)}`}>
                {totalVariance >= 0 ? '+' : ''}{formatCurrency(totalVariance)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Matched</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{matchedCount}</p>
              <p className="text-sm text-green-600 dark:text-green-400">
                {Math.round((matchedCount / reconciliationData.length) * 100)}% of total
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Discrepancies</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{discrepancyCount}</p>
              <p className="text-sm text-yellow-600 dark:text-yellow-400">
                Needs attention
              </p>
            </div>
          </div>
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
                placeholder="Search collectors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="matched">Matched</option>
              <option value="minor_discrepancy">Minor Discrepancy</option>
              <option value="major_discrepancy">Major Discrepancy</option>
              <option value="pending">Pending</option>
            </select>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <Filter className="w-4 h-4" />
            <span>{filteredData.length} records found</span>
          </div>
        </div>
      </div>

      {/* Reconciliation Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Collector
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Reported Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actual Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Variance
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
              {filteredData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                      <span className="text-sm text-gray-900 dark:text-white">{new Date(item.date).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{item.collectorName}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">ID: {item.collectorId}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatCurrency(item.reportedAmount)}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {item.receiptCount} receipts
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatCurrency(item.actualAmount)}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                      {item.paymentMethod}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-1">
                      {getVarianceIcon(item.variance)}
                      <span className={`text-sm font-medium ${getVarianceColor(item.variance)}`}>
                        {item.variance > 0 ? '+' : ''}{formatCurrency(item.variance)}
                      </span>
                    </div>
                    <div className={`text-xs ${getVarianceColor(item.variance)}`}>
                      {item.variancePercentage > 0 ? '+' : ''}{item.variancePercentage.toFixed(2)}%
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                      {getStatusIcon(item.status)}
                      <span className="capitalize">{item.status.replace('_', ' ')}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setSelectedItem(item)}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {(item.status === 'minor_discrepancy' || item.status === 'major_discrepancy') && (
                        <button
                          onClick={() => handleResolveDiscrepancy(item.id)}
                          className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300"
                          title="Resolve Discrepancy"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        className="text-purple-600 dark:text-purple-400 hover:text-purple-900 dark:hover:text-purple-300"
                        title="Download Report"
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

      {/* Reconciliation Details Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Reconciliation Details</h3>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
                  <p className="text-sm text-gray-900 dark:text-white">{new Date(selectedItem.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                  <div className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedItem.status)}`}>
                    {getStatusIcon(selectedItem.status)}
                    <span className="capitalize">{selectedItem.status.replace('_', ' ')}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Collector</label>
                  <p className="text-sm text-gray-900 dark:text-white">{selectedItem.collectorName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Collector ID</label>
                  <p className="text-sm text-gray-900 dark:text-white">{selectedItem.collectorId}</p>
                </div>
              </div>

              {/* Financial Details */}
              <div>
                <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">Financial Details</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      <span className="text-sm font-medium text-blue-900 dark:text-blue-300">Reported Amount</span>
                    </div>
                    <p className="text-lg font-bold text-blue-900 dark:text-blue-300 mt-1">
                      {formatCurrency(selectedItem.reportedAmount)}
                    </p>
                    <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">
                      {selectedItem.receiptCount} receipts
                    </p>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Calculator className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="text-sm font-medium text-green-900 dark:text-green-300">Actual Amount</span>
                    </div>
                    <p className="text-lg font-bold text-green-900 dark:text-green-300 mt-1">
                      {formatCurrency(selectedItem.actualAmount)}
                    </p>
                    <p className="text-xs text-green-700 dark:text-green-400 mt-1">
                      Payment method: {selectedItem.paymentMethod}
                    </p>
                  </div>
                </div>
                <div className="mt-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-750">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Variance:</span>
                    <div className="flex items-center space-x-1">
                      {getVarianceIcon(selectedItem.variance)}
                      <span className={`text-sm font-medium ${getVarianceColor(selectedItem.variance)}`}>
                        {selectedItem.variance > 0 ? '+' : ''}{formatCurrency(selectedItem.variance)} 
                        ({selectedItem.variancePercentage > 0 ? '+' : ''}{selectedItem.variancePercentage.toFixed(2)}%)
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selectedItem.notes && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes</label>
                  <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <p className="text-sm text-yellow-800 dark:text-yellow-300">{selectedItem.notes}</p>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setSelectedItem(null)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    alert('Downloading reconciliation report...');
                    setSelectedItem(null);
                  }}
                  className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600"
                >
                  Download Report
                </button>
                {(selectedItem.status === 'minor_discrepancy' || selectedItem.status === 'major_discrepancy') && (
                  <button
                    onClick={() => handleResolveDiscrepancy(selectedItem.id)}
                    className="px-4 py-2 bg-green-600 dark:bg-green-500 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600"
                  >
                    Resolve Discrepancy
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}