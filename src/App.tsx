import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AppProvider } from './contexts/AppContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/Layout/Layout';
import LoginPage from './components/Auth/LoginPage';
import BusinessOwnerLoginPage from './components/Auth/BusinessOwnerLoginPage';
import Dashboard from './pages/Dashboard';
import Businesses from './pages/Businesses';
import BusinessManagement from './pages/BusinessManagement';
import Collections from './pages/Collections';
import Reports from './pages/Reports';


import Settings from './pages/Settings';
import PaymentValidation from './pages/PaymentValidation';

import BusinessProfile from './pages/BusinessProfile';
import MakePayment from './pages/MakePayment';
import PaymentManagement from './pages/PaymentManagement';
import RoleBasedRoute from './components/Common/RoleBasedRoute';

// Super Admin Pages
import SuperAdminDashboard from './pages/SuperAdmin/Dashboard';
import MMDAManagement from './pages/SuperAdmin/DistrictManagement';
import UserManagement from './pages/SuperAdmin/UserManagement';

import ReportsCenter from './pages/SuperAdmin/ReportsCenter';
import SystemMonitoring from './pages/SuperAdmin/SystemMonitoring';


// Auditor Pages
import AuditorDashboard from './pages/Auditor/Dashboard';
import TransactionReview from './pages/Auditor/TransactionReview';
import ComplianceCheck from './pages/Auditor/ComplianceCheck';
import AuditorReportsCenter from './pages/Auditor/ReportsCenter';

// Monitoring Body Pages
import MonitoringBodyDashboard from './pages/MonitoringBody/Dashboard';
import MMDAReports from './pages/MonitoringBody/MMDAReports';

// MMDA Admin Pages
import MMDACollectorAssignments from './pages/MMDA/CollectorAssignments';
import RevenueTypes from './pages/Revenue/RevenueTypes';

import MMDAUserManagement from './pages/MMDA/MMDAUserManagement';


// Finance Pages
import DataExports from './pages/Finance/DataExports';
import ReconciliationPage from './pages/Finance/ReconciliationPage';
import RevenueAnalysis from './pages/Finance/RevenueAnalysis';

// Collector Pages
import CollectorAssignments from './pages/Collector/CollectorAssignments';

// Business Registration Officer Pages
import BusinessRegistrationOfficerDashboard from './pages/BusinessRegistrationOfficer/Dashboard';

// Regional Admin Pages
import RegionalAdminUserManagement from './pages/RegionalAdmin/UserManagement';
import RegionReportCenter from './pages/RegionalAdmin/RegionReportCenter';


