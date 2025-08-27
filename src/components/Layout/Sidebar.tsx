import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  Users,
  Receipt,
  BarChart3,
  FileText,
  Settings,
  UserCheck,
  CreditCard,
  Bell,
  Shield,
  Globe,
  Database,
  MapPin,
  TrendingUp,
  Eye,
  Activity,
  UserPlus,
  Zap,
  Download,
  Printer,
  CheckCircle,
  Target,
  PieChart,
  Calculator,
  RefreshCw,
  DollarSign,
  Upload,
  Search,
  AlertTriangle,
  Flag
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { PermissionManager } from '../../utils/permissions';
import PermissionGate from '../Common/PermissionGate';

interface NavItem {
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  permission: string | string[];
  requireAll?: boolean;
}

// Super Admin specific navigation
const superAdminNavItems: NavItem[] = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, permission: 'view_dashboard' },
  { path: '/system-users', label: 'User Management', icon: Users, permission: 'manage_users' },
  { path: '/districts', label: 'MMDA Management', icon: Globe, permission: 'view_all_mmdas' },
  { path: '/system-monitoring', label: 'System Monitoring', icon: Eye, permission: 'view_all_mmdas' },
  { path: '/collector-performance', label: 'Collector Performance', icon: TrendingUp, permission: 'view_collector_performance' },
];

// Regional Admin navigation
const regionalAdminNavItems: NavItem[] = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, permission: 'view_dashboard' },
  { path: '/regional-users', label: 'User Management', icon: Users, permission: 'manage_users' },
  { path: '/districts', label: 'MMDA Management', icon: Globe, permission: 'view_all_mmdas' },
  { path: '/region-report-center', label: 'Region Report Center', icon: BarChart3, permission: 'view_reports' },
  { path: '/collector-performance', label: 'Collector Performance', icon: TrendingUp, permission: 'view_collector_performance' },
];

// Business Registration Officer navigation
const businessRegistrationOfficerNavItems: NavItem[] = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, permission: 'view_dashboard' },
  { path: '/businesses', label: 'Business Management', icon: Building2, permission: ['register_business', 'view_business'] },
];

// MMDA Admin specific navigation
const mmdaAdminNavItems: NavItem[] = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, permission: 'view_dashboard' },
  { path: '/businesses', label: 'Business Management', icon: Building2, permission: ['view_business', 'register_business'] },
  { path: '/assignments', label: 'Collector Assignments', icon: UserCheck, permission: ['view_assignments', 'assign_collector'] },
  { path: '/mmda-users', label: 'MMDA User Management', icon: Users, permission: ['manage_users', 'view_users'] },
  { path: '/collections', label: 'Collections Overview', icon: Receipt, permission: ['view_collections', 'validate_payment'] },
  { path: '/collector-performance', label: 'Collector Performance', icon: TrendingUp, permission: 'view_collector_performance' },
];

// Finance Officer navigation
const financeNavItems: NavItem[] = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, permission: 'view_dashboard' },
  { path: '/businesses', label: 'Businesses', icon: Building2, permission: 'view_business' },
  { path: '/collections', label: 'Payment Validation', icon: CheckCircle, permission: 'view_collections' },
  { path: '/reconciliation', label: 'Reconciliation', icon: Calculator, permission: 'view_collections' },
  { path: '/revenue-analysis', label: 'Revenue Analysis', icon: TrendingUp, permission: 'view_reports' },
  { path: '/exports', label: 'Data Export', icon: Download, permission: 'export_reports' },
  { path: '/collector-performance', label: 'Collector Performance', icon: TrendingUp, permission: 'view_collector_performance' },
];

// Collector navigation
const collectorNavItems: NavItem[] = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, permission: 'view_dashboard' },
  { path: '/businesses', label: 'My Businesses', icon: Building2, permission: ['view_business', 'view_my_business'] },
  { path: '/assignments', label: 'My Assignments', icon: UserCheck, permission: 'view_my_assignments' },
  { path: '/collections', label: 'Record Payments', icon: DollarSign, permission: 'record_payment' },
];

// Business Owner navigation
const businessOwnerNavItems: NavItem[] = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, permission: 'view_dashboard' },
  { path: '/business-profile', label: 'My Business Profile', icon: Building2, permission: 'view_my_business' },
  { path: '/make-payment', label: 'Make Payment', icon: DollarSign, permission: 'make_payment' },
  { path: '/payment-management', label: 'Payment Management', icon: Receipt, permission: 'view_my_payments' },
];

// Auditor navigation
const auditorNavItems: NavItem[] = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, permission: 'view_dashboard' },
  { path: '/transaction-review', label: 'Transaction Review', icon: Search, permission: 'flag_irregularities' },
  { path: '/compliance', label: 'Compliance Check', icon: Shield, permission: 'flag_irregularities' },
];

