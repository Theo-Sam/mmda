import React, { useState } from 'react';
import { Bell, ChevronDown, LogOut, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import ThemeToggle from './ThemeToggle';
import { useNavigate } from 'react-router-dom';

const mockNotifications = [
  { id: 1, type: 'info', message: 'Welcome to the MMDA Portal!', time: 'Just now', read: false },
  { id: 2, type: 'success', message: 'Your profile was updated successfully.', time: '10 min ago', read: false },
  { id: 3, type: 'warning', message: 'You have pending tasks to review.', time: '1 hour ago', read: true },
];

export default function Header() {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  const navigate = useNavigate();

  if (!user) return null;

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleNotifClick = () => {
    setShowNotifDropdown(!showNotifDropdown);
    // Optionally mark all as read here
    // setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 h-16 flex items-center justify-between px-6">
      <div className="flex items-center">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
          {user.district}
        </h2>
      </div>

      <div className="flex items-center space-x-4">
        <ThemeToggle />
        
        <div className="relative">
          <button
            className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            onClick={handleNotifClick}
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">{unreadCount}</span>
            )}
          </button>
          {showNotifDropdown && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-20">
              <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 font-semibold text-gray-900 dark:text-white">Notifications</div>
              {notifications.length === 0 ? (
                <div className="px-4 py-4 text-gray-500 dark:text-gray-400 text-sm">No notifications</div>
              ) : (
                notifications.map((notif) => (
                  <div key={notif.id} className={`flex items-start space-x-3 px-4 py-3 border-b border-gray-100 dark:border-gray-700 ${notif.read ? 'bg-gray-50 dark:bg-gray-900/10' : 'bg-blue-50 dark:bg-blue-900/10'}`}>
                    <div className="mt-1">
                      {notif.type === 'success' && <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>}
                      {notif.type === 'info' && <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>}
                      {notif.type === 'warning' && <span className="inline-block w-2 h-2 bg-yellow-500 rounded-full"></span>}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 dark:text-white">{notif.message}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{notif.time}</p>
                    </div>
                  </div>
                ))
              )}
              <div className="px-4 py-2 text-right">
                <button className="text-xs text-blue-600 dark:text-blue-400 hover:underline" onClick={() => setNotifications([])}>Clear All</button>
              </div>
            </div>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center space-x-3 p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium dark:text-white">{user.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user.role.replace('_', ' ')}</p>
            </div>
            <ChevronDown className="w-4 h-4" />
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-10">
              <button
                onClick={() => {
                  setShowDropdown(false);
                  navigate('/settings');
                }}
                className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <User className="w-4 h-4" />
                <span>Settings</span>
              </button>
              <hr className="my-1 border-gray-200 dark:border-gray-700" />
              <button
                onClick={() => {
                  setShowDropdown(false);
                  logout();
                }}
                className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}