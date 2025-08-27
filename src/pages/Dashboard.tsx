import React from 'react';
import {
  DollarSign,
  Building2,
  Users,
  FileText,
  TrendingUp,
  Plus,
  UserPlus,
  CreditCard,
  Bell,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowRight,
  Globe,
  Shield,
  Database,
  Eye,
  BarChart3,
  UserCheck,
  Receipt,
  Zap,
  Activity,
  Calculator,
  PieChart,
  Target,
  AlertOctagon,
  UserX
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import StatCard from '../components/Dashboard/StatCard';
import AnalyticsSection from '../components/Dashboard/AnalyticsSection';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useAuth();
  const { dashboardStats, auditLogs, businesses, collections } = useApp();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Role-specific dashboard content
  const getDashboardContent = () => {
    switch (user?.role) {
      case 'super_admin': {
        return {
          title: 'National Overview',
          subtitle: 'Monitor all MMDAs across Ghana',
          stats: [
            { title: 'Total Revenue (National)', value: formatCurrency((dashboardStats?.totalRevenue || 0) * 16), icon: DollarSign, color: 'green' as const },
            { title: 'Registered MMDAs', value: '260', icon: Globe, color: 'blue' as const },
            { title: 'Total Users', value: '1,247', icon: Users, color: 'yellow' as const },
            { title: 'System Uptime', value: '99.8%', icon: Shield, color: 'red' as const },
          ],
          quickActions: [
            { label: 'System Monitoring', href: '/system-monitoring', icon: Eye, description: 'Monitor system performance', color: 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600' },
            { label: 'MMDA Management', href: '/districts', icon: Globe, description: 'Manage MMDA configurations', color: 'bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600' },
            { label: 'User Management', href: '/system-users', icon: Users, description: 'Manage system users', color: 'bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600' },
          ]
        };
      }

      case 'mmda_admin': {
        const districtBusinesses = businesses.filter(b => b.status === 'active').length;
        const districtRevenue = collections.reduce((sum, c) => sum + c.amount, 0);
        const todaysCollections = collections.filter(c =>
          new Date(c.date).toDateString() === new Date().toDateString()
        ).length;

        return {
          title: `${user.district} - Admin Dashboard`,
          subtitle: 'Manage your district operations and monitor performance',
          stats: [
            { title: 'District Revenue', value: formatCurrency(districtRevenue), icon: DollarSign, color: 'green' as const },
            { title: 'Active Businesses', value: districtBusinesses, icon: Building2, color: 'blue' as const },
            { title: 'Today\'s Collections', value: todaysCollections, icon: Receipt, color: 'yellow' as const },
            { title: 'Pending Validations', value: '8', icon: Clock, color: 'red' as const },
          ],
          quickActions: [
            { label: 'Register Business', href: '/businesses', icon: Building2, description: 'Add new business to the system', color: 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600' },
            { label: 'Assign Collector', href: '/assignments', icon: UserCheck, description: 'Assign collectors to zones', color: 'bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600' },
            { label: 'Manage Revenue Types', href: '/revenue-types', icon: CreditCard, description: 'Configure revenue categories', color: 'bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600' },
            { label: 'Validate Payments', href: '/collections', icon: CheckCircle, description: 'Review and approve payments', color: 'bg-orange-600 hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-600' },
            { label: 'Add Users', href: '/users', icon: UserPlus, description: 'Add staff to your MMDA', color: 'bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600' },
            { label: 'View Reports', href: '/reports', icon: BarChart3, description: 'Generate district reports', color: 'bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600' },
            { label: 'Collector Performance', href: '/collector-performance', icon: TrendingUp, description: 'Monitor collector efficiency and metrics', color: 'bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600' },
          ]
        };
      }

      case 'finance': {
        const pendingValidations = collections.filter(c => c.status === 'pending').length;
        const monthlyRevenue = collections
          .filter(c => new Date(c.date).getMonth() === new Date().getMonth())
          .reduce((sum, c) => sum + c.amount, 0);
        const todaysCollectionsFinance = collections.filter(c =>
          new Date(c.date).toDateString() === new Date().toDateString()
        ).length;

        return {
          title: 'Financial Overview',
          subtitle: 'Monitor revenue and validate collections',
          stats: [
            { title: 'Monthly Revenue', value: formatCurrency(monthlyRevenue), icon: DollarSign, color: 'green' as const },
            { title: 'Pending Validations', value: pendingValidations, icon: Clock, color: 'red' as const },
            { title: 'Today\'s Collections', value: todaysCollectionsFinance, icon: Receipt, color: 'blue' as const },
            { title: 'Revenue Types', value: '8', icon: CreditCard, color: 'yellow' as const },
          ],
          quickActions: [
            { label: 'Validate Payments', href: '/collections', icon: CheckCircle, description: 'Review and approve pending payments', color: 'bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600' },
            { label: 'Financial Reports', href: '/reports', icon: BarChart3, description: 'Generate financial statements', color: 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600' },
            { label: 'Revenue Analysis', href: '/revenue-analysis', icon: TrendingUp, description: 'Analyze revenue trends', color: 'bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600' },
            { label: 'Collections Overview', href: '/collections', icon: Target, description: 'View collection metrics', color: 'bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600' },
            { label: 'Export Records', href: '/exports', icon: Database, description: 'Export financial data', color: 'bg-orange-600 hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-600' },
            { label: 'Manage Revenue Types', href: '/revenue-types', icon: CreditCard, description: 'Configure fee structures', color: 'bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600' },
            { label: 'Collector Performance', href: '/collector-performance', icon: TrendingUp, description: 'Monitor collector efficiency and metrics', color: 'bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600' },
          ]
        };
      }

      case 'collector': {
        // Calculate collector-specific stats
        const collectorCollections = collections.filter(c => c.collectorId === user.id);
        const todayCollections = collectorCollections.filter(c =>
          new Date(c.date).toDateString() === new Date().toDateString()
        );
        const todayRevenue = todayCollections.reduce((sum, c) => sum + c.amount, 0);
        const monthlyCollections = collectorCollections.filter(c =>
          new Date(c.date).getMonth() === new Date().getMonth() &&
          new Date(c.date).getFullYear() === new Date().getFullYear()
        );
        const monthlyRevenue = monthlyCollections.reduce((sum, c) => sum + c.amount, 0);

        return {
          title: 'Collection Dashboard',
          subtitle: 'Manage your assigned collections',
          stats: [
            { title: 'Today\'s Collections', value: formatCurrency(todayRevenue), icon: DollarSign, color: 'green' as const },
            { title: 'Monthly Revenue', value: formatCurrency(monthlyRevenue), icon: Receipt, color: 'blue' as const },
            { title: 'Assigned Businesses', value: '23', icon: Building2, color: 'yellow' as const },
            { title: 'Collection Rate', value: '87%', icon: TrendingUp, color: 'red' as const },
          ],
          quickActions: [
            { label: 'Record Payment', href: '/collections', icon: DollarSign, description: 'Record new payment', color: 'bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600' },
            { label: 'View Assignments', href: '/assignments', icon: UserCheck, description: 'Check your assignments', color: 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600' },
            { label: 'Generate Receipt', href: '/receipts', icon: Receipt, description: 'Create payment receipts', color: 'bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600' },
            { label: 'View Businesses', href: '/businesses', icon: Building2, description: 'View assigned businesses', color: 'bg-yellow-600 hover:bg-yellow-700 dark:bg-yellow-500 dark:hover:bg-yellow-600' },
          ]
        };
      }

      case 'business_owner': {
        return {
          title: 'Business Dashboard',
          subtitle: 'Manage your business payments and profile',
          stats: [
            { title: 'Total Paid This Year', value: formatCurrency(1200), icon: DollarSign, color: 'green' as const },
            { title: 'Payment History', value: '24', icon: FileText, color: 'blue' as const },
            { title: 'Pending Payments', value: '2', icon: Clock, color: 'yellow' as const },
            { title: 'Business Status', value: 'Active', icon: CheckCircle, color: 'red' as const },
          ],
          quickActions: [
            { label: 'Payment Management', href: '/payment-management', icon: FileText, description: 'View payment records and receipts', color: 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600' },
            { label: 'Business Profile', href: '/business-profile', icon: Building2, description: 'Update business info', color: 'bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600' },
          ]
        };
      }

      case 'auditor': {
        return {
          title: 'Audit Dashboard',
          subtitle: 'Monitor compliance and system integrity',
          stats: [
            { title: 'Audit Logs Today', value: '156', icon: FileText, color: 'green' as const },
            { title: 'Compliance Score', value: '94%', icon: Shield, color: 'blue' as const },
            { title: 'Flagged Transactions', value: '3', icon: AlertTriangle, color: 'yellow' as const },
            { title: 'Reports Generated', value: '12', icon: BarChart3, color: 'red' as const },
          ],
          quickActions: [
            { label: 'Audit Reports', href: '/audit-logs', icon: FileText, description: 'View audit trails', color: 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600' },
            { label: 'Compliance Check', href: '/compliance', icon: Shield, description: 'Run compliance checks', color: 'bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600' },
          ]
        };
      }

      case 'monitoring_body': {
        return {
          title: 'National Monitoring',
          subtitle: 'Oversee MMDA performance nationwide',
          stats: [
            { title: 'MMDAs Monitored', value: '260', icon: Globe, color: 'green' as const },
            { title: 'Performance Score', value: '82%', icon: TrendingUp, color: 'blue' as const },
            { title: 'Data Quality', value: '96%', icon: Database, color: 'yellow' as const },
            { title: 'Active Issues', value: '7', icon: AlertTriangle, color: 'red' as const },
          ],
          quickActions: [
            { label: 'MMDA Reports', href: '/mmda-reports', icon: TrendingUp, description: 'Monitor district performance', color: 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600' },
            { label: 'Data Export', href: '/data-export', icon: Database, description: 'Export monitoring data', color: 'bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600' },
          ]
        };
      }

      case 'business_registration_officer': {
        return {
          title: 'Business Registration',
          subtitle: 'Manage business registrations and updates',
          stats: [
            { title: 'Total Businesses', value: businesses.length.toString(), icon: Building2, color: 'green' as const },
            { title: 'Active Businesses', value: businesses.filter(b => b.status === 'active').length.toString(), icon: CheckCircle, color: 'blue' as const },
            { title: 'Pending Registrations', value: businesses.filter(b => b.status === 'pending').length.toString(), icon: Clock, color: 'yellow' as const },
            { title: 'Recent Registrations', value: '12', icon: Plus, color: 'red' as const },
          ],
          quickActions: [
            { label: 'Register Business', href: '/businesses', icon: Plus, description: 'Add new business', color: 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600' },
            { label: 'View Businesses', href: '/businesses', icon: Building2, description: 'Manage existing businesses', color: 'bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600' },
            { label: 'View Reports', href: '/reports', icon: BarChart3, description: 'Business statistics', color: 'bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600' },
          ]
        };
      }

      case 'regional_admin': {
        // Mock data for regional dashboard
        const region = 'Greater Accra'; // Default region
        const totalMMDAs = 20;
        const totalRevenue = 3500000;
        const totalBusinesses = 4200;
        const activeMMDAAdmins = 18;
        const topMMDAs = [
          { name: 'Accra Metropolitan', revenue: 1200000, growth: 10.5, businesses: 1200 },
          { name: 'Tema Municipal', revenue: 900000, growth: 8.2, businesses: 900 },
          { name: 'Ga East', revenue: 700000, growth: 7.1, businesses: 700 },
        ];
        return {
          title: `${region} - Regional Dashboard`,
          subtitle: `Monitor all MMDAs in ${region}`,
          stats: [
            { title: 'Total Regional Revenue', value: formatCurrency(totalRevenue), icon: DollarSign, color: 'green' as const },
            { title: 'MMDAs in Region', value: totalMMDAs, icon: Globe, color: 'blue' as const },
            { title: 'Total Businesses', value: totalBusinesses, icon: Building2, color: 'yellow' as const },
            { title: 'Active MMDA Admins', value: activeMMDAAdmins, icon: Users, color: 'red' as const },
          ],
          quickActions: [
            { label: 'Manage MMDAs', href: '/regional-users', icon: Globe, description: 'Manage MMDAs in your region', color: 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600' },
            { label: 'Regional Report Center', href: '/regional-report-center', icon: BarChart3, description: 'View regional analytics', color: 'bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600' },
            { label: 'User Management', href: '/regional-users', icon: Users, description: 'Manage MMDA Admins', color: 'bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600' },
          ],
          topMMDAs,
          alerts: [
            { type: 'info', message: '3 MMDAs have not submitted monthly reports', details: 'Follow up required', time: '2 hours ago', action: 'View Reports', href: '/regional-report-center' },
            { type: 'warning', message: '2 MMDA Admins inactive', details: 'Check on user activity', time: '4 hours ago', action: 'Manage Users', href: '/regional-users' },
            { type: 'success', message: 'Revenue target exceeded', details: 'This month\'s target surpassed by 8%', time: '1 day ago', action: 'View Analytics', href: '/regional-report-center' },
          ]
        };
      }

      default: {
        return {
          title: 'Dashboard',
          subtitle: 'Welcome to the MMDA Revenue System',
          stats: [],
          quickActions: []
        };
      }
    }
  };

  const dashboardContent = getDashboardContent();

  // Role-specific alerts with enhanced MMDA admin alerts
  const getRoleSpecificAlerts = () => {
    switch (user?.role) {
      case 'mmda_admin': {
        return [
          {
            type: 'critical',
            message: '3 pending validations exceed 48 hours',
            details: 'High-value payments require immediate attention',
            time: '1 hour ago',
            action: 'Review Urgently',
            href: '/collections'
          },
          {
            type: 'warning',
            message: 'Collector John Doe hasn\'t submitted reports in 2 days',
            details: 'Zone A collections may be delayed',
            time: '2 hours ago',
            action: 'Follow Up',
            href: '/assignments'
          },
          {
            type: 'critical',
            message: '5 overdue payments from Zone C businesses',
            details: 'Total overdue amount: GHS 12,500',
            time: '3 hours ago',
            action: 'Send Reminders',
            href: '/collections'
          },
          {
            type: 'warning',
            message: 'Collector Sarah Wilson missed daily target',
            details: 'Only 60% of assigned collections completed',
            time: '4 hours ago',
            action: 'Check Performance',
            href: '/assignments'
          },
          {
            type: 'info',
            message: 'New business applications pending verification',
            details: '8 applications require document review',
            time: '6 hours ago',
            action: 'Review Applications',
            href: '/businesses'
          },
          {
            type: 'success',
            message: 'Monthly revenue target achieved',
            details: 'Revenue target exceeded by 15% this month',
            time: '1 day ago',
            action: 'View Report',
            href: '/reports'
          }
        ];
      }

      case 'finance': {
        return [
          {
            type: 'critical',
            message: 'Urgent Validations',
            details: '12 high-value payments awaiting approval',
            time: '1 hour ago',
            action: 'Validate Now',
            href: '/collections'
          },
          {
            type: 'warning',
            message: 'Revenue Variance',
            details: 'Monthly revenue 8% below target',
            time: '3 hours ago',
            action: 'View Analysis',
            href: '/reports'
          },
          {
            type: 'info',
            message: 'Reconciliation Due',
            details: 'Weekly financial reconciliation pending',
            time: '6 hours ago',
            action: 'Start Reconciliation',
            href: '/reconciliation'
          },
          {
            type: 'success',
            message: 'Audit Complete',
            details: 'Monthly audit completed successfully',
            time: '1 day ago',
            action: 'View Report',
            href: '/audit-logs'
          }
        ];
      }

      case 'collector': {
        return [
          {
            type: 'warning',
            message: 'Collection Targets',
            details: '3 businesses have pending collections',
            time: '2 hours ago',
            action: 'View Assignments',
            href: '/assignments'
          },
          {
            type: 'info',
            message: 'New Assignment',
            details: 'You have been assigned to Makola Market Zone B',
            time: '4 hours ago',
            action: 'View Details',
            href: '/assignments'
          },
          {
            type: 'success',
            message: 'Collection Goal',
            details: 'You\'ve reached 85% of your monthly target',
            time: '1 day ago',
            action: 'View Progress',
            href: '/reports'
          }
        ];
      }

      case 'business_registration_officer': {
        return [
          {
            type: 'warning',
            message: 'Pending Verifications',
            details: '5 businesses require document verification',
            time: '2 hours ago',
            action: 'Review Documents',
            href: '/businesses'
          },
          {
            type: 'info',
            message: 'Registration Renewals',
            details: '12 businesses due for license renewal this month',
            time: '4 hours ago',
            action: 'View List',
            href: '/businesses'
          },
          {
            type: 'success',
            message: 'Registration Target',
            details: 'Monthly registration target achieved',
            time: '1 day ago',
            action: 'View Report',
            href: '/reports'
          }
        ];
      }

      default: {
        return [
          {
            type: 'warning',
            message: 'Overdue Payments',
            details: '15 businesses have overdue payments',
            time: '2 hours ago',
            action: 'View Details',
            href: '/collections'
          },
          {
            type: 'info',
            message: 'Pending Approvals',
            details: '8 business applications awaiting approval',
            time: '4 hours ago',
            action: 'Review',
            href: '/businesses'
          },
          {
            type: 'success',
            message: 'Target Achieved',
            details: 'Monthly revenue target exceeded by 12%',
            time: '1 day ago',
            action: 'View Report',
            href: '/reports'
          }
        ];
      }
    }
  };

  const alerts = getRoleSpecificAlerts();

  const getAlertStyle = (type: string) => {
    switch (type) {
      case 'critical': return 'border-red-300 dark:border-red-600 bg-red-100 dark:bg-red-900/40 shadow-sm';
      case 'warning': return 'border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/30';
      case 'info': return 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/30';
      case 'success': return 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/30';
      default: return 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical': return <AlertOctagon className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5" />;
      case 'info': return <Activity className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5" />;
      case 'success': return <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5" />;
      default: return <Activity className="w-4 h-4 text-gray-600 dark:text-gray-400 mt-0.5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {dashboardContent.title}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {dashboardContent.subtitle}
          </p>
          <div className="flex items-center space-x-4 mt-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">Welcome back, {user?.name}</span>
            <span className="text-sm text-gray-400 dark:text-gray-500">•</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">{user?.district}</span>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
          <Clock className="w-4 h-4" />
          <span>{new Date().toLocaleDateString('en-GB', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}</span>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardContent.stats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
          />
        ))}
      </div>

      {/* Analytics & Reports Section */}
      <AnalyticsSection 
        userRole={user?.role || ''} 
        district={user?.district}
      />

      {/* Quick Actions */}
      {dashboardContent.quickActions.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Actions</h3>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {user?.role === 'regional_admin' ? 'Regional Management Tools' :
                user?.role === 'mmda_admin' ? 'District Management Tools' :
                  user?.role === 'finance' ? 'Financial Management Tools' :
                    user?.role === 'collector' ? 'Collection Tools' :
                      user?.role === 'business_registration_officer' ? 'Business Registration Tools' :
                        'Frequently Used Tools'}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dashboardContent.quickActions.map((action) => (
              <Link
                key={action.label}
                to={action.href}
                className="group relative overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-200"
              >
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-lg ${action.color} text-white`}>
                    <action.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {action.label}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {action.description}
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Top Performing MMDAs Table for Regional Admin */}
      {user?.role === 'regional_admin' && dashboardContent.topMMDAs && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top Performing MMDAs</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">MMDA</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Revenue</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Growth</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Businesses</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {dashboardContent.topMMDAs.map((mmda, idx) => (
                  <tr key={idx}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{mmda.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{formatCurrency(mmda.revenue)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 dark:text-green-400">{mmda.growth}%</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{mmda.businesses}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Enhanced Notifications/Alerts Panel */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {user?.role === 'regional_admin' ? 'Regional Alerts' :
                user?.role === 'finance' ? 'Financial Alerts' :
                  user?.role === 'mmda_admin' ? 'District Alerts' :
                    user?.role === 'collector' ? 'Collection Alerts' :
                      user?.role === 'business_registration_officer' ? 'Registration Alerts' :
                        'System Alerts'}
            </h3>
            <div className="flex items-center space-x-2">
              <Bell className="w-4 h-4 text-gray-400 dark:text-gray-500" />
              <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                {user?.role === 'regional_admin' && dashboardContent.alerts ? dashboardContent.alerts.length : alerts.length}
              </span>
            </div>
          </div>
          {user?.role === 'mmda_admin' && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Monitor urgent district issues, pending validations, and collector performance
            </p>
          )}
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {user?.role === 'regional_admin' && dashboardContent.alerts ? (
              dashboardContent.alerts.map((alert, index) => (
                <div key={index} className={`flex items-start space-x-3 p-3 rounded-lg border ${getAlertStyle(alert.type)} relative`}>
                  {alert.type === 'critical' && (
                    <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium shadow-lg">
                      URGENT
                    </div>
                  )}
                  {getAlertIcon(alert.type)}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{alert.message}</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{alert.details}</p>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs text-gray-600 dark:text-gray-400">{alert.time}</p>
                      <Link
                        to={alert.href}
                        className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
                      >
                        {alert.action} →
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              alerts.map((alert, index) => (
                <div key={index} className={`flex items-start space-x-3 p-3 rounded-lg border ${getAlertStyle(alert.type)} relative`}>
                  {alert.type === 'critical' && (
                    <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium shadow-lg">
                      URGENT
                    </div>
                  )}
                  {getAlertIcon(alert.type)}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{alert.message}</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{alert.details}</p>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs text-gray-600 dark:text-gray-400">{alert.time}</p>
                      <Link
                        to={alert.href}
                        className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
                      >
                        {alert.action} →
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
