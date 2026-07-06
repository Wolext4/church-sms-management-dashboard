'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MessageCircle, ArrowLeft, Loader2 } from 'lucide-react';
import { useNotificationsStore } from '@/lib/store/notifications';
import { authAPI } from '@/lib/api';

export default function ForgotPasswordPage() {
  const { addNotification } = useNotificationsStore();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      addNotification({
        type: 'ERROR',
        title: 'Validation Error',
        message: 'Please enter your email address',
      });
      return;
    }

    try {
      setIsLoading(true);
      await authAPI.forgotPassword(email);
      setSubmitted(true);
      addNotification({
        type: 'SUCCESS',
        title: 'Email Sent',
        message: 'Check your email for password reset instructions',
      });
    } catch (error: any) {
      addNotification({
        type: 'ERROR',
        title: 'Error',
        message: error.response?.data?.error || 'Failed to send reset email',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="p-3 bg-blue-600 rounded-lg">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Church SMS</h1>
          </div>
          <p className="text-gray-600">Professional SMS Management</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
          {!submitted ? (
            <>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Reset Password</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Enter your email and we&apos;ll send you a link to reset your password
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@church.com"
                    disabled={isLoading}
                    className="mt-1"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    'Send Reset Link'
                  )}
                </Button>
              </form>

              <Link href="/login">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Login
                </Button>
              </Link>
            </>
          ) : (
            <>
              <div className="text-center space-y-4">
                <div className="p-3 bg-green-50 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Check your email</h2>
                <p className="text-sm text-gray-600">
                  We&apos;ve sent a password reset link to {email}
                </p>
                <p className="text-xs text-gray-500">
                  The link will expire in 24 hours. If you don&apos;t see it, check your spam folder.
                </p>
              </div>

              <Link href="/login">
                <Button
                  type="button"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Back to Login
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
