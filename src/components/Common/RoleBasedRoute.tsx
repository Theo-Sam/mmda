import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Permission, PermissionManager } from '../../utils/permissions';

interface RoleBasedRouteProps {
  permission: Permission | Permission[];
  children: React.ReactNode;
  redirectTo?: string;
  requireAll?: boolean;
}

export default function RoleBasedRoute({ 
  permission, 
  children, 
  redirectTo = '/dashboard',
  requireAll = false 
}: RoleBasedRouteProps) {
  const { user, isLoading } = useAuth();

  // Wait for loading to finish before making any redirect decisions
  if (isLoading) return null;

  if (!user || !user.role) {
    if (window.location.pathname === '/login') return null;
    return <Navigate to="/login" replace />;
  }

  const permissionManager = new PermissionManager(user.role);
  
  let hasPermission = false;
  
  // Super admin always has access to all routes
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

  if (!hasPermission) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
}