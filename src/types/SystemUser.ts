export interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: string;
  district: string;
  phone: string;
  status: 'active' | 'inactive' | 'suspended';
  lastLogin: string;
  createdDate: string;
  permissions: string[];
  password: string;
} 