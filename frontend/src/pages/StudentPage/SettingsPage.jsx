
import React, { useState } from 'react';
import MentaroNavbar from './../../components/Student/StudentNavbar.jsx';
import Navbar from './../../components/Student/Navbar.jsx';
import { 
  User, 
  Mail, 
  Upload, 
  Eye, 
  EyeOff, 
  CreditCard,
  Calendar,
  Download
} from 'lucide-react';

// Utility to generate a random username
function generateUsername() {
  const adjectives = ["Cool", "Fast", "Smart", "Happy", "Brave", "Bright"];
  const nouns = ["Lion", "Tiger", "Eagle", "Shark", "Wolf", "Falcon"];
  return (
    adjectives[Math.floor(Math.random() * adjectives.length)] +
    nouns[Math.floor(Math.random() * nouns.length)] +
    Math.floor(Math.random() * 1000)
  );
}

const SettingsPage = () => {
  const [settings, setSettings] = useState({
    profile: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      bio: 'Passionate learner interested in web development and data science.',
      username: generateUsername()
    },
    security: {
      passwordLastChanged: '2024-01-15'
    },
    billing: {
      paymentMethod: {
        type: 'card',
        last4: '4242',
        expiry: '12/26'
      },
      billingAddress: {
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        zip: '10001',
        country: 'US'
      }
    }
  });

  const [activeTab, setActiveTab] = useState('profile');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const updateSetting = (section, key, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  const handleSave = () => {
    alert('Settings saved successfully!');
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'security', label: 'Security', icon: '🔐' },
    { id: 'billing', label: 'Billing', icon: '💳' }
  ];

  // Purchase history mock data
  const purchaseHistory = [
    {
      id: 1,
      course: 'Complete React Developer Course',
      date: '2024-01-15',
      amount: 99.99,
      status: 'completed'
    },
    {
      id: 2,
      course: 'Python Machine Learning Bootcamp',
      date: '2024-01-10',
      amount: 129.99,
      status: 'completed'
    },
    {
      id: 3,
      course: 'UI/UX Design Masterclass',
      date: '2024-01-05',
      amount: 89.99,
      status: 'completed'
    }
  ];

  const renderProfileSettings = () => (
    <div className="space-y-6">
      {/* Profile Overview Card */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Overview</h3>
        
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
            <User className="h-10 w-10 text-gray-400" />
          </div>
          <div>
            <div className="font-medium text-lg">{settings.profile.username}</div>
            <div className="text-sm text-gray-500 flex items-center">
              <Mail className="h-4 w-4 mr-1" />
              {settings.profile.email}
            </div>
          </div>
        </div>

        <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Upload className="h-4 w-4 mr-2" />
          Upload New Photo
        </button>
        <p className="text-sm text-gray-500 mt-2">JPG, PNG or GIF. Max size 5MB.</p>
      </div>

      {/* Personal Information */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
            <input
              type="text"
              value={settings.profile.username}
              onChange={(e) => updateSetting('profile', 'username', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
              <input
                type="text"
                value={settings.profile.firstName}
                onChange={(e) => updateSetting('profile', 'firstName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
              <input
                type="text"
                value={settings.profile.lastName}
                onChange={(e) => updateSetting('profile', 'lastName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={settings.profile.email}
              onChange={(e) => updateSetting('profile', 'email', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
            <textarea
              value={settings.profile.bio}
              onChange={(e) => updateSetting('profile', 'bio', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      {/* Password Settings */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Password</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
            <div className="relative">
              <input
                type={showCurrentPassword ? "text" : "password"}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter current password"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter new password"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Confirm new password"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="text-sm text-gray-500">
            Last changed: {new Date(settings.security.passwordLastChanged).toLocaleDateString()}
          </div>

          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Update Password
          </button>
        </div>
      </div>
    </div>
  );

  const renderBillingSettings = () => (
    <div className="space-y-6">
      {/* Payment Method */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h3>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <CreditCard className="h-5 w-5 text-gray-600 mr-3" />
            <div>
              <p className="font-medium text-gray-900">
                •••• •••• •••• {settings.billing.paymentMethod.last4}
              </p>
              <p className="text-sm text-gray-500">
                Expires {settings.billing.paymentMethod.expiry}
              </p>
            </div>
          </div>
          <button className="text-sm text-blue-600 hover:text-blue-800">
            Update
          </button>
        </div>

        <div className="pt-4 border-t">
          <h4 className="font-medium text-gray-900 mb-3">Billing Address</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
              <input
                type="text"
                value={settings.billing.billingAddress.street}
                onChange={(e) => updateSetting('billing', 'billingAddress', {
                  ...settings.billing.billingAddress,
                  street: e.target.value
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
              <input
                type="text"
                value={settings.billing.billingAddress.city}
                onChange={(e) => updateSetting('billing', 'billingAddress', {
                  ...settings.billing.billingAddress,
                  city: e.target.value
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
              <input
                type="text"
                value={settings.billing.billingAddress.state}
                onChange={(e) => updateSetting('billing', 'billingAddress', {
                  ...settings.billing.billingAddress,
                  state: e.target.value
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
              <input
                type="text"
                value={settings.billing.billingAddress.zip}
                onChange={(e) => updateSetting('billing', 'billingAddress', {
                  ...settings.billing.billingAddress,
                  zip: e.target.value
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Purchase History */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Purchase History</h3>
          <button className="flex items-center text-sm text-blue-600 hover:text-blue-800">
            <Download className="h-4 w-4 mr-1" />
            Download All
          </button>
        </div>
        
        <div className="space-y-3">
          {purchaseHistory.map((purchase) => (
            <div key={purchase.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{purchase.course}</p>
                <p className="text-sm text-gray-500 flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {new Date(purchase.date).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900">${purchase.amount}</p>
                <p className="text-sm text-green-600 capitalize">{purchase.status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return renderProfileSettings();
      case 'security':
        return renderSecuritySettings();
      case 'billing':
        return renderBillingSettings();
      default:
        return renderProfileSettings();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <MentaroNavbar />
      <Navbar />
      
      <div className="max-w-6xl mx-auto py-6 px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <nav className="bg-white rounded-lg shadow-sm border p-4">
              <ul className="space-y-2">
                {tabs.map((tab) => (
                  <li key={tab.id}>
                    <button
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? 'bg-blue-50 text-blue-600 border-l-2 border-blue-600'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span className="mr-3">{tab.icon}</span>
                      {tab.label}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="lg:col-span-3">
            {renderTabContent()}
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleSave}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
