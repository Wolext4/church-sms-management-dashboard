// Mock API for demo purposes
import { User } from './types';

const DEMO_USER: User = {
  id: 'demo-user-1',
  email: 'demo@church.com',
  firstName: 'Demo',
  lastName: 'User',
  role: 'admin',
  churchId: 'church-1',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const DEMO_TOKENS = {
  accessToken: 'demo-access-token-' + Date.now(),
  refreshToken: 'demo-refresh-token-' + Date.now(),
};

export const mockAuthAPI = {
  login: async (email: string, password: string) => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (email === 'demo@church.com' && password === 'demo123') {
      return {
        data: {
          user: DEMO_USER,
          accessToken: DEMO_TOKENS.accessToken,
          refreshToken: DEMO_TOKENS.refreshToken,
        },
      };
    }

    throw new Error('Invalid email or password');
  },

  register: async (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const newUser: User = {
      id: 'user-' + Date.now(),
      email,
      firstName,
      lastName,
      role: 'user',
      churchId: 'church-1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return {
      data: {
        user: newUser,
        accessToken: 'access-' + Date.now(),
        refreshToken: 'refresh-' + Date.now(),
      },
    };
  },

  logout: async () => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return { data: { success: true } };
  },

  refreshToken: async () => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return {
      data: {
        accessToken: 'demo-access-token-' + Date.now(),
        refreshToken: 'demo-refresh-token-' + Date.now(),
      },
    };
  },

  verifyEmail: async (token: string) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return { data: { success: true } };
  },

  forgotPassword: async (email: string) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return { data: { message: 'Reset link sent to email' } };
  },

  resetPassword: async (token: string, password: string) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return { data: { success: true } };
  },
};

// Mock data for other endpoints
export const mockDashboardAPI = {
  getStats: async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      data: {
        totalSmssSent: 1254,
        creditsRemaining: 5000,
        activeUsers: 12,
        churchMembers: 450,
        monthlyStats: [
          { month: 'Jan', sent: 150 },
          { month: 'Feb', sent: 200 },
          { month: 'Mar', sent: 180 },
          { month: 'Apr', sent: 320 },
          { month: 'May', sent: 280 },
          { month: 'Jun', sent: 520 },
        ],
      },
    };
  },
};

export const mockSmsAPI = {
  sendQuick: async (to: string, message: string) => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return {
      data: {
        id: 'sms-' + Date.now(),
        to,
        message,
        status: 'sent',
        timestamp: new Date().toISOString(),
      },
    };
  },

  sendBulk: async (recipients: string[], message: string, templateId?: string) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return {
      data: {
        id: 'bulk-' + Date.now(),
        recipientCount: recipients.length,
        message,
        status: 'processing',
        timestamp: new Date().toISOString(),
      },
    };
  },

  getTemplates: async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      data: [
        {
          id: 'template-1',
          name: 'Service Reminder',
          content: 'Hi {{name}}, reminder for this Sunday service at {{time}}. See you there!',
          variables: ['name', 'time'],
          createdAt: new Date().toISOString(),
        },
        {
          id: 'template-2',
          name: 'Welcome Message',
          content: 'Welcome to {{churchName}}! We are glad to have you.',
          variables: ['churchName'],
          createdAt: new Date().toISOString(),
        },
      ],
    };
  },

  createTemplate: async (name: string, content: string, variables: string[]) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      data: {
        id: 'template-' + Date.now(),
        name,
        content,
        variables,
        createdAt: new Date().toISOString(),
      },
    };
  },

  updateTemplate: async (id: string, name: string, content: string, variables: string[]) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      data: {
        id,
        name,
        content,
        variables,
        updatedAt: new Date().toISOString(),
      },
    };
  },

  deleteTemplate: async (id: string) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return { data: { success: true } };
  },
};

