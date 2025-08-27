import React, { createContext, useContext, useState } from 'react';
import { Business, RevenueType, Collection, Assignment, AuditLog, DashboardStats } from '../types';
import { MMDA } from '../types/MMDA';
import { v4 as uuidv4 } from 'uuid';
import { SystemUser } from '../types/SystemUser';

export interface CollectorData {
  id: string;
  name: string;
  district: string;
  region: string;
  totalCollected: number;
  monthlyTarget: number;
  businessesAssigned: number;
  collectionsCount: number;
  efficiency: number;
  growth: number;
  lastActive: string;
  performance: 'excellent' | 'good' | 'average' | 'poor';
}

interface AppContextType {
  businesses: Business[];
  setBusinesses: React.Dispatch<React.SetStateAction<Business[]>>;
  revenueTypes: RevenueType[];
  setRevenueTypes: React.Dispatch<React.SetStateAction<RevenueType[]>>;
  collections: Collection[];
  setCollections: React.Dispatch<React.SetStateAction<Collection[]>>;
  assignments: Assignment[];
  setAssignments: React.Dispatch<React.SetStateAction<Assignment[]>>;
  auditLogs: AuditLog[];
  setAuditLogs: React.Dispatch<React.SetStateAction<AuditLog[]>>;
  dashboardStats: DashboardStats | null;
  setDashboardStats: React.Dispatch<React.SetStateAction<DashboardStats | null>>;
  mmdas: MMDA[];
  setMMDAs: React.Dispatch<React.SetStateAction<MMDA[]>>;
  collectorPerformance: CollectorData[];
  setCollectorPerformance: React.Dispatch<React.SetStateAction<CollectorData[]>>;
  users: SystemUser[];
  setUsers: React.Dispatch<React.SetStateAction<SystemUser[]>>;
  reconciliationData: any[];
  setReconciliationData: React.Dispatch<React.SetStateAction<any[]>>;
  revenueAnalytics: any[];
  setRevenueAnalytics: React.Dispatch<React.SetStateAction<any[]>>;
  nationalRevenueOversight: any[];
  setNationalRevenueOversight: React.Dispatch<React.SetStateAction<any[]>>;
  regionalOversightData: any[];
  setRegionalOversightData: React.Dispatch<React.SetStateAction<any[]>>;
  realTimeAlerts: any[];
  setRealTimeAlerts: React.Dispatch<React.SetStateAction<any[]>>;
  predictiveAnalytics: any[];
  setPredictiveAnalytics: React.Dispatch<React.SetStateAction<any[]>>;
  complianceData: any[];
  setComplianceData: React.Dispatch<React.SetStateAction<any[]>>;
  performanceBenchmarks: any[];
  setPerformanceBenchmarks: React.Dispatch<React.SetStateAction<any[]>>;
  interventionPlans: any[];
  setInterventionPlans: React.Dispatch<React.SetStateAction<any[]>>;
  communicationLogs: any[];
  setCommunicationLogs: React.Dispatch<React.SetStateAction<any[]>>;
  dataQualityMetrics: any;
  setDataQualityMetrics: React.Dispatch<React.SetStateAction<any>>;
  advancedInsights: any[];
  setAdvancedInsights: React.Dispatch<React.SetStateAction<any[]>>;
  fieldMonitoringData: any[];
  setFieldMonitoringData: React.Dispatch<React.SetStateAction<any[]>>;
  systemIntegrationStatus: any;
  setSystemIntegrationStatus: React.Dispatch<React.SetStateAction<any>>;
  transactions: any[];
  setTransactions: React.Dispatch<React.SetStateAction<any[]>>;
  addBusiness: (business: Omit<Business, 'id'>) => Promise<void>;
  updateBusiness: (id: string, updates: Partial<Business>) => Promise<void>;
  addCollection: (collection: Omit<Collection, 'id'>) => Promise<void>;
  addAuditLog: (log: Omit<AuditLog, 'id' | 'timestamp'>) => Promise<void>;
  loading: boolean;
  error: string | null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [businesses, setBusinesses] = useState<Business[]>([
    {
      id: 'b1', businessCode: 'BUS-100001', name: 'Accra Bakery', ownerName: 'Ama Mensah', category: 'Bakery', phone: '0244000001',
      email: 'ama@bakery.com', gpsLocation: 'Accra', physicalAddress: '123 Accra St', status: 'active', registrationDate: '2024-01-10',
      lastPayment: '2024-06-01', businessLicense: 'LIC-001', tinNumber: 'TIN-001', district: 'Accra Metropolitan'
    },
    {
      id: 'b2', businessCode: 'BUS-100002', name: 'Tema Hardware', ownerName: 'Kwesi Boateng', category: 'Hardware', phone: '0244000002',
      email: 'kwesi@hardware.com', gpsLocation: 'Tema', physicalAddress: '456 Tema Rd', status: 'active', registrationDate: '2024-02-15',
      lastPayment: '2024-06-10', businessLicense: 'LIC-002', tinNumber: 'TIN-002', district: 'Tema Metropolitan'
    },
    {
      id: 'b3', businessCode: 'BUS-100003', name: 'Osu Boutique', ownerName: 'Efua Asante', category: 'Fashion', phone: '0244000003',
      email: 'efua@boutique.com', gpsLocation: 'Osu', physicalAddress: '789 Osu Ave', status: 'pending', registrationDate: '2024-03-20',
      lastPayment: '', businessLicense: '', tinNumber: 'TIN-003', district: 'Accra Metropolitan'
    },
  ]);

