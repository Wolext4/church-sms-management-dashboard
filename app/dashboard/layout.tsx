'use client';

import { ReactNode, useState } from 'react';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { Sidebar } from '@/components/dashboard/sidebar';
import { TopNav } from '@/components/dashboard/top-nav';
import ResponsiveContainer from '@/components/ui/responsive-container';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-gray-50">
        <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopNav onMenuToggle={() => setMobileOpen((s) => !s)} />
          <main className="flex-1 overflow-auto">
            <ResponsiveContainer className="py-8">
              {children}
            </ResponsiveContainer>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
