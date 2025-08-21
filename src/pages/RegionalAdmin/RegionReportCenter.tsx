import React, { useState } from 'react';
import {
    BarChart3,
    TrendingUp,
    Users,
    DollarSign,
    Building2,
    Download,
    Filter,
    Calendar,
    PieChart,
    Activity,
    Target,
    CheckCircle,
    AlertTriangle,
    Clock,
    FileText,
    MapPin,
    Globe
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { filterByJurisdiction } from '../../utils/filterByJurisdiction';

export default function RegionReportCenter() {
    const { user } = useAuth();
    const { businesses, collections, revenueTypes, mmdas } = useApp();
    const [dateRange, setDateRange] = useState('this-month');

    const [reportType, setReportType] = useState('overview');
    const { theme } = useTheme();

    // Apply district-based filtering
    const districtBusinesses = user ? filterByJurisdiction(user, businesses) : businesses;
    const districtCollections = user ? filterByJurisdiction(user, collections) : collections;
    const districtMMDAs = user ? filterByJurisdiction(user, mmdas) : mmdas;

    // Mock data for Greater Accra Region - in real app, this would come from API
    const mockRegionalData = {
        'Greater Accra': {
            totalMMDAs: 16,
            activeMMDAs: 15,
            totalBusinesses: 1247,
            totalRevenue: 2850000,
            compliance: 94,
            growth: 8.5,
            mmdas: [
                { id: '1', name: 'Accra Metropolitan Assembly', district: 'Accra Central', status: 'active', region: 'Greater Accra', businesses: 156, revenue: 450000, compliance: 96, growth: 9.2 },
                { id: '2', name: 'Tema Metropolitan Assembly', district: 'Tema', status: 'active', region: 'Greater Accra', businesses: 134, revenue: 380000, compliance: 94, growth: 8.7 },
                { id: '3', name: 'Ga West Municipal Assembly', district: 'Amasaman', status: 'active', region: 'Greater Accra', businesses: 98, revenue: 220000, compliance: 92, growth: 7.8 },
                { id: '4', name: 'Ga East Municipal Assembly', district: 'Abokobi', status: 'active', region: 'Greater Accra', businesses: 87, revenue: 195000, compliance: 93, growth: 8.1 },
                { id: '5', name: 'Ga Central Municipal Assembly', district: 'Sowutuom', status: 'active', region: 'Greater Accra', businesses: 76, revenue: 168000, compliance: 91, growth: 7.5 },
                { id: '6', name: 'Ga South Municipal Assembly', district: 'Ngleshie Amanfro', status: 'active', region: 'Greater Accra', businesses: 92, revenue: 205000, compliance: 89, growth: 6.9 },
                { id: '7', name: 'Adenta Municipal Assembly', district: 'Adenta', status: 'active', region: 'Greater Accra', businesses: 103, revenue: 235000, compliance: 95, growth: 8.8 },
                { id: '8', name: 'Ashaiman Municipal Assembly', district: 'Ashaiman', status: 'active', region: 'Greater Accra', businesses: 89, revenue: 198000, compliance: 87, growth: 6.7 },
                { id: '9', name: 'Ledzokuku Municipal Assembly', district: 'Teshie', status: 'active', region: 'Greater Accra', businesses: 78, revenue: 175000, compliance: 90, growth: 7.2 },
                { id: '10', name: 'Kpone Katamanso Municipal Assembly', district: 'Kpone', status: 'active', region: 'Greater Accra', businesses: 65, revenue: 145000, compliance: 88, growth: 6.5 },
                { id: '11', name: 'La Dadekotopon Municipal Assembly', district: 'La', status: 'active', region: 'Greater Accra', businesses: 82, revenue: 185000, compliance: 92, growth: 7.8 },
                { id: '12', name: 'Ayawaso West Municipal Assembly', district: 'Dzorwulu', status: 'active', region: 'Greater Accra', businesses: 95, revenue: 210000, compliance: 94, growth: 8.3 },
                { id: '13', name: 'Ayawaso East Municipal Assembly', district: 'Nima', status: 'active', region: 'Greater Accra', businesses: 88, revenue: 195000, compliance: 89, growth: 7.1 },
                { id: '14', name: 'Ayawaso Central Municipal Assembly', district: 'Kokomlemle', status: 'active', region: 'Greater Accra', businesses: 73, revenue: 162000, compliance: 91, growth: 7.6 },
                { id: '15', name: 'Ayawaso North Municipal Assembly', district: 'Achimota', status: 'active', region: 'Greater Accra', businesses: 67, revenue: 148000, compliance: 88, growth: 6.8 },
                { id: '16', name: 'Korle Klottey Municipal Assembly', district: 'Osu', status: 'inactive', region: 'Greater Accra', businesses: 0, revenue: 0, compliance: 0, growth: 0 }
            ]
        }
    };

    // Always use mock data for now - in real app, this would come from API
    const regionalData = mockRegionalData;

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-GH', {
            style: 'currency',
            currency: 'GHS',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const getComplianceColor = (compliance: number) => {
        if (compliance >= 90) return 'text-green-600 dark:text-green-400';
        if (compliance >= 80) return 'text-yellow-600 dark:text-yellow-400';
        return 'text-red-600 dark:text-red-400';
    };

    const getGrowthColor = (growth: number) => {
        if (growth > 0) return 'text-green-600 dark:text-green-400';
        if (growth < 0) return 'text-red-600 dark:text-red-400';
        return 'text-gray-600 dark:text-gray-400';
    };

    const getComplianceBadge = (compliance: number) => {
        if (compliance >= 90) return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
        if (compliance >= 80) return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
    };

    const getComplianceIcon = (compliance: number) => {
        if (compliance >= 90) return <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />;
        if (compliance >= 80) return <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />;
        return <Clock className="w-4 h-4 text-red-600 dark:text-red-400" />;
    };

    const handleExportReport = (type: string) => {
        const reportData = {
            type,
            region: 'Greater Accra',
            dateRange,
            reportType,
            data: regionalData['Greater Accra'],
            timestamp: new Date().toISOString(),
            user: user?.email,
            jurisdiction: user?.district
        };

        // In a real app, this would send the data to a backend service
        // For now, we'll create a downloadable JSON file
        const dataStr = JSON.stringify(reportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${type}_report_Greater_Accra_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };



    // Loading state
    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-500"></div>
            </div>
        );
    }

    // Always use mock data for demonstration

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Greater Accra Region Report Center</h1>
                    <p className="text-gray-600 dark:text-gray-400">Regional performance analytics and insights for Greater Accra</p>
                    {(!districtMMDAs || districtMMDAs.length === 0) && (
                        <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300">
                            <Globe className="w-3 h-3 mr-1" />
                            Demo Mode - Using Sample Data
                        </div>
                    )}
                </div>
                <div className="flex items-center space-x-3">
                    <button
                        onClick={() => handleExportReport('comprehensive')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                    >
                        <Download className="w-4 h-4" />
                        <span>Export Report</span>
                    </button>
                </div>
            </div>

            {/* Jurisdiction Summary */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 p-6">
                <div className="flex items-center space-x-3 mb-4">
                    <MapPin className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">Greater Accra Region Overview</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                        <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                            {regionalData['Greater Accra'].totalMMDAs}
                        </p>
                        <p className="text-sm text-blue-700 dark:text-blue-300">Total MMDAs</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                            {regionalData['Greater Accra'].totalBusinesses}
                        </p>
                        <p className="text-sm text-blue-700 dark:text-blue-300">Total Businesses</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                            {formatCurrency(regionalData['Greater Accra'].totalRevenue)}
                        </p>
                        <p className="text-sm text-blue-700 dark:text-blue-300">Total Revenue</p>
                    </div>
                </div>
                <div className="mt-4 text-center">
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                        {user?.district ? (
                            <>Managing: <span className="font-semibold">{user.district}</span> in Greater Accra</>
                        ) : (
                            <>Managing: <span className="font-semibold">Greater Accra Region (Demo Mode)</span></>
                        )}
                    </p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                    <div className="flex items-center space-x-4">
                        <div className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg border border-gray-300 dark:border-gray-600">
                            <span className="font-medium">Greater Accra Region</span>
                        </div>
                        <select
                            value={dateRange}
                            onChange={(e) => setDateRange(e.target.value)}
                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
                        >
                            <option value="this-month">This Month</option>
                            <option value="last-month">Last Month</option>
                            <option value="this-quarter">This Quarter</option>
                            <option value="this-year">This Year</option>
                        </select>
                        <select
                            value={reportType}
                            onChange={(e) => setReportType(e.target.value)}
                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
                        >
                            <option value="overview">Overview</option>
                            <option value="performance">Performance</option>
                            <option value="compliance">Compliance</option>
                            <option value="revenue">Revenue</option>
                        </select>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                        <Filter className="w-4 h-4" />
                        <span>Greater Accra Region</span>
                    </div>
                </div>
            </div>

            {/* Regional Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total MMDAs</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {regionalData['Greater Accra'].totalMMDAs}
                            </p>
                        </div>
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                            <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Businesses</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {regionalData['Greater Accra'].totalBusinesses}
                            </p>
                        </div>
                        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                            <Building2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {formatCurrency(regionalData['Greater Accra'].totalRevenue)}
                            </p>
                        </div>
                        <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                            <DollarSign className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Compliance</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {regionalData['Greater Accra'].compliance}%
                            </p>
                        </div>
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                            <Target className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                    </div>
                </div>
            </div>

            {/* MMDA Performance Table */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">MMDA Performance Overview</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">MMDA Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">District</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Businesses</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Revenue</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Compliance</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Growth</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {regionalData['Greater Accra'].mmdas.map((mmda: any) => (
                                <tr key={mmda.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <Globe className="w-4 h-4 text-gray-400 mr-2" />
                                            <span className="text-sm font-medium text-gray-900 dark:text-white">{mmda.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                        {mmda.district || 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${mmda.status === 'active'
                                            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                                            : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                                            }`}>
                                            {mmda.status === 'active' ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                        {mmda.businesses || 0}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                        {formatCurrency(mmda.revenue || 0)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getComplianceBadge(mmda.compliance || 0)}`}>
                                            {getComplianceIcon(mmda.compliance || 0)}
                                            <span className="ml-1">{mmda.compliance || 0}%</span>
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={`flex items-center ${getGrowthColor(mmda.growth || 0)}`}>
                                            <TrendingUp className={`w-4 h-4 mr-1 ${(mmda.growth || 0) < 0 ? 'rotate-180' : ''}`} />
                                            {(mmda.growth || 0) > 0 ? '+' : ''}{mmda.growth || 0}%
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => handleExportReport(mmda.name)}
                                                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                                                title="Export MMDA Report"
                                            >
                                                <Download className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleExportReport('mmda')}
                                                className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300"
                                                title="Export MMDA Report"
                                            >
                                                <FileText className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>



            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                            <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Performance Reports</h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">Generate detailed performance reports for selected regions</p>
                    <button
                        onClick={() => handleExportReport('performance')}
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Generate Report
                    </button>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Compliance Analysis</h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">Analyze compliance rates and identify areas for improvement</p>
                    <button
                        onClick={() => handleExportReport('compliance')}
                        className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                        Analyze Compliance
                    </button>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                            <PieChart className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Revenue Insights</h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">Get detailed revenue analysis and forecasting insights</p>
                    <button
                        onClick={() => handleExportReport('revenue')}
                        className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                    >
                        View Insights
                    </button>
                </div>
            </div>
        </div>
    );
}
