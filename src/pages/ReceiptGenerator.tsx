import React, { useState } from 'react';
import { 
  Download, 
  Printer, 
  Search, 
  Filter, 
  Calendar, 
  Receipt, 
  Building2, 
  DollarSign,
  User,
  FileText,
  Eye,
  RefreshCw
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

export default function ReceiptGenerator() {
  const { collections, businesses, revenueTypes } = useApp();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterBusiness, setFilterBusiness] = useState('');
  const [selectedReceipt, setSelectedReceipt] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState<string | null>(null);
  const { theme } = useTheme();

  // Get collector's collections
  const collectorCollections = collections.filter(c => c.collectorId === user?.id);

  // Filter collections
  const filteredCollections = collectorCollections.filter(collection => {
    const business = businesses.find(b => b.id === collection.businessId);
    const revenueType = revenueTypes.find(rt => rt.id === collection.revenueTypeId);
    
    const matchesSearch = business?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         collection.receiptId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         revenueType?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = !filterDate || collection.date === filterDate;
    const matchesBusiness = !filterBusiness || collection.businessId === filterBusiness;
    
    return matchesSearch && matchesDate && matchesBusiness;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const generateReceipt = async (collection: any, format: 'pdf' | 'print') => {
    setIsGenerating(collection.id);
    
    // Simulate receipt generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const business = businesses.find(b => b.id === collection.businessId);
    const revenueType = revenueTypes.find(rt => rt.id === collection.revenueTypeId);
    
    if (format === 'pdf') {
      alert(`PDF receipt ${collection.receiptId} downloaded for ${business?.name}`);
    } else {
      alert(`Receipt ${collection.receiptId} sent to printer for ${business?.name}`);
    }
    
    setIsGenerating(null);
  };

  const generateBulkReceipts = async () => {
    setIsGenerating('bulk');
    
    // Simulate bulk generation
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    alert(`Generated ${filteredCollections.length} receipts successfully`);
    setIsGenerating(null);
  };

  const previewReceipt = (collection: any) => {
    setSelectedReceipt(collection);
  };

  // Get unique businesses for filter
  const uniqueBusinesses = Array.from(new Set(collectorCollections.map(c => c.businessId)))
    .map(id => businesses.find(b => b.id === id))
    .filter(Boolean);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Receipt Generator</h1>
          <p className="text-gray-600 dark:text-gray-400">Generate and download receipts for your collections</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={generateBulkReceipts}
            disabled={isGenerating === 'bulk' || filteredCollections.length === 0}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 dark:bg-green-500 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating === 'bulk' ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            <span>{isGenerating === 'bulk' ? 'Generating...' : 'Bulk Generate'}</span>
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Receipt className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Receipts</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{collectorCollections.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Value</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(collectorCollections.reduce((sum, c) => sum + c.amount, 0))}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <Calendar className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">This Month</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {collectorCollections.filter(c => {
                  const collectionDate = new Date(c.date);
                  const now = new Date();
                  return collectionDate.getMonth() === now.getMonth() && 
                         collectionDate.getFullYear() === now.getFullYear();
                }).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Building2 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Businesses</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{uniqueBusinesses.length}</p>
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
                placeholder="Search receipts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
            />
            <select
              value={filterBusiness}
              onChange={(e) => setFilterBusiness(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
            >
              <option value="">All Businesses</option>
              {uniqueBusinesses.map((business) => (
                <option key={business?.id} value={business?.id}>
                  {business?.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <Filter className="w-4 h-4" />
            <span>{filteredCollections.length} receipts found</span>
          </div>
        </div>
      </div>

      {/* Receipts Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Receipt Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Business
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Revenue Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredCollections
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((collection) => {
                  const business = businesses.find(b => b.id === collection.businessId);
                  const revenueType = revenueTypes.find(rt => rt.id === collection.revenueTypeId);
                  
                  return (
                    <tr key={collection.id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                            <Receipt className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {collection.receiptId}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                              {collection.paymentMethod}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{business?.name}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{business?.ownerName}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {revenueType?.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600 dark:text-green-400">
                        {formatCurrency(collection.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {new Date(collection.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => previewReceipt(collection)}
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                            title="Preview Receipt"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => generateReceipt(collection, 'pdf')}
                            disabled={isGenerating === collection.id}
                            className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300 disabled:opacity-50"
                            title="Download PDF"
                          >
                            {isGenerating === collection.id ? (
                              <RefreshCw className="w-4 h-4 animate-spin" />
                            ) : (
                              <Download className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            onClick={() => generateReceipt(collection, 'print')}
                            disabled={isGenerating === collection.id}
                            className="text-purple-600 dark:text-purple-400 hover:text-purple-900 dark:hover:text-purple-300 disabled:opacity-50"
                            title="Print Receipt"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Receipt Preview Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Receipt Preview</h3>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400"
              >
                ×
              </button>
            </div>
            
            {/* Receipt Content */}
            <div className="border border-gray-300 dark:border-gray-600 p-8 bg-white dark:bg-gray-800">
              {(() => {
                const business = businesses.find(b => b.id === selectedReceipt.businessId);
                const revenueType = revenueTypes.find(rt => rt.id === selectedReceipt.revenueTypeId);
                
                return (
                  <div className="space-y-6">
                    {/* Header */}
                    <div className="text-center border-b border-gray-300 dark:border-gray-600 pb-4">
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">MMDA REVENUE RECEIPT</h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{user?.district}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Government of Ghana</p>
                    </div>

                    {/* Receipt Details */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Receipt No:</p>
                        <p className="text-sm text-gray-900 dark:text-white">{selectedReceipt.receiptId}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Date:</p>
                        <p className="text-sm text-gray-900 dark:text-white">{new Date(selectedReceipt.date).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Business Name:</p>
                        <p className="text-sm text-gray-900 dark:text-white">{business?.name}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Owner:</p>
                        <p className="text-sm text-gray-900 dark:text-white">{business?.ownerName}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Collector:</p>
                        <p className="text-sm text-gray-900 dark:text-white">{user?.name}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Revenue Type:</p>
                        <p className="text-sm text-gray-900 dark:text-white">{revenueType?.name}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Payment Method:</p>
                        <p className="text-sm text-gray-900 dark:text-white capitalize">{selectedReceipt.paymentMethod}</p>
                      </div>
                    </div>

                    {/* Amount */}
                    <div className="border-t border-gray-300 dark:border-gray-600 pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-medium text-gray-700 dark:text-gray-300">Amount Paid:</span>
                        <span className="text-xl font-bold text-green-600 dark:text-green-400">
                          {formatCurrency(selectedReceipt.amount)}
                        </span>
                      </div>
                    </div>

                    {/* Collector Info */}
                    <div className="border-t border-gray-300 dark:border-gray-600 pt-4">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Collected by:</p>
                      <p className="text-sm text-gray-900 dark:text-white">{user?.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Revenue Collector</p>
                    </div>

                    {/* Footer */}
                    <div className="border-t border-gray-300 dark:border-gray-600 pt-4 text-center">
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        This is an official receipt from {user?.district}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        For inquiries, contact your local MMDA office
                      </p>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setSelectedReceipt(null)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Close
              </button>
              <button
                onClick={() => generateReceipt(selectedReceipt, 'print')}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 dark:bg-purple-500 text-white rounded-lg hover:bg-purple-700 dark:hover:bg-purple-600"
              >
                <Printer className="w-4 h-4" />
                <span>Print</span>
              </button>
              <button
                onClick={() => generateReceipt(selectedReceipt, 'pdf')}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 dark:bg-green-500 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredCollections.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
          <Receipt className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No receipts found</h3>
          <p className="text-gray-600 dark:text-gray-400">
            {searchTerm || filterDate || filterBusiness
              ? 'No receipts match your current filters.'
              : 'You haven\'t recorded any payments yet.'}
          </p>
        </div>
      )}
    </div>
  );
}