  const [revenueTypes, setRevenueTypes] = useState<RevenueType[]>([
    {
      id: 'rt1', code: 'RT-101', name: 'Business Operating Permit', defaultAmount: 500, frequency: 'yearly', description: 'Annual permit for business operation', isActive: true, category: 'permit'
    },
    {
      id: 'rt2', code: 'RT-102', name: 'Signage Fee', defaultAmount: 300, frequency: 'yearly', description: 'Fee for business signage', isActive: true, category: 'fee'
    },
  ]);

  const [collections, setCollections] = useState<Collection[]>([
    {
      id: 'c1', receiptCode: 'RCP-2024-1001', businessId: 'b1', revenueTypeId: 'rt1', collectorId: '5', amount: 500, paymentMethod: 'cash',
      receiptId: 'RCPT-001', date: '2024-06-01', status: 'paid', district: 'Accra Metropolitan', receiptImage: '', notes: 'June payment'
    },
    {
      id: 'c2', receiptCode: 'RCP-2024-1002', businessId: 'b2', revenueTypeId: 'rt2', collectorId: '5', amount: 800, paymentMethod: 'momo',
      receiptId: 'RCPT-002', date: '2024-06-10', status: 'paid', district: 'Tema Metropolitan', receiptImage: '', notes: 'June payment'
    },
    {
      id: 'c3', receiptCode: 'RCP-2024-1003', businessId: 'b3', revenueTypeId: 'rt1', collectorId: '5', amount: 0, paymentMethod: 'cash',
      receiptId: 'RCPT-003', date: '2024-06-15', status: 'pending', district: 'Accra Metropolitan', receiptImage: '', notes: 'Pending payment'
    },
  ]);

