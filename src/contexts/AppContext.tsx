import React, { createContext, useContext, useState, useEffect } from 'react';
import { Business, RevenueType, Collection, Assignment, AuditLog, DashboardStats } from '../types';
import { MMDA } from '../types/MMDA';
import { supabase } from '../utils/supabaseClient';
import { v4 as uuidv4 } from 'uuid';
import { SystemUser } from '../types/SystemUser';

// Add CollectorData type for mock collectorPerformance
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
  revenueTypes: RevenueType[];
  collections: Collection[];
  assignments: Assignment[];
  setAssignments: React.Dispatch<React.SetStateAction<Assignment[]>>;
  auditLogs: AuditLog[];
  dashboardStats: DashboardStats | null;
  mmdas: MMDA[];
  setMMDAs: React.Dispatch<React.SetStateAction<MMDA[]>>;
  collectorPerformance: CollectorData[];
  users: SystemUser[];
  setUsers: React.Dispatch<React.SetStateAction<SystemUser[]>>;
  addBusiness: (business: Omit<Business, 'id'>) => Promise<void>;
  updateBusiness: (id: string, updates: Partial<Business>) => Promise<void>;
  addCollection: (collection: Omit<Collection, 'id'>) => Promise<void>;
  addAuditLog: (log: Omit<AuditLog, 'id' | 'timestamp'>) => Promise<void>;
  loading: boolean;
  error: string | null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [businesses] = useState<Business[]>([
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

  const [revenueTypes] = useState<RevenueType[]>([
    {
      id: 'rt1', code: 'RT-101', name: 'Business Operating Permit', defaultAmount: 500, frequency: 'yearly', description: 'Annual permit for business operation', isActive: true, category: 'permit'
    },
    {
      id: 'rt2', code: 'RT-102', name: 'Signage Fee', defaultAmount: 300, frequency: 'yearly', description: 'Fee for business signage', isActive: true, category: 'fee'
    },
  ]);

  const [collections] = useState<Collection[]>([
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
      id: 'a1', assignmentCode: 'ASN-100001', collectorId: '5', businessId: 'b1', zone: 'Zone 1', startDate: '2024-06-01', endDate: '', isActive: true, assignedBy: '3', district: 'Accra Metropolitan'
    },
    {
      id: 'a2', assignmentCode: 'ASN-100002', collectorId: '5', businessId: 'b2', zone: 'Zone 2', startDate: '2024-06-10', endDate: '', isActive: true, assignedBy: '3', district: 'Tema Metropolitan'
    },
  ]);

  const [auditLogs] = useState<AuditLog[]>([
    {
      id: 'al1', userId: '3', userName: 'MMDA Admin', userRole: 'mmda_admin', action: 'Created Business', details: 'Created Accra Bakery', timestamp: '2024-06-01T10:00:00Z', ipAddress: '192.168.1.1', district: 'Accra Metropolitan', entityType: 'business', entityId: 'b1'
    },
    {
      id: 'al2', userId: '4', userName: 'Finance Officer', userRole: 'finance', action: 'Validated Payment', details: 'Validated payment for Tema Hardware', timestamp: '2024-06-10T12:00:00Z', ipAddress: '192.168.1.2', district: 'Tema Metropolitan', entityType: 'payment', entityId: 'c2'
    },
  ]);

  const [dashboardStats] = useState<DashboardStats>({
    totalRevenue: 1300,
    totalBusinesses: 3,
    totalCollectors: 1,
    pendingPayments: 1,
    monthlyGrowth: 5.5,
    activeDistricts: 2,
    totalUsers: 9,
    systemUptime: 99.9,
  });

  const [mmdas, setMMDAs] = useState<MMDA[]>([
    {
      id: 'd1', name: 'Accra Metropolitan', code: 'ACM', region: 'Greater Accra', status: 'active', adminName: 'MMDA Admin', adminEmail: 'mmdaadmin@test.com', phone: '0244000003', totalRevenue: 500, totalBusinesses: 2, totalUsers: 5, lastActivity: '2024-06-25', createdDate: '2020-01-01'
    },
    {
      id: 'd2', name: 'Tema Metropolitan', code: 'TEM', region: 'Greater Accra', status: 'active', adminName: 'MMDA Admin', adminEmail: 'mmdaadmin@test.com', phone: '0244000003', totalRevenue: 800, totalBusinesses: 1, totalUsers: 4, lastActivity: '2024-06-24', createdDate: '2020-01-01'
    },
  ]);

  const [collectorPerformance] = useState<CollectorData[]>([
    {
      id: '1',
      name: 'John Doe',
      district: 'Accra Metropolitan',
      region: 'Greater Accra',
      totalCollected: 12000,
      monthlyTarget: 15000,
      businessesAssigned: 30,
      collectionsCount: 25,
      efficiency: 80,
      growth: 5.2,
      lastActive: '2024-06-25',
      performance: 'good',
    },
    {
      id: '2',
      name: 'Jane Smith',
      district: 'Accra Metropolitan',
      region: 'Greater Accra',
      totalCollected: 17000,
      monthlyTarget: 15000,
      businessesAssigned: 28,
      collectionsCount: 27,
      efficiency: 95,
      growth: 7.1,
      lastActive: '2024-06-24',
      performance: 'excellent',
    },
    {
      id: '3',
      name: 'Kwame Mensah',
      district: 'Accra Metropolitan',
      region: 'Greater Accra',
      totalCollected: 9000,
      monthlyTarget: 15000,
      businessesAssigned: 22,
      collectionsCount: 18,
      efficiency: 60,
      growth: 2.8,
      lastActive: '2024-06-23',
      performance: 'average',
    },
    {
      id: '4',
      name: 'Ama Serwaa',
      district: 'Accra Metropolitan',
      region: 'Greater Accra',
      totalCollected: 4000,
      monthlyTarget: 15000,
      businessesAssigned: 15,
      collectionsCount: 10,
      efficiency: 27,
      growth: -1.2,
      lastActive: '2024-06-22',
      performance: 'poor',
    },
  ]);

  const [users, setUsers] = useState<SystemUser[]>([
    {
      id: '1',
      name: 'Super Admin',
      email: 'superadmin@test.com',
      role: 'super_admin',
      district: '',
      phone: '0244000001',
      status: 'active',
      lastLogin: '2024-06-25T08:00:00Z',
      createdDate: '2022-01-01',
      permissions: ['manage_users', 'view_reports', 'manage_roles'],
      password: 'password',
      region: '',
    },
    {
      id: '2',
      name: 'Regional Admin',
      email: 'regionaladmin@test.com',
      role: 'regional_admin',
      district: '',
      phone: '0244000002',
      status: 'active',
      lastLogin: '2024-06-25T09:00:00Z',
      createdDate: '2022-02-01',
      permissions: ['manage_mmdas', 'view_reports'],
      password: 'password',
      region: 'Greater Accra',
    },
    {
      id: '3',
      name: 'MMDA Admin',
      email: 'mmdaadmin@test.com',
      role: 'mmda_admin',
      district: 'Accra Metropolitan',
      phone: '0244000003',
      status: 'active',
      lastLogin: '2024-06-25T10:00:00Z',
      createdDate: '2022-03-01',
      permissions: ['manage_users', 'view_reports'],
      password: 'password',
      region: 'Greater Accra',
    },
    {
      id: '4',
      name: 'Finance Officer',
      email: 'finance@test.com',
      role: 'finance',
      district: 'Accra Metropolitan',
      phone: '0244000004',
      status: 'active',
      lastLogin: '2024-06-24T11:00:00Z',
      createdDate: '2022-04-01',
      permissions: ['validate_payments', 'view_reports'],
      password: 'password',
      region: 'Greater Accra',
    },
    {
      id: '5',
      name: 'Collector',
      email: 'collector@test.com',
      role: 'collector',
      district: 'Accra Metropolitan',
      phone: '0244000005',
      status: 'active',
      lastLogin: '2024-06-23T12:00:00Z',
      createdDate: '2022-05-01',
      permissions: ['collect_payments'],
      password: 'password',
      region: 'Greater Accra',
    },
    {
      id: '6',
      name: 'Auditor',
      email: 'auditor@test.com',
      role: 'auditor',
      district: 'Accra Metropolitan',
      phone: '0244000006',
      status: 'active',
      lastLogin: '2024-06-22T13:00:00Z',
      createdDate: '2022-06-01',
      permissions: ['audit_transactions', 'view_reports'],
      password: 'password',
      region: 'Greater Accra',
    },
    {
      id: '7',
      name: 'Business Owner',
      email: 'businessowner@test.com',
      role: 'business_owner',
      district: 'Accra Metropolitan',
      phone: '0244000007',
      status: 'inactive',
      lastLogin: '2024-06-21T14:00:00Z',
      createdDate: '2022-07-01',
      permissions: ['view_own_business'],
      password: 'password',
      region: 'Greater Accra',
    },
    {
      id: '8',
      name: 'Monitoring Body',
      email: 'monitoring@test.com',
      role: 'monitoring_body',
      district: '',
      phone: '0244000008',
      status: 'active',
      lastLogin: '2024-06-20T15:00:00Z',
      createdDate: '2022-08-01',
      permissions: ['monitor_performance', 'view_reports'],
      password: 'password',
      region: 'Greater Accra',
    },
    {
      id: '9',
      name: 'Registration Officer',
      email: 'registrationofficer@test.com',
      role: 'business_registration_officer',
      district: 'Accra Metropolitan',
      phone: '0244000009',
      status: 'suspended',
      lastLogin: '2024-06-19T16:00:00Z',
      createdDate: '2022-09-01',
      permissions: ['register_businesses'],
      password: 'password',
      region: 'Greater Accra',
    },
  ]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const fetchAll = async () => {
      try {
        const [bizRes, revRes, colRes, assignRes, auditRes, dashRes, mmdasRes] = await Promise.all([
          supabase.from('businesses').select('*'),
          supabase.from('revenue_types').select('*'),
          supabase.from('collections').select('*'),
          supabase.from('assignments').select('*'),
          supabase.from('audit_logs').select('*'),
          supabase.from('dashboard_stats').select('*').single(),
          supabase.from('districts').select('*'),
        ]);
        if (bizRes.error || revRes.error || colRes.error || assignRes.error || auditRes.error || dashRes.error || mmdasRes.error) {
          setError('Failed to fetch data from Supabase.');
        } else {
          setBusinesses(bizRes.data || []);
          setRevenueTypes(revRes.data || []);
          setCollections(colRes.data || []);
          setAssignments(assignRes.data || []);
          setAuditLogs(auditRes.data || []);
          setDashboardStats(dashRes.data || null);
          setMMDAs(mmdasRes.data || []);
        }
      } catch (e) {
        setError('An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  function generateBusinessCode() {
    return 'BUS-' + Math.floor(100000 + Math.random() * 900000);
  }
  function generateReceiptCode() {
    const year = new Date().getFullYear();
    return `RCP-${year}-${Math.floor(1000 + Math.random() * 9000)}`;
  }
  function generateAssignmentCode() {
    return 'ASN-' + Math.floor(100000 + Math.random() * 900000);
  }
  function generateRevenueTypeCode() {
    return 'RT-' + Math.floor(100 + Math.random() * 900);
  }
  function generateDistrictCode() {
    return 'DST-' + Math.floor(100 + Math.random() * 900);
  }
  function generateZoneCode() {
    return 'ZN-' + Math.floor(100 + Math.random() * 900);
  }

  // CRUD operations
  const addBusiness = async (business: Omit<Business, 'id' | 'businessCode'>) => {
    const { data, error } = await supabase.from('businesses').insert([{ ...business, id: uuidv4(), businessCode: generateBusinessCode() }]).select();
    if (!error && data) setBusinesses(prev => [...prev, ...data]);
  };

  const updateBusiness = async (id: string, updates: Partial<Business>) => {
    const { data, error } = await supabase.from('businesses').update(updates).eq('id', id).select();
    if (!error && data) setBusinesses(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
  };

  const addCollection = async (collection: Omit<Collection, 'id' | 'receiptCode'>) => {
    const { data, error } = await supabase.from('collections').insert([{ ...collection, id: uuidv4(), receiptCode: generateReceiptCode() }]).select();
    if (!error && data) setCollections(prev => [...prev, ...data]);
  };

  const addAuditLog = async (log: Omit<AuditLog, 'id' | 'timestamp'>) => {
    const { data, error } = await supabase.from('audit_logs').insert([{ ...log, id: uuidv4(), timestamp: new Date().toISOString() }]).select();
    if (!error && data) setAuditLogs(prev => [data[0], ...prev]);
  };

  const addAssignment = async (assignment: Omit<Assignment, 'id' | 'assignmentCode'>) => {
    const { data, error } = await supabase.from('assignments').insert([{ ...assignment, id: uuidv4(), assignmentCode: generateAssignmentCode() }]).select();
    if (!error && data) setAssignments(prev => [...prev, ...data]);
  };

  const addRevenueType = async (revenueType: Omit<RevenueType, 'id' | 'code'>) => {
    const { data, error } = await supabase.from('revenue_types').insert([{ ...revenueType, id: uuidv4(), code: generateRevenueTypeCode() }]).select();
    if (!error && data) setRevenueTypes(prev => [...prev, ...data]);
  };

  const addDistrict = async (district: Omit<District, 'id' | 'code'>) => {
    const { data, error } = await supabase.from('districts').insert([{ ...district, id: uuidv4(), code: generateDistrictCode() }]).select();
    // handle state update if needed
  };

  const addZone = async (zone: Omit<Zone, 'id' | 'zoneCode'>) => {
    const { data, error } = await supabase.from('zones').insert([{ ...zone, id: uuidv4(), zoneCode: generateZoneCode() }]).select();
    // handle state update if needed
  };

  return (
    <AppContext.Provider value={{
      businesses,
      revenueTypes,
      collections,
      assignments,
      setAssignments,
      auditLogs,
      dashboardStats,
      mmdas,
      setMMDAs,
      collectorPerformance,
      addBusiness,
      updateBusiness,
      addCollection,
      addAuditLog,
      loading: false,
      error: null,
      users,
      setUsers,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}