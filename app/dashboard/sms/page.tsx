'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Clock3, FileText, Send, Users } from 'lucide-react';

const smsNodes = [
  {
    title: 'Quick Send',
    description: 'Send one message to a single recipient.',
    href: '/dashboard/sms/quick-send',
    icon: Send,
    color: 'bg-blue-50 text-blue-600 border-blue-200',
  },
  {
    title: 'Bulk Send',
    description: 'Send one message to multiple recipients.',
    href: '/dashboard/sms/bulk-send',
    icon: Users,
    color: 'bg-green-50 text-green-600 border-green-200',
  },
  {
    title: 'Templates',
    description: 'Create and reuse common message templates.',
    href: '/dashboard/sms/templates',
    icon: FileText,
    color: 'bg-purple-50 text-purple-600 border-purple-200',
  },
  {
    title: 'History',
    description: 'Review sent campaigns and delivery summaries.',
    href: '/dashboard/sms/history',
    icon: Clock3,
    color: 'bg-orange-50 text-orange-600 border-orange-200',
  },
];

export default function SMSPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">SMS</h1>
        <p className="text-gray-600 mt-2">Choose an SMS workflow to continue</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {smsNodes.map((node) => {
          const Icon = node.icon;

          return (
            <Link
              key={node.href}
              href={node.href}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md hover:border-gray-300 transition-all"
            >
              <div className={`w-12 h-12 rounded-lg border flex items-center justify-center mb-4 ${node.color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <h2 className="font-semibold text-gray-900">{node.title}</h2>
              <p className="text-sm text-gray-600 mt-2 min-h-10">{node.description}</p>
              <Button className="mt-5 bg-blue-600 hover:bg-blue-700 text-white" size="sm">
                Open
              </Button>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
