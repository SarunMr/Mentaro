
import React, { useState } from 'react';
import MentaroNavbar from './../../components/Student/StudentNavbar.jsx';
import Navbar from './../../components/Student/Navbar.jsx';
import { 
  MessageCircle, 
  RotateCcw, 
  Clock, 
  Award, 
  Info,
  Check,
  Trash2,
  Bell
} from 'lucide-react';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "message",
      title: "New message from instructor",
      message: "John Smith replied to your question in React Developer Course",
      time: "2 hours ago",
      read: false
    },
    {
      id: 2,
      type: "update",
      title: "Course updated",
      message: "React Basics has new content available",
      time: "1 day ago",
      read: false
    },
    {
      id: 3,
      type: "reminder",
      title: "Assignment due soon",
      message: "JavaScript project is due in 2 days",
      time: "2 days ago",
      read: false
    },
    {
      id: 4,
      type: "achievement",
      title: "Certificate earned",
      message: "Congratulations! You've completed the CSS Fundamentals course",
      time: "3 days ago",
      read: true
    },
    {
      id: 5,
      type: "message",
      title: "New course recommendation",
      message: "Based on your progress, you might like Advanced JavaScript",
      time: "1 week ago",
      read: true
    }
  ]);

  const [filter, setFilter] = useState('all');

  const markAsRead = (id) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.read;
    if (filter === 'read') return notification.read;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'message':
        return <MessageCircle className="h-6 w-6 text-blue-500" />;
      case 'update':
        return <RotateCcw className="h-6 w-6 text-green-500" />;
      case 'reminder':
        return <Clock className="h-6 w-6 text-yellow-500" />;
      case 'achievement':
        return <Award className="h-6 w-6 text-purple-500" />;
      default:
        return <Info className="h-6 w-6 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <MentaroNavbar />
      <Navbar />
      
      <div className="max-w-4xl mx-auto py-6 px-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
            <p className="text-gray-600 mt-2">
              {unreadCount} unread {unreadCount === 1 ? 'notification' : 'notifications'}
            </p>
          </div>
          
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="mt-4 sm:mt-0 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              Mark All as Read
            </button>
          )}
        </div>

        <div className="flex space-x-1 mb-6 bg-white rounded-lg p-1 shadow-sm border">
          {[
            { value: 'all', label: 'All' },
            { value: 'unread', label: 'Unread' },
            { value: 'read', label: 'Read' }
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === tab.value
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Bell className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No notifications</h3>
            <p className="text-gray-600">You're all caught up! Check back later for new notifications.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredNotifications.map((notification) => (
              <div key={notification.id} className={`bg-white rounded-lg border p-4 transition-all ${
                notification.read ? 'shadow-sm' : 'shadow-md border-l-4 border-l-blue-500'
              }`}>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className={`font-medium ${notification.read ? 'text-gray-900' : 'text-gray-900 font-semibold'}`}>
                          {notification.title}
                        </h4>
                        <p className="text-gray-600 mt-1">{notification.message}</p>
                        <p className="text-sm text-gray-500 mt-2">{notification.time}</p>
                      </div>

                      <div className="flex items-center space-x-2 ml-4">
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                            title="Mark as read"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                        )}
                        
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
