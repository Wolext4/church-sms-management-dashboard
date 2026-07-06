'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth';
import { useNotificationsStore } from '@/lib/store/notifications';
import { Button } from '@/components/ui/button';
import { LogOut, User, Bell } from 'lucide-react';
import { useState } from 'react';

export function TopNav() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { addNotification } = useNotificationsStore();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      addNotification({
        type: 'SUCCESS',
        title: 'Logged Out',
        message: 'You have been logged out successfully',
      });
      router.push('/login');
    } catch (error) {
      addNotification({
        type: 'ERROR',
        title: 'Error',
        message: 'Failed to logout',
      });
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Welcome back, {user?.firstName}</h2>
        <p className="text-sm text-gray-600">{user?.email}</p>
      </div>

      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="relative"
        >
          <Bell className="w-5 h-5 text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </Button>

        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-semibold">
                {user?.firstName.charAt(0)}{user?.lastName.charAt(0)}
              </span>
            </div>
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-40">
              <div className="p-4 border-b border-gray-200">
                <p className="font-medium text-gray-900">{user?.firstName} {user?.lastName}</p>
                <p className="text-sm text-gray-600">{user?.role}</p>
              </div>

              <button
                onClick={() => {
                  router.push('/dashboard/settings');
                  setShowMenu(false);
                }}
                className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-50 text-left text-gray-700"
              >
                <User className="w-4 h-4" />
                Profile Settings
              </button>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-3 hover:bg-red-50 text-left text-red-600 border-t border-gray-200"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
