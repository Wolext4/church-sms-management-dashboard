// Mock API for demo purposes
import { User } from './types';

const DB_KEY = 'mock_db_v2';

const now = () => new Date().toISOString();

const defaultDb = {
  users: [
    {
      id: 'demo-user-1',
      email: 'demo@church.com',
      firstName: 'Demo',
      lastName: 'User',
      role: 'admin',
      churchId: 'church-1',
      createdAt: now(),
      updatedAt: now(),
    },
    {
      id: 'user-2',
      email: 'pastor@church.com',
      firstName: 'Pastor',
      lastName: 'James',
      role: 'user',
      churchId: 'church-1',
      createdAt: now(),
      updatedAt: now(),
    },
    {
      id: 'user-3',
      email: 'admin2@church.com',
      firstName: 'Sarah',
      lastName: 'Lee',
      role: 'viewer',
      churchId: 'church-1',
      createdAt: now(),
      updatedAt: now(),
    },
  ],
  tokens: {
    accessToken: 'demo-access-token-' + Date.now(),
    refreshToken: 'demo-refresh-token-' + Date.now(),
  },
  templates: [
    {
      id: 'template-1',
      name: 'Service Reminder',
      content: 'Hi {{name}}, reminder for this Sunday service at {{time}}. See you there!',
      variables: ['name', 'time'],
      createdAt: now(),
    },
    {
      id: 'template-2',
      name: 'Welcome Message',
      content: 'Welcome to {{churchName}}! We are glad to have you.',
      variables: ['churchName'],
      createdAt: now(),
    },
  ],
  smsHistory: [
    { id: 'sms-1001', to: '+15550101', message: 'Reminder: Service at 10am', status: 'sent', timestamp: now() },
    { id: 'sms-1002', to: '+15550102', message: 'Welcome to Grace Community Church!', status: 'sent', timestamp: now() },
    { id: 'sms-1003', to: '+15550103', message: 'Event: Youth Night this Friday', status: 'sent', timestamp: now() },
  ],
  credits: {
    available: 2500,
    used: 320,
    total: 2820,
  },
  dashboard: {
    totalSmssSent: 1257,
    creditsRemaining: 5000,
    activeUsers: 15,
    churchMembers: 450,
    monthlyStats: [
      { month: 'Jan', sent: 150 },
      { month: 'Feb', sent: 200 },
      { month: 'Mar', sent: 180 },
      { month: 'Apr', sent: 320 },
      { month: 'May', sent: 280 },
      { month: 'Jun', sent: 527 },
    ],
  },
  auditLogs: [
    { id: 'log-1', action: 'CREATE', entityType: 'Template', entityId: 'template-1', userId: 'demo-user-1', changes: { name: 'Service Reminder' }, timestamp: now(), ipAddress: '127.0.0.1', userAgent: 'mock-agent' },
    { id: 'log-2', action: 'SEND', entityType: 'SMS', entityId: 'sms-1001', userId: 'user-2', changes: { recipients: 1 }, timestamp: now(), ipAddress: '127.0.0.1', userAgent: 'mock-agent' },
    { id: 'log-3', action: 'UPDATE', entityType: 'Church', entityId: 'church-1', userId: 'demo-user-1', changes: { name: 'Updated church info' }, timestamp: now(), ipAddress: '127.0.0.1', userAgent: 'mock-agent' },
  ],
  church: {
    id: 'church-1',
    name: 'Redemption House',
    email: 'info@rccgrh53.org',
    phone: '(+234) 7000 000 0000',
    website: 'https://rccgrh53.org/',
    address: '23/24 Nuru Oniwo St, Surulere, Lagos 101015, Lagos',
    city: 'Lagos',
    state: 'Lagos Mainland',
    zipCode: '101015',
    country: 'Nigeria',
    memberCount: 420,
    createdAt: now(),
    updatedAt: now(),
  },
  settings: {
    id: 'settings-1',
    churchId: 'church-1',
    theme: 'auto',
    smsNotifications: true,
    emailNotifications: true,
    language: 'en',
    timezone: 'UTC',
    createdAt: now(),
    updatedAt: now(),
  },
};

