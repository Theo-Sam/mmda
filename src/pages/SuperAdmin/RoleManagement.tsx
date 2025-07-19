import React, { useState } from 'react';
import { 
  Shield, 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Copy, 
  Search, 
  Filter, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Eye,
  Save,
  X,
  ChevronDown,
  ChevronRight,
  Lock,
  Unlock
} from 'lucide-react';
import { ROLE_PERMISSIONS, Permission } from '../../utils/permissions';
import { useTheme } from '../../contexts/ThemeContext';

interface Role {
  id: string;
  name: string;
  description: string;
  isSystem: boolean;
  isActive: boolean;
  permissions: Permission[];
  userCount: number;
}

// Group permissions by category for better organization
const permissionCategories = {
  general: {
    name: 'General',
    permissions: ['view_dashboard', 'view_own_profile', 'change_password', 'set_notifications', 'view_notifications']
  },
  userManagement: {
    name: 'User Management',
    permissions: ['manage_users', 'view_users', 'assign_roles']
  },
  mmdaManagement: {
    name: 'MMDA Management',
    permissions: ['create_mmda', 'edit_mmda', 'deactivate_mmda', 'view_all_mmdas']
  },
  businessManagement: {
    name: 'Business Management',
    permissions: ['register_business', 'edit_business', 'delete_business', 'view_business', 'view_my_business']
  },
  revenueManagement: {
    name: 'Revenue Management',
    permissions: ['create_revenue_type', 'edit_revenue_type', 'delete_revenue_type', 'view_revenue_types']
  },
  assignmentManagement: {
    name: 'Assignment Management',
    permissions: ['assign_collector', 'edit_assignment', 'delete_assignment', 'view_assignments', 'view_my_assignments']
  },
  paymentProcessing: {
    name: 'Payment Processing',
    permissions: ['record_payment', 'edit_payment', 'delete_payment', 'validate_payment', 'view_collections', 'view_my_collections', 'make_payment', 'view_my_payments', 'generate_receipt']
  },
  reporting: {
    name: 'Reporting',
    permissions: ['view_reports', 'export_reports', 'view_collector_performance']
  },
  security: {
    name: 'Security & Compliance',
    permissions: ['view_audit_logs', 'search_logs', 'flag_irregularities', 'send_notifications']
  }
};

// Permission descriptions for tooltips
const permissionDescriptions: Record<string, string> = {
  view_dashboard: 'Access to view the dashboard',
  manage_users: 'Create, edit, and delete user accounts',
  view_users: 'View user accounts and details',
  assign_roles: 'Assign roles to users',
  create_mmda: 'Create new MMDA accounts',
  edit_mmda: 'Edit MMDA details',
  deactivate_mmda: 'Deactivate MMDA accounts',
  view_all_mmdas: 'View all MMDAs in the system',
  register_business: 'Register new businesses',
  edit_business: 'Edit business details',
  delete_business: 'Delete business records',
  view_business: 'View business details',
  view_my_business: 'View own business details (for business owners)',
  create_revenue_type: 'Create new revenue types',
  edit_revenue_type: 'Edit revenue type details',
  delete_revenue_type: 'Delete revenue types',
  view_revenue_types: 'View revenue type details',
  assign_collector: 'Assign collectors to businesses or zones',
  edit_assignment: 'Edit collector assignments',
  delete_assignment: 'Delete collector assignments',
  view_assignments: 'View all collector assignments',
  view_my_assignments: 'View own assignments (for collectors)',
  record_payment: 'Record new payments',
  edit_payment: 'Edit payment details',
  delete_payment: 'Delete payment records',
  validate_payment: 'Validate and approve payments',
  view_collections: 'View all collection records',
  view_my_collections: 'View own collection records (for collectors)',
  make_payment: 'Make payments (for business owners)',
  view_my_payments: 'View own payment history (for business owners)',
  generate_receipt: 'Generate payment receipts',
  view_reports: 'View system reports',
  export_reports: 'Export reports to various formats',
  view_collector_performance: 'View collector performance metrics',
  view_audit_logs: 'View system audit logs',
  search_logs: 'Search through audit logs',
  flag_irregularities: 'Flag suspicious activities',
  view_own_profile: 'View and edit own profile',
  change_password: 'Change own password',
  set_notifications: 'Configure notification preferences',
  view_notifications: 'View system notifications',
  send_notifications: 'Send notifications to users'
};

