import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Pusher from 'pusher-js';
import Link from 'next/link';

interface Notification {
  id: string;
  type: 'message' | 'task' | 'project';
  content: string;
  link: string;
  createdAt: string;
  read: boolean;
}

const Notifications: React.FC = () => {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (session?.user?.id) {
      const fetchNotifications = async () => {
        const response = await fetch('/api/notifications');
        const data = await response.json();
        setNotifications(data);
      };
      fetchNotifications();

      const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
        cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
      });

      const channel = pusher.subscribe(`user-${session.user.id}`);
      channel.bind('new-notification', (data: Notification) => {
        setNotifications((prevNotifications) => [data, ...prevNotifications]);
      });

      return () => {
        pusher.unsubscribe(`user-${session.user.id}`);
      };
    }
  }, [session?.user?.id]);

  const markAsRead = async (notificationId: string) => {
    await fetch(`/api/notifications/${notificationId}`, { method: 'PUT' });
    setNotifications(notifications.map(notif => 
      notif.id === notificationId ? { ...notif, read: true } : notif
    ));
  };

  const renderNotificationContent = (notification: Notification) => {
    switch (notification.type) {
      case 'message':
        return `New message: ${notification.content}`;
      case 'task':
        return `Task update: ${notification.content}`;
      case 'project':
        return `Project update: ${notification.content}`;
      default:
        return notification.content;
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setShowNotifications(!showNotifications)}
        className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 relative"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {notifications.some(n => !n.read) && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {notifications.filter(n => !n.read).length}
          </span>
        )}
      </button>
      {showNotifications && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-20 max-h-96 overflow-y-auto">
          <div className="py-2">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <Link 
                  key={notification.id} 
                  href={notification.link}
                  className={`flex items-center px-4 py-3 hover:bg-gray-100 -mx-2 ${notification.read ? 'opacity-50' : ''}`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <p className="text-gray-600 text-sm mx-2">
                    {renderNotificationContent(notification)}
                    <span className="text-xs text-gray-400 block">{new Date(notification.createdAt).toLocaleString()}</span>
                  </p>
                </Link>
              ))
            ) : (
              <p className="text-center text-gray-500 py-4">No notifications</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;
