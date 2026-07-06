'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/store/auth';
import { useNotificationsStore } from '@/lib/store/notifications';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings, Save, User, Bell, Lock } from 'lucide-react';
import { settingsAPI } from '@/lib/api';

interface AppSettings {
  id: string;
  churchId: string;
  theme: 'light' | 'dark' | 'auto';
  smsNotifications: boolean;
  emailNotifications: boolean;
  language: string;
  timezone: string;
  createdAt: string;
  updatedAt: string;
}

export default function SettingsPage() {
  const { user } = useAuthStore();
  const { addNotification } = useNotificationsStore();
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editData, setEditData] = useState({
    theme: 'auto' as const,
    smsNotifications: true,
    emailNotifications: true,
    language: 'en',
    timezone: 'UTC',
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const response = await settingsAPI.get();
      setSettings(response.data);
      setEditData({
        theme: response.data.theme,
        smsNotifications: response.data.smsNotifications,
        emailNotifications: response.data.emailNotifications,
        language: response.data.language,
        timezone: response.data.timezone,
      });
    } catch (error: any) {
      addNotification({
        type: 'ERROR',
        title: 'Error',
        message: 'Failed to load settings',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as any;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setEditData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await settingsAPI.update(editData);
      addNotification({
        type: 'SUCCESS',
        title: 'Success',
        message: 'Settings have been saved',
      });
    } catch (error: any) {
      addNotification({
        type: 'ERROR',
        title: 'Error',
        message: 'Failed to save settings',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-600">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">Manage your preferences and account settings</p>
      </div>

      {/* Profile Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <User className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-700">First Name</Label>
              <p className="mt-1 px-3 py-2 bg-gray-50 rounded-lg text-gray-900">{user?.firstName}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Last Name</Label>
              <p className="mt-1 px-3 py-2 bg-gray-50 rounded-lg text-gray-900">{user?.lastName}</p>
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700">Email</Label>
            <p className="mt-1 px-3 py-2 bg-gray-50 rounded-lg text-gray-900">{user?.email}</p>
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700">Role</Label>
            <p className="mt-1 px-3 py-2 bg-gray-50 rounded-lg text-gray-900">
              <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium border ${
                user?.role === 'ADMIN'
                  ? 'bg-red-50 text-red-700 border-red-200'
                  : user?.role === 'USER'
                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                    : 'bg-gray-50 text-gray-700 border-gray-200'
              }`}>
                {user?.role}
              </span>
            </p>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Lock className="w-4 h-4 mr-2" />
            Change Password
          </Button>
        </div>
      </div>

      {/* Preferences Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Settings className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">Preferences</h2>
        </div>

        <div className="space-y-6">
          {/* Theme */}
          <div>
            <Label htmlFor="theme" className="text-sm font-medium">
              Theme
            </Label>
            <select
              id="theme"
              name="theme"
              value={editData.theme}
              onChange={handleChange}
              className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="auto">Auto (System)</option>
            </select>
          </div>

          {/* Language */}
          <div>
            <Label htmlFor="language" className="text-sm font-medium">
              Language
            </Label>
            <select
              id="language"
              name="language"
              value={editData.language}
              onChange={handleChange}
              className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
          </div>

          {/* Timezone */}
          <div>
            <Label htmlFor="timezone" className="text-sm font-medium">
              Timezone
            </Label>
            <select
              id="timezone"
              name="timezone"
              value={editData.timezone}
              onChange={handleChange}
              className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="UTC">UTC</option>
              <option value="America/New_York">Eastern Time (ET)</option>
              <option value="America/Chicago">Central Time (CT)</option>
              <option value="America/Denver">Mountain Time (MT)</option>
              <option value="America/Los_Angeles">Pacific Time (PT)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Bell className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">Notifications</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div>
              <p className="font-medium text-gray-900">SMS Notifications</p>
              <p className="text-sm text-gray-600">Receive SMS notifications for important events</p>
            </div>
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="smsNotifications"
                checked={editData.smsNotifications}
                onChange={handleChange}
                className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div>
              <p className="font-medium text-gray-900">Email Notifications</p>
              <p className="text-sm text-gray-600">Receive email notifications for system updates</p>
            </div>
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="emailNotifications"
                checked={editData.emailNotifications}
                onChange={handleChange}
                className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex gap-3">
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Saving...' : 'Save Settings'}
        </Button>
        <Button
          onClick={loadSettings}
          variant="outline"
          disabled={saving}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
