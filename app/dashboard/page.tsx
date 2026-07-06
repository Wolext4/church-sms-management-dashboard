'use client';

import { useEffect, useState } from 'react';
import { useCreditsStore } from '@/lib/store/credits';
import { Button } from '@/components/ui/button';
import { MessageSquare, CreditCard, Users, TrendingUp, Send, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { balance, fetchBalance } = useCreditsStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      await fetchBalance();
      setLoading(false);
    };
    loadData();
  }, [fetchBalance]);

  const stats = [
    {
      label: 'Available Credits',
      value: balance?.available || 0,
      icon: CreditCard,
      color: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      label: 'Total Used',
      value: balance?.used || 0,
      icon: Send,
      color: 'bg-green-50',
      textColor: 'text-green-600',
    },
    {
      label: 'Total Balance',
      value: balance?.total || 0,
      icon: TrendingUp,
      color: 'bg-purple-50',
      textColor: 'text-purple-600',
    },
  ];

  const quickActions = [
    {
      label: 'Send Quick SMS',
      description: 'Send a single SMS message',
      href: '/dashboard/sms/quick-send',
      icon: MessageSquare,
      color: 'bg-blue-600',
    },
    {
      label: 'Bulk Send',
      description: 'Send to multiple recipients',
      href: '/dashboard/sms/bulk-send',
      icon: Send,
      color: 'bg-green-600',
    },
    {
      label: 'View Templates',
      description: 'Manage SMS templates',
      href: '/dashboard/sms/templates',
      icon: MessageSquare,
      color: 'bg-purple-600',
    },
    {
      label: 'Buy Credits',
      description: 'Purchase more credits',
      href: '/dashboard/credits',
      icon: CreditCard,
      color: 'bg-orange-600',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Overview of your SMS management system</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className={`${stat.color} rounded-lg p-6 border border-gray-200`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                  <p className={`text-3xl font-bold ${stat.textColor} mt-2`}>
                    {loading ? '...' : stat.value}
                  </p>
                </div>
                <Icon className={`w-10 h-10 ${stat.textColor} opacity-20`} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.href} href={action.href}>
                <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md hover:border-gray-300 transition-all cursor-pointer h-full">
                  <div className={`${action.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900">{action.label}</h3>
                  <p className="text-sm text-gray-600 mt-1">{action.description}</p>
                  <div className="flex items-center gap-2 text-blue-600 mt-4 text-sm font-medium">
                    Go <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Recent Activity</h2>
          <Link href="/dashboard/sms/history">
            <Button variant="outline" size="sm">
              View All <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
        <div className="text-center py-12">
          <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600">No recent activity yet</p>
          <Link href="/dashboard/sms/quick-send">
            <Button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white">
              Send Your First SMS
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
