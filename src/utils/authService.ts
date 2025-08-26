import { User } from '../types';

// Demo user accounts for each role
export const demoUsers: User[] = [
  {
    id: '1',
    email: 'superadmin@demo.com',
    password: 'demo123',
    name: 'Super Administrator',
    role: 'super_admin',
    district: 'All Districts',
    phone: '+233 20 123 4567',
    avatar: '/avatars/admin.png',
    permissions: ['all']
  },
  {
    id: '2',
    email: 'mmdaadmin@demo.com',
    password: 'demo123',
    name: 'MMDA Administrator',
    role: 'mmda_admin',
    district: 'Accra Metropolitan',
    phone: '+233 20 123 4568',
    avatar: '/avatars/mmda.png',
    permissions: ['manage_mmda', 'view_reports', 'manage_users']
  },
  {
    id: '3',
    email: 'finance@demo.com',
    password: 'demo123',
    name: 'Finance Officer',
    role: 'finance',
    district: 'Accra Metropolitan',
    phone: '+233 20 123 4569',
    avatar: '/avatars/finance.png',
    permissions: ['view_reports', 'manage_revenue', 'view_collections']
  },
  {
    id: '4',
    email: 'collector@demo.com',
    password: 'demo123',
    name: 'Revenue Collector',
    role: 'collector',
    district: 'Accra Metropolitan',
    phone: '+233 20 123 4570',
    avatar: '/avatars/collector.png',
    permissions: ['collect_revenue', 'view_assignments', 'submit_receipts']
  },
  {
    id: '5',
    email: 'auditor@demo.com',
    password: 'demo123',
    name: 'System Auditor',
    role: 'auditor',
    district: 'All Districts',
    phone: '+233 20 123 4571',
    avatar: '/avatars/auditor.png',
    permissions: ['view_audit_logs', 'view_reports', 'flag_transactions']
  },
  {
    id: '6',
    email: 'businessowner@demo.com',
    password: 'demo123',
    name: 'Business Owner',
    role: 'business_owner',
    district: 'Accra Metropolitan',
    phone: '+233 20 123 4572',
    avatar: '/avatars/business.png',
    permissions: ['view_business', 'view_payments', 'update_profile']
  },
  {
    id: '7',
    email: 'monitoring@demo.com',
    password: 'demo123',
    name: 'Monitoring Body',
    role: 'monitoring_body',
    district: 'All Districts',
    phone: '+233 20 123 4573',
    avatar: '/avatars/monitoring.png',
    permissions: ['view_reports', 'view_audit_logs', 'flag_issues']
  },
  {
    id: '8',
    email: 'registration@demo.com',
    password: 'demo123',
    name: 'Business Registration Officer',
    role: 'business_registration_officer',
    district: 'Accra Metropolitan',
    phone: '+233 20 123 4574',
    avatar: '/avatars/registration.png',
    permissions: ['register_business', 'manage_businesses', 'view_reports']
  },
  {
    id: '9',
    email: 'regionaladmin@demo.com',
    password: 'demo123',
    name: 'Regional Administrator',
    role: 'regional_admin',
    district: 'Greater Accra',
    phone: '+233 20 123 4575',
    avatar: '/avatars/regional.png',
    permissions: ['manage_districts', 'view_reports', 'manage_users']
  }
];

export interface LoginCredentials {
  email: string;
  password: string;
}

export const authenticateUser = (credentials: LoginCredentials): User | null => {
  const user = demoUsers.find(
    u => u.email === credentials.email && u.password === credentials.password
  );
  
  if (user) {
    // Return user without password for security
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
  
  return null;
};

export const getUserById = (id: string): User | null => {
  const user = demoUsers.find(u => u.id === id);
  if (user) {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
  return null;
};

export const getAllUsers = (): Omit<User, 'password'>[] => {
  return demoUsers.map(({ password, ...user }) => user);
};
