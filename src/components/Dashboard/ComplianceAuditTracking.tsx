import React, { useState, useEffect } from 'react';
import {
  Search,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  UserCheck,
  FileText,
  TrendingUp,
  Users
} from 'lucide-react';
import { MMDACompliance } from '../../types';

interface ComplianceAuditTrackingProps {
  mmdas?: MMDACompliance[];
}

const mockMMDAs: MMDACompliance[] = [
  {
    id: '1',
    name: 'Accra Metropolitan Assembly',
    code: 'AMA',
    region: 'Greater Accra',
    adminName: 'Kwame Asante',
    adminEmail: 'k.asante@ama.gov.gh',
    status: 'active',
    totalRevenue: 2500000,
    totalBusinesses: 1250,
    lastActivity: '2 hours ago',
    complianceMetrics: {
      paymentValidationOnTime: true,
      collectorAssignmentProper: true,
      weeklyReportSubmitted: true,
      monthlyReportSubmitted: true,
      lastPaymentValidation: '1 hour ago',
      lastCollectorAssignment: '2 hours ago',
      lastWeeklyReport: '3 days ago',
      lastMonthlyReport: '2 weeks ago',
      complianceScore: 95
    }
  },
  {
    id: '2',
    name: 'Kumasi Metropolitan Assembly',
    code: 'KMA',
    region: 'Ashanti',
    adminName: 'Ama Osei',
    adminEmail: 'a.osei@kma.gov.gh',
    status: 'active',
    totalRevenue: 1800000,
    totalBusinesses: 890,
    lastActivity: '4 hours ago',
    complianceMetrics: {
      paymentValidationOnTime: false,
      collectorAssignmentProper: true,
      weeklyReportSubmitted: false,
      monthlyReportSubmitted: true,
      lastPaymentValidation: '2 days ago',
      lastCollectorAssignment: '1 day ago',
      lastWeeklyReport: '1 week ago',
      lastMonthlyReport: '3 weeks ago',
      complianceScore: 65
    }
  },
  {
    id: '3',
    name: 'Tamale Metropolitan Assembly',
    code: 'TMA',
    region: 'Northern',
    adminName: 'Ibrahim Mohammed',
    adminEmail: 'i.mohammed@tma.gov.gh',
    status: 'active',
    totalRevenue: 1200000,
    totalBusinesses: 650,
    lastActivity: '6 hours ago',
    complianceMetrics: {
      paymentValidationOnTime: true,
      collectorAssignmentProper: false,
      weeklyReportSubmitted: true,
      monthlyReportSubmitted: false,
      lastPaymentValidation: '1 hour ago',
      lastCollectorAssignment: '3 days ago',
      lastWeeklyReport: '2 days ago',
      lastMonthlyReport: '1 month ago',
      complianceScore: 70
    }
  },
  {
    id: '4',
    name: 'Sekondi-Takoradi Metropolitan Assembly',
    code: 'STMA',
    region: 'Western',
    adminName: 'Grace Addo',
    adminEmail: 'g.addo@stma.gov.gh',
    status: 'active',
    totalRevenue: 950000,
    totalBusinesses: 480,
    lastActivity: '1 day ago',
    complianceMetrics: {
      paymentValidationOnTime: false,
      collectorAssignmentProper: false,
      weeklyReportSubmitted: false,
      monthlyReportSubmitted: false,
      lastPaymentValidation: '1 week ago',
      lastCollectorAssignment: '2 weeks ago',
      lastWeeklyReport: '2 weeks ago',
      lastMonthlyReport: '2 months ago',
      complianceScore: 25
    }
  },
  {
    id: '5',
    name: 'Cape Coast Metropolitan Assembly',
    code: 'CCMA',
    region: 'Central',
    adminName: 'Kofi Mensah',
    adminEmail: 'k.mensah@ccma.gov.gh',
    status: 'active',
    totalRevenue: 750000,
    totalBusinesses: 320,
    lastActivity: '12 hours ago',
    complianceMetrics: {
      paymentValidationOnTime: true,
      collectorAssignmentProper: true,
      weeklyReportSubmitted: true,
      monthlyReportSubmitted: true,
      lastPaymentValidation: '6 hours ago',
      lastCollectorAssignment: '1 day ago',
      lastWeeklyReport: '4 days ago',
      lastMonthlyReport: '3 weeks ago',
      complianceScore: 90
    }
  }
];

