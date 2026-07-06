'use client';

import { useState, useEffect } from 'react';
import { useSMSStore } from '@/lib/store/sms';
import { useCreditsStore } from '@/lib/store/credits';
import { useNotificationsStore } from '@/lib/store/notifications';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Send, AlertCircle, CheckCircle, Upload, Trash2 } from 'lucide-react';

export default function BulkSendPage() {
  const { sendBulkSMS, templates, isLoading, fetchTemplates } = useSMSStore();
  const { balance } = useCreditsStore();
  const { addNotification } = useNotificationsStore();

  const [formData, setFormData] = useState({
    recipients: '',
    message: '',
    templateId: '',
  });

  const [recipientList, setRecipientList] = useState<string[]>([]);
  const [charCount, setCharCount] = useState(0);
  const maxChars = 160;

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'message') {
      setCharCount(value.length);
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddRecipients = () => {
    const numbers = formData.recipients
      .split(/[\n,]+/)
      .map((n) => n.trim())
      .filter((n) => n && n.match(/^\+?[1-9]\d{1,14}$/));

    if (numbers.length === 0) {
      addNotification({
        type: 'ERROR',
        title: 'Invalid Phone Numbers',
        message: 'Please enter valid phone numbers (one per line or comma-separated)',
      });
      return;
    }

    setRecipientList([...new Set([...recipientList, ...numbers])]);
    setFormData((prev) => ({ ...prev, recipients: '' }));

    addNotification({
      type: 'SUCCESS',
      title: 'Recipients Added',
      message: `${numbers.length} recipient(s) added`,
    });
  };

  const handleRemoveRecipient = (index: number) => {
    setRecipientList(recipientList.filter((_, i) => i !== index));
  };

  const handleSelectTemplate = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId);
    if (template) {
      setFormData((prev) => ({
        ...prev,
        templateId,
        message: template.content,
      }));
      setCharCount(template.content.length);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (recipientList.length === 0) {
      addNotification({
        type: 'ERROR',
        title: 'No Recipients',
        message: 'Please add at least one recipient',
      });
      return;
    }

    if (!formData.message) {
      addNotification({
        type: 'ERROR',
        title: 'No Message',
        message: 'Please enter a message',
      });
      return;
    }

    const estimatedCost = recipientList.length;
    if (!balance || balance.available < estimatedCost) {
      addNotification({
        type: 'ERROR',
        title: 'Insufficient Credits',
        message: `You need ${estimatedCost} credits but only have ${balance?.available || 0}`,
      });
      return;
    }

    try {
      await sendBulkSMS(
        recipientList,
        formData.message,
        formData.templateId || undefined
      );
      addNotification({
        type: 'SUCCESS',
        title: 'Bulk SMS Sent',
        message: `Messages sent to ${recipientList.length} recipients`,
      });
      setFormData({ recipients: '', message: '', templateId: '' });
      setRecipientList([]);
      setCharCount(0);
    } catch (err) {
      addNotification({
        type: 'ERROR',
        title: 'Failed to Send',
        message: 'Could not send bulk SMS. Please try again.',
      });
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Bulk Send SMS</h1>
        <p className="text-gray-600 mt-2">Send SMS to multiple recipients at once</p>
      </div>

      {/* Credits Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
        <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-medium text-blue-900">Available Credits</p>
          <p className="text-blue-700 text-sm">
            You have <span className="font-bold">{balance?.available || 0}</span> credits available
            {recipientList.length > 0 && (
              <span> • Sending to {recipientList.length} recipients will cost {recipientList.length} credits</span>
            )}
          </p>
        </div>
      </div>

      {/* Main Form */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Recipients Section */}
          <div>
            <Label className="text-sm font-medium">Recipients</Label>
            <p className="text-xs text-gray-600 mb-3">Enter phone numbers (one per line or comma-separated)</p>

            <div className="space-y-3">
              <textarea
                name="recipients"
                value={formData.recipients}
                onChange={handleChange}
                placeholder="+1234567890&#10;+1234567891&#10;+1234567892"
                disabled={isLoading}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none disabled:bg-gray-50 text-sm"
              />

              <Button
                type="button"
                onClick={handleAddRecipients}
                disabled={!formData.recipients || isLoading}
                className="bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200"
              >
                <Upload className="w-4 h-4 mr-2" />
                Add Recipients
              </Button>
            </div>
          </div>

          {/* Recipients List */}
          {recipientList.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">
                Recipients ({recipientList.length})
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-3 bg-gray-50 rounded-lg border border-gray-200">
                {recipientList.map((recipient, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between gap-2 bg-white px-3 py-2 rounded border border-gray-200 text-sm"
                  >
                    <span className="text-gray-700">{recipient}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveRecipient(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Templates Section */}
          <div>
            <Label htmlFor="template" className="text-sm font-medium">
              Use Template (Optional)
            </Label>
            <select
              id="template"
              value={formData.templateId}
              onChange={(e) => handleSelectTemplate(e.target.value)}
              disabled={isLoading}
              className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
            >
              <option value="">None - Type your own message</option>
              {templates.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.name}
                </option>
              ))}
            </select>
          </div>

          {/* Message Section */}
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
                ? `Your message will be sent as ${Math.ceil(charCount / maxChars)} SMS per recipient`
                : `${maxChars - charCount} characters remaining`}
            </p>
          </div>

          {formData.message && (
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-xs font-medium text-gray-600 mb-2">Message Preview</p>
              <p className="text-sm text-gray-900 whitespace-pre-wrap">{formData.message}</p>
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading || recipientList.length === 0 || !formData.message}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2"
          >
            {isLoading ? (
              <>
                <Send className="w-4 h-4 mr-2 animate-spin" />
                Sending to {recipientList.length} recipients...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Send to {recipientList.length} Recipients
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
