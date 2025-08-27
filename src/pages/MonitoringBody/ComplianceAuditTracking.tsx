import React from 'react';
import ComplianceAuditTracking from '../../components/Dashboard/ComplianceAuditTracking';

const ComplianceAuditTrackingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <ComplianceAuditTracking />
      </div>
    </div>
  );
};

export default ComplianceAuditTrackingPage;
