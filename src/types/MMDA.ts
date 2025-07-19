import { mmdaByRegion } from '../utils/ghanaRegions';

export interface MMDA {
  id: string;
  name: string;
  code: string;
  region: string;
  status: 'active' | 'inactive' | 'suspended';
  adminName: string;
  adminEmail: string;
  phone: string;
  totalRevenue: number;
  totalBusinesses: number;
  totalUsers: number;
  lastActivity: string;
  createdDate: string;
} 