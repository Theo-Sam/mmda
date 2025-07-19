import React, { useState, useRef, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  MapPin, 
  Users, 
  Building2, 
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  Settings,
  Globe,
  Phone,
  Mail,
  ChevronDown,
  X
} from 'lucide-react';
import { ghanaRegions, mmdaByRegion } from '../../utils/ghanaRegions';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { filterByJurisdiction } from '../../utils/filterByJurisdiction';
import { SystemUser } from '../../types/SystemUser';

// Searchable dropdown component
interface SearchableDropdownProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  disabled?: boolean;
  required?: boolean;
}

function SearchableDropdown({ 
  options, 
  value, 
  onChange, 
  placeholder, 
  disabled = false,
  required = false
}: SearchableDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  
  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const filteredOptions = options.filter(option => 
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleSelect = (option: string) => {
    onChange(option);
    setIsOpen(false);
    setSearchTerm('');
  };
  
  const displayValue = value || placeholder;
  
  return (
    <div className="relative" ref={dropdownRef}>
      <div 
        className={`flex items-center justify-between w-full px-3 py-2 border rounded-lg ${
          disabled 
            ? 'bg-gray-100 dark:bg-gray-600 border-gray-300 dark:border-gray-600 cursor-not-allowed' 
            : 'border-gray-300 dark:border-gray-600 cursor-pointer hover:border-gray-400 dark:hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white'
        }`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <span className={`truncate ${!value ? 'text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-white'}`}>
          {displayValue}
        </span>
        <ChevronDown className="w-4 h-4 text-gray-400 dark:text-gray-500" />
      </div>
      
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg">
          <div className="p-2 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
                placeholder={`Search ${placeholder.toLowerCase()}...`}
                onClick={(e) => e.stopPropagation()}
                autoFocus
              />
              {searchTerm && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSearchTerm('');
                  }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
          
          <div className="max-h-60 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <div
                  key={option}
                  className={`px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                    option === value ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-medium' : 'text-gray-900 dark:text-white'
                  }`}
                  onClick={() => handleSelect(option)}
                >
                  {option}
                </div>
              ))
            ) : (
              <div className="px-4 py-2 text-gray-500 dark:text-gray-400">No results found</div>
            )}
          </div>
          
          {filteredOptions.length > 0 && (
            <div className="p-2 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
              {filteredOptions.length} {filteredOptions.length === 1 ? 'result' : 'results'} found
            </div>
          )}
        </div>
      )}
      
      {required && !value && (
        <input 
          type="text" 
          required 
          style={{ 
            position: 'absolute', 
            opacity: 0, 
            height: 0, 
            width: 0, 
            zIndex: -1 
          }} 
        />
      )}
    </div>
  );
}

