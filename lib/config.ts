// API Configuration
// Update this URL to your actual API endpoint
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.demo.church-sms.com/v1';

export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH_LOGIN: '/auth/login',
  AUTH_REGISTER: '/auth/register',
  AUTH_VERIFY_EMAIL: '/auth/verify-email',
  AUTH_FORGOT_PASSWORD: '/auth/forgot-password',
  AUTH_RESET_PASSWORD: '/auth/reset-password',
  AUTH_REFRESH_TOKEN: '/auth/refresh-token',
  AUTH_LOGOUT: '/auth/logout',

  // Dashboard endpoints
  DASHBOARD_STATS: '/dashboard/stats',

  // SMS endpoints
  SMS_SEND_QUICK: '/sms/send',
  SMS_SEND_BULK: '/sms/bulk-send',
  SMS_TEMPLATES: '/sms/templates',
  SMS_TEMPLATES_CREATE: '/sms/templates',
  SMS_TEMPLATES_UPDATE: '/sms/templates/:id',
  SMS_TEMPLATES_DELETE: '/sms/templates/:id',

  // SMS History
  SMS_HISTORY: '/sms/history',
  SMS_HISTORY_DETAIL: '/sms/history/:id',

  // Credits
  CREDITS_BALANCE: '/credits/balance',
  CREDITS_PACKAGES: '/credits/packages',
  CREDITS_PURCHASE: '/credits/purchase',
  CREDITS_HISTORY: '/credits/history',

  // Users
  USERS_LIST: '/users',
  USERS_CREATE: '/users',
  USERS_UPDATE: '/users/:id',
  USERS_DELETE: '/users/:id',
  USERS_PROFILE: '/users/profile',

  // Church
  CHURCH_INFO: '/church/info',
  CHURCH_UPDATE: '/church/info',
  CHURCH_MEMBERS: '/church/members',
  CHURCH_GROUPS: '/church/groups',

  // Audit logs
  AUDIT_LOGS: '/audit-logs',

  // Settings
  SETTINGS: '/settings',
  SETTINGS_UPDATE: '/settings',
};
