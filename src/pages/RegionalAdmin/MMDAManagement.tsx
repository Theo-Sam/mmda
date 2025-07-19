import React, { useState } from 'react';
import { Plus, Eye, Edit, Trash2, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { mmdaByRegion } from '../../utils/ghanaRegions';
import { useApp } from '../../contexts/AppContext';

const region = 'Greater Accra';

const statusColors = {
  active: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
  inactive: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300',
  suspended: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300',
};

const statusIcons = {
  active: <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />,
  inactive: <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />,
  suspended: <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />,
};

export default function MMDAManagement() {
  const { mmdas, setMMDAs } = useApp();
  const [showNewModal, setShowNewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    adminName: '',
    adminEmail: '',
    phone: '',
    status: 'active',
  });

  const handleAddMMDA = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.adminName || !formData.adminEmail) {
      alert('Please fill in all required fields');
      return;
    }
    const newMMDA = {
      id: (Math.max(...mmdas.map(m => parseInt(m.id))) + 1).toString(),
      name: formData.name,
      code: formData.code || formData.name.split(' ').map(w => w[0]).join('').toUpperCase(),
      region,
      status: formData.status as 'active' | 'inactive' | 'suspended',
      adminName: formData.adminName,
      adminEmail: formData.adminEmail,
      phone: formData.phone,
      totalRevenue: 0,
      totalBusinesses: 0,
      totalUsers: 0,
      lastActivity: new Date().toISOString(),
      createdDate: new Date().toISOString().split('T')[0],
    };
    setMMDAs(prev => [...prev, newMMDA]);
    setShowNewModal(false);
    setFormData({ name: '', code: '', adminName: '', adminEmail: '', phone: '', status: 'active' });
    alert('MMDA added successfully!');
  };

  const handleEditMMDA = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showEditModal) return;
    setMMDAs(prev => prev.map(m => m.id === showEditModal.id ? { ...m, ...formData, status: formData.status as 'active' | 'inactive' | 'suspended' } : m));
    setShowEditModal(null);
    setFormData({ name: '', code: '', adminName: '', adminEmail: '', phone: '', status: 'active' });
    alert('MMDA updated successfully!');
  };

  const handleSuspendMMDA = (id: string) => {
    setMMDAs(prev => prev.map(m => m.id === id ? { ...m, status: 'suspended' } : m));
    alert('MMDA suspended.');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">MMDA Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage MMDAs in {region}</p>
        </div>
        <button
          onClick={() => setShowNewModal(true)}
          className="flex items-center space-x-2 bg-blue-600 dark:bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add New MMDA</span>
        </button>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">MMDA</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Admin</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {mmdas.map((mmda) => (
                <tr key={mmda.id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{mmda.name}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900 dark:text-white">{mmda.code}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900 dark:text-white">{mmda.adminName}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900 dark:text-white">{mmda.adminEmail}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900 dark:text-white">{mmda.phone}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[mmda.status]}`}>{statusIcons[mmda.status]}<span className="ml-1 capitalize">{mmda.status}</span></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300" title="View Details"><Eye className="w-4 h-4" /></button>
                      <button className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300" title="Edit MMDA" onClick={() => { setShowEditModal(mmda); setFormData({ name: mmda.name, code: mmda.code, adminName: mmda.adminName, adminEmail: mmda.adminEmail, phone: mmda.phone, status: mmda.status }); }}><Edit className="w-4 h-4" /></button>
                      <button className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300" title="Suspend MMDA" onClick={() => handleSuspendMMDA(mmda.id)}><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Add New MMDA Modal */}
      {showNewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Add New MMDA</h3>
            <form onSubmit={handleAddMMDA} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">MMDA Name <span className="text-red-500">*</span></label>
                <select
                  value={formData.name}
                  onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
                  required
                >
                  <option value="">Select MMDA</option>
                  {(mmdaByRegion[region] || []).filter(mmdaName => !mmdas.some(m => m.name === mmdaName)).map((mmda, idx) => (
                    <option key={mmda || idx} value={mmda}>{mmda}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Admin Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={formData.adminName}
                  onChange={e => setFormData(prev => ({ ...prev, adminName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter admin name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Admin Email <span className="text-red-500">*</span></label>
                <input
                  type="email"
                  value={formData.adminEmail}
                  onChange={e => setFormData(prev => ({ ...prev, adminEmail: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
                  placeholder="admin@mmda.gov.gh"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
                  placeholder="+233 XX XXX XXXX"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={e => setFormData(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
              <div className="flex items-center justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => { setShowNewModal(false); setFormData({ name: '', code: '', adminName: '', adminEmail: '', phone: '', status: 'active' }); }}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600"
                >
                  Add MMDA
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Edit MMDA Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Edit MMDA</h3>
            <form onSubmit={handleEditMMDA} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">MMDA Name</label>
                <input
                  type="text"
                  value={formData.name}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Admin Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={formData.adminName}
                  onChange={e => setFormData(prev => ({ ...prev, adminName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Admin Email <span className="text-red-500">*</span></label>
                <input
                  type="email"
                  value={formData.adminEmail}
                  onChange={e => setFormData(prev => ({ ...prev, adminEmail: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
                  placeholder="+233 XX XXX XXXX"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={e => setFormData(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
              <div className="flex items-center justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => { setShowEditModal(null); setFormData({ name: '', code: '', adminName: '', adminEmail: '', phone: '', status: 'active' }); }}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
