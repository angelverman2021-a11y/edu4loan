import { api } from './api';
import {
  FilterState,
  LoanSchemeItem,
  BankSummary,
  ComparisonResult,
} from '@/types';

export const loanSchemeService = {
  listLoanSchemes: async (
    filters: FilterState = {}
  ): Promise<{ schemes: LoanSchemeItem[]; meta: any; disclaimer?: string }> => {
    const params = new URLSearchParams();

    if (filters.search && filters.search.trim()) {
      params.append('search', filters.search.trim());
    }
    if (filters.bank && filters.bank !== 'all') {
      params.append('bank', filters.bank);
    }
    if (filters.degreeLevel && filters.degreeLevel !== 'all') {
      params.append('degreeLevel', filters.degreeLevel);
    }
    if (filters.loanAmount && filters.loanAmount > 0) {
      params.append('loanAmount', filters.loanAmount.toString());
    }
    if (filters.collateral && filters.collateral !== 'all') {
      params.append('collateral', filters.collateral);
    }
    if (filters.studentCategory && filters.studentCategory !== 'all') {
      params.append('studentCategory', filters.studentCategory);
    }
    if (filters.pmVidyalaxmi) {
      params.append('pmVidyalaxmi', 'true');
    }
    if (filters.vidyaLakshmi) {
      params.append('vidyaLakshmi', 'true');
    }
    if (filters.status) {
      params.append('status', filters.status);
    }
    if (filters.page) {
      params.append('page', filters.page.toString());
    }
    if (filters.limit) {
      params.append('limit', filters.limit.toString());
    }

    const queryString = params.toString();
    const endpoint = queryString ? `/loan-schemes?${queryString}` : '/loan-schemes';
    const res = await api.get<LoanSchemeItem[]>(endpoint);

    return {
      schemes: res.data || [],
      meta: res.meta || {},
      disclaimer: res.disclaimer,
    };
  },

  getLoanSchemeById: async (id: string): Promise<LoanSchemeItem> => {
    const res = await api.get<LoanSchemeItem>(`/loan-schemes/${id}`);
    return res.data;
  },

  compareLoanSchemes: async (ids: string[]): Promise<ComparisonResult> => {
    if (!ids || ids.length < 2) {
      throw new Error('Please select at least 2 schemes to compare.');
    }
    if (ids.length > 4) {
      throw new Error('A maximum of 4 schemes can be compared simultaneously.');
    }
    const res = await api.get<ComparisonResult>(`/loan-schemes/compare?ids=${ids.join(',')}`);
    return res.data;
  },

  getBanks: async (): Promise<BankSummary[]> => {
    const res = await api.get<BankSummary[]>('/banks');
    return res.data || [];
  },

  getVitBhopalProfile: async (): Promise<any> => {
    const res = await api.get<any>('/institutions/vit-bhopal');
    return res.data;
  },
};
