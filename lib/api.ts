import axios, { AxiosInstance, AxiosError } from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from './config';
import {
  mockAuthAPI,
  mockAuditLogsAPI,
  mockChurchAPI,
  mockCreditsAPI,
  mockDashboardAPI,
  mockSettingsAPI,
  mockSmsAPI,
  mockUsersAPI,
} from './mock-api';

const isDemo = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to inject token
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email: string, password: string) =>
    isDemo ? mockAuthAPI.login(email, password) : apiClient.post(API_ENDPOINTS.AUTH_LOGIN, { email, password }),

  register: (email: string, password: string, firstName: string, lastName: string) =>
    isDemo ? mockAuthAPI.register(email, password, firstName, lastName) : apiClient.post(API_ENDPOINTS.AUTH_REGISTER, {
      email,
      password,
      firstName,
      lastName,
    }),

  verifyEmail: (token: string) =>
    isDemo ? mockAuthAPI.verifyEmail(token) : apiClient.post(API_ENDPOINTS.AUTH_VERIFY_EMAIL, { token }),

  forgotPassword: (email: string) =>
    isDemo ? mockAuthAPI.forgotPassword(email) : apiClient.post(API_ENDPOINTS.AUTH_FORGOT_PASSWORD, { email }),

  resetPassword: (token: string, password: string) =>
    isDemo ? mockAuthAPI.resetPassword(token, password) : apiClient.post(API_ENDPOINTS.AUTH_RESET_PASSWORD, { token, password }),

  refreshToken: () =>
    isDemo ? mockAuthAPI.refreshToken() : apiClient.post(API_ENDPOINTS.AUTH_REFRESH_TOKEN, {}),

  logout: () =>
    isDemo ? mockAuthAPI.logout() : apiClient.post(API_ENDPOINTS.AUTH_LOGOUT, {}),
};

// Dashboard API
export const dashboardAPI = {
  getStats: () =>
    isDemo ? mockDashboardAPI.getStats() : apiClient.get(API_ENDPOINTS.DASHBOARD_STATS),
};

// SMS API
export const smsAPI = {
  sendQuick: (to: string, message: string) =>
    isDemo ? mockSmsAPI.sendQuick(to, message) : apiClient.post(API_ENDPOINTS.SMS_SEND_QUICK, { to, message }),

  sendBulk: (recipients: string[], message: string, templateId?: string) =>
    isDemo ? mockSmsAPI.sendBulk(recipients, message, templateId) : apiClient.post(API_ENDPOINTS.SMS_SEND_BULK, {
      recipients,
      message,
      templateId,
    }),

  getTemplates: () =>
    isDemo ? mockSmsAPI.getTemplates() : apiClient.get(API_ENDPOINTS.SMS_TEMPLATES),

  createTemplate: (name: string, content: string, variables: string[]) =>
    isDemo ? mockSmsAPI.createTemplate(name, content, variables) : apiClient.post(API_ENDPOINTS.SMS_TEMPLATES_CREATE, {
      name,
      content,
      variables,
    }),

  updateTemplate: (id: string, name: string, content: string, variables: string[]) =>
    isDemo ? mockSmsAPI.updateTemplate(id, name, content, variables) : apiClient.put(API_ENDPOINTS.SMS_TEMPLATES_UPDATE.replace(':id', id), {
      name,
      content,
      variables,
    }),

  deleteTemplate: (id: string) =>
    isDemo ? mockSmsAPI.deleteTemplate(id) : apiClient.delete(API_ENDPOINTS.SMS_TEMPLATES_DELETE.replace(':id', id)),

  getHistory: (page = 1, pageSize = 10) =>
    apiClient.get(API_ENDPOINTS.SMS_HISTORY, {
      params: { page, pageSize },
    }),

  getHistoryDetail: (id: string) =>
    apiClient.get(API_ENDPOINTS.SMS_HISTORY_DETAIL.replace(':id', id)),
};

// Credits API
export const creditsAPI = {
  getBalance: () =>
    isDemo ? mockCreditsAPI.getBalance() : apiClient.get(API_ENDPOINTS.CREDITS_BALANCE),

  getPackages: () =>
    isDemo ? mockCreditsAPI.getPackages() : apiClient.get(API_ENDPOINTS.CREDITS_PACKAGES),

  purchaseCredits: (packageId: string) =>
    isDemo ? mockCreditsAPI.purchaseCredits(packageId) : apiClient.post(API_ENDPOINTS.CREDITS_PURCHASE, { packageId }),

  getHistory: (page = 1, pageSize = 10) =>
    isDemo ? mockCreditsAPI.getHistory() : apiClient.get(API_ENDPOINTS.CREDITS_HISTORY, {
      params: { page, pageSize },
    }),
};

// Users API
export const usersAPI = {
  getList: (page = 1, pageSize = 10) =>
    isDemo ? mockUsersAPI.getList() : apiClient.get(API_ENDPOINTS.USERS_LIST, {
      params: { page, pageSize },
    }),

  create: (email: string, firstName: string, lastName: string, role: string) =>
    isDemo ? mockUsersAPI.create() : apiClient.post(API_ENDPOINTS.USERS_CREATE, {
      email,
      firstName,
      lastName,
      role,
    }),

  update: (id: string, data: any) =>
    isDemo ? mockUsersAPI.update() : apiClient.put(API_ENDPOINTS.USERS_UPDATE.replace(':id', id), data),

  delete: (id: string) =>
    isDemo ? mockUsersAPI.delete() : apiClient.delete(API_ENDPOINTS.USERS_DELETE.replace(':id', id)),

  getProfile: () =>
    isDemo ? mockUsersAPI.getList() : apiClient.get(API_ENDPOINTS.USERS_PROFILE),
};

// Church API
export const churchAPI = {
  getInfo: () =>
    isDemo ? mockChurchAPI.getInfo() : apiClient.get(API_ENDPOINTS.CHURCH_INFO),

  updateInfo: (data: any) =>
    isDemo ? mockChurchAPI.updateInfo() : apiClient.put(API_ENDPOINTS.CHURCH_UPDATE, data),

  getMembers: (page = 1, pageSize = 10, groupId?: string) =>
    isDemo ? mockChurchAPI.getMembers() : apiClient.get(API_ENDPOINTS.CHURCH_MEMBERS, {
      params: { page, pageSize, groupId },
    }),

  getGroups: () =>
    isDemo ? mockChurchAPI.getGroups() : apiClient.get(API_ENDPOINTS.CHURCH_GROUPS),
};

// Audit Logs API
export const auditLogsAPI = {
  getLogs: (page = 1, pageSize = 10) =>
    isDemo ? mockAuditLogsAPI.getLogs() : apiClient.get(API_ENDPOINTS.AUDIT_LOGS, {
      params: { page, pageSize },
    }),
};

// Settings API
export const settingsAPI = {
  get: () =>
    isDemo ? mockSettingsAPI.get() : apiClient.get(API_ENDPOINTS.SETTINGS),

  update: (data: any) =>
    isDemo ? mockSettingsAPI.update() : apiClient.put(API_ENDPOINTS.SETTINGS_UPDATE, data),
};

export default apiClient;
