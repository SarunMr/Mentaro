import React, { useState } from 'react';
import girlAvatar from '../../assets/images/girl.png';

export default function Profilepage() {
  const [formData, setFormData] = useState({
    firstName: 'Jonathan',
    lastName: 'Doe',
    headline: '',
    language: 'English',
    link: 'www.kitani.io',
    profileImage: null,
  });

  const [errors, setErrors] = useState({}); // Added error state
  const [activeTab, setActiveTab] = useState('Profile');
  const [isSubmitting, setIsSubmitting] = useState(false); // Added loading state

  const tabs = ['Profile', 'Account', 'Payment Methods', 'Notifications'];

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (formData.link && !formData.link.startsWith('http')) {
      newErrors.link = 'Link must start with http:// or https://';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file');
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size should be less than 5MB');
        return;
      }
      const imageUrl = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, profileImage: imageUrl }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // TODO: Replace with actual API call
      // const response = await api.updateProfile(formData);
      console.log('Saved data:', formData);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <main className="flex-grow flex flex-col items-center px-4 py-10">
        <div className="w-full max-w-2xl">
          <h2 className="text-2xl font-semibold text-center mb-6">My Account</h2>

          <div className="flex justify-center border-b mb-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium border-b-2 whitespace-nowrap ${
                  activeTab === tab
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-black'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === 'Profile' && (
            <div>
              <div className="flex justify-center mb-6">
                <label className="cursor-pointer relative group">
                  <img
                    src={formData.profileImage || girlAvatar}
                    alt="Profile"
                    className="w-20 h-20 rounded-full object-cover"
                  />
                  <input 
                    type="file" 
                    className="hidden" 
                    onChange={handleImageUpload}
                    accept="image/*"
                  />
                  <span className="absolute bottom-0 right-0 bg-gray-800 text-white text-xs px-1 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    ✎
                  </span>
                </label>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`w-full border rounded px-3 py-2 mt-1 ${
                      errors.firstName ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`w-full border rounded px-3 py-2 mt-1 ${
                      errors.lastName ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium">Headline</label>
                  <input
                    type="text"
                    name="headline"
                    value={formData.headline}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Language</label>
                  <select
                    name="language"
                    value={formData.language}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                  >
                    <option value="English">English</option>
                    <option value="Spanish">Spanish</option>
                    <option value="French">French</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium">Link</label>
                  <input
                    type="text"
                    name="link"
                    value={formData.link}
                    onChange={handleChange}
                    className={`w-full border rounded px-3 py-2 mt-1 ${
                      errors.link ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.link && (
                    <p className="text-red-500 text-xs mt-1">{errors.link}</p>
                  )}
                </div>
                <div className="text-center">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 ${
                      isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {isSubmitting ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab !== 'Profile' && (
            <div className="text-center text-gray-500 py-10">
              <p>This is the <strong>{activeTab}</strong> tab content.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
