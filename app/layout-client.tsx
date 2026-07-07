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
    // Apply persisted theme preference before rendering
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('rh_theme');
      if (saved === 'dark') {
        document.documentElement.classList.add('dark');
      } else if (saved === 'light') {
        document.documentElement.classList.remove('dark');
      } else if (saved === 'auto') {
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.classList.toggle('dark', prefersDark);
      }
    }

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