export default function RoleManagement() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActive, setFilterActive] = useState('all');
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [editedRole, setEditedRole] = useState<Role | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const { theme } = useTheme();

  // Filter roles based on search and active filter
  const filteredRoles = roles.filter(role => {
    const matchesSearch = role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         role.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesActive = filterActive === 'all' || 
                         (filterActive === 'active' && role.isActive) ||
                         (filterActive === 'inactive' && !role.isActive);
    return matchesSearch && matchesActive;
  });

  const handleSelectRole = (role: Role) => {
    setSelectedRole(role);
    setEditMode(false);
    setEditedRole(null);
    
    // Initialize expanded categories
    const categories: Record<string, boolean> = {};
    Object.keys(permissionCategories).forEach(key => {
      categories[key] = false;
    });
    setExpandedCategories(categories);
  };

  const handleEditRole = () => {
    if (!selectedRole) return;
    setEditedRole({...selectedRole});
    setEditMode(true);
  };

  const handleSaveRole = () => {
    if (!editedRole) return;
    
    setRoles(prev => prev.map(role => 
      role.id === editedRole.id ? editedRole : role
    ));
    
    setSelectedRole(editedRole);
    setEditMode(false);
    setEditedRole(null);
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setEditedRole(null);
  };

  const handleDeleteRole = () => {
    if (!selectedRole) return;
    
    setRoles(prev => prev.filter(role => role.id !== selectedRole.id));
    setSelectedRole(null);
    setShowDeleteConfirm(false);
  };

  const handleDuplicateRole = () => {
    if (!selectedRole || !newRoleName.trim()) return;
    
    const newRole: Role = {
      ...selectedRole,
      id: (Math.max(...roles.map(r => parseInt(r.id))) + 1).toString(),
      name: newRoleName,
      description: `Copy of ${selectedRole.name}`,
      isSystem: false,
      userCount: 0
    };
    
    setRoles(prev => [...prev, newRole]);
    setShowDuplicateModal(false);
    setNewRoleName('');
  };

  const handleTogglePermission = (permission: Permission) => {
    if (!editedRole) return;
    
    const hasPermission = editedRole.permissions.includes(permission);
    
    if (hasPermission) {
      setEditedRole({
        ...editedRole,
        permissions: editedRole.permissions.filter(p => p !== permission)
      });
    } else {
      setEditedRole({
        ...editedRole,
        permissions: [...editedRole.permissions, permission]
      });
    }
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const toggleAllPermissionsInCategory = (category: string, shouldAdd: boolean) => {
    if (!editedRole) return;
    
    const categoryPermissions = permissionCategories[category as keyof typeof permissionCategories].permissions;
    
    if (shouldAdd) {
      // Add all permissions from this category that aren't already included
      const newPermissions = [...editedRole.permissions];
      categoryPermissions.forEach(permission => {
        if (!newPermissions.includes(permission as Permission)) {
          newPermissions.push(permission as Permission);
        }
      });
      
      setEditedRole({
        ...editedRole,
        permissions: newPermissions
      });
    } else {
      // Remove all permissions from this category
      setEditedRole({
        ...editedRole,
        permissions: editedRole.permissions.filter(p => !categoryPermissions.includes(p))
      });
    }
  };

  const countPermissionsByCategory = (role: Role, category: string) => {
    const categoryPermissions = permissionCategories[category as keyof typeof permissionCategories].permissions;
    return role.permissions.filter(p => categoryPermissions.includes(p)).length;
  };

  const createNewRole = () => {
    const newRole: Role = {
      id: (Math.max(...roles.map(r => parseInt(r.id))) + 1).toString(),
      name: 'New Role',
      description: 'Description for new role',
      isSystem: false,
      isActive: true,
      permissions: ['view_dashboard', 'view_own_profile'],
      userCount: 0
    };
    
    setRoles(prev => [...prev, newRole]);
    setSelectedRole(newRole);
    setEditedRole(newRole);
    setEditMode(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Role Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage system roles and permissions</p>
        </div>
        <button
          onClick={createNewRole}
          className="flex items-center space-x-2 bg-blue-600 dark:bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Role</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Roles List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">System Roles</h3>
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <Shield className="w-4 h-4" />
                <span>{roles.length} roles</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 mb-4">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                <input
                  type="text"
                  placeholder="Search roles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <select
                value={filterActive}
                onChange={(e) => setFilterActive(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          
          <div className="p-6">
            <div className="space-y-2">
              {filteredRoles.map((role) => (
                <div
                  key={role.id}
                  onClick={() => handleSelectRole(role)}
                  className={`p-4 rounded-lg cursor-pointer transition-colors ${
                    selectedRole?.id === role.id
                      ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
                      : 'border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${role.isSystem ? 'bg-purple-100 dark:bg-purple-900/30' : 'bg-blue-100 dark:bg-blue-900/30'}`}>
                        <Shield className={`w-4 h-4 ${role.isSystem ? 'text-purple-600 dark:text-purple-400' : 'text-blue-600 dark:text-blue-400'}`} />
                      </div>
                      <h4 className="font-medium text-gray-900 dark:text-white">{role.name}</h4>
                    </div>
                    <div className="flex items-center space-x-2">
                      {role.isSystem && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300">
                          System
                        </span>
                      )}
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        role.isActive 
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' 
                          : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                      }`}>
                        {role.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{role.description}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>{role.permissions.length} permissions</span>
                    <span>{role.userCount} users</span>
                  </div>
                </div>
              ))}
              
              {filteredRoles.length === 0 && (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No roles found</h4>
                  <p className="text-gray-600 dark:text-gray-400">Try adjusting your search or filters</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Role Details */}
        <div className="lg:col-span-2">
          {selectedRole ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${selectedRole.isSystem ? 'bg-purple-100 dark:bg-purple-900/30' : 'bg-blue-100 dark:bg-blue-900/30'}`}>
                      <Shield className={`w-5 h-5 ${selectedRole.isSystem ? 'text-purple-600 dark:text-purple-400' : 'text-blue-600 dark:text-blue-400'}`} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{selectedRole.name}</h3>
                      <div className="flex items-center space-x-2 text-sm">
                        {selectedRole.isSystem && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300">
                            <Lock className="w-3 h-3 mr-1" />
                            System Role
                          </span>
                        )}
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          selectedRole.isActive 
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' 
                            : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                        }`}>
                          {selectedRole.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {!editMode ? (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={handleEditRole}
                        className="flex items-center space-x-1 px-3 py-1.5 bg-blue-600 dark:bg-blue-500 text-white text-sm rounded hover:bg-blue-700 dark:hover:bg-blue-600"
                      >
                        <Edit className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => setShowDuplicateModal(true)}
                        className="flex items-center space-x-1 px-3 py-1.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm rounded hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <Copy className="w-3 h-3" />
                        <span>Duplicate</span>
                      </button>
                      {!selectedRole.isSystem && (
                        <button
                          onClick={() => setShowDeleteConfirm(true)}
                          className="flex items-center space-x-1 px-3 py-1.5 border border-gray-300 dark:border-gray-600 text-red-600 dark:text-red-400 text-sm rounded hover:bg-red-50 dark:hover:bg-red-900/20"
                          disabled={selectedRole.userCount > 0}
                          title={selectedRole.userCount > 0 ? "Cannot delete role with assigned users" : "Delete role"}
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Delete</span>
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={handleSaveRole}
                        className="flex items-center space-x-1 px-3 py-1.5 bg-green-600 dark:bg-green-500 text-white text-sm rounded hover:bg-green-700 dark:hover:bg-green-600"
                      >
                        <Save className="w-3 h-3" />
                        <span>Save</span>
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="flex items-center space-x-1 px-3 py-1.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm rounded hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <X className="w-3 h-3" />
                        <span>Cancel</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="p-6">
                {/* Role Information */}
                <div className="mb-6">
                  <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">Role Information</h4>
                  {editMode && editedRole ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Role Name
                        </label>
                        <input
                          type="text"
                          value={editedRole.name}
                          onChange={(e) => setEditedRole({...editedRole, name: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
                          disabled={editedRole.isSystem}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Description
                        </label>
                        <textarea
                          value={editedRole.description}
                          onChange={(e) => setEditedRole({...editedRole, description: e.target.value})}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Status:</label>
                        <button
                          onClick={() => setEditedRole({...editedRole, isActive: true})}
                          className={`px-3 py-1 text-sm rounded ${
                            editedRole.isActive 
                              ? 'bg-green-600 dark:bg-green-500 text-white' 
                              : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          Active
                        </button>
                        <button
                          onClick={() => setEditedRole({...editedRole, isActive: false})}
                          className={`px-3 py-1 text-sm rounded ${
                            !editedRole.isActive 
                              ? 'bg-red-600 dark:bg-red-500 text-white' 
                              : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          Inactive
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Role Name
                        </label>
                        <p className="text-sm text-gray-900 dark:text-white">{selectedRole.name}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Description
                        </label>
                        <p className="text-sm text-gray-900 dark:text-white">{selectedRole.description}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Users Assigned
                        </label>
                        <p className="text-sm text-gray-900 dark:text-white">{selectedRole.userCount}</p>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Permissions */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-md font-medium text-gray-900 dark:text-white">Permissions</h4>
                    {selectedRole.isSystem && !editMode && (
                      <div className="flex items-center space-x-1 text-xs text-yellow-600 dark:text-yellow-400">
                        <AlertTriangle className="w-3 h-3" />
                        <span>System roles have predefined permissions</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Permission Categories */}
                  <div className="space-y-4">
                    {Object.entries(permissionCategories).map(([key, category]) => {
                      const role = editMode && editedRole ? editedRole : selectedRole;
                      const permissionsInCategory = category.permissions as Permission[];
                      const grantedCount = countPermissionsByCategory(role, key);
                      const allGranted = grantedCount === permissionsInCategory.length;
                      const someGranted = grantedCount > 0 && grantedCount < permissionsInCategory.length;
                      
                      return (
                        <div key={key} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                          <div 
                            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-750 cursor-pointer"
                            onClick={() => toggleCategory(key)}
                          >
                            <div className="flex items-center space-x-2">
                              {expandedCategories[key] ? (
                                <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                              ) : (
                                <ChevronRight className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                              )}
                              <h5 className="font-medium text-gray-900 dark:text-white">{category.name}</h5>
                            </div>
                            <div className="flex items-center space-x-3">
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {grantedCount} of {permissionsInCategory.length} permissions
                              </div>
                              {editMode && editedRole && (
                                <div className="flex items-center space-x-1">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleAllPermissionsInCategory(key, true);
                                    }}
                                    className={`px-2 py-0.5 text-xs rounded ${
                                      allGranted 
                                        ? 'bg-green-600 dark:bg-green-500 text-white' 
                                        : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
                                    }`}
                                    disabled={allGranted}
                                  >
                                    All
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleAllPermissionsInCategory(key, false);
                                    }}
                                    className={`px-2 py-0.5 text-xs rounded ${
                                      grantedCount === 0 
                                        ? 'bg-gray-400 dark:bg-gray-500 text-white' 
                                        : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
                                    }`}
                                    disabled={grantedCount === 0}
                                  >
                                    None
                                  </button>
                                </div>
                              )}
                              {!editMode && (
                                <div className="flex items-center space-x-1">
                                  {allGranted && (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                                      <CheckCircle className="w-3 h-3 mr-1" />
                                      All
                                    </span>
                                  )}
                                  {someGranted && (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300">
                                      <AlertTriangle className="w-3 h-3 mr-1" />
                                      Partial
                                    </span>
                                  )}
                                  {grantedCount === 0 && (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">
                                      <XCircle className="w-3 h-3 mr-1" />
                                      None
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {expandedCategories[key] && (
                            <div className="p-3 border-t border-gray-200 dark:border-gray-700">
                              <div className="space-y-2">
                                {permissionsInCategory.map((permission) => {
                                  const hasPermission = role.permissions.includes(permission);
                                  
                                  return (
                                    <div key={permission} className="flex items-center justify-between">
                                      <div className="flex items-start space-x-2">
                                        {editMode && editedRole ? (
                                          <input
                                            type="checkbox"
                                            checked={hasPermission}
                                            onChange={() => handleTogglePermission(permission)}
                                            className="mt-1"
                                          />
                                        ) : (
                                          <div className={`w-5 h-5 flex items-center justify-center rounded-full ${
                                            hasPermission 
                                              ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' 
                                              : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
                                          }`}>
                                            {hasPermission ? (
                                              <CheckCircle className="w-4 h-4" />
                                            ) : (
                                              <XCircle className="w-4 h-4" />
                                            )}
                                          </div>
                                        )}
                                        <div>
                                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                                            {permission.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                          </p>
                                          <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {permissionDescriptions[permission] || 'No description available'}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
              <Shield className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No role selected</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">Select a role from the list to view details</p>
              <button
                onClick={createNewRole}
                className="inline-flex items-center space-x-2 bg-blue-600 dark:bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Role</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && selectedRole && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Delete Role</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Are you sure you want to delete the role <span className="font-medium">{selectedRole.name}</span>?
                This action cannot be undone.
              </p>
              {selectedRole.userCount > 0 && (
                <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg text-sm text-yellow-800 dark:text-yellow-300">
                  <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400 inline mr-2" />
                  This role has {selectedRole.userCount} users assigned to it. Please reassign these users before deleting.
                </div>
              )}
            </div>
            <div className="flex items-center justify-center space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteRole}
                className="px-4 py-2 bg-red-600 dark:bg-red-500 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-600"
                disabled={selectedRole.userCount > 0}
              >
                Delete Role
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Duplicate Role Modal */}
      {showDuplicateModal && selectedRole && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Duplicate Role</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Create a new role based on <span className="font-medium">{selectedRole.name}</span> with the same permissions.
              </p>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  New Role Name
                </label>
                <input
                  type="text"
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  placeholder="Enter role name"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDuplicateModal(false);
                  setNewRoleName('');
                }}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleDuplicateRole}
                className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600"
                disabled={!newRoleName.trim()}
              >
                Create Copy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}