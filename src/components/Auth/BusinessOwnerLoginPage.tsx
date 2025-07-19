import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Briefcase, Eye, EyeOff, Loader2, Moon, Sun, User, Lock as LockIcon, Building } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

export default function BusinessOwnerLoginPage() {
  const { user, login, isLoading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);
  const [forgotError, setForgotError] = useState('');
  const [shakeError, setShakeError] = useState(false);

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600 dark:text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 overflow-hidden">
      {/* Subtle SVG background illustration */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" aria-hidden="true">
        <defs>
          <radialGradient id="bg-grad" cx="50%" cy="50%" r="80%">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#818cf8" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#bg-grad)" />
      </svg>
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full bg-white/80 dark:bg-gray-800/80 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors shadow-sm backdrop-blur"
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? (
            <Moon className="w-5 h-5" />
          ) : (
            <Sun className="w-5 h-5" />
          )}
        </button>
      </div>
      <div className="max-w-md w-full space-y-8 z-10">
        {/* Header */}
        <div className="text-center animate-fade-in-slow">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-700 dark:from-blue-500 dark:to-indigo-600 rounded-full flex items-center justify-center shadow-2xl border-4 border-white/60 dark:border-gray-900/60">
            <Briefcase className="w-10 h-10 text-white drop-shadow-lg" />
          </div>
          <h2 className="mt-4 text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight font-sans drop-shadow-sm">
            Business Owner Login
          </h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 font-medium">
            Access your business account securely
          </p>
        </div>
        <div className={`bg-white/70 dark:bg-gray-800/70 rounded-3xl shadow-2xl p-8 backdrop-blur-2xl border border-white/40 dark:border-gray-700/50 transition-all duration-300 hover:shadow-3xl animate-slide-in-up ${shakeError ? 'animate-shake' : ''}`}>
          <form className="space-y-6" onSubmit={handleSubmit} autoComplete="off">
            <div className="space-y-4">
              {/* Email Field */}
              <div className="relative">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email Address
                </label>
                <span className="absolute left-3 top-9 text-gray-400 dark:text-gray-500 pointer-events-none">
                  <User className="w-4 h-4" />
                </span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  aria-label="Email address"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full pl-10 px-3 py-3 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 dark:bg-gray-700 dark:text-white transition-all duration-200 focus:shadow-lg"
                  placeholder="your.email@business.com"
                  disabled={false}
                />
              </div>
              {/* Password Field */}
              <div className="relative">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <span className="absolute left-3 top-9 text-gray-400 dark:text-gray-500 pointer-events-none">
                  <LockIcon className="w-4 h-4" />
                </span>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  aria-label="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-10 px-3 py-3 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 pr-10 dark:bg-gray-700 dark:text-white transition-all duration-200 focus:shadow-lg"
                  placeholder="Enter your password"
                  disabled={false}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  tabIndex={0}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-gray-400 dark:text-gray-500 transition-all duration-200" />
                  ) : (
                    <Eye className="w-4 h-4 text-gray-400 dark:text-gray-500 transition-all duration-200" />
                  )}
                </button>
              </div>
            </div>
            {error && (
              <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm shadow animate-shake">
                {error}
              </div>
            )}
            <div className="flex items-center justify-between">
              <button
                type="button"
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 font-medium transition-all duration-200"
                aria-label="Forgot password"
                onClick={() => setShowForgotModal(true)}
              >
                Forgot Password?
              </button>
            </div>
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 hover:from-blue-700 hover:to-indigo-700 dark:hover:from-blue-600 dark:hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg scale-100 hover:scale-105 active:scale-95"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  'Sign In'
                )}
              </button>
            </div>
            <div className="text-center mt-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Don't have an account?{' '}
                <span className="text-blue-600 dark:text-blue-400 font-medium">
                  Contact your MMDA office to register your business.
                </span>
              </p>
            </div>
          </form>
        </div>
        {/* Footer with logo */}
        <div className="text-center text-xs text-gray-500 dark:text-gray-400 flex flex-col items-center space-y-1 mt-4">
          <div className="flex items-center space-x-2">
            <Building className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>© 2024 Government of Ghana. All rights reserved.</span>
          </div>
          <span>Ministry of Local Government, Rural Development and Decentralization</span>
        </div>
      </div>
      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 dark:bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 w-full max-w-sm border border-white/30 dark:border-gray-700/40 relative animate-fade-in">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              aria-label="Close modal"
              onClick={() => {
                setShowForgotModal(false);
                setForgotEmail('');
                setForgotSent(false);
                setForgotError('');
              }}
            >
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M18 6 6 18M6 6l12 12"/></svg>
            </button>
            {!forgotSent ? (
              <form
                className="space-y-4"
                onSubmit={e => {
                  e.preventDefault();
                  setForgotError('');
                  if (!forgotEmail || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(forgotEmail)) {
                    setForgotError('Please enter a valid email address.');
                    return;
                  }
                  setTimeout(() => {
                    setForgotSent(true);
                  }, 1000);
                }}
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Forgot Password</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Enter your email address and we'll send you a password reset link.</p>
                <input
                  type="email"
                  className="block w-full px-3 py-3 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 dark:bg-gray-700 dark:text-white"
                  placeholder="your.email@business.com"
                  value={forgotEmail}
                  onChange={e => setForgotEmail(e.target.value)}
                  aria-label="Email for password reset"
                  required
                />
                {forgotError && <div className="text-xs text-red-500 dark:text-red-400">{forgotError}</div>}
                <button
                  type="submit"
                  className="w-full py-2 px-4 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 text-white font-medium hover:from-blue-700 hover:to-indigo-700 dark:hover:from-blue-600 dark:hover:to-indigo-600 transition-all duration-200 mt-2"
                >
                  Send Reset Link
                </button>
              </form>
            ) : (
              <div className="flex flex-col items-center justify-center py-8">
                <svg className="w-12 h-12 text-blue-600 dark:text-blue-400 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" /><circle cx="12" cy="12" r="10" /></svg>
                <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-1">Check your email</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">If an account exists for <span className="font-medium">{forgotEmail}</span>, a password reset link has been sent.</p>
                <button
                  className="mt-4 px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-all duration-200"
                  onClick={() => {
                    setShowForgotModal(false);
                    setForgotEmail('');
                    setForgotSent(false);
                    setForgotError('');
                  }}
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      {/* Animations */}
      <style>{`
        .animate-fade-in-slow { animation: fadeIn 1.2s cubic-bezier(.4,0,.2,1); }
        .animate-fade-in { animation: fadeIn 0.7s cubic-bezier(.4,0,.2,1); }
        .animate-pop-in { animation: popIn 0.5s cubic-bezier(.4,0,.2,1); }
        .animate-slide-in-up { animation: slideInUp 0.7s cubic-bezier(.4,0,.2,1); }
        .animate-shake { animation: shake 0.4s cubic-bezier(.4,0,.2,1); }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(16px);} to { opacity: 1; transform: none; } }
        @keyframes popIn { 0% { opacity: 0; transform: scale(0.9);} 80% { opacity: 1; transform: scale(1.04);} 100% { opacity: 1; transform: scale(1); } }
        @keyframes slideInUp { from { opacity: 0; transform: translateY(32px);} to { opacity: 1; transform: none; } }
        @keyframes shake { 0% { transform: translateX(0); } 20% { transform: translateX(-8px); } 40% { transform: translateX(8px); } 60% { transform: translateX(-6px); } 80% { transform: translateX(6px); } 100% { transform: translateX(0); } }
      `}</style>
    </div>
  );
} 