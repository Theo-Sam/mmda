import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Permission, PermissionManager } from '../../utils/permissions';

interface PermissionGateProps {
  permission: Permission | Permission[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requireAll?: boolean; // If true, requires all permissions when array is passed
}

export default function PermissionGate({ 
  permission, 
  children, 
  fallback = null,
  requireAll = false 
}: PermissionGateProps) {
  const { user } = useAuth();

  if (!user?.role) {
    return <>{fallback}</>;
  }

  const permissionManager = new PermissionManager(user.role);
  
  let hasPermission = false;
  
  // Super admin always has access to everything
  if (user.role === 'super_admin') {
    hasPermission = true;
  } else {
    if (Array.isArray(permission)) {
      hasPermission = requireAll 
        ? permissionManager.hasAllPermissions(permission)
        : permissionManager.hasAnyPermission(permission);
    } else {
      hasPermission = permissionManager.hasPermission(permission);
    }
  }

  return hasPermission ? <>{children}</> : <>{fallback}</>;
}