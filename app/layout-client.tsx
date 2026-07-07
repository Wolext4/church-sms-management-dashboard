'use client';

import { ReactNode, useEffect, useState } from 'react';
import { NotificationContainer } from '@/components/notifications/notification-container';

export default function RootLayoutClient({
  children,
}: {
  children: ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <>
      {children}
      <NotificationContainer />
    </>
  );
}