  const [assignments, setAssignments] = useState<Assignment[]>([
    {
      id: 'a1', assignmentCode: 'ASG-2024-001', collectorId: '5', businessId: 'b1', zone: 'Zone A', startDate: '2024-06-01', isActive: true, assignedBy: 'admin1', district: 'Accra Metropolitan'
    },
    {
      id: 'a2', assignmentCode: 'ASG-2024-002', collectorId: '5', businessId: 'b2', zone: 'Zone B', startDate: '2024-06-01', isActive: true, assignedBy: 'admin1', district: 'Tema Metropolitan'
    },
  ]);

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([
    {
      id: 'al1', userId: '5', userName: 'John Doe', userRole: 'collector', action: 'Collection recorded', details: 'Payment collected from Accra Bakery', timestamp: '2024-06-01T10:00:00Z', ipAddress: '192.168.1.1', district: 'Accra Metropolitan', entityType: 'payment', entityId: 'c1'
    },
    {
      id: 'al2', userId: 'admin1', userName: 'Admin User', userRole: 'mmda_admin', action: 'Business registered', details: 'New business Osu Boutique registered', timestamp: '2024-03-20T14:30:00Z', ipAddress: '192.168.1.2', district: 'Accra Metropolitan', entityType: 'business', entityId: 'b3'
    },
  ]);

  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    totalRevenue: 1300,
    totalBusinesses: 3,
    totalCollectors: 1,
    pendingPayments: 1,
    monthlyGrowth: 15.5,
    activeDistricts: 2,
    totalUsers: 8,
    systemUptime: 99.8
  });

  const [mmdas, setMMDAs] = useState<MMDA[]>([
    {
      id: 'mmda1', name: 'Accra Metropolitan Assembly', code: 'AMA', region: 'Greater Accra', district: 'Accra Metropolitan', contactEmail: 'info@ama.gov.gh', contactPhone: '+233302123456', address: 'Accra, Ghana', isActive: true, logo: '', website: 'https://ama.gov.gh'
    },
    {
      id: 'mmda2', name: 'Tema Metropolitan Assembly', code: 'TMA', region: 'Greater Accra', district: 'Tema Metropolitan', contactEmail: 'info@tma.gov.gh', contactPhone: '+233303123456', address: 'Tema, Ghana', isActive: true, logo: '', website: 'https://tma.gov.gh'
    },
  ]);

  const [collectorPerformance, setCollectorPerformance] = useState<CollectorData[]>([
    {
      id: 'cp1', name: 'John Doe', district: 'Accra Metropolitan', region: 'Greater Accra', totalCollected: 1300, monthlyTarget: 2000, businessesAssigned: 3, collectionsCount: 2, efficiency: 85, growth: 12, lastActive: '2024-06-15', performance: 'good'
    },
  ]);

  const [users, setUsers] = useState<SystemUser[]>([
    {
      id: 'u1', name: 'John Doe', email: 'john@example.com', role: 'collector', district: 'Accra Metropolitan', phone: '0244000005', isActive: true, permissions: ['view_assignments', 'record_payment'], lastLogin: '2024-06-15T10:00:00Z'
    },
    {
      id: 'admin1', name: 'Admin User', email: 'admin@example.com', role: 'mmda_admin', district: 'Accra Metropolitan', phone: '0244000006', isActive: true, permissions: ['manage_users', 'view_reports'], lastLogin: '2024-06-15T09:00:00Z'
    },
  ]);

  const [reconciliationData, setReconciliationData] = useState<any[]>([]);
  const [revenueAnalytics, setRevenueAnalytics] = useState<any[]>([
    { month: 'Jan', revenue: 3200000, target: 3000000, mmdaCount: 260, compliance: 94.2 },
    { month: 'Feb', revenue: 4100000, target: 3500000, mmdaCount: 260, compliance: 94.8 },
    { month: 'Mar', revenue: 3800000, target: 3200000, mmdaCount: 260, compliance: 95.1 },
    { month: 'Apr', revenue: 4500000, target: 4000000, mmdaCount: 260, compliance: 95.5 },
    { month: 'May', revenue: 5200000, target: 4500000, mmdaCount: 260, compliance: 96.2 },
    { month: 'Jun', revenue: 4800000, target: 4200000, mmdaCount: 260, compliance: 96.8 },
    { month: 'Jul', revenue: 5500000, target: 5000000, mmdaCount: 260, compliance: 97.1 },
    { month: 'Aug', revenue: 6100000, target: 5500000, mmdaCount: 260, compliance: 97.5 },
    { month: 'Sep', revenue: 5800000, target: 5200000, mmdaCount: 260, compliance: 97.8 },
    { month: 'Oct', revenue: 6400000, target: 5800000, mmdaCount: 260, compliance: 98.1 },
    { month: 'Nov', revenue: 7200000, target: 6500000, mmdaCount: 260, compliance: 98.4 },
    { month: 'Dec', revenue: 8100000, target: 7000000, mmdaCount: 260, compliance: 98.7 }
  ]);

  // Add national revenue oversight data
  const [nationalRevenueOversight, setNationalRevenueOversight] = useState<any[]>([
    { month: 'Jan', actual: 3200000, target: 3000000, variance: 200000, achievement: 106.7, mmdasOnTarget: 245, mmdasBelowTarget: 15 },
    { month: 'Feb', actual: 4100000, target: 3500000, variance: 600000, achievement: 117.1, mmdasOnTarget: 248, mmdasBelowTarget: 12 },
    { month: 'Mar', actual: 3800000, target: 3200000, variance: 600000, achievement: 118.8, mmdasOnTarget: 250, mmdasBelowTarget: 10 },
    { month: 'Apr', actual: 4500000, target: 4000000, variance: 500000, achievement: 112.5, mmdasOnTarget: 252, mmdasBelowTarget: 8 },
    { month: 'May', actual: 5200000, target: 4500000, variance: 700000, achievement: 115.6, mmdasOnTarget: 254, mmdasBelowTarget: 6 },
    { month: 'Jun', actual: 4800000, target: 4200000, variance: 600000, achievement: 114.3, mmdasOnTarget: 255, mmdasBelowTarget: 5 },
    { month: 'Jul', actual: 5500000, target: 5000000, variance: 500000, achievement: 110.0, mmdasOnTarget: 256, mmdasBelowTarget: 4 },
    { month: 'Aug', actual: 6100000, target: 5500000, variance: 600000, achievement: 110.9, mmdasOnTarget: 257, mmdasBelowTarget: 3 },
    { month: 'Sep', actual: 5800000, target: 5200000, variance: 600000, achievement: 111.5, mmdasOnTarget: 258, mmdasBelowTarget: 2 },
    { month: 'Oct', actual: 6400000, target: 5800000, variance: 600000, achievement: 110.3, mmdasOnTarget: 258, mmdasBelowTarget: 2 },
    { month: 'Nov', actual: 7200000, target: 6500000, variance: 700000, achievement: 110.8, mmdasOnTarget: 259, mmdasBelowTarget: 1 },
    { month: 'Dec', actual: 8100000, target: 7000000, variance: 1100000, achievement: 115.7, mmdasOnTarget: 260, mmdasBelowTarget: 0 }
  ]);

  // Add regional performance data for oversight
  const [regionalOversightData, setRegionalOversightData] = useState<any[]>([
    { region: 'Greater Accra', mmdas: 29, revenue: 12500000, target: 11000000, achievement: 113.6, compliance: 95.2, performance: 'excellent' },
    { region: 'Ashanti', mmdas: 43, revenue: 9800000, target: 8500000, achievement: 115.3, compliance: 92.8, performance: 'excellent' },
    { region: 'Western', mmdas: 22, revenue: 7200000, target: 6500000, achievement: 110.8, compliance: 89.5, performance: 'good' },
    { region: 'Central', mmdas: 20, revenue: 6100000, target: 5800000, achievement: 105.2, compliance: 87.3, performance: 'good' },
    { region: 'Eastern', mmdas: 33, revenue: 5800000, target: 5200000, achievement: 111.5, compliance: 91.1, performance: 'excellent' },
    { region: 'Northern', mmdas: 26, revenue: 4200000, target: 4000000, achievement: 105.0, compliance: 84.7, performance: 'good' },
    { region: 'Volta', mmdas: 25, revenue: 3900000, target: 3600000, achievement: 108.3, compliance: 88.9, performance: 'good' },
    { region: 'Brong Ahafo', mmdas: 27, revenue: 3600000, target: 3300000, achievement: 109.1, compliance: 86.2, performance: 'good' },
    { region: 'Upper East', mmdas: 15, revenue: 2100000, target: 2000000, achievement: 105.0, compliance: 82.1, performance: 'average' },
    { region: 'Upper West', mmdas: 11, revenue: 1800000, target: 1700000, achievement: 105.9, compliance: 79.8, performance: 'average' }
  ]);

  // Add real-time monitoring and alerts data
  const [realTimeAlerts, setRealTimeAlerts] = useState<any[]>([
    { id: '1', type: 'critical', title: 'Revenue Target Alert', message: 'Northern Region MMDAs falling below 80% target', mmda: 'Tamale Metropolitan', severity: 'high', timestamp: new Date().toISOString(), status: 'active', assignedTo: 'monitoring_team_1' },
    { id: '2', type: 'warning', title: 'Compliance Drop', message: 'Western Region compliance rate dropped by 5% this week', mmda: 'Takoradi Metropolitan', severity: 'medium', timestamp: new Date(Date.now() - 3600000).toISOString(), status: 'investigating', assignedTo: 'monitoring_team_2' },
    { id: '3', type: 'info', title: 'Target Achievement', message: 'Greater Accra Region exceeded monthly target by 15%', mmda: 'Accra Metropolitan', severity: 'low', timestamp: new Date(Date.now() - 7200000).toISOString(), status: 'resolved', assignedTo: 'monitoring_team_1' },
    { id: '4', type: 'critical', title: 'System Alert', message: '3 MMDAs reporting connectivity issues', mmda: 'Multiple', severity: 'high', timestamp: new Date(Date.now() - 1800000).toISOString(), status: 'active', assignedTo: 'technical_team' }
  ]);

  // Add predictive analytics data
  const [predictiveAnalytics, setPredictiveAnalytics] = useState<any[]>([
    { month: 'Jan 2025', predictedRevenue: 8500000, confidence: 95, riskLevel: 'low', factors: ['seasonal growth', 'new businesses', 'improved compliance'] },
    { month: 'Feb 2025', predictedRevenue: 8200000, confidence: 92, riskLevel: 'low', factors: ['stable growth', 'continued compliance'] },
    { month: 'Mar 2025', predictedRevenue: 8800000, confidence: 88, riskLevel: 'medium', factors: ['quarterly payments', 'business renewals'] },
    { month: 'Apr 2025', predictedRevenue: 9000000, confidence: 85, riskLevel: 'medium', factors: ['annual renewals', 'tax season'] },
    { month: 'May 2025', predictedRevenue: 8700000, confidence: 90, riskLevel: 'low', factors: ['post-tax season', 'steady growth'] },
    { month: 'Jun 2025', predictedRevenue: 9200000, confidence: 87, riskLevel: 'medium', factors: ['mid-year renewals', 'business expansion'] }
  ]);

  // Add compliance and audit data
  const [complianceData, setComplianceData] = useState<any[]>([
    { mmda: 'Accra Metropolitan', overallScore: 96.8, businessPermits: 98, propertyRates: 95, marketFees: 97, signagePermits: 94, lastAudit: '2024-12-01', nextAudit: '2025-03-01', status: 'excellent' },
    { mmda: 'Tema Metropolitan', overallScore: 94.2, businessPermits: 96, propertyRates: 93, marketFees: 95, signagePermits: 92, lastAudit: '2024-11-15', nextAudit: '2025-02-15', status: 'good' },
    { mmda: 'Kumasi Metropolitan', overallScore: 91.5, businessPermits: 93, propertyRates: 90, marketFees: 92, signagePermits: 89, lastAudit: '2024-12-10', nextAudit: '2025-03-10', status: 'good' },
    { mmda: 'Tamale Metropolitan', overallScore: 87.3, businessPermits: 89, propertyRates: 85, marketFees: 88, signagePermits: 83, lastAudit: '2024-11-20', nextAudit: '2025-02-20', status: 'needs_improvement' },
    { mmda: 'Cape Coast Metropolitan', overallScore: 89.7, businessPermits: 91, propertyRates: 88, marketFees: 90, signagePermits: 87, lastAudit: '2024-12-05', nextAudit: '2025-03-05', status: 'good' }
  ]);

  // Add performance benchmarking data
  const [performanceBenchmarks, setPerformanceBenchmarks] = useState<any[]>([
    { category: 'Large MMDAs (100k+ population)', avgRevenue: 850000, avgCompliance: 94.2, topPerformer: 'Accra Metropolitan', benchmarkScore: 100 },
    { category: 'Medium MMDAs (50k-100k population)', avgRevenue: 420000, avgCompliance: 91.8, topPerformer: 'Tema Metropolitan', benchmarkScore: 95 },
    { category: 'Small MMDAs (<50k population)', avgRevenue: 180000, avgCompliance: 88.5, topPerformer: 'Ga West Municipal', benchmarkScore: 87 },
    { category: 'Rural MMDAs', avgRevenue: 95000, avgCompliance: 85.2, topPerformer: 'Adaklu District', benchmarkScore: 82 }
  ]);

  // Add action planning and intervention data
  const [interventionPlans, setInterventionPlans] = useState<any[]>([
    { id: '1', mmda: 'Tamale Metropolitan', issue: 'Low compliance rate (84.7%)', action: 'Enhanced training for collectors', assignedTo: 'training_team', deadline: '2025-02-15', status: 'in_progress', progress: 65 },
    { id: '2', mmda: 'Upper East Region MMDAs', issue: 'Below target achievement', action: 'Additional resource allocation', assignedTo: 'resource_team', deadline: '2025-01-30', status: 'planned', progress: 0 },
    { id: '3', mmda: 'Western Region MMDAs', issue: 'Declining compliance trend', action: 'Compliance audit and training', assignedTo: 'audit_team', deadline: '2025-02-28', status: 'planned', progress: 0 }
  ]);

  // Add stakeholder communication data
  const [communicationLogs, setCommunicationLogs] = useState<any[]>([
    { id: '1', type: 'email', recipient: 'Northern Region Coordinators', subject: 'Performance Review Meeting', content: 'Scheduled performance review for underperforming MMDAs', timestamp: new Date().toISOString(), status: 'sent', priority: 'high' },
    { id: '2', type: 'sms', recipient: 'Tamale Metropolitan', subject: 'Compliance Alert', content: 'Your compliance rate has dropped below 85%. Immediate action required.', timestamp: new Date(Date.now() - 1800000).toISOString(), status: 'delivered', priority: 'critical' },
    { id: '3', type: 'report', recipient: 'Ministry of Local Government', subject: 'Monthly Performance Report', content: 'December 2024 MMDA performance summary', timestamp: new Date(Date.now() - 86400000).toISOString(), status: 'delivered', priority: 'medium' }
  ]);

  // Add data quality and validation metrics
  const [dataQualityMetrics, setDataQualityMetrics] = useState<any>({
    overallScore: 94.8,
    completeness: 96.2,
    accuracy: 93.5,
    timeliness: 95.1,
    consistency: 94.7,
    lastValidation: new Date().toISOString(),
    issues: [
      { type: 'missing_data', count: 12, severity: 'low', affectedMMDAs: ['Ga South', 'Ledzokuku'] },
      { type: 'data_inconsistency', count: 5, severity: 'medium', affectedMMDAs: ['Ashaiman', 'Adenta'] },
      { type: 'timing_delay', count: 3, severity: 'high', affectedMMDAs: ['Northern Region'] }
    ]
  });

  // Add advanced analytics and insights
  const [advancedInsights, setAdvancedInsights] = useState<any[]>([
    { id: '1', type: 'trend', title: 'Seasonal Revenue Pattern', description: 'Revenue peaks in Q4 due to annual renewals and tax season', confidence: 92, impact: 'high', recommendation: 'Optimize resource allocation for Q4 peak period' },
    { id: '2', type: 'correlation', title: 'Compliance vs Revenue Correlation', description: 'Strong positive correlation (0.87) between compliance rates and revenue achievement', confidence: 89, impact: 'medium', recommendation: 'Focus on compliance improvement to boost revenue' },
    { id: '3', type: 'anomaly', title: 'Unusual Growth in Western Region', description: 'Western Region showing 18.5% growth vs national average of 12.5%', confidence: 95, impact: 'low', recommendation: 'Investigate and replicate successful strategies' },
    { id: '4', type: 'risk', title: 'Northern Region Risk Alert', description: 'Northern Region at risk of missing Q1 2025 targets based on current trends', confidence: 87, impact: 'high', recommendation: 'Implement immediate intervention strategies' }
  ]);

  // Add mobile and field monitoring data
  const [fieldMonitoringData, setFieldMonitoringData] = useState<any[]>([
    { id: '1', inspector: 'John Doe', location: 'Accra Central', activity: 'Business Verification', status: 'completed', timestamp: new Date().toISOString(), gps: { lat: 5.5600, lng: -0.2057 }, photos: 3, notes: 'All businesses verified and compliant' },
    { id: '2', inspector: 'Jane Smith', location: 'Tema Industrial Area', activity: 'Revenue Collection Audit', status: 'in_progress', timestamp: new Date(Date.now() - 1800000).toISOString(), gps: { lat: 5.6168, lng: -0.0173 }, photos: 2, notes: 'Auditing 15 businesses, 3 non-compliant found' },
    { id: '3', inspector: 'Mike Johnson', location: 'Kumasi Central Market', activity: 'Market Fee Collection', status: 'scheduled', timestamp: new Date(Date.now() + 3600000).toISOString(), gps: { lat: 6.7000, lng: -1.6167 }, photos: 0, notes: 'Scheduled for 2 PM today' }
  ]);

  // Add system integration status
  const [systemIntegrationStatus, setSystemIntegrationStatus] = useState<any>({
    bankingSystems: { status: 'connected', lastSync: new Date().toISOString(), syncFrequency: 'real-time', dataQuality: 'excellent' },
    governmentSystems: { status: 'partial', lastSync: new Date(Date.now() - 86400000).toISOString(), syncFrequency: 'daily', dataQuality: 'good' },
    thirdPartyData: { status: 'connected', lastSync: new Date().toISOString(), syncFrequency: 'hourly', dataQuality: 'good' },
    mobileApp: { status: 'connected', lastSync: new Date().toISOString(), syncFrequency: 'real-time', dataQuality: 'excellent' }
  });

  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addBusiness = async (business: Omit<Business, 'id'>) => {
    const newBusiness = { ...business, id: uuidv4() };
    setBusinesses(prev => [...prev, newBusiness]);
  };

  const updateBusiness = async (id: string, updates: Partial<Business>) => {
    setBusinesses(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
  };

  const addCollection = async (collection: Omit<Collection, 'id'>) => {
    const newCollection = { ...collection, id: uuidv4() };
    setCollections(prev => [...prev, newCollection]);
  };

  const addAuditLog = async (log: Omit<AuditLog, 'id' | 'timestamp'>) => {
    const newLog = { ...log, id: uuidv4(), timestamp: new Date().toISOString() };
    setAuditLogs(prev => [...prev, newLog]);
  };

  return (
    <AppContext.Provider value={{
      businesses,
      setBusinesses,
      revenueTypes,
      setRevenueTypes,
      collections,
      setCollections,
      assignments,
      setAssignments,
      auditLogs,
      setAuditLogs,
      dashboardStats,
      setDashboardStats,
      mmdas,
      setMMDAs,
      collectorPerformance,
      setCollectorPerformance,
      users,
      setUsers,
      reconciliationData,
      setReconciliationData,
      revenueAnalytics,
      setRevenueAnalytics,
      nationalRevenueOversight,
      setNationalRevenueOversight,
      regionalOversightData,
      setRegionalOversightData,
      realTimeAlerts,
      setRealTimeAlerts,
      predictiveAnalytics,
      setPredictiveAnalytics,
      complianceData,
      setComplianceData,
      performanceBenchmarks,
      setPerformanceBenchmarks,
      interventionPlans,
      setInterventionPlans,
      communicationLogs,
      setCommunicationLogs,
      dataQualityMetrics,
      setDataQualityMetrics,
      advancedInsights,
      setAdvancedInsights,
      fieldMonitoringData,
      setFieldMonitoringData,
      systemIntegrationStatus,
      setSystemIntegrationStatus,
      transactions,
      setTransactions,
      addBusiness,
      updateBusiness,
      addCollection,
      addAuditLog,
      loading,
      error
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
