import { create } from 'zustand';
import { SMSMessage, SMSTemplate, SMSHistory } from '../types';
import { smsAPI } from '../api';

interface SMSStore {
  templates: SMSTemplate[];
  history: SMSHistory[];
  isLoading: boolean;
  error: string | null;

  // Templates
  fetchTemplates: () => Promise<void>;
  addTemplate: (name: string, content: string, variables: string[]) => Promise<void>;
  updateTemplate: (id: string, name: string, content: string, variables: string[]) => Promise<void>;
  deleteTemplate: (id: string) => Promise<void>;

  // History
  fetchHistory: (page?: number, pageSize?: number) => Promise<void>;

  // Messaging
  sendQuickSMS: (to: string, message: string) => Promise<void>;
  sendBulkSMS: (recipients: string[], message: string, templateId?: string) => Promise<void>;

  // Utility
  clearError: () => void;
}

export const useSMSStore = create<SMSStore>((set, get) => ({
  templates: [],
  history: [],
  isLoading: false,
  error: null,

  fetchTemplates: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await smsAPI.getTemplates();
      set({ templates: response.data, isLoading: false });
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to fetch templates';
      set({ error: message, isLoading: false });
    }
  },

  addTemplate: async (name: string, content: string, variables: string[]) => {
    set({ isLoading: true, error: null });
    try {
      const response = await smsAPI.createTemplate(name, content, variables);
      set((state) => ({
        templates: [...state.templates, response.data],
        isLoading: false,
      }));
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to create template';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  updateTemplate: async (id: string, name: string, content: string, variables: string[]) => {
    set({ isLoading: true, error: null });
    try {
      const response = await smsAPI.updateTemplate(id, name, content, variables);
      set((state) => ({
        templates: state.templates.map((t) => (t.id === id ? response.data : t)),
        isLoading: false,
      }));
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to update template';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  deleteTemplate: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await smsAPI.deleteTemplate(id);
      set((state) => ({
        templates: state.templates.filter((t) => t.id !== id),
        isLoading: false,
      }));
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to delete template';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  fetchHistory: async (page = 1, pageSize = 10) => {
    set({ isLoading: true, error: null });
    try {
      const response = await smsAPI.getHistory(page, pageSize);
      set({ history: response.data.data, isLoading: false });
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to fetch history';
      set({ error: message, isLoading: false });
    }
  },

  sendQuickSMS: async (to: string, message: string) => {
    set({ isLoading: true, error: null });
    try {
      await smsAPI.sendQuick(to, message);
      set({ isLoading: false });
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to send SMS';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  sendBulkSMS: async (recipients: string[], message: string, templateId?: string) => {
    set({ isLoading: true, error: null });
    try {
      await smsAPI.sendBulk(recipients, message, templateId);
      set({ isLoading: false });
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to send bulk SMS';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));
