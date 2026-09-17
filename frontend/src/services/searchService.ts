import { api } from './api';
import { SearchResponseData } from '@/types';

export const searchService = {
  globalSearch: async (query: string, limit = 10): Promise<SearchResponseData> => {
    if (!query || query.trim().length === 0) {
      return {
        query: '',
        totalResults: 0,
        results: {
          banks: [],
          loanSchemes: [],
          governmentSchemes: [],
          documents: [],
          institutions: [],
          faqs: [],
        },
      };
    }
    const res = await api.get<SearchResponseData>(`/search?q=${encodeURIComponent(query.trim())}&limit=${limit}`);
    return res.data;
  },
};