const ComplianceAuditTracking: React.FC<ComplianceAuditTrackingProps> = ({ 
  mmdas = mockMMDAs 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredMMDAs, setFilteredMMDAs] = useState<MMDACompliance[]>(mmdas);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [complianceFilter, setComplianceFilter] = useState<'all' | 'compliant' | 'non-compliant'>('all');

  useEffect(() => {
    let filtered = mmdas.filter(mmda => {
      const matchesSearch = mmda.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           mmda.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           mmda.region.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCompliance = complianceFilter === 'all' ||
                               (complianceFilter === 'compliant' && mmda.complianceMetrics.complianceScore >= 80) ||
                               (complianceFilter === 'non-compliant' && mmda.complianceMetrics.complianceScore < 80);
      
      return matchesSearch && matchesCompliance;
    });

    setFilteredMMDAs(filtered);
    setPage(0);
  }, [mmdas, searchTerm, complianceFilter]);

  const getComplianceColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400';
    return 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400';
  };

  const getComplianceLabel = (score: number) => {
    if (score >= 80) return 'Compliant';
    if (score >= 60) return 'Partially Compliant';
    return 'Non-Compliant';
  };

  const getStatusIcon = (isCompliant: boolean) => {
    return isCompliant ? <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" /> : <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />;
  };

  const getStatusChip = (isCompliant: boolean, label: string) => {
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isCompliant ? 'text-green-800 bg-green-100 dark:bg-green-900/30 dark:text-green-300' : 'text-red-800 bg-red-100 dark:bg-red-900/30 dark:text-red-300'}`}>
        {getStatusIcon(isCompliant)}
        <span className="ml-1">{label}</span>
      </span>
    );
  };

  const totalMMDAs = filteredMMDAs.length;
  const compliantMMDAs = filteredMMDAs.filter(mmda => mmda.complianceMetrics.complianceScore >= 80).length;
  const nonCompliantMMDAs = filteredMMDAs.filter(mmda => mmda.complianceMetrics.complianceScore < 80).length;
  const averageComplianceScore = filteredMMDAs.length > 0 
    ? Math.round(filteredMMDAs.reduce((sum, mmda) => sum + mmda.complianceMetrics.complianceScore, 0) / filteredMMDAs.length)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Compliance & Audit Tracking</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Monitor MMDA compliance with payment validation, collector assignment, and report submission requirements
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-blue-600 text-white rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-blue-200" />
            <div className="ml-4">
              <p className="text-2xl font-bold">{totalMMDAs}</p>
              <p className="text-blue-200">Total MMDAs</p>
            </div>
          </div>
        </div>
        
        <div className="bg-green-600 text-white rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-green-200" />
            <div className="ml-4">
              <p className="text-2xl font-bold">{compliantMMDAs}</p>
              <p className="text-blue-200">Compliant MMDAs</p>
            </div>
          </div>
        </div>
        
        <div className="bg-red-600 text-white rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <AlertTriangle className="w-8 h-8 text-red-200" />
            <div className="ml-4">
              <p className="text-2xl font-bold">{nonCompliantMMDAs}</p>
              <p className="text-red-200">Non-Compliant MMDAs</p>
            </div>
          </div>
        </div>
        
        <div className="bg-indigo-600 text-white rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <TrendingUp className="w-8 h-8 text-indigo-200" />
            <div className="ml-4">
              <p className="text-2xl font-bold">{averageComplianceScore}%</p>
              <p className="text-indigo-200">Average Compliance</p>
            </div>
          </div>
        </div>
      </div>

      {/* Non-Compliant Alert */}
      {nonCompliantMMDAs > 0 && (
        <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <div className="flex items-start">
            <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                {nonCompliantMMDAs} MMDA{nonCompliantMMDAs > 1 ? 's are' : ' is'} flagged as non-compliant
              </h3>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                These MMDAs require immediate attention for payment validation, collector assignment, or report submission issues.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search MMDAs, codes, or regions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
          />
        </div>
        
        <select
          value={complianceFilter}
          onChange={(e) => setComplianceFilter(e.target.value as any)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
        >
          <option value="all">All MMDAs</option>
          <option value="compliant">Compliant Only</option>
          <option value="non-compliant">Non-Compliant Only</option>
        </select>
        
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {filteredMMDAs.length} MMDAs found
        </span>
      </div>

      {/* Compliance Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  MMDA
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Region
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Payment Validation
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Collector Assignment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Weekly Report
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Monthly Report
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Compliance Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredMMDAs
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((mmda) => (
                <tr 
                  key={mmda.id} 
                  className={`hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors ${
                    mmda.complianceMetrics.complianceScore < 80 ? 'bg-red-50 dark:bg-red-900/20' : ''
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {mmda.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {mmda.code} • {mmda.adminName}
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {mmda.region}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {getStatusChip(
                        mmda.complianceMetrics.paymentValidationOnTime,
                        mmda.complianceMetrics.paymentValidationOnTime ? 'On Time' : 'Delayed'
                      )}
                      <div className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-help" title={`Last validation: ${mmda.complianceMetrics.lastPaymentValidation}`}>
                        <Clock className="w-4 h-4" />
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {getStatusChip(
                        mmda.complianceMetrics.collectorAssignmentProper,
                        mmda.complianceMetrics.collectorAssignmentProper ? 'Proper' : 'Improper'
                      )}
                      <div className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-help" title={`Last assignment: ${mmda.complianceMetrics.lastCollectorAssignment}`}>
                        <UserCheck className="w-4 h-4" />
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {getStatusChip(
                        mmda.complianceMetrics.weeklyReportSubmitted,
                        mmda.complianceMetrics.weeklyReportSubmitted ? 'Submitted' : 'Pending'
                      )}
                      <div className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-help" title={`Last report: ${mmda.complianceMetrics.lastWeeklyReport}`}>
                        <FileText className="w-4 h-4" />
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {getStatusChip(
                        mmda.complianceMetrics.monthlyReportSubmitted,
                        mmda.complianceMetrics.monthlyReportSubmitted ? 'Submitted' : 'Pending'
                      )}
                      <div className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-help" title={`Last report: ${mmda.complianceMetrics.lastMonthlyReport}`}>
                        <FileText className="w-4 h-4" />
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getComplianceColor(mmda.complianceMetrics.complianceScore)}`}>
                        {mmda.complianceMetrics.complianceScore}%
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {getComplianceLabel(mmda.complianceMetrics.complianceScore)}
                      </span>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      mmda.status === 'active' 
                        ? 'text-green-800 bg-green-100 dark:bg-green-900/30 dark:text-green-300'
                        : 'text-red-800 bg-red-100 dark:bg-red-900/30 dark:text-red-300'
                    }`}>
                      {mmda.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="bg-white dark:bg-gray-800 px-4 py-3 border-t border-gray-200 dark:border-gray-700 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setPage(Math.max(0, page - 1))}
                disabled={page === 0}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setPage(page + 1)}
                disabled={(page + 1) * rowsPerPage >= filteredMMDAs.length}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Showing <span className="font-medium">{page * rowsPerPage + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min((page + 1) * rowsPerPage, filteredMMDAs.length)}
                  </span>{' '}
                  of <span className="font-medium">{filteredMMDAs.length}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => setPage(Math.max(0, page - 1))}
                    disabled={page === 0}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={(page + 1) * rowsPerPage >= filteredMMDAs.length}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-500 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplianceAuditTracking;