function loadDb() {
  if (typeof window === 'undefined') return structuredClone(defaultDb);
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    // ignore parse errors
  }
  // persist initial DB for subsequent runs
  try {
    localStorage.setItem(DB_KEY, JSON.stringify(defaultDb));
  } catch (e) {}
  return structuredClone(defaultDb);
}

function saveDb(db: any) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
  } catch (e) {
    // ignore
  }
}

export const mockAuthAPI = {
  login: async (email: string, password: string) => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    const db = loadDb();
    const user = db.users.find((u: any) => u.email === email);
    // For demo purposes accept the demo password for demo user and any registered user
    if (user && (email === 'demo@church.com' ? password === 'demo123' : true)) {
      return {
        data: {
          user,
          accessToken: db.tokens.accessToken,
          refreshToken: db.tokens.refreshToken,
        },
      };
    }

    throw new Error('Invalid email or password');
  },

  register: async (email: string, password: string, firstName: string, lastName: string) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const db = loadDb();
    const exists = db.users.find((u: any) => u.email === email);
    if (exists) throw new Error('Email already registered');

    const newUser: User = {
      id: 'user-' + Date.now(),
      email,
      firstName,
      lastName,
      role: 'user',
      churchId: 'church-1',
      createdAt: now(),
      updatedAt: now(),
    } as any;

    db.users.push(newUser);
    saveDb(db);

    return {
      data: {
        user: newUser,
        accessToken: 'access-' + Date.now(),
        refreshToken: 'refresh-' + Date.now(),
      },
    };
  },

  logout: async () => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return { data: { success: true } };
  },

  refreshToken: async () => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const db = loadDb();
    // rotate tokens
    db.tokens.accessToken = 'demo-access-token-' + Date.now();
    db.tokens.refreshToken = 'demo-refresh-token-' + Date.now();
    saveDb(db);
    return {
      data: {
        accessToken: db.tokens.accessToken,
        refreshToken: db.tokens.refreshToken,
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
    await new Promise((resolve) => setTimeout(resolve, 200));
    const db = loadDb();
    return { data: db.dashboard };
  },
};

export const mockSmsAPI = {
  sendQuick: async (to: string, message: string) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const db = loadDb();
    const sms = {
      id: 'sms-' + Date.now(),
      to,
      message,
      status: 'sent',
      timestamp: now(),
    };
    db.smsHistory.unshift(sms);
    // increment dashboard count
    db.dashboard.totalSmssSent = (db.dashboard.totalSmssSent || 0) + 1;
    saveDb(db);
    return { data: sms };
  },

  sendBulk: async (recipients: string[], message: string, templateId?: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const db = loadDb();
    const bulk = {
      id: 'bulk-' + Date.now(),
      recipientCount: recipients.length,
      message,
      status: 'sent',
      timestamp: now(),
    };
    db.smsHistory.unshift(bulk);
    db.dashboard.totalSmssSent = (db.dashboard.totalSmssSent || 0) + recipients.length;
    saveDb(db);
    return { data: bulk };
  },

  getTemplates: async () => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const db = loadDb();
    return { data: db.templates };
  },

  createTemplate: async (name: string, content: string, variables: string[]) => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const db = loadDb();
    const tpl = { id: 'template-' + Date.now(), name, content, variables, createdAt: now() };
    db.templates.unshift(tpl);
    saveDb(db);
    return { data: tpl };
  },

  updateTemplate: async (id: string, name: string, content: string, variables: string[]) => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const db = loadDb();
    const tpl = db.templates.find((t: any) => t.id === id);
    if (!tpl) throw new Error('Template not found');
    tpl.name = name;
    tpl.content = content;
    tpl.variables = variables;
    tpl.updatedAt = now();
    saveDb(db);
    return { data: tpl };
  },

  deleteTemplate: async (id: string) => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const db = loadDb();
    db.templates = db.templates.filter((t: any) => t.id !== id);
    saveDb(db);
    return { data: { success: true } };
  },
};

