import React from 'react';

// Role permission mappings based on the provided table
export const ROLE_PERMISSIONS = {
  super_admin: [
    'view_dashboard',
    'manage_users',
    'view_users', 
    'assign_roles',
    'create_mmda',
    'edit_mmda',
    'deactivate_mmda',
    'view_all_mmdas',
    'register_business',
    'edit_business',
    'delete_business',
    'view_business',
    'view_my_business',
    'create_revenue_type',
    'edit_revenue_type',
    'delete_revenue_type',
    'view_revenue_types',
    'assign_collector',
    'edit_assignment',
    'delete_assignment',
    'view_assignments',
    'view_my_assignments',
    'record_payment',
    'edit_payment',
    'delete_payment',
    'validate_payment',
    'view_collections',
    'view_my_collections',
    'make_payment',
    'view_my_payments',
    'generate_receipt',
    'view_reports',
    'export_reports',
    'view_collector_performance',
    'view_audit_logs',
    'search_logs',
    'flag_irregularities',
    'view_own_profile',
    'change_password',
    'set_notifications',
    'view_notifications',
    'send_notifications'
  ],
  mmda_admin: [
    'view_dashboard',
    'manage_users',
    'view_users',
    'assign_roles',
    'edit_mmda',
    'register_business',
    'edit_business',
    'delete_business',
    'view_business',
    'create_revenue_type',
    'edit_revenue_type',
    'delete_revenue_type',
    'view_revenue_types',
    'assign_collector',
    'edit_assignment',
    'delete_assignment',
    'view_assignments',
    'validate_payment',
    'view_collections',
    'view_reports',
    'export_reports',
    'view_collector_performance',
    'view_audit_logs',
    'search_logs',
    'view_own_profile',
    'change_password',
    'set_notifications',
    'view_notifications',
    'send_notifications'
  ],
  business_registration_officer: [
    'view_dashboard',
    'register_business',
    'edit_business',
    'view_business',
    'view_revenue_types',
    'view_reports',
    'view_own_profile',
    'change_password',
    'set_notifications',
    'view_notifications'
  ],
  finance: [
    'view_dashboard',
    'view_users',
    'view_business',
    'create_revenue_type',
    'edit_revenue_type',
    'view_revenue_types',
    'validate_payment',
    'view_collections',
    'view_reports',
    'export_reports',
    'view_collector_performance',
    'view_audit_logs',
    'search_logs',
    'view_own_profile',
    'change_password',
    'set_notifications',
    'view_notifications'
  ],
  collector: [
    'view_dashboard',
    'view_business',
    'view_my_business',
    'view_my_assignments',
    'record_payment',
    'edit_payment',
    'view_my_collections',
    'generate_receipt',
    'view_own_profile',
    'change_password',
    'set_notifications',
    'view_notifications'
  ],
  auditor: [
    'view_dashboard',
    'view_business',
    'view_revenue_types',
    'view_assignments',
    'view_collections',
    'view_reports',
    'export_reports',
    'view_collector_performance',
    'view_audit_logs',
    'search_logs',
    'flag_irregularities',
    'view_own_profile',
    'change_password',
    'set_notifications',
    'view_notifications'
  ],
  business_owner: [
    'view_dashboard',
    'view_my_business',
    'view_my_payments',
    'make_payment',
    'generate_receipt',
    'view_own_profile',
    'change_password',
    'set_notifications',
    'view_notifications'
  ],
  monitoring_body: [
    'view_dashboard',
    'view_all_mmdas',
    'view_business',
    'view_revenue_types',
    'view_assignments',
    'view_collections',
    'view_reports',
    'export_reports',
    'view_collector_performance',
    'view_audit_logs',
    'search_logs',
    'view_own_profile',
    'change_password',
    'set_notifications',
    'view_notifications'
  ],
  regional_admin: [
    'view_dashboard',
    'manage_users',
    'view_users',
    'assign_roles',
    'edit_mmda',
    'deactivate_mmda',
    'view_all_mmdas',
    'register_business',
    'edit_business',
    'delete_business',
    'view_business',
    'create_revenue_type',
    'edit_revenue_type',
    'delete_revenue_type',
    'view_revenue_types',
    'assign_collector',
    'edit_assignment',
    'delete_assignment',
    'view_assignments',
    'validate_payment',
    'view_collections',
    'view_reports',
    'export_reports',
    'view_collector_performance',
    'view_audit_logs',
    'search_logs',
    'view_own_profile',
    'change_password',
    'set_notifications',
    'view_notifications',
    'send_notifications'
  ]
} as const;

export type Permission = typeof ROLE_PERMISSIONS[keyof typeof ROLE_PERMISSIONS][number];
export type Role = keyof typeof ROLE_PERMISSIONS;

// Permission checking utility
export class PermissionManager {
  private userRole: Role;
  private userPermissions: Permission[];

  constructor(userRole: Role) {
    this.userRole = userRole;
    this.userPermissions = ROLE_PERMISSIONS[userRole] || [];
  }

  hasPermission(permission: Permission): boolean {
    // Super admin has all permissions
    if (this.userRole === 'super_admin') {
      return true;
    }
    return this.userPermissions.includes(permission);
  }

  hasAnyPermission(permissions: Permission[]): boolean {
    // Super admin has all permissions
    if (this.userRole === 'super_admin') {
      return true;
    }
    return permissions.some(permission => this.hasPermission(permission));
  }

  hasAllPermissions(permissions: Permission[]): boolean {
    // Super admin has all permissions
    if (this.userRole === 'super_admin') {
      return true;
    }
    return permissions.every(permission => this.hasPermission(permission));
  }

  getPermissions(): Permission[] {
    return [...this.userPermissions];
  }

  canManageUsers(): boolean {
    return this.hasPermission('manage_users');
  }

  canManageBusinesses(): boolean {
    return this.hasAnyPermission(['register_business', 'edit_business', 'delete_business']);
  }

  canManageRevenue(): boolean {
    return this.hasAnyPermission(['create_revenue_type', 'edit_revenue_type', 'delete_revenue_type']);
  }

  canManageCollections(): boolean {
    return this.hasAnyPermission(['record_payment', 'edit_payment', 'validate_payment']);
  }

  canViewReports(): boolean {
    return this.hasPermission('view_reports');
  }

  canExportData(): boolean {
    return this.hasPermission('export_reports');
  }

  canViewAuditLogs(): boolean {
    return this.hasPermission('view_audit_logs');
  }

  canManageAssignments(): boolean {
    return this.hasAnyPermission(['assign_collector', 'edit_assignment', 'delete_assignment']);
  }
}

// React hook for permission checking
export function usePermissions(userRole?: Role) {
  if (!userRole) return null;
  return new PermissionManager(userRole);
}

// Permission-based component wrapper
export function withPermission<T extends object>(
  Component: React.ComponentType<T>,
  requiredPermission: Permission | Permission[],
  fallback?: React.ComponentType<T>
) {
  return function PermissionWrapper(props: T & { userRole?: Role }) {
    const { userRole, ...componentProps } = props;
    
    if (!userRole) {
      return fallback ? React.createElement(fallback, componentProps) : null;
    }

    const permissions = new PermissionManager(userRole);
    const hasPermission = Array.isArray(requiredPermission)
      ? permissions.hasAnyPermission(requiredPermission)
      : permissions.hasPermission(requiredPermission);

    if (!hasPermission) {
      return fallback ? React.createElement(fallback, componentProps) : null;
    }

    return React.createElement(Component, componentProps);
  };
}