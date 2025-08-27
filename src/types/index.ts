export interface User {
  id: string;
  email: string;
  name: string;
  role: 'super_admin' | 'mmda_admin' | 'finance' | 'collector' | 'auditor' | 'business_owner' | 'monitoring_body' | 'business_registration_officer' | 'regional_admin';
  district: string;
  phone?: string;
  avatar?: string;
  permissions?: string[];
  password?: string; // Added for demo authentication
}

export interface Business {
  id: string;
  businessCode: string;
  name: string;
  ownerName: string;
  category: string;
  phone: string;
  email?: string;
  gpsLocation: string;
  physicalAddress?: string;
  status: 'active' | 'inactive' | 'suspended' | 'pending';
  registrationDate: string;
  lastPayment?: string;
  businessLicense?: string;
  tinNumber?: string;
  district: string;
}

export interface RevenueType {
  id: string;
  code: string;
  name: string;
  defaultAmount: number;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'one-time';
  description: string;
  isActive: boolean;
  category?: 'permit' | 'license' | 'toll' | 'fee' | 'tax';
}

export interface Collection {
  id: string;
  receiptCode: string;
  businessId: string;
  revenueTypeId: string;
  collectorId: string;
  amount: number;
  paymentMethod: 'cash' | 'momo' | 'bank' | 'cheque' | 'pos';
  receiptId: string;
  date: string;
  status: 'paid' | 'pending' | 'overdue' | 'cancelled';
  receiptImage?: string;
  notes?: string;
  district: string;
}

export interface Assignment {
  id: string;
  assignmentCode: string;
  collectorId: string;
  businessId?: string;
  zone?: string;
  startDate: string;
  endDate?: string;
  isActive: boolean;
  assignedBy?: string;
  district?: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  details: string;
  timestamp: string;
  ipAddress?: string;
  district?: string;
  entityType?: 'business' | 'payment' | 'user' | 'system';
  entityId?: string;
}

export interface DashboardStats {
  totalRevenue: number;
  totalBusinesses: number;
  totalCollectors: number;
  pendingPayments: number;
  monthlyGrowth: number;
  activeDistricts?: number;
  totalUsers?: number;
  systemUptime?: number;
}

export interface District {
  id: string;
  name: string;
  code: string;
  region: string;
  logo?: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  isActive: boolean;
}

export interface Zone {
  id: string;
  zoneCode: string;
  name: string;
  district: string;
  description?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  isActive: boolean;
}

export interface Transaction {
  id: string;
  receiptId: string;
  businessName: string;
  collectorName: string;
  amount: number;
  date: string;
  time: string;
  paymentMethod: 'cash' | 'momo' | 'bank' | 'cheque' | 'pos';
  revenueType: string;
  status: 'normal' | 'flagged' | 'suspicious' | 'resolved';
  riskLevel: 'low' | 'medium' | 'high';
  flagReason?: string;
  ipAddress: string;
  deviceInfo: string;
  district: string;
}

// Export compliance types
export * from './Compliance';