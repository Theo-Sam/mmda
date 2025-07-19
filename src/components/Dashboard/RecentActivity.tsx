import React from 'react';
import { Clock, DollarSign, FileText, UserPlus } from 'lucide-react';

const activities = [
  {
    id: 1,
    type: 'payment',
    description: 'Payment received from Kofi\'s General Store',
    amount: 'GHS 50.00',
    time: '2 hours ago',
    icon: DollarSign,
    iconColor: 'text-green-600 dark:text-green-400',
  },
  {
    id: 2,
    type: 'business',
    description: 'New business registered: Ama\'s Restaurant',
    time: '4 hours ago',
    icon: UserPlus,
    iconColor: 'text-blue-600 dark:text-blue-400',
  },
  {
    id: 3,
    type: 'report',
    description: 'Monthly report generated',
    time: '1 day ago',
    icon: FileText,
    iconColor: 'text-gray-600 dark:text-gray-400',
  },
];

export default function RecentActivity() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3">
              <div className={`p-2 rounded-lg bg-gray-50 dark:bg-gray-700 ${activity.iconColor}`}>
                <activity.icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900 dark:text-gray-100">{activity.description}</p>
                {activity.amount && (
                  <p className="text-sm font-medium text-green-600 dark:text-green-400">{activity.amount}</p>
                )}
                <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                  <Clock className="w-3 h-3" />
                  <span>{activity.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}