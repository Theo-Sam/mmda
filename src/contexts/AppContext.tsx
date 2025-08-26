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
  const [revenueAnalytics, setRevenueAnalytics] = useState<any[]>([]);
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
