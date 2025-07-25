import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Bell, 
  User, 
  ChevronDown,
  GraduationCap,
  Shield,
  X,
  Clock,
  CheckCircle
} from 'lucide-react';

const InstructorNavbar = () => {
  const [isAdminView, setIsAdminView] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "New Assignment Posted",
      message: "Mathematics Assignment 3 has been posted",
      time: "2 hours ago",
      read: false,
      type: "assignment"
    },
    {
      id: 2,
      title: "Grade Updated",
      message: "Your grade for Physics Quiz 2 has been updated",
      time: "1 day ago",
      read: false,
      type: "grade"
    },
    {
      id: 3,
      title: "Class Reminder",
      message: "Chemistry lab session starts in 30 minutes",
      time: "3 hours ago",
      read: true,
      type: "reminder"
    },
    {
      id: 4,
      title: "System Maintenance",
      message: "Scheduled maintenance on Sunday 2 AM - 4 AM",
      time: "2 days ago",
      read: false,
      type: "system"
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const toggleView = () => {
    setIsAdminView(!isAdminView);
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getUserInitials = (username) => {
    if (!username) return 'I';
    return username.charAt(0).toUpperCase();
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'assignment':
        return <GraduationCap className="h-4 w-4 text-blue-500" />;
      case 'grade':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'reminder':
        return <Clock className="h-4 w-4 text-orange-500" />;
      case 'system':
        return <Shield className="h-4 w-4 text-red-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <nav className="bg-white shadow-sm py-3 px-6 flex justify-between items-center relative">
      {/* Empty left side */}
      <div></div>

      {/* Right side controls */}
      <div className="flex items-center space-x-4">
        {/* View Toggle */}
        <button
          onClick={toggleView}
          className="flex items-center px-3 py-2 rounded-md text-sm font-medium bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          {isAdminView ? (
            <>
              <GraduationCap className="h-4 w-4 mr-2" />
              Switch to Student
            </>
          ) : (
            <>
              <Shield className="h-4 w-4 mr-2" />
              Switch to Instructor
            </>
          )}
        </button>

        {/* Notification Button */}
        <div className="relative">
          <button 
            onClick={toggleNotifications}
            className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <Bell className="h-5 w-5 text-gray-600" />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
              {/* Header */}
              <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
                <div className="flex items-center space-x-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Mark all read
                    </button>
                  )}
                  <button
                    onClick={toggleNotifications}
                    className="p-1 hover:bg-gray-100 rounded-full"
                  >
                    <X className="h-4 w-4 text-gray-500" />
                  </button>
                </div>
              </div>

              {/* Notifications List */}
              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="px-4 py-8 text-center text-gray-500">
                    <Bell className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No notifications</p>
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 ${
                        !notification.read ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className={`text-sm font-medium ${
                              !notification.read ? 'text-gray-900' : 'text-gray-600'
                            }`}>
                              {notification.title}
                            </p>
                            <button
                              onClick={() => deleteNotification(notification.id)}
                              className="ml-2 p-1 hover:bg-gray-200 rounded-full"
                            >
                              <X className="h-3 w-3 text-gray-400" />
                            </button>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <p className="text-xs text-gray-400">
                              {notification.time}
                            </p>
                            {!notification.read && (
                              <button
                                onClick={() => markAsRead(notification.id)}
                                className="text-xs text-blue-600 hover:text-blue-800"
                              >
                                Mark as read
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              {notifications.length > 0 && (
                <div className="px-4 py-3 border-t border-gray-200 text-center">
                  <button className="text-sm text-blue-600 hover:text-blue-800">
                    View all notifications
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* User Dropdown */}
        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-medium">
              {getUserInitials(user?.username)}
            </div>
            <ChevronDown className="h-4 w-4 text-gray-600" />
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
              <div className="px-4 py-2 text-sm font-medium text-gray-900 border-b">
                {user?.username || 'Instructor'}
              </div>
              <div className="px-4 py-1 text-xs text-gray-500 border-b">
                {user?.email || 'instructor@example.com'}
              </div>
              <a
                href="#"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Your Profile
              </a>
              <a
                href="#"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Settings
              </a>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default InstructorNavbar;