// Monitoring Body navigation
const monitoringBodyNavItems: NavItem[] = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, permission: 'view_dashboard' },
  { path: '/mmda-reports', label: 'MMDA Oversight', icon: BarChart3, permission: 'view_all_mmdas' },
  { path: '/enhanced-monitoring', label: 'Enhanced Monitoring', icon: Activity, permission: 'view_all_mmdas' },
  { path: '/predictive-analytics', label: 'Predictive Analytics', icon: TrendingUp, permission: 'view_all_mmdas' },
  { path: '/intervention-planning', label: 'Intervention Planning', icon: Target, permission: 'view_all_mmdas' },
];

export default function Sidebar() {
  const { user } = useAuth();

  if (!user) return null;

  const permissionManager = user.role ? new PermissionManager(user.role) : null;

  const getRoleDisplayName = (role: string) => {
    const roleNames = {
      super_admin: 'Super Admin',
      mmda_admin: 'MMDA Admin',
      business_registration_officer: 'Business Registration Officer',
      finance: 'Finance Officer',
      collector: 'Collector',
      business_owner: 'Business Owner',
      auditor: 'Auditor',
      monitoring_body: 'Monitoring Body'
    };
    return roleNames[role as keyof typeof roleNames] || role;
  };

  const getRoleColor = (role: string) => {
    const roleColors = {
      super_admin: 'bg-purple-600',
      mmda_admin: 'bg-blue-600',
      business_registration_officer: 'bg-teal-600',
      finance: 'bg-green-600',
      collector: 'bg-yellow-600',
      business_owner: 'bg-gray-600',
      auditor: 'bg-red-600',
      monitoring_body: 'bg-indigo-600'
    };
    return roleColors[role as keyof typeof roleColors] || 'bg-gray-600';
  };

  // Choose navigation items based on role
  const getNavItems = () => {
    switch (user.role) {
      case 'super_admin':
        return superAdminNavItems;
      case 'regional_admin':
        return regionalAdminNavItems;
      case 'mmda_admin':
        return mmdaAdminNavItems;
      case 'business_registration_officer':
        return businessRegistrationOfficerNavItems;
      case 'finance':
        return financeNavItems;
      case 'collector':
        return collectorNavItems;
      case 'business_owner':
        return businessOwnerNavItems;
      case 'auditor':
        return auditorNavItems;
      case 'monitoring_body':
        return monitoringBodyNavItems;
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  // Filter nav items based on user permissions
  const visibleNavItems = navItems.filter(item => {
    if (!permissionManager) return false;

    // Super admin always has access to everything
    if (user.role === 'super_admin') return true;

    if (Array.isArray(item.permission)) {
      return item.requireAll
        ? permissionManager.hasAllPermissions(item.permission as any)
        : permissionManager.hasAnyPermission(item.permission as any);
    }

    return permissionManager.hasPermission(item.permission as any);
  });

  return (
    <div className="w-64 bg-blue-900 dark:bg-gray-900 text-white h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-blue-800 dark:border-gray-800">
        <div className="flex items-center space-x-3">
          <div className={`w-8 h-8 ${getRoleColor(user.role)} dark:bg-opacity-80 rounded-lg flex items-center justify-center`}>
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-lg">MMDA</h1>
            <p className="text-blue-200 dark:text-gray-400 text-sm">Revenue System</p>
          </div>
        </div>

        {/* User Role Badge */}
        <div className="mt-3 p-2 bg-blue-800 dark:bg-gray-800 rounded-lg">
          <p className="text-xs text-blue-200 dark:text-gray-400">Logged in as</p>
          <p className="text-sm font-medium">{getRoleDisplayName(user.role)}</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 overflow-y-auto">
        <ul className="space-y-1">
          {visibleNavItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors text-sm ${isActive
                    ? 'bg-blue-800 dark:bg-gray-800 text-white'
                    : 'text-blue-100 dark:text-gray-300 hover:bg-blue-800 dark:hover:bg-gray-800 hover:text-white'
                  }`
                }
              >
                <item.icon className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* MMDA Info */}
      <div className="p-3 border-t border-blue-800 dark:border-gray-800">
        <div className="text-xs text-blue-200 dark:text-gray-400 mb-1">
          {user.role === 'super_admin' ? 'Level' :
            user.role === 'monitoring_body' ? 'Ministry' : 'MMDA'}
        </div>
        <div className="text-sm font-medium truncate" title={user.district}>
          {user.district}
        </div>
      </div>

      {/* Settings */}
      <div className="p-3 border-t border-blue-800 dark:border-gray-800">
        <PermissionGate permission="view_own_profile">
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors text-sm ${isActive
                ? 'bg-blue-800 dark:bg-gray-800 text-white'
                : 'text-blue-100 dark:text-gray-300 hover:bg-blue-800 dark:hover:bg-gray-800 hover:text-white'
              }`
            }
          >
            <Settings className="w-4 h-4 flex-shrink-0" />
            <span>Settings</span>
          </NavLink>
        </PermissionGate>
      </div>
    </div>
  );
}