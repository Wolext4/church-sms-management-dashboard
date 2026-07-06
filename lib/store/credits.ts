import { create } from 'zustand';
import { CreditBalance, CreditPackage, CreditTransaction } from '../types';
import { creditsAPI } from '../api';

interface CreditsStore {
  balance: CreditBalance | null;
  packages: CreditPackage[];
  transactions: CreditTransaction[];
  isLoading: boolean;
  error: string | null;

  fetchBalance: () => Promise<void>;
  fetchPackages: () => Promise<void>;
  purchaseCredits: (packageId: string) => Promise<void>;
  fetchTransactions: (page?: number, pageSize?: number) => Promise<void>;
  clearError: () => void;
}

export const useCreditsStore = create<CreditsStore>((set) => ({
  balance: null,
  packages: [],
  transactions: [],
  isLoading: false,
  error: null,

  fetchBalance: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await creditsAPI.getBalance();
      set({ balance: response.data, isLoading: false });
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to fetch balance';
      set({ error: message, isLoading: false });
    }
  },

  fetchPackages: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await creditsAPI.getPackages();
      set({ packages: response.data, isLoading: false });
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to fetch packages';
      set({ error: message, isLoading: false });
    }
  },

  purchaseCredits: async (packageId: string) => {
    set({ isLoading: true, error: null });
    try {
      await creditsAPI.purchaseCredits(packageId);
      // Refresh balance after purchase
      const balanceResponse = await creditsAPI.getBalance();
      set({ balance: balanceResponse.data, isLoading: false });
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to purchase credits';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  fetchTransactions: async (page = 1, pageSize = 10) => {
    set({ isLoading: true, error: null });
    try {
      const response = await creditsAPI.getHistory(page, pageSize);
      set({ transactions: response.data.data, isLoading: false });
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to fetch transactions';
      set({ error: message, isLoading: false });
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));
