export interface ComplianceMetrics {
  paymentValidationOnTime: boolean;
  collectorAssignmentProper: boolean;
  weeklyReportSubmitted: boolean;
  monthlyReportSubmitted: boolean;
  lastPaymentValidation: string;
  lastCollectorAssignment: string;
  lastWeeklyReport: string;
  lastMonthlyReport: string;
  complianceScore: number;
}

export interface MMDACompliance {
  id: string;
  name: string;
  code: string;
  region: string;
  adminName: string;
  adminEmail: string;
  status: 'active' | 'inactive' | 'suspended';
  complianceMetrics: ComplianceMetrics;
  totalRevenue: number;
  totalBusinesses: number;
  lastActivity: string;
}

export interface ComplianceAuditLog {
  id: string;
  mmdaId: string;
  mmdaName: string;
  action: 'payment_validation' | 'collector_assignment' | 'report_submission' | 'compliance_check';
  status: 'success' | 'warning' | 'error';
  details: string;
  timestamp: string;
  complianceScore: number;
  previousScore?: number;
  auditorId?: string;
  auditorName?: string;
}

export interface ComplianceReport {
  id: string;
  mmdaId: string;
  mmdaName: string;
  reportType: 'weekly' | 'monthly' | 'quarterly' | 'annual';
  period: string;
  submissionDate: string;
  dueDate: string;
  status: 'submitted' | 'pending' | 'overdue' | 'rejected';
  content: string;
  attachments?: string[];
  complianceScore: number;
  issues?: string[];
  recommendations?: string[];
}