export const mockCreditsAPI = {
  getBalance: async () => {
    await new Promise((resolve) => setTimeout(resolve, 150));
    const db = loadDb();
    return { data: db.credits };
  },

  getPackages: async () => {
    await new Promise((resolve) => setTimeout(resolve, 150));
    return {
      data: [
        { id: 'pkg-1', name: 'Starter Pack', description: 'Great for small churches', creditsAmount: 1000, price: 20, discount: 0 },
        { id: 'pkg-2', name: 'Growth Pack', description: 'Perfect for growing ministries', creditsAmount: 2500, price: 40, discount: 10 },
        { id: 'pkg-3', name: 'Enterprise Pack', description: 'For large outreach campaigns', creditsAmount: 5000, price: 75, discount: 15 },
      ],
    };
  },

  purchaseCredits: async (packageId: string) => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const db = loadDb();
    const pkgMap: any = { 'pkg-1': 1000, 'pkg-2': 2500, 'pkg-3': 5000 };
    const amount = pkgMap[packageId] || 0;
    db.credits.available = (db.credits.available || 0) + amount;
    db.credits.total = (db.credits.total || 0) + amount;
    saveDb(db);
    return { data: { success: true, packageId } };
  },

  getHistory: async () => {
    await new Promise((resolve) => setTimeout(resolve, 150));
    // For now reuse smsHistory as transaction list where applicable
    const db = loadDb();
    const txns = (db.smsHistory || []).slice(0, 20).map((s: any) => ({ id: s.id, type: 'USAGE', description: s.message, amount: 1, balance: db.credits.available, transactionDate: s.timestamp }));
    return { data: { data: txns } };
  },
};

export const mockUsersAPI = {
  getList: async () => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const db = loadDb();
    return { data: { data: db.users } };
  },

  create: async (email: string, firstName: string, lastName: string, role: string) => {
    const db = loadDb();
    const u = { id: 'user-' + Date.now(), email, firstName, lastName, role, createdAt: now() };
    db.users.unshift(u);
    saveDb(db);
    return { data: { success: true } };
  },
  update: async (id: string, data: any) => {
    const db = loadDb();
    const user = db.users.find((u: any) => u.id === id);
    if (!user) throw new Error('User not found');
    Object.assign(user, data, { updatedAt: now() });
    saveDb(db);
    return { data: { success: true } };
  },
  delete: async (id: string) => {
    const db = loadDb();
    db.users = db.users.filter((u: any) => u.id !== id);
    saveDb(db);
    return { data: { success: true } };
  },
};

export const mockChurchAPI = {
  getInfo: async () => {
    await new Promise((resolve) => setTimeout(resolve, 150));
    const db = loadDb();
    return { data: db.church };
  },

  updateInfo: async (data: any) => {
    const db = loadDb();
    Object.assign(db.church, data, { updatedAt: now() });
    saveDb(db);
    return { data: { success: true } };
  },

  getMembers: async () => {
    await new Promise((resolve) => setTimeout(resolve, 150));
    // For demo keep static sample members
    return {
      data: {
        data: [
          { id: 'member-1', firstName: 'Maria', lastName: 'Lopez', email: 'maria@example.com', phone: '+15550101', groups: ['Youth', 'Sunday School'], joinDate: now() },
          { id: 'member-2', firstName: 'David', lastName: 'Clark', phone: '+15550102', groups: ['Choir'], joinDate: now() },
        ],
      },
    };
  },

  getGroups: async () => ({ data: { data: [{ id: 'group-1', name: 'Youth' }, { id: 'group-2', name: 'Choir' }] } }),
};

export const mockAuditLogsAPI = {
  getLogs: async (page = 1, pageSize = 10) => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const db = loadDb();
    const start = (page - 1) * pageSize;
    const data = db.auditLogs.slice(start, start + pageSize);
    return { data: { data } };
  },
};

export const mockSettingsAPI = {
  get: async () => {
    await new Promise((resolve) => setTimeout(resolve, 150));
    const db = loadDb();
    return { data: db.settings };
  },
  update: async (data: any) => {
    const db = loadDb();
    Object.assign(db.settings, data, { updatedAt: now() });
    saveDb(db);
    return { data: { success: true } };
  },
};