export default function MMDAManagement() {
  const { user } = useAuth();
  const [mmdas, setMMDAs] = useState<MMDA[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterRegion, setFilterRegion] = useState('all');
  const [showNewMMDAForm, setShowNewMMDAForm] = useState(false);
  const [selectedMMDA, setSelectedMMDA] = useState<MMDA | null>(null);
  const { theme } = useTheme();
  
  // Form state for new MMDA
  const [selectedRegion, setSelectedRegion] = useState('Greater Accra');
  const [selectedMmdaName, setSelectedMmdaName] = useState('');
  const [selectedAdminId, setSelectedAdminId] = useState('');
  const [formData, setFormData] = useState({
    adminName: '',
    adminEmail: '',
    phone: ''
  });

  // Apply district-based filtering
  let districtMMDAs = mmdas;
  if (user) {
    if (user.role === 'regional_admin') {
      districtMMDAs = mmdas.filter(mmda => mmda.region === user.district || mmda.region === user.region);
    } else {
      districtMMDAs = filterByJurisdiction(user, mmdas, 'name');
    }
  }
  const filteredMMDAs = districtMMDAs.filter(mmda => {
    const matchesSearch = mmda.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mmda.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mmda.adminName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || mmda.status === filterStatus;
    const matchesRegion = filterRegion === 'all' || mmda.region === filterRegion;
    return matchesSearch && matchesStatus && matchesRegion;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />;
      case 'inactive': return <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />;
      case 'suspended': return <Clock className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />;
      default: return <XCircle className="w-4 h-4 text-gray-600 dark:text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      case 'inactive': return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
      case 'suspended': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
    }
  };

  const handleRegionChange = (region: string) => {
    setSelectedRegion(region);
    setSelectedMmdaName(''); // Reset MMDA selection when region changes
  };

  const handleSubmitNewMMDA = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedRegion || !selectedMmdaName || !selectedAdminId) {
      alert('Please fill in all required fields');
      return;
    }

    // Generate code from MMDA name
    const words = selectedMmdaName.split(' ');
    let code = '';
    if (words.length >= 2) {
      code = words[0][0] + words[1][0];
      if (words.length > 2 && !['District', 'Municipal', 'Metropolitan'].includes(words[2])) {
        code += words[2][0];
      }
    } else {
      code = selectedMmdaName.substring(0, 3);
    }
    code = code.toUpperCase();

    const newMMDA: MMDA = {
      id: (Math.max(...mmdas.map(m => parseInt(m.id))) + 1).toString(),
      name: selectedMmdaName,
      code,
      region: selectedRegion,
      status: 'active',
      adminName: user.role === 'super_admin' ? formData.adminName : user.name,
      adminEmail: user.role === 'super_admin' ? formData.adminEmail : user.email,
      phone: user.role === 'super_admin' ? formData.phone : user.phone,
      totalRevenue: 0,
      totalBusinesses: 0,
      totalUsers: 1,
      lastActivity: new Date().toISOString(),
      createdDate: new Date().toISOString().split('T')[0]
    };

    setMMDAs(prev => [...prev, newMMDA]);
    setShowNewMMDAForm(false);
    
    // Reset form
    setSelectedRegion('');
    setSelectedMmdaName('');
    setSelectedAdminId('');
    setFormData({
      adminName: '',
      adminEmail: '',
      phone: ''
    });
    
    alert('MMDA created successfully!');
  };

  // For regional_admin, only show eligible MMDA Admins in their region
  let eligibleAdmins = [];
  if (user && user.role === 'regional_admin') {
    eligibleAdmins = eligibleAdmins.filter(u => u.district && (u.district.includes(user.district) || u.district.includes(user.region)));
  }

  const availableMMDAs = selectedRegion ? mmdaByRegion[selectedRegion] || [] : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">MMDA Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage all MMDAs across Ghana</p>
        </div>
        <button
          onClick={() => setShowNewMMDAForm(true)}
          className="flex items-center space-x-2 bg-blue-600 dark:bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add New MMDA</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total MMDAs</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{mmdas.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active MMDAs</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {mmdas.filter(d => d.status === 'active').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <Users className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {mmdas.reduce((sum, d) => sum + d.totalUsers, 0)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <DollarSign className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(mmdas.reduce((sum, d) => sum + d.totalRevenue, 0))}
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
                placeholder="Search MMDAs..."
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
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
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
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <Filter className="w-4 h-4" />
            <span>{filteredMMDAs.length} MMDAs found</span>
          </div>
        </div>
      </div>

      {/* MMDAs Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Region
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  MMDA
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Admin
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Performance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Last Activity
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
                    <span className="text-sm text-gray-900 dark:text-white">{mmda.region}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {mmda.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {mmda.code}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {mmda.adminName}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {mmda.adminEmail}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {formatCurrency(mmda.totalRevenue)}
                      </div>
                      <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                        <span className="flex items-center space-x-1">
                          <Building2 className="w-3 h-3" />
                          <span>{mmda.totalBusinesses}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Users className="w-3 h-3" />
                          <span>{mmda.totalUsers}</span>
                        </span>
                      </div>
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {new Date(mmda.lastActivity).toLocaleDateString()}
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
                      <button className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300" title="Edit MMDA">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300" title="Settings">
                        <Settings className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300" title="Deactivate">
                        <Trash2 className="w-4 h-4" />
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
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">MMDA Details</h3>
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
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Region</label>
                  <p className="text-sm text-gray-900 dark:text-white">{selectedMMDA.region}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">MMDA Name</label>
                  <p className="text-sm text-gray-900 dark:text-white">{selectedMMDA.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Code</label>
                  <p className="text-sm text-gray-900 dark:text-white">{selectedMMDA.code}</p>
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

              {/* Admin Info */}
              <div>
                <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">Administrator Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                    <p className="text-sm text-gray-900 dark:text-white">{selectedMMDA.adminName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                    <p className="text-sm text-gray-900 dark:text-white">{selectedMMDA.adminEmail}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
                    <p className="text-sm text-gray-900 dark:text-white">{selectedMMDA.phone}</p>
                  </div>
                </div>
              </div>

              {/* Performance Metrics */}
              <div>
                <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">Performance Metrics</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="text-sm font-medium text-green-900 dark:text-green-300">Total Revenue</span>
                    </div>
                    <p className="text-lg font-bold text-green-900 dark:text-green-300 mt-1">
                      {formatCurrency(selectedMMDA.totalRevenue)}
                    </p>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      <span className="text-sm font-medium text-blue-900 dark:text-blue-300">Businesses</span>
                    </div>
                    <p className="text-lg font-bold text-blue-900 dark:text-blue-300 mt-1">
                      {selectedMMDA.totalBusinesses.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      <span className="text-sm font-medium text-purple-900 dark:text-purple-300">Users</span>
                    </div>
                    <p className="text-lg font-bold text-purple-900 dark:text-purple-300 mt-1">
                      {selectedMMDA.totalUsers}
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
                <button className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600">
                  Edit MMDA
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New MMDA Form Modal */}
      {showNewMMDAForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Add New MMDA</h3>
            <form onSubmit={handleSubmitNewMMDA} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Region <span className="text-red-500">*</span>
                </label>
                <SearchableDropdown
                  options={(user?.role === 'regional_admin' ? [user.region] : ghanaRegions).filter(Boolean)}
                  value={selectedRegion}
                  onChange={region => {
                    setSelectedRegion(region);
                    setSelectedMmdaName('');
                  }}
                  placeholder="Select region"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  MMDA Name <span className="text-red-500">*</span>
                </label>
                <SearchableDropdown
                  options={(selectedRegion ? mmdaByRegion[selectedRegion] || [] : []).filter(Boolean)}
                  value={selectedMmdaName}
                  onChange={setSelectedMmdaName}
                  placeholder={selectedRegion ? "Select MMDA" : "Select region first"}
                  disabled={!selectedRegion}
                  required
                />
                {selectedRegion && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {(mmdaByRegion[selectedRegion] || []).length} MMDAs available in {selectedRegion}
                  </p>
                )}
              </div>

              {user?.role === 'super_admin' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Admin <span className="text-red-500">*</span>
                  </label>
                  <SearchableDropdown
                    options={[]}
                    value={selectedAdminId}
                    onChange={val => {
                      setSelectedAdminId(val);
                      const admin = null;
                      setFormData(prev => ({
                        ...prev,
                        adminName: admin?.name || '',
                        adminEmail: admin?.email || '',
                        phone: admin?.phone || ''
                      }));
                    }}
                    placeholder="Select regional admin"
                    required
                  />
                </div>
              )}

              {user?.role === 'regional_admin' && (
                <input type="hidden" value={user.name} />
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
                  placeholder="+233 XX XXX XXXX"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowNewMMDAForm(false);
                    setSelectedRegion('');
                    setSelectedMmdaName('');
                    setSelectedAdminId('');
                    setFormData({ adminName: '', adminEmail: '', phone: '' });
                  }}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600"
                >
                  Create MMDA
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}