function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-500"></div>
      </div>
    );
  }

  return user && user.role ? <>{children}</> : <Navigate to="/login" replace />;
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/business" element={<BusinessOwnerLoginPage />} />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* Dashboard Route - Role-specific */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <RoleBasedRoute permission="view_dashboard">
              <Layout>
                {user?.role === 'super_admin' ? <SuperAdminDashboard /> :
                  user?.role === 'auditor' ? <AuditorDashboard /> :
                    user?.role === 'monitoring_body' ? <MonitoringBodyDashboard /> :
                      user?.role === 'business_registration_officer' ? <BusinessRegistrationOfficerDashboard /> :
                        <Dashboard />}
              </Layout>
            </RoleBasedRoute>
          </PrivateRoute>
        }
      />

      {/* Super Admin Routes */}
      <Route
        path="/districts"
        element={
          <PrivateRoute>
            <RoleBasedRoute permission="view_all_mmdas">
              <Layout>
                <MMDAManagement />
              </Layout>
            </RoleBasedRoute>
          </PrivateRoute>
        }
      />

      <Route
        path="/system-users"
        element={
          <PrivateRoute>
            <RoleBasedRoute permission="manage_users">
              <Layout>
                <UserManagement />
              </Layout>
            </RoleBasedRoute>
          </PrivateRoute>
        }
      />



      <Route
        path="/system-monitoring"
        element={
          <PrivateRoute>
            <RoleBasedRoute permission="view_all_mmdas">
              <Layout>
                <SystemMonitoring />
              </Layout>
            </RoleBasedRoute>
          </PrivateRoute>
        }
      />



      {/* Auditor Routes */}
      <Route
        path="/transaction-review"
        element={
          <PrivateRoute>
            <RoleBasedRoute permission="flag_irregularities">
              <Layout>
                <TransactionReview />
              </Layout>
            </RoleBasedRoute>
          </PrivateRoute>
        }
      />

      <Route
        path="/compliance"
        element={
          <PrivateRoute>
            <RoleBasedRoute permission="flag_irregularities">
              <Layout>
                <ComplianceCheck />
              </Layout>
            </RoleBasedRoute>
          </PrivateRoute>
        }
      />

      {/* Monitoring Body Routes */}
      <Route
        path="/mmda-reports"
        element={
          <PrivateRoute>
            <RoleBasedRoute permission="view_all_mmdas">
              <Layout>
                <MMDAReports />
              </Layout>
            </RoleBasedRoute>
          </PrivateRoute>
        }
      />



      {/* Regular Routes */}
      <Route
        path="/businesses"
        element={
          <PrivateRoute>
            <RoleBasedRoute permission={['view_business', 'view_my_business', 'register_business']}>
              <Layout>
                {user?.role === 'business_registration_officer' || user?.role === 'mmda_admin' ? <BusinessManagement /> : <Businesses />}
              </Layout>
            </RoleBasedRoute>
          </PrivateRoute>
        }
      />

      <Route
        path="/collections"
        element={
          <PrivateRoute>
            <RoleBasedRoute permission={['view_collections', 'view_my_collections', 'record_payment']}>
              <Layout>
                {user?.role === 'finance' ? <PaymentValidation /> : <Collections />}
              </Layout>
            </RoleBasedRoute>
          </PrivateRoute>
        }
      />

      <Route
        path="/reports"
        element={
          <PrivateRoute>
            <RoleBasedRoute permission="view_reports">
              <Layout>
                {user?.role === 'super_admin' ? <ReportsCenter /> :
                  user?.role === 'auditor' ? <AuditorReportsCenter /> : <Reports />}
              </Layout>
            </RoleBasedRoute>
          </PrivateRoute>
        }
      />



      <Route
        path="/payment-management"
        element={
          <PrivateRoute>
            <RoleBasedRoute permission="view_my_payments">
              <Layout>
                <PaymentManagement />
              </Layout>
            </RoleBasedRoute>
          </PrivateRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <PrivateRoute>
            <RoleBasedRoute permission="view_own_profile">
              <Layout>
                <Settings />
              </Layout>
            </RoleBasedRoute>
          </PrivateRoute>
        }
      />

      {/* Business Owner specific routes */}
      <Route
        path="/business-profile"
        element={
          <PrivateRoute>
            <RoleBasedRoute permission="view_my_business">
              <Layout>
                <BusinessProfile />
              </Layout>
            </RoleBasedRoute>
          </PrivateRoute>
        }
      />

      <Route
        path="/make-payment"
        element={
          <PrivateRoute>
            <RoleBasedRoute permission="make_payment">
              <Layout>
                <MakePayment />
              </Layout>
            </RoleBasedRoute>
          </PrivateRoute>
        }
      />



      {/* Collector specific routes */}
      <Route
        path="/assignments"
        element={
          <PrivateRoute>
            <RoleBasedRoute permission={['view_assignments', 'view_my_assignments']}>
              <Layout>
                {user?.role === 'mmda_admin' ? <MMDACollectorAssignments /> : <CollectorAssignments />}
              </Layout>
            </RoleBasedRoute>
          </PrivateRoute>
        }
      />





      <Route
        path="/exports"
        element={
          <PrivateRoute>
            <RoleBasedRoute permission="export_reports">
              <Layout>
                <DataExports />
              </Layout>
            </RoleBasedRoute>
          </PrivateRoute>
        }
      />

      <Route
        path="/reconciliation"
        element={
          <PrivateRoute>
            <RoleBasedRoute permission="view_collections">
              <Layout>
                <ReconciliationPage />
              </Layout>
            </RoleBasedRoute>
          </PrivateRoute>
        }
      />

      <Route
        path="/revenue-analysis"
        element={
          <PrivateRoute>
            <RoleBasedRoute permission="view_reports">
              <Layout>
                <RevenueAnalysis />
              </Layout>
            </RoleBasedRoute>
          </PrivateRoute>
        }
      />

      {/* MMDA Admin specific routes */}
      <Route
        path="/revenue-types"
        element={
          <PrivateRoute>
            <RoleBasedRoute permission="view_revenue_types">
              <Layout>
                <RevenueTypes />
              </Layout>
            </RoleBasedRoute>
          </PrivateRoute>
        }
      />

      <Route
        path="/users"
        element={
          <PrivateRoute>
            <RoleBasedRoute permission={['manage_users', 'view_users']}>
              <Layout>
                <UserManagement />
              </Layout>
            </RoleBasedRoute>
          </PrivateRoute>
        }
      />

      <Route
        path="/regional-users"
        element={
          <PrivateRoute>
            <RoleBasedRoute permission="manage_users">
              <Layout>
                <RegionalAdminUserManagement />
              </Layout>
            </RoleBasedRoute>
          </PrivateRoute>
        }
      />

      <Route
        path="/region-report-center"
        element={
          <PrivateRoute>
            <RoleBasedRoute permission="view_reports">
              <Layout>
                <RegionReportCenter />
              </Layout>
            </RoleBasedRoute>
          </PrivateRoute>
        }
      />





      <Route
        path="/mmda-users"
        element={
          <PrivateRoute>
            <RoleBasedRoute permission={['manage_users', 'view_users']}>
              <Layout>
                <MMDAUserManagement />
              </Layout>
            </RoleBasedRoute>
          </PrivateRoute>
        }
      />



      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppProvider>
          <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <AppRoutes />
          </Router>
        </AppProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;