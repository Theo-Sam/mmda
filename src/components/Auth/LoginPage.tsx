import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Building2, Eye, EyeOff, Loader2, Shield, Moon, Sun, UserCog, User, Briefcase, Users, FileText, Globe, Building, UserCheck, UserCircle, Lock as LockIcon, Info, Menu, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { demoUsers } from '../../utils/authService';

export default function LoginPage() {
  const { user, login, isLoading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);
  const [forgotError, setForgotError] = useState('');
  const [shakeError, setShakeError] = useState(false);
  const [showDemoInfo, setShowDemoInfo] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Force theme class on document element to ensure consistency
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  if (user && user.role) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    setShakeError(false);
    try {
      const success = await login(formData.email, formData.password);
      if (!success) {
        setError('Invalid email or password');
        setShakeError(true);
        setTimeout(() => setShakeError(false), 600);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      setShakeError(true);
      setTimeout(() => setShakeError(false), 600);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleRoleSelect = (role: string) => {
    const demoUser = demoUsers.find(u => u.role === role);
    if (demoUser) {
      setFormData({
        email: demoUser.email,
        password: demoUser.password || 'demo123'
      });
      setSelectedRole(role);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 dark:text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Reordered roles array by importance
  const roles = [
    {
      role: 'super_admin',
      title: 'Super Administrator',
      description: 'Full system access and control',
      icon: Shield,
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50 dark:bg-red-900/20'
    },
    {
      role: 'mmda_admin',
      title: 'MMDA Administrator',
      description: 'Manage MMDA operations and users',
      icon: Building2,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      role: 'finance',
      title: 'Finance Officer',
      description: 'Manage revenue and financial reports',
      icon: FileText,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20'
    },
    {
      role: 'collector',
      title: 'Revenue Collector',
      description: 'Collect payments and manage receipts',
      icon: UserCheck,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20'
    },
    {
      role: 'auditor',
      title: 'System Auditor',
      description: 'Monitor system activities and flag issues',
      icon: UserCog,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20'
    },
    {
      role: 'monitoring_body',
      title: 'Monitoring Body',
      description: 'Oversee system compliance and performance',
      icon: Globe,
      color: 'from-teal-500 to-teal-600',
      bgColor: 'bg-teal-50 dark:bg-teal-900/20'
    },
    {
      role: 'business_registration_officer',
      title: 'Business Registration Officer',
      description: 'Register and manage business entities',
      icon: Building,
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-50 dark:bg-indigo-900/20'
    },
    {
      role: 'regional_admin',
      title: 'Regional Administrator',
      description: 'Manage regional operations and districts',
      icon: Users,
      color: 'from-pink-500 to-pink-600',
      bgColor: 'bg-pink-50 dark:bg-pink-900/20'
    },
    {
      role: 'business_owner',
      title: 'Business Owner',
      description: 'View business details and payment history',
      icon: Briefcase,
      color: 'from-gray-500 to-gray-600',
      bgColor: 'bg-gray-50 dark:bg-gray-900/20'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                <Building2 className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">MMDA Revenue System</h1>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Metropolitan Management System</p>
              </div>
              <div className="sm:hidden">
                <h1 className="text-base font-bold text-gray-900 dark:text-white">MMDA</h1>
              </div>
            </div>
            
            {/* Desktop Header Actions */}
            <div className="hidden sm:flex items-center space-x-3 lg:space-x-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              
              <button
                onClick={() => setShowDemoInfo(!showDemoInfo)}
                className="flex items-center space-x-2 px-3 py-2 sm:px-4 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                <Info className="w-4 h-4" />
                <span className="hidden lg:inline">Demo Accounts</span>
                <span className="lg:hidden">Demo</span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="sm:hidden flex items-center space-x-2">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
              
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                {showMobileMenu ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {showMobileMenu && (
            <div className="sm:hidden border-t border-gray-200 dark:border-gray-700 py-4">
              <div className="flex flex-col space-y-3">
                <button
                  onClick={() => {
                    setShowDemoInfo(!showDemoInfo);
                    setShowMobileMenu(false);
                  }}
                  className="flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Info className="w-4 h-4" />
                  <span>Demo Accounts</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Left Side - Role Selection */}
        <div className="lg:hidden bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 p-4 sm:p-6">
          <div className="w-full max-w-md mx-auto">
            <div className="text-center mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">
                Choose Your Role
              </h2>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                Select a role to automatically fill in demo credentials
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {roles.map((roleInfo) => {
                const Icon = roleInfo.icon;
                const isSelected = selectedRole === roleInfo.role;
                const demoUser = demoUsers.find(u => u.role === roleInfo.role);
                
                return (
                  <button
                    key={roleInfo.role}
                    onClick={() => handleRoleSelect(roleInfo.role)}
                    className={`p-3 sm:p-4 rounded-xl border-2 transition-all duration-200 ${
                      isSelected 
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg scale-105' 
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    } ${roleInfo.bgColor}`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-r ${roleInfo.color} flex items-center justify-center flex-shrink-0`}>
                        <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </div>
                      <div className="flex-1 text-left min-w-0">
                        <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base truncate">
                          {roleInfo.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                          {roleInfo.description}
                        </p>
                        {demoUser && (
                          <p className="text-xs text-blue-600 dark:text-blue-400 mt-1 truncate">
                            {demoUser.email}
                          </p>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Desktop Role Selection */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 p-8">
          <div className="w-full max-w-md mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Choose Your Role
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Select a role to automatically fill in demo credentials
              </p>
            </div>
            
            <div className="space-y-4">
              {roles.map((roleInfo) => {
                const Icon = roleInfo.icon;
                const isSelected = selectedRole === roleInfo.role;
                const demoUser = demoUsers.find(u => u.role === roleInfo.role);
                
                return (
                  <button
                    key={roleInfo.role}
                    onClick={() => handleRoleSelect(roleInfo.role)}
                    className={`w-full p-4 rounded-xl border-2 transition-all duration-200 ${
                      isSelected 
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg scale-105' 
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    } ${roleInfo.bgColor}`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${roleInfo.color} flex items-center justify-center`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 text-left">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {roleInfo.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {roleInfo.description}
                        </p>
                        {demoUser && (
                          <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                            {demoUser.email} | Password: demo123
                          </p>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
          <div className="w-full max-w-md">
            <div className="text-center mb-6 lg:hidden">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">
                Welcome Back
              </h2>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                Sign in to access your dashboard
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8">
              <div className="text-center mb-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UserCircle className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  Sign In
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-2">
                  Enter your credentials to continue
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className={`w-full px-3 py-2.5 sm:px-4 sm:py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                        shakeError ? 'animate-shake border-red-500' : 'border-gray-300 dark:border-gray-600'
                      } bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm sm:text-base`}
                      placeholder="Enter your email"
                    />
                    <User className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className={`w-full px-3 py-2.5 sm:px-4 sm:py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                        shakeError ? 'animate-shake border-red-500' : 'border-gray-300 dark:border-gray-600'
                      } bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm sm:text-base`}
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
                    </button>
                    <LockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 sm:p-4">
                    <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2.5 sm:py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center space-x-2">
                      <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                      <span>Signing In...</span>
                    </div>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </form>

              <div className="mt-4 sm:mt-6 text-center">
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  Demo System - Use the demo accounts above
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Demo Info Modal */}
      {showDemoInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-xl w-full max-w-sm sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                  Demo Account Information
                </h3>
                <button
                  onClick={() => setShowDemoInfo(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-4 sm:p-6">
              <div className="mb-4">
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4">
                  Use these demo accounts to test different roles in the system. All accounts use the password: <strong>demo123</strong>
                </p>
              </div>
              
              <div className="grid gap-3 sm:gap-4">
                {demoUsers.map((user) => (
                  <div key={user.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 sm:p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">{user.name}</h4>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{user.role.replace('_', ' ').toUpperCase()}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">{user.district}</p>
                      </div>
                      <div className="text-left sm:text-right">
                        <p className="text-xs sm:text-sm font-mono text-blue-600 dark:text-blue-400 break-all">{user.email}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">Password: demo123</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}