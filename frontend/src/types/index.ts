export * from '@shared/types';

export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
    hasMore?: boolean;
    query?: string;
  };
  disclaimer?: string;
  generatedAt?: string;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

export interface NavItem {
  label: string;
  href: string;
  description?: string;
  badge?: string;
}

export interface SearchResultItem {
  type: 'bank' | 'loan_scheme' | 'government_scheme' | 'document' | 'institution' | 'faq';
  id: string;
  title: string;
  subtitle?: string;
  url: string;
  tags?: string[];
  snippet?: string;
}

export interface SearchResponseData {
  query: string;
  totalResults: number;
  results: {
    banks: any[];
    loanSchemes: any[];
    governmentSchemes: any[];
    documents: any[];
    institutions: any[];
    faqs: any[];
  };
}
