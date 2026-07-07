// Authentication types
export interface AuthCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'USER' | 'VIEWER';
  churchId: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

// SMS types
export interface SMSMessage {
  id: string;
  to: string;
  message: string;
  status: 'PENDING' | 'SENT' | 'DELIVERED' | 'FAILED';
  sentAt: string;
  deliveredAt?: string;
  errorMessage?: string;
  cost: number;
  template?: SMSTemplate;
}

export interface SMSTemplate {
  id: string;
  name: string;
  content: string;
  variables: string[];
  createdAt: string;
  updatedAt: string;
}

export interface QuickSendRequest {
  to: string;
  message: string;
}

export interface BulkSendRequest {
  recipients: string[];
  message: string;
  templateId?: string;
}

export interface SMSHistory {
  id: string;
  type: 'QUICK' | 'BULK' | 'TEMPLATE';
  recipients: number;
  messagesSent: number;
  messagesFailed: number;
  totalCost: number;
  sentAt: string;
  sentBy: User;
}

// Credits types
export interface CreditBalance {
  available: number;
  used: number;
  total: number;
  lastUpdated: string;
}

export interface CreditPackage {
  id: string;
  name: string;
  creditsAmount: number;
  price: number;
  discount?: number;
  description: string;
}

export interface CreditTransaction {
  id: string;
  type: 'PURCHASE' | 'USAGE' | 'REFUND';
  amount: number;
  description: string;
  transactionDate: string;
  balance: number;
}

// Church types
export interface Church {
  id: string;
  name: string;
  email: string;
  phone: string;
  website?: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  memberCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ChurchMember {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone: string;
  groups: string[];
  joinDate: string;
}

export interface ChurchGroup {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  createdAt: string;
}

// Audit log types
export interface AuditLog {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  userId: string;
  changes: Record<string, any>;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
}

// Notification types
export interface Notification {
  id: string;
  type: 'SUCCESS' | 'ERROR' | 'WARNING' | 'INFO';
  title: string;
  message: string;
  duration?: number;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// Settings types
export interface AppSettings {
  id: string;
  churchId: string;
  smsNotifications: boolean;
  emailNotifications: boolean;
  language: string;
  timezone: string;
  createdAt: string;
  updatedAt: string;
}
