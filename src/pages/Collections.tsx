import React, { useState } from 'react';
import { Plus, Receipt, Calendar, DollarSign, Building2, MapPin, Clock, CheckCircle, Search, Filter, Eye, Download } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { filterByJurisdiction } from '../utils/filterByJurisdiction';
import { v4 as uuidv4 } from 'uuid';

export default function Collections() {
  const { businesses, revenueTypes, collections, addCollection, addAuditLog } = useApp();
  const { user } = useAuth();
  const [showNewPaymentForm, setShowNewPaymentForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedCollection, setSelectedCollection] = useState<any>(null);
  const [formData, setFormData] = useState({
    businessId: '',
    revenueTypeId: '',
    amount: '',
    paymentMethod: 'cash' as 'cash' | 'momo' | 'bank' | 'cheque' | 'pos'
  });

  // For collectors, filter businesses assigned to them
  // In a real app, this would use the assignments table
  const districtBusinesses = user ? filterByJurisdiction(user, businesses) : businesses;
  const assignedBusinesses = districtBusinesses.filter(b => b.status === 'active');

  // Get collector's collections (district filtered)
  const districtCollections = user ? filterByJurisdiction(user, collections) : collections;
  const collectorCollections = districtCollections.filter(c => c.collectorId === user?.id);

  // Filter collections
  const filteredCollections = collectorCollections.filter(collection => {
    const business = businesses.find(b => b.id === collection.businessId);
    const revenueType = revenueTypes.find(rt => rt.id === collection.revenueTypeId);

    const matchesSearch = business?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      collection.receiptCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      revenueType?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || collection.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Calculate today's collections
  const todaysCollections = collectorCollections.filter(c =>
    new Date(c.date).toDateString() === new Date().toDateString()
  );
  const todaysTotal = todaysCollections.reduce((sum, c) => sum + c.amount, 0);

  // Calculate this month's collections
  const thisMonthCollections = collectorCollections.filter(c => {
    const collectionDate = new Date(c.date);
    const now = new Date();
    return collectionDate.getMonth() === now.getMonth() &&
      collectionDate.getFullYear() === now.getFullYear();
  });
  const monthlyTotal = thisMonthCollections.reduce((sum, c) => sum + c.amount, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newCollection = {
      id: uuidv4(),
      businessId: formData.businessId,
      revenueTypeId: formData.revenueTypeId,
      collectorId: user!.id,
      amount: parseFloat(formData.amount),
      paymentMethod: formData.paymentMethod,
      receiptCode: uuidv4(),
      date: new Date().toISOString().split('T')[0],
      status: 'paid' as const,
      district: user!.district
    };

    addCollection(newCollection);

    const business = businesses.find(b => b.id === formData.businessId);
    const revenueType = revenueTypes.find(rt => rt.id === formData.revenueTypeId);

    addAuditLog({
      userId: user!.id,
      userName: user!.name,
      userRole: user!.role,
      action: 'Payment Recorded',
      details: `Recorded payment for ${business?.name} - ${revenueType?.name} (${formData.receiptCode})`,
      district: user!.district
    });

    setShowNewPaymentForm(false);
    setFormData({
      businessId: '',
      revenueTypeId: '',
      amount: '',
      paymentMethod: 'cash'
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Auto-fill amount when revenue type is selected
    if (name === 'revenueTypeId') {
      const revenueType = revenueTypes.find(rt => rt.id === value);
      if (revenueType) {
        setFormData(prev => ({ ...prev, amount: revenueType.defaultAmount.toString() }));
      }
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const generateReceipt = (collection: any) => {
    const business = businesses.find(b => b.id === collection.businessId);
    const revenueType = revenueTypes.find(rt => rt.id === collection.revenueTypeId);

    // Mock receipt generation
    alert(`Receipt ${collection.receiptCode} generated for ${business?.name} - ${formatCurrency(collection.amount)}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Collections</h1>
          <p className="text-gray-600 dark:text-gray-400">Record payments and manage your collection activities</p>
        </div>
        <button
          onClick={() => setShowNewPaymentForm(true)}
          className="flex items-center space-x-2 bg-green-600 dark:bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Record Payment</span>
        </button>
      </div>

      {/* Performance Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Today's Collections</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{formatCurrency(todaysTotal)}</p>
              <p className="text-sm text-green-600 dark:text-green-400">{todaysCollections.length} payments</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">This Month</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{formatCurrency(monthlyTotal)}</p>
              <p className="text-sm text-blue-600 dark:text-blue-400">{thisMonthCollections.length} payments</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <Building2 className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Assigned Businesses</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{assignedBusinesses.length}</p>
              <p className="text-sm text-yellow-600 dark:text-yellow-400">Active assignments</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Receipt className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Collections</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{collectorCollections.length}</p>
              <p className="text-sm text-purple-600 dark:text-purple-400">All time</p>
            </div>
          </div>
        </div>
      </div>

      {/* Assigned Businesses Quick Access */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">My Assigned Businesses</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Quick access to record payments</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {assignedBusinesses.slice(0, 6).map((business) => {
              const lastPayment = collectorCollections
                .filter(c => c.businessId === business.id)
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

              return (
                <div key={business.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900 dark:text-white truncate">{business.name}</h4>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{business.category}</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{business.ownerName}</p>
                  <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400 mb-3">
                    <MapPin className="w-3 h-3" />
                    <span className="truncate">{business.gpsLocation}</span>
                  </div>

                  {lastPayment ? (
                    <div className="flex items-center space-x-2 text-xs text-green-600 dark:text-green-400 mb-3">
                      <CheckCircle className="w-3 h-3" />
                      <span>Last payment: {new Date(lastPayment.date).toLocaleDateString()}</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2 text-xs text-orange-600 dark:text-orange-400 mb-3">
                      <Clock className="w-3 h-3" />
                      <span>No payments recorded</span>
                    </div>
                  )}

                  <button
                    onClick={() => {
                      setFormData(prev => ({ ...prev, businessId: business.id }));
                      setShowNewPaymentForm(true);
                    }}
                    className="w-full bg-blue-600 dark:bg-blue-500 text-white py-2 px-3 rounded text-sm hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                  >
                    Record Payment
                  </button>
                </div>
              );
            })}
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
                placeholder="Search collections..."
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
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <Filter className="w-4 h-4" />
            <span>{filteredCollections.length} collections found</span>
          </div>
        </div>
      </div>

      {/* Collections Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">My Collection Records</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Receipt Code
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
                  Payment Method
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {collection.receiptCode}
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
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 capitalize">
                          {collection.paymentMethod}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {new Date(collection.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setSelectedCollection(collection)}
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => generateReceipt(collection)}
                            className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300"
                            title="Generate Receipt"
                          >
                            <Download className="w-4 h-4" />
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

      {/* New Payment Form Modal */}
      {showNewPaymentForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Record New Payment</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Business
                </label>
                <select
                  name="businessId"
                  value={formData.businessId}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Select business</option>
                  {assignedBusinesses.map((business) => (
                    <option key={business.id} value={business.id}>
                      {business.name} - {business.ownerName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Revenue Type
                </label>
                <select
                  name="revenueTypeId"
                  value={formData.revenueTypeId}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Select revenue type</option>
                  {revenueTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name} - {formatCurrency(type.defaultAmount)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Amount (GHS)
                </label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Payment Method
                </label>
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
                >
                  <option value="cash">Cash</option>
                  <option value="momo">Mobile Money</option>
                  <option value="bank">Bank Transfer</option>
                  <option value="cheque">Cheque</option>
                  <option value="pos">POS</option>
                </select>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowNewPaymentForm(false)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 dark:bg-green-500 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600"
                >
                  <DollarSign className="w-4 h-4" />
                  <span>Record Payment</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Collection Details Modal */}
      {selectedCollection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Collection Details</h3>
              <button
                onClick={() => setSelectedCollection(null)}
                className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              {(() => {
                const business = businesses.find(b => b.id === selectedCollection.businessId);
                const revenueType = revenueTypes.find(rt => rt.id === selectedCollection.revenueTypeId);

                return (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Receipt Code</label>
                        <p className="text-sm text-gray-900 dark:text-white">{selectedCollection.receiptCode}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Amount</label>
                        <p className="text-sm font-medium text-green-600 dark:text-green-400">{formatCurrency(selectedCollection.amount)}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Business</label>
                        <p className="text-sm text-gray-900 dark:text-white">{business?.name}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Owner</label>
                        <p className="text-sm text-gray-900 dark:text-white">{business?.ownerName}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Revenue Type</label>
                        <p className="text-sm text-gray-900 dark:text-white">{revenueType?.name}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Payment Method</label>
                        <p className="text-sm text-gray-900 dark:text-white capitalize">{selectedCollection.paymentMethod}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
                        <p className="text-sm text-gray-900 dark:text-white">{new Date(selectedCollection.date).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 capitalize">
                          {selectedCollection.status}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <button
                        onClick={() => setSelectedCollection(null)}
                        className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        Close
                      </button>
                      <button
                        onClick={() => generateReceipt(selectedCollection)}
                        className="flex items-center space-x-2 px-4 py-2 bg-green-600 dark:bg-green-500 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600"
                      >
                        <Download className="w-4 h-4" />
                        <span>Generate Receipt</span>
                      </button>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Finance & Analytics Section */}
      {user?.role === 'finance' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Finance Analytics & Validation</h3>
            <p className="text-gray-600 dark:text-gray-400">Comprehensive financial insights and payment validation tools</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-md font-semibold text-blue-900 dark:text-blue-100">Payment Validation</h4>
                  <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">Validate and approve pending payments</p>
                <button className="w-full px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                  Review Payments
                </button>
              </div>

              <div className="p-4 bg-green-50 dark:bg-green-900/30 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-md font-semibold text-green-900 dark:text-green-100">Revenue Overview</h4>
                  <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <p className="text-sm text-green-800 dark:text-green-200 mb-3">View revenue trends and collection metrics</p>
                <button className="w-full px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">
                  View Analytics
                </button>
              </div>

              <div className="p-4 bg-purple-50 dark:bg-purple-900/30 rounded-lg border border-purple-200 dark:border-purple-800">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-md font-semibold text-purple-900 dark:text-purple-100">Export & Reports</h4>
                  <Download className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <p className="text-sm text-purple-800 dark:text-purple-200 mb-3">Export financial data and generate reports</p>
                <button className="w-full px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm">
                  Export Data
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Receipt Management Section for Collectors */}
      {user?.role === 'collector' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Receipt Management</h3>
            <p className="text-gray-600 dark:text-gray-400">Generate and manage payment receipts for your collections</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-md font-semibold text-blue-900 dark:text-blue-100">Generate Receipts</h4>
                  <Receipt className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">Create receipts for completed payments</p>
                <button className="w-full px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                  Generate Receipt
                </button>
              </div>

              <div className="p-4 bg-green-50 dark:bg-green-900/30 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-md font-semibold text-green-900 dark:text-green-100">Receipt History</h4>
                  <Receipt className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <p className="text-sm text-green-800 dark:text-green-200 mb-3">View all generated receipts</p>
                <button className="w-full px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">
                  View History
                </button>
              </div>

              <div className="p-4 bg-purple-50 dark:bg-purple-900/30 rounded-lg border border-purple-200 dark:border-purple-800">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-md font-semibold text-purple-900 dark:text-purple-100">Bulk Operations</h4>
                  <Download className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <p className="text-sm text-purple-800 dark:text-purple-200 mb-3">Download multiple receipts at once</p>
                <button className="w-full px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm">
                  Bulk Download
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredCollections.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
          <Receipt className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No collections found</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {searchTerm || filterStatus !== 'all'
              ? 'No collections match your current filters.'
              : 'Start recording payments from your assigned businesses.'}
          </p>
          <button
            onClick={() => setShowNewPaymentForm(true)}
            className="inline-flex items-center space-x-2 bg-green-600 dark:bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-700 dark:hover:bg-green-600"
          >
            <Plus className="w-4 h-4" />
            <span>Record First Payment</span>
          </button>
        </div>
      )}
    </div>
  );
}