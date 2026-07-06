'use client';

import { Notification } from '@/lib/types';
import { useNotificationsStore } from '@/lib/store/notifications';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

interface NotificationItemProps {
  notification: Notification;
}

export function NotificationItem({ notification }: NotificationItemProps) {
  const { removeNotification } = useNotificationsStore();

  const icons = {
    SUCCESS: <CheckCircle className="w-5 h-5 text-green-500" />,
    ERROR: <AlertCircle className="w-5 h-5 text-red-500" />,
    WARNING: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
    INFO: <Info className="w-5 h-5 text-blue-500" />,
  };

  const backgrounds = {
    SUCCESS: 'bg-green-50 border-green-200',
    ERROR: 'bg-red-50 border-red-200',
    WARNING: 'bg-yellow-50 border-yellow-200',
    INFO: 'bg-blue-50 border-blue-200',
  };

  return (
    <div
      className={`${backgrounds[notification.type]} border rounded-lg p-4 flex gap-3 animate-in slide-in-from-top-2 fade-in`}
    >
      {icons[notification.type]}
      <div className="flex-1">
        <h3 className="font-semibold text-sm">{notification.title}</h3>
        <p className="text-sm text-gray-600">{notification.message}</p>
      </div>
      <button
        onClick={() => removeNotification(notification.id)}
        className="text-gray-400 hover:text-gray-600"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
