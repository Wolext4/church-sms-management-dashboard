'use client';

import { useState } from 'react';
import { useSMSStore } from '@/lib/store/sms';
import { useCreditsStore } from '@/lib/store/credits';
import { useNotificationsStore } from '@/lib/store/notifications';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Send, AlertCircle, CheckCircle } from 'lucide-react';

export default function QuickSendPage() {
  const { sendQuickSMS, isLoading, error } = useSMSStore();
  const { balance } = useCreditsStore();
  const { addNotification } = useNotificationsStore();

  const [formData, setFormData] = useState({
    to: '',
    message: '',
  });

  const [charCount, setCharCount] = useState(0);
  const maxChars = 160;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name === 'message') {
      setCharCount(value.length);
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.to || !formData.message) {
      addNotification({
        type: 'ERROR',
        title: 'Validation Error',
        message: 'Please fill in all fields',
      });
      return;
    }

    if (!formData.to.match(/^\+?[1-9]\d{1,14}$/)) {
      addNotification({
        type: 'ERROR',
        title: 'Invalid Phone Number',
        message: 'Please enter a valid phone number',
      });
      return;
    }

    if (!balance || balance.available < 1) {
      addNotification({
        type: 'ERROR',
        title: 'Insufficient Credits',
        message: 'You do not have enough credits to send this SMS',
      });
      return;
    }

    try {
      await sendQuickSMS(formData.to, formData.message);
      addNotification({
        type: 'SUCCESS',
        title: 'SMS Sent',
        message: `Message sent to ${formData.to}`,
      });
      setFormData({ to: '', message: '' });
      setCharCount(0);
    } catch (err) {
      addNotification({
        type: 'ERROR',
        title: 'Failed to Send',
        message: 'Could not send SMS. Please try again.',
      });
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Quick Send SMS</h1>
        <p className="text-gray-600 mt-2">Send a single SMS message instantly</p>
      </div>

      {/* Credits Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
        <div className="text-blue-600 mt-0.5">
          <CheckCircle className="w-5 h-5" />
        </div>
        <div>
          <p className="font-medium text-blue-900">Available Credits</p>
          <p className="text-blue-700 text-sm">
            You have <span className="font-bold">{balance?.available || 0}</span> credits available
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="to" className="text-sm font-medium">
              Recipient Phone Number
            </Label>
            <Input
              id="to"
              name="to"
              type="tel"
              value={formData.to}
              onChange={handleChange}
              placeholder="+1234567890"
              disabled={isLoading}
              className="mt-2"
            />
            <p className="text-xs text-gray-500 mt-1">
              Include country code (e.g., +1 for US, +44 for UK)
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="message" className="text-sm font-medium">
                Message
              </Label>
              <span className={`text-xs font-medium ${charCount > maxChars ? 'text-red-600' : 'text-gray-600'}`}>
                {charCount}/{maxChars}
              </span>
            </div>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Type your message here..."
              disabled={isLoading}
              maxLength={320}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none disabled:bg-gray-50"
            />
            <p className="text-xs text-gray-500 mt-1">
              {charCount > maxChars
                ? `Your message will be sent as ${Math.ceil(charCount / maxChars)} SMS (${charCount} characters)`
                : `${maxChars - charCount} characters remaining`}
            </p>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-red-900">Error</p>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading || !formData.to || !formData.message}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2"
          >
            {isLoading ? (
              <>
                <Send className="w-4 h-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Send SMS
              </>
            )}
          </Button>
        </form>
      </div>

      {/* Info Card */}
      <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-3">SMS Guidelines</h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>✓ Messages up to 160 characters are sent as a single SMS</li>
          <li>✓ Longer messages are automatically split into multiple SMS</li>
          <li>✓ Special characters may increase the message size</li>
          <li>✓ Each SMS costs 1 credit</li>
          <li>✓ Delivery typically completes within seconds</li>
        </ul>
      </div>
    </div>
  );
}
