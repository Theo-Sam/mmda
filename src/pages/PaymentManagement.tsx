import React, { useState } from 'react';
import {
  Calendar,
  Receipt,
  Download,
  Filter,
  Search,
  FileText,
  Eye,
  Printer,
  CheckCircle,
  Clock,
  X,
  RefreshCw,
  DollarSign,
  BarChart3,
  TrendingUp
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

interface ReceiptRecord {
  id: string;
  receiptId: string;
  businessId: string;
  revenueTypeId: string;
  amount: number;
  date: string;
  status: 'paid' | 'pending';
  paymentMethod: string;
  collectorId: string;
}

export default function PaymentManagement() {
  const { collections, businesses, revenueTypes, loading, error } = useApp();
  const { user } = useAuth();
  const [dateRange, setDateRange] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterYear, setFilterYear] = useState('all');
  const [selectedReceipt, setSelectedReceipt] = useState<ReceiptRecord | null>(null);
  const [isDownloading, setIsDownloading] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'history' | 'receipts'>('history');
  const { theme } = useTheme();

  // For business owners, show only their payments
  const userBusinesses = businesses.filter(b => b.ownerName === user?.name);
  const userPayments = collections.filter(c =>
    userBusinesses.some(b => b.id === c.businessId)
  );

  const filteredPayments = userPayments.filter(payment => {
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;

    if (dateRange === 'all') return matchesStatus;

    const paymentDate = new Date(payment.date);
    const now = new Date();

    switch (dateRange) {
      case 'this-month':
        return paymentDate.getMonth() === now.getMonth() &&
          paymentDate.getFullYear() === now.getFullYear() && matchesStatus;
      case 'last-month':
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1);
        return paymentDate.getMonth() === lastMonth.getMonth() &&
          lastMonth.getFullYear() === lastMonth.getFullYear() && matchesStatus;
      case 'this-year':
        return paymentDate.getFullYear() === now.getFullYear() && matchesStatus;
      default:
        return matchesStatus;
    }
  });

  // Apply district-based filtering for receipts (using collections data)
  const districtReceipts = user ? collections.filter(c =>
    userBusinesses.some(b => b.id === c.businessId)
  ) : collections;

  const filteredReceipts = districtReceipts.filter(receipt => {
    const revenueType = revenueTypes.find(rt => rt.id === receipt.revenueTypeId);
    const matchesSearch = receipt.receiptId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (revenueType?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || receipt.status === filterStatus;
    const matchesYear = filterYear === 'all' || new Date(receipt.date).getFullYear().toString() === filterYear;
    return matchesSearch && matchesStatus && matchesYear;
  });

  const totalPaid = filteredPayments
    .filter(p => p.status === 'paid')
    .reduce((sum, payment) => sum + payment.amount, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      case 'pending': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />;
      default: return <Clock className="w-4 h-4 text-gray-600 dark:text-gray-400" />;
    }
  };

  const handleDownloadReceipt = (receiptId: string) => {
    // Mock receipt download
    alert(`Downloading receipt: ${receiptId}`);
  };

  const handleDownload = async (receipt: ReceiptRecord, format: 'pdf' | 'print') => {
    setIsDownloading(receipt.id);

    // Simulate download
    await new Promise(resolve => setTimeout(resolve, 2000));

    if (format === 'pdf') {
      alert(`Receipt ${receipt.receiptId} downloaded as PDF`);
    } else {
      alert(`Receipt ${receipt.receiptId} sent to printer`);
    }

    setIsDownloading(null);
  };

  const handleBulkDownload = async () => {
    setIsDownloading('bulk');

    // Simulate bulk download
    await new Promise(resolve => setTimeout(resolve, 3000));

    const paidReceipts = filteredReceipts.filter(r => r.status === 'paid');
    alert(`Downloaded ${paidReceipts.length} receipts as ZIP file`);

    setIsDownloading(null);
  };

  // Get unique years for filter
  const availableYears = Array.from(new Set(collections.map(r => new Date(r.date).getFullYear())));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Payment Management</h1>
          <p className="text-gray-600 dark:text-gray-400">View payment history and manage receipts</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Paid</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">{formatCurrency(totalPaid)}</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('history')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'history'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
            >
              <Receipt className="w-4 h-4 inline mr-2" />
              Payment History
            </button>
            <button
              onClick={() => setActiveTab('receipts')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'receipts'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
            >
              <FileText className="w-4 h-4 inline mr-2" />
              Receipts & Downloads
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Payment History Tab */}
          {activeTab === 'history' && (
            <div className="space-y-6">
              {/* Filters */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <div className="flex items-center space-x-4">
                  <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="all">All Time</option>
                    <option value="this-month">This Month</option>
                    <option value="last-month">Last Month</option>
                    <option value="this-year">This Year</option>
                  </select>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="all">All Status</option>
                    <option value="paid">Paid</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <Filter className="w-4 h-4" />
                  <span>{filteredPayments.length} payments found</span>
                </div>
              </div>

              {/* Payment Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Payments</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">{filteredPayments.length}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <DollarSign className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Amount</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">{formatCurrency(totalPaid)}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                      <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">This Month</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">
                        {formatCurrency(filteredPayments.filter(p => {
                          const paymentDate = new Date(p.date);
                          const now = new Date();
                          return paymentDate.getMonth() === now.getMonth() &&
                            paymentDate.getFullYear() === now.getFullYear() &&
                            p.status === 'paid';
                        }).reduce((sum, payment) => sum + payment.amount, 0))}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment List */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Payment Records</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Receipt ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Revenue Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {filteredPayments.map((payment) => {
                        const revenueType = revenueTypes.find(rt => rt.id === payment.revenueTypeId);
                        return (
                          <tr key={payment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                              {new Date(payment.date).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                              {payment.receiptId}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                              {revenueType?.name || 'Unknown'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                              {formatCurrency(payment.amount)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                                {getStatusIcon(payment.status)}
                                <span className="ml-1 capitalize">{payment.status}</span>
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                              <button
                                onClick={() => handleDownloadReceipt(payment.receiptId)}
                                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                              >
                                <Download className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Receipts Tab */}
          {activeTab === 'receipts' && (
            <div className="space-y-6">
              {/* Search and Filters */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search receipts..."
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
                    <option value="paid">Paid</option>
                    <option value="pending">Pending</option>
                  </select>
                  <select
                    value={filterYear}
                    onChange={(e) => setFilterYear(e.target.value)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="all">All Years</option>
                    {availableYears.map(year => (
                      <option key={year} value={year.toString()}>{year}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleBulkDownload}
                    disabled={isDownloading === 'bulk'}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isDownloading === 'bulk' ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Download className="w-4 h-4" />
                    )}
                    <span className="ml-2">Bulk Download</span>
                  </button>
                </div>
              </div>

              {/* Receipts List */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Receipts & Documents</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Receipt ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Revenue Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {filteredReceipts.map((receipt) => (
                        <tr key={receipt.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {receipt.receiptId}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {revenueTypes.find(rt => rt.id === receipt.revenueTypeId)?.name || 'Unknown'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {formatCurrency(receipt.amount)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {new Date(receipt.date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(receipt.status)}`}>
                              {getStatusIcon(receipt.status)}
                              <span className="ml-1 capitalize">{receipt.status}</span>
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleDownload(receipt, 'pdf')}
                                disabled={isDownloading === receipt.id}
                                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 disabled:opacity-50"
                                title="Download PDF"
                              >
                                {isDownloading === receipt.id ? (
                                  <RefreshCw className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Download className="w-4 h-4" />
                                )}
                              </button>
                              <button
                                onClick={() => handleDownload(receipt, 'print')}
                                disabled={isDownloading === receipt.id}
                                className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 disabled:opacity-50"
                                title="Print"
                              >
                                <Printer className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setSelectedReceipt(receipt)}
                                className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300"
                                title="View Details"
                              >
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
            </div>
          )}
        </div>
      </div>

      {/* Receipt Details Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Receipt Details</h3>
                <button
                  onClick={() => setSelectedReceipt(null)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Receipt ID</label>
                  <p className="text-sm text-gray-900 dark:text-white">{selectedReceipt.receiptId}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Revenue Type</label>
                  <p className="text-sm text-gray-900 dark:text-white">{revenueTypes.find(rt => rt.id === selectedReceipt.revenueTypeId)?.name || 'Unknown'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Amount</label>
                  <p className="text-sm text-gray-900 dark:text-white">{formatCurrency(selectedReceipt.amount)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
                  <p className="text-sm text-gray-900 dark:text-white">{new Date(selectedReceipt.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedReceipt.status)}`}>
                    {getStatusIcon(selectedReceipt.status)}
                    <span className="ml-1 capitalize">{selectedReceipt.status}</span>
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Payment Method</label>
                  <p className="text-sm text-gray-900 dark:text-white">{selectedReceipt.paymentMethod}</p>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setSelectedReceipt(null)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Close
                </button>
                <button
                  onClick={() => handleDownload(selectedReceipt, 'pdf')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Download className="w-4 h-4 inline mr-2" />
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
