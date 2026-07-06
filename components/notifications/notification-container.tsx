'use client';

import { useNotificationsStore } from '@/lib/store/notifications';
import { NotificationItem } from './notification-item';

export function NotificationContainer() {
  const { notifications } = useNotificationsStore();

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md">
      {notifications.map((notification) => (
        <NotificationItem key={notification.id} notification={notification} />
      ))}
    </div>
  );
}