export const mockCreditsAPI = {
  getBalance: async () => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return {
      data: {
        available: 2500,
        used: 320,
        total: 2820,
      },
    };
  },

  getPackages: async () => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return {
      data: [
        {
          id: 'pkg-1',
          name: 'Starter Pack',
          description: 'Great for small churches',
          creditsAmount: 1000,
          price: 20,
          discount: 0,
        },
        {
          id: 'pkg-2',
          name: 'Growth Pack',
          description: 'Perfect for growing ministries',
          creditsAmount: 2500,
          price: 40,
          discount: 10,
        },
        {
          id: 'pkg-3',
          name: 'Enterprise Pack',
          description: 'For large outreach campaigns',
          creditsAmount: 5000,
          price: 75,
          discount: 15,
        },
      ],
    };
  },

  purchaseCredits: async (packageId: string) => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    return { data: { success: true, packageId } };
  },

  getHistory: async () => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return {
      data: {
        data: [
          {
            id: 'txn-1',
            type: 'PURCHASE',
            description: 'Starter Pack purchase',
            amount: 1000,
            balance: 2500,
            transactionDate: new Date().toISOString(),
          },
          {
            id: 'txn-2',
            type: 'USAGE',
            description: 'Bulk SMS campaign',
            amount: 120,
            balance: 2380,
            transactionDate: new Date(Date.now() - 86400000).toISOString(),
          },
        ],
      },
    };
  },
};

export const mockUsersAPI = {
  getList: async () => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return {
      data: {
        data: [
          {
            id: 'user-1',
            email: 'demo@church.com',
            firstName: 'Demo',
            lastName: 'User',
            role: 'ADMIN',
            createdAt: new Date().toISOString(),
          },
          {
            id: 'user-2',
            email: 'pastor@church.com',
            firstName: 'Pastor',
            lastName: 'James',
            role: 'USER',
            createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
          },
          {
            id: 'user-3',
            email: 'admin2@church.com',
            firstName: 'Sarah',
            lastName: 'Lee',
            role: 'VIEWER',
            createdAt: new Date(Date.now() - 86400000 * 20).toISOString(),
          },
        ],
      },
    };
  },

  create: async () => ({ data: { success: true } }),
  update: async () => ({ data: { success: true } }),
  delete: async () => ({ data: { success: true } }),
};

export const mockChurchAPI = {
  getInfo: async () => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return {
      data: {
        id: 'church-1',
        name: 'Grace Community Church',
        email: 'office@gracechurch.org',
        phone: '+1-555-0100',
        website: 'https://gracechurch.org',
        address: '123 Main Street',
        city: 'Springfield',
        state: 'IL',
        zipCode: '62704',
        country: 'USA',
        memberCount: 420,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    };
  },

  updateInfo: async () => ({ data: { success: true } }),

  getMembers: async () => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return {
      data: {
        data: [
          {
            id: 'member-1',
            firstName: 'Maria',
            lastName: 'Lopez',
            email: 'maria@example.com',
            phone: '+15550101',
            groups: ['Youth', 'Sunday School'],
            joinDate: new Date().toISOString(),
          },
          {
            id: 'member-2',
            firstName: 'David',
            lastName: 'Clark',
            phone: '+15550102',
            groups: ['Choir'],
            joinDate: new Date(Date.now() - 86400000 * 30).toISOString(),
          },
        ],
      },
    };
  },

  getGroups: async () => ({ data: { data: [{ id: 'group-1', name: 'Youth' }, { id: 'group-2', name: 'Choir' }] } }),
};

export const mockAuditLogsAPI = {
  getLogs: async () => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return {
      data: {
        data: [
          {
            id: 'log-1',
            action: 'CREATE',
            entityType: 'Template',
            entityId: 'template-1',
            userId: 'user-1',
            changes: { name: 'Service Reminder' },
            timestamp: new Date().toISOString(),
            ipAddress: '192.168.1.10',
            userAgent: 'Mozilla/5.0',
          },
          {
            id: 'log-2',
            action: 'SEND',
            entityType: 'SMS',
            entityId: 'sms-1',
            userId: 'user-2',
            changes: { recipients: 42 },
            timestamp: new Date(Date.now() - 86400000).toISOString(),
            ipAddress: '192.168.1.12',
            userAgent: 'Mozilla/5.0',
          },
        ],
      },
    };
  },
};

export const mockSettingsAPI = {
  get: async () => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return {
      data: {
        id: 'settings-1',
        churchId: 'church-1',
        theme: 'auto',
        smsNotifications: true,
        emailNotifications: true,
        language: 'en',
        timezone: 'UTC',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    };
  },

  update: async () => ({ data: { success: true } }),
};
