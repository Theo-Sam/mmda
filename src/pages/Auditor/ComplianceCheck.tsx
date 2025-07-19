import React, { useState } from 'react';
import { 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Play, 
  RefreshCw, 
  Download, 
  Eye,
  Calendar,
  FileText,
  Users,
  Building2,
  DollarSign,
  Clock,
  Target,
  BarChart3,
  TrendingUp,
  Search
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface ComplianceCheck {
  id: string;
  name: string;
  description: string;
  category: 'financial' | 'operational' | 'security' | 'regulatory';
  status: 'passed' | 'failed' | 'warning' | 'pending';
  score: number;
  lastRun: string;
  issues: number;
  critical: number;
}

interface ComplianceIssue {
  id: string;
  checkId: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  recommendation: string;
  affectedEntity: string;
  dateFound: string;
  status: 'open' | 'resolved' | 'acknowledged';
}

const complianceChecks: ComplianceCheck[] = [
  {
    id: '1',
    name: 'Payment Verification',
    description: 'Verify all payments have proper documentation and approval',
    category: 'financial',
    status: 'passed',
    score: 96.8,
    lastRun: '2024-12-01T10:00:00Z',
    issues: 2,
    critical: 0
  },
  {
    id: '2',
    name: 'User Access Control',
    description: 'Check user permissions and access levels',
    category: 'security',
    status: 'warning',
    score: 89.2,
    lastRun: '2024-12-01T09:30:00Z',
    issues: 5,
    critical: 1
  },
  {
    id: '3',
    name: 'Revenue Type Compliance',
    description: 'Ensure all revenue types follow regulatory guidelines',
    category: 'regulatory',
    status: 'passed',
    score: 98.5,
    lastRun: '2024-12-01T08:00:00Z',
    issues: 1,
    critical: 0
  },
  {
    id: '4',
    name: 'Data Integrity Check',
    description: 'Verify data consistency across all systems',
    category: 'operational',
    status: 'failed',
    score: 78.3,
    lastRun: '2024-12-01T07:00:00Z',
    issues: 12,
    critical: 3
  },
  {
    id: '5',
    name: 'Audit Trail Completeness',
    description: 'Check if all actions are properly logged',
    category: 'security',
    status: 'passed',
    score: 94.7,
    lastRun: '2024-12-01T06:00:00Z',
    issues: 3,
    critical: 0
  },
  {
    id: '6',
    name: 'Business Registration Compliance',
    description: 'Verify business registration requirements are met',
    category: 'regulatory',
    status: 'warning',
    score: 87.1,
    lastRun: '2024-11-30T18:00:00Z',
    issues: 8,
    critical: 2
  }
];

const complianceIssues: ComplianceIssue[] = [
  {
    id: '1',
    checkId: '2',
    severity: 'critical',
    title: 'Elevated User Privileges',
    description: 'User account has excessive permissions beyond role requirements',
    recommendation: 'Review and reduce user permissions to match role requirements',
    affectedEntity: 'User: john.doe@district.gov.gh',
    dateFound: '2024-12-01',
    status: 'open'
  },
  {
    id: '2',
    checkId: '4',
    severity: 'critical',
    title: 'Data Inconsistency',
    description: 'Payment records do not match between collection and receipt tables',
    recommendation: 'Run data reconciliation process and fix inconsistencies',
    affectedEntity: 'Payment Records: RCP-2024-145 to RCP-2024-150',
    dateFound: '2024-12-01',
    status: 'open'
  },
  {
    id: '3',
    checkId: '6',
    severity: 'high',
    title: 'Missing Business License',
    description: 'Active business operating without valid license documentation',
    recommendation: 'Request updated license documentation or suspend business',
    affectedEntity: 'Business: Tech Solutions Ltd',
    dateFound: '2024-11-30',
    status: 'acknowledged'
  }
];

export default function ComplianceCheck() {
  const [checks, setChecks] = useState<ComplianceCheck[]>(complianceChecks);
  const [issues, setIssues] = useState<ComplianceIssue[]>(complianceIssues);
  const [isRunning, setIsRunning] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedIssue, setSelectedIssue] = useState<ComplianceIssue | null>(null);
  const { theme } = useTheme();

  const filteredChecks = checks.filter(check => 
    selectedCategory === 'all' || check.category === selectedCategory
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      case 'failed': return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
      case 'warning': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
      case 'pending': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300';
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed': return <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />;
      case 'pending': return <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      default: return <Clock className="w-4 h-4 text-gray-600 dark:text-gray-400" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800';
      case 'high': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 border-orange-200 dark:border-orange-800';
      case 'medium': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800';
      case 'low': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700';
    }
  };

  const runComplianceCheck = async (checkId: string) => {
    setIsRunning(checkId);
    
    // Simulate compliance check
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setChecks(prev => prev.map(check => 
      check.id === checkId 
        ? { ...check, lastRun: new Date().toISOString(), status: 'passed' as const }
        : check
    ));
    
    setIsRunning(null);
  };

  const runAllChecks = async () => {
    setIsRunning('all');
    
    // Simulate running all checks
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    setChecks(prev => prev.map(check => ({
      ...check,
      lastRun: new Date().toISOString()
    })));
    
    setIsRunning(null);
  };

  const resolveIssue = (issueId: string) => {
    setIssues(prev => prev.map(issue => 
      issue.id === issueId 
        ? { ...issue, status: 'resolved' as const }
        : issue
    ));
  };

  const acknowledgeIssue = (issueId: string) => {
    setIssues(prev => prev.map(issue => 
      issue.id === issueId 
        ? { ...issue, status: 'acknowledged' as const }
        : issue
    ));
  };

  const overallScore = checks.reduce((sum, check) => sum + check.score, 0) / checks.length;
  const totalIssues = issues.filter(issue => issue.status === 'open').length;
  const criticalIssues = issues.filter(issue => issue.severity === 'critical' && issue.status === 'open').length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Compliance Check</h1>
          <p className="text-gray-600 dark:text-gray-400">Run compliance audits and monitor system integrity</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={runAllChecks}
            disabled={isRunning === 'all'}
            className="flex items-center space-x-2 bg-blue-600 dark:bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50"
          >
            {isRunning === 'all' ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            <span>{isRunning === 'all' ? 'Running...' : 'Run All Checks'}</span>
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Overall Score</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{overallScore.toFixed(1)}%</p>
              <p className="text-sm text-green-600 dark:text-green-400">Good compliance</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Checks</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{checks.length}</p>
              <p className="text-sm text-blue-600 dark:text-blue-400">
                {checks.filter(c => c.status === 'passed').length} passed
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Open Issues</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{totalIssues}</p>
              <p className="text-sm text-yellow-600 dark:text-yellow-400">Require attention</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Critical Issues</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{criticalIssues}</p>
              <p className="text-sm text-red-600 dark:text-red-400">Immediate action</p>
            </div>
          </div>
        </div>
      </div>

      {/* Compliance Checks */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Compliance Checks</h3>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Categories</option>
              <option value="financial">Financial</option>
              <option value="operational">Operational</option>
              <option value="security">Security</option>
              <option value="regulatory">Regulatory</option>
            </select>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredChecks.map((check) => (
              <div key={check.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="font-semibold text-gray-900 dark:text-white">{check.name}</h4>
                      <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(check.status)}`}>
                        {getStatusIcon(check.status)}
                        <span className="capitalize">{check.status}</span>
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{check.description}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                      <span className="capitalize">{check.category}</span>
                      <span>•</span>
                      <span>Score: {check.score}%</span>
                      <span>•</span>
                      <span>{check.issues} issues</span>
                      {check.critical > 0 && (
                        <>
                          <span>•</span>
                          <span className="text-red-600 dark:text-red-400">{check.critical} critical</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Compliance Score</span>
                    <span className="text-xs font-medium text-gray-900 dark:text-white">{check.score}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        check.score >= 95 ? 'bg-green-600 dark:bg-green-500' :
                        check.score >= 85 ? 'bg-yellow-600 dark:bg-yellow-500' : 'bg-red-600 dark:bg-red-500'
                      }`}
                      style={{ width: `${check.score}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Last run: {new Date(check.lastRun).toLocaleString()}
                  </span>
                  <button
                    onClick={() => runComplianceCheck(check.id)}
                    disabled={isRunning === check.id}
                    className="flex items-center space-x-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium disabled:opacity-50"
                  >
                    {isRunning === check.id ? (
                      <RefreshCw className="w-3 h-3 animate-spin" />
                    ) : (
                      <Play className="w-3 h-3" />
                    )}
                    <span>{isRunning === check.id ? 'Running...' : 'Run Check'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Critical Issues */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Critical Issues</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {issues.filter(issue => issue.status === 'open').map((issue) => (
              <div key={issue.id} className={`border rounded-lg p-4 ${getSeverityColor(issue.severity)}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="font-medium text-gray-900 dark:text-white">{issue.title}</h4>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getSeverityColor(issue.severity)}`}>
                        {issue.severity}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{issue.description}</p>
                    <p className="text-sm text-blue-700 dark:text-blue-300 mb-2">
                      <strong>Recommendation:</strong> {issue.recommendation}
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-gray-600 dark:text-gray-400">
                      <span>Affected: {issue.affectedEntity}</span>
                      <span>•</span>
                      <span>Found: {new Date(issue.dateFound).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setSelectedIssue(issue)}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium"
                    >
                      View
                    </button>
                    <button
                      onClick={() => acknowledgeIssue(issue.id)}
                      className="text-yellow-600 dark:text-yellow-400 hover:text-yellow-800 dark:hover:text-yellow-300 text-sm font-medium"
                    >
                      Acknowledge
                    </button>
                    <button
                      onClick={() => resolveIssue(issue.id)}
                      className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 text-sm font-medium"
                    >
                      Resolve
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Issue Details Modal */}
      {selectedIssue && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Issue Details</h3>
              <button
                onClick={() => setSelectedIssue(null)}
                className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                <p className="text-sm text-gray-900 dark:text-white">{selectedIssue.title}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Severity</label>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getSeverityColor(selectedIssue.severity)}`}>
                  {selectedIssue.severity}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <p className="text-sm text-gray-900 dark:text-white">{selectedIssue.description}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Recommendation</label>
                <p className="text-sm text-blue-700 dark:text-blue-300">{selectedIssue.recommendation}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Affected Entity</label>
                <p className="text-sm text-gray-900 dark:text-white">{selectedIssue.affectedEntity}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date Found</label>
                <p className="text-sm text-gray-900 dark:text-white">{new Date(selectedIssue.dateFound).toLocaleDateString()}</p>
              </div>
              
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setSelectedIssue(null)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    acknowledgeIssue(selectedIssue.id);
                    setSelectedIssue(null);
                  }}
                  className="px-4 py-2 bg-yellow-600 dark:bg-yellow-500 text-white rounded-lg hover:bg-yellow-700 dark:hover:bg-yellow-600"
                >
                  Acknowledge
                </button>
                <button
                  onClick={() => {
                    resolveIssue(selectedIssue.id);
                    setSelectedIssue(null);
                  }}
                  className="px-4 py-2 bg-green-600 dark:bg-green-500 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600"
                >
                  Resolve
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}