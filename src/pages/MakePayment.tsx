import React, { useState } from 'react';
import { 
  CreditCard, 
  Upload, 
  Receipt, 
  DollarSign, 
  Calendar, 
  Building2, 
  CheckCircle, 
  AlertTriangle, 
  Clock,
  FileText,
  Camera,
  Smartphone,
  Banknote,
  X
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import { useTheme } from '../contexts/ThemeContext';

interface PaymentOption {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  available: boolean;
}

const paymentMethods: PaymentOption[] = [
  {
    id: 'momo',
    name: 'Mobile Money',
    description: 'Pay with MTN, Vodafone, or AirtelTigo',
    icon: Smartphone,
    color: 'bg-green-600 dark:bg-green-500',
    available: true
  },
  {
    id: 'bank',
    name: 'Bank Transfer',
    description: 'Direct bank transfer or online banking',
    icon: Building2,
    color: 'bg-blue-600 dark:bg-blue-500',
    available: true
  },
  {
    id: 'card',
    name: 'Debit/Credit Card',
    description: 'Pay with Visa, Mastercard, or local cards',
    icon: CreditCard,
    color: 'bg-purple-600 dark:bg-purple-500',
    available: false
  },
  {
    id: 'cash',
    name: 'Cash Payment',
    description: 'Pay at MMDA office or authorized agent',
    icon: Banknote,
    color: 'bg-yellow-600 dark:bg-yellow-500',
    available: true
  }
];

export default function MakePayment() {
  const { user } = useAuth();
  const { revenueTypes, addAuditLog } = useApp();
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [selectedRevenue, setSelectedRevenue] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [showProofUpload, setShowProofUpload] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'select' | 'details' | 'payment' | 'confirmation'>('select');
  const [paymentReference, setPaymentReference] = useState<string>('');
  const { theme } = useTheme();

  const handleRevenueTypeChange = (revenueTypeId: string) => {
    setSelectedRevenue(revenueTypeId);
    const revenueType = revenueTypes.find(rt => rt.id === revenueTypeId);
    if (revenueType) {
      setAmount(revenueType.defaultAmount.toString());
    }
  };

  const handlePaymentMethodSelect = (methodId: string) => {
    setSelectedMethod(methodId);
    setPaymentStep('details');
  };

  const handlePaymentSubmit = () => {
    // Generate payment reference
    const reference = `PAY-${Date.now()}`;
    setPaymentReference(reference);
    
    if (user) {
      addAuditLog({
        userId: user.id,
        userName: user.name,
        userRole: user.role,
        action: 'Payment Initiated',
        details: `Initiated payment of GHS ${amount} via ${selectedMethod}`,
        district: user.district
      });
    }
    
    setPaymentStep('confirmation');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const getMethodDetails = (methodId: string) => {
    switch (methodId) {
      case 'momo':
        return {
          title: 'Mobile Money Payment',
          instructions: [
            'Dial *170# or use your mobile money app',
            'Select "Pay Bill" or "Make Payment"',
            'Enter MMDA code: 123456',
            'Enter amount: GHS ' + amount,
            'Enter your PIN to confirm',
            'Save the transaction ID for your records'
          ]
        };
      case 'bank':
        return {
          title: 'Bank Transfer Details',
          instructions: [
            'Bank: Ghana Commercial Bank',
            'Account Name: ' + user?.district,
            'Account Number: 1234567890',
            'Reference: Your business name',
            'Amount: GHS ' + amount,
            'Upload proof of payment after transfer'
          ]
        };
      case 'cash':
        return {
          title: 'Cash Payment Locations',
          instructions: [
            'Visit any MMDA office during business hours',
            'Bring this payment reference: ' + (paymentReference || 'Will be generated'),
            'Present valid ID and business documents',
            'Collect official receipt after payment',
            'Office hours: Monday - Friday, 8:00 AM - 5:00 PM'
          ]
        };
      default:
        return { title: '', instructions: [] };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Make Payment</h1>
          <p className="text-gray-600 dark:text-gray-400">Pay your business fees and taxes online or upload proof of payment</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowProofUpload(true)}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Proof</span>
          </button>
        </div>
      </div>

      {/* Payment Steps */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              paymentStep === 'select' ? 'bg-blue-600 dark:bg-blue-500 text-white' : 
              ['details', 'payment', 'confirmation'].includes(paymentStep) ? 'bg-green-600 dark:bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
            }`}>
              1
            </div>
            <span className={`text-sm font-medium ${
              paymentStep === 'select' ? 'text-blue-600 dark:text-blue-400' : 
              ['details', 'payment', 'confirmation'].includes(paymentStep) ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'
            }`}>
              Select Payment
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              paymentStep === 'details' ? 'bg-blue-600 dark:bg-blue-500 text-white' : 
              ['payment', 'confirmation'].includes(paymentStep) ? 'bg-green-600 dark:bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
            }`}>
              2
            </div>
            <span className={`text-sm font-medium ${
              paymentStep === 'details' ? 'text-blue-600 dark:text-blue-400' : 
              ['payment', 'confirmation'].includes(paymentStep) ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'
            }`}>
              Payment Details
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              paymentStep === 'payment' ? 'bg-blue-600 dark:bg-blue-500 text-white' : 
              paymentStep === 'confirmation' ? 'bg-green-600 dark:bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
            }`}>
              3
            </div>
            <span className={`text-sm font-medium ${
              paymentStep === 'payment' ? 'text-blue-600 dark:text-blue-400' : 
              paymentStep === 'confirmation' ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'
            }`}>
              Make Payment
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              paymentStep === 'confirmation' ? 'bg-green-600 dark:bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
            }`}>
              4
            </div>
            <span className={`text-sm font-medium ${
              paymentStep === 'confirmation' ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'
            }`}>
              Confirmation
            </span>
          </div>
        </div>
      </div>

      {/* Step 1: Select Payment Type and Method */}
      {paymentStep === 'select' && (
        <div className="space-y-6">
          {/* Revenue Type Selection */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Select Payment Type</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {revenueTypes.map((revenueType) => (
                <div
                  key={revenueType.id}
                  onClick={() => handleRevenueTypeChange(revenueType.id)}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedRevenue === revenueType.id
                      ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">{revenueType.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{revenueType.description}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-500 capitalize">Frequency: {revenueType.frequency}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600 dark:text-green-400">
                        {formatCurrency(revenueType.defaultAmount)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Method Selection */}
          {selectedRevenue && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Choose Payment Method</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    onClick={() => method.available && handlePaymentMethodSelect(method.id)}
                    className={`p-6 border rounded-lg transition-colors ${
                      method.available
                        ? 'cursor-pointer border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                        : 'cursor-not-allowed border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 opacity-60'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-lg ${method.color} text-white`}>
                        <method.icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-white">{method.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{method.description}</p>
                        {!method.available && (
                          <p className="text-xs text-red-600 dark:text-red-400 mt-1">Coming soon</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Step 2: Payment Details */}
      {paymentStep === 'details' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Payment Details</h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Revenue Type</label>
                <p className="text-gray-900 dark:text-white">
                  {revenueTypes.find(rt => rt.id === selectedRevenue)?.name}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Amount</label>
                <div className="relative">
                  <DollarSign className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
                    placeholder="0.00"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Payment Method</label>
                <p className="text-gray-900 dark:text-white">
                  {paymentMethods.find(pm => pm.id === selectedMethod)?.name}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Business</label>
                <p className="text-gray-900 dark:text-white">{user?.name}'s Business</p>
              </div>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-750 rounded-lg p-6">
              <h4 className="font-medium text-gray-900 dark:text-white mb-4">Payment Summary</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                  <span className="text-gray-900 dark:text-white">GHS {amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Processing Fee:</span>
                  <span className="text-gray-900 dark:text-white">GHS 0.00</span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-900 dark:text-white">Total:</span>
                    <span className="font-bold text-green-600 dark:text-green-400">GHS {amount}</span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => setPaymentStep('payment')}
                className="w-full mt-6 bg-blue-600 dark:bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 font-medium"
              >
                Proceed to Payment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Payment Instructions */}
      {paymentStep === 'payment' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {getMethodDetails(selectedMethod).title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">Follow the instructions below to complete your payment</p>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-6">
              <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-4">Payment Instructions:</h4>
              <ol className="space-y-2">
                {getMethodDetails(selectedMethod).instructions.map((instruction, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-600 dark:bg-blue-500 text-white text-sm rounded-full flex items-center justify-center">
                      {index + 1}
                    </span>
                    <span className="text-blue-800 dark:text-blue-300">{instruction}</span>
                  </li>
                ))}
              </ol>
            </div>
            
            <div className="text-center space-y-4">
              <button
                onClick={handlePaymentSubmit}
                className="bg-green-600 dark:bg-green-500 text-white py-3 px-8 rounded-lg hover:bg-green-700 dark:hover:bg-green-600 font-medium"
              >
                I have completed the payment
              </button>
              
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Click the button above after completing your payment
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Confirmation */}
      {paymentStep === 'confirmation' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Payment Submitted Successfully!</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Your payment is being processed and will be verified shortly.</p>
            
            <div className="bg-gray-50 dark:bg-gray-750 rounded-lg p-6 max-w-md mx-auto mb-6">
              <h4 className="font-medium text-gray-900 dark:text-white mb-4">Payment Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Reference:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{paymentReference}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Amount:</span>
                  <span className="font-medium text-gray-900 dark:text-white">GHS {amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Method:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {paymentMethods.find(pm => pm.id === selectedMethod)?.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Status:</span>
                  <span className="font-medium text-yellow-600 dark:text-yellow-400">Pending Verification</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={() => {
                  setPaymentStep('select');
                  setSelectedMethod('');
                  setSelectedRevenue('');
                  setAmount('');
                  setPaymentReference('');
                }}
                className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Make Another Payment
              </button>
              <button className="px-6 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600">
                View Payment History
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Proof Upload Modal */}
      {showProofUpload && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Upload Payment Proof</h3>
              <button
                onClick={() => setShowProofUpload(false)}
                className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Revenue Type</label>
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white">
                  <option>Select revenue type</option>
                  {revenueTypes.map(rt => (
                    <option key={rt.id} value={rt.id}>{rt.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Amount Paid</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
                  placeholder="0.00"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Payment Reference</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
                  placeholder="Transaction ID or reference number"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Upload Receipt</label>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                  <Camera className="w-8 h-8 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">JPG, PNG up to 5MB</p>
                </div>
              </div>
              
              <div className="flex items-center justify-end space-x-3 pt-4">
                <button
                  onClick={() => setShowProofUpload(false)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600">
                  Submit Proof
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}