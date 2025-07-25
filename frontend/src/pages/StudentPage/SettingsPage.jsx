
import React, { useState, useEffect } from 'react';
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
import { useAuth } from '../../contexts/AuthContext';
import { authAPI, enrollmentAPI } from '../../utils/apiClient';

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
      firstName: '',
      lastName: '',
      email: '',
      bio: '',
      username: ''
    },
    security: {
      passwordLastChanged: ''
    },
    billing: {
      paymentMethod: {
        type: 'card',
        last4: '4242',
        expiry: '12/26'
      },
      billingAddress: {
        street: '',
        city: '',
        state: '',
        zip: '',
        country: 'US'
      }
    }
  });

  const [activeTab, setActiveTab] = useState('profile');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const { user } = useAuth();

  // Fetch user data on component mount
  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch user profile
      const profileResponse = await authAPI.getProfile();
      if (profileResponse.success) {
        const profile = profileResponse.data;
        setSettings(prev => ({
          ...prev,
          profile: {
            firstName: profile.firstName || '',
            lastName: profile.lastName || '',
            email: profile.email || '',
            bio: profile.bio || '',
            username: profile.username || generateUsername()
          }
        }));
      }

      // Fetch purchase history (enrolled courses)
      const enrollmentsResponse = await enrollmentAPI.getMyEnrollments();
      if (enrollmentsResponse.success) {
        const enrollments = enrollmentsResponse.data;
        const history = enrollments.map(enrollment => ({
          id: enrollment._id,
          course: enrollment.course?.title || 'Unknown Course',
          date: enrollment.enrollmentDate,
          amount: enrollment.course?.price || 0,
          status: enrollment.status === 'completed' ? 'completed' : 'in progress'
        }));
        setPurchaseHistory(history);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError('Failed to load user data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = (section, key, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);

      // Update user profile
      const updateResponse = await authAPI.updateProfile({
        firstName: settings.profile.firstName,
        lastName: settings.profile.lastName,
        email: settings.profile.email,
        bio: settings.profile.bio,
        username: settings.profile.username
      });

      if (updateResponse.success) {
        alert('Settings saved successfully!');
      } else {
        throw new Error(updateResponse.message || 'Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      setError('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'security', label: 'Security', icon: '🔐' },
    { id: 'billing', label: 'Billing', icon: '💳' }
  ];

  // Purchase history from API
  const [purchaseHistory, setPurchaseHistory] = useState([]);

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
          {purchaseHistory.length > 0 ? (
            purchaseHistory.map((purchase) => (
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
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              No purchase history available.
            </div>
          )}
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <MentaroNavbar />
        <Navbar />
        <div className="max-w-6xl mx-auto py-6 px-6">
          <div className="flex justify-center items-center h-64">
            <div className="text-lg text-gray-600">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <MentaroNavbar />
      <Navbar />
      
      {error && (
        <div className="max-w-6xl mx-auto px-6 pt-6">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        </div>
      )}
      
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
                disabled={saving}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
