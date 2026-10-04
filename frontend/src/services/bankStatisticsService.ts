import { api } from "./api";

export interface BankStatisticsData {
  summary: {
    totalPublishedBanks: number;
    totalPublishedSchemes: number;
    vitBhopalSupportedCount: number;
    zeroCollateralSchemesCount: number;
    notice: string;
  };
  schemesPerBank: Array<{
    bankName: string;
    shortCode: string;
    category: string;
    schemeCount: number;
    hasCampusDesk: boolean;
    turnaroundTime: string;
    officialPortal: string;
  }>;
  rateDistribution: Array<{
    schemeName: string;
    bankName: string;
    minRate: number;
    maxRate: number;
    benchmarkType: string;
    spreadMin: number;
    spreadMax: number;
    source: string;
    lastVerified: string;
  }>;
  loanLimits: Array<{
    schemeName: string;
    bankName: string;
    maxInland: number;
    collateralFreeThreshold: number;
  }>;
  turnaroundStats: Array<{
    bankName: string;
    publishedTime: string;
    source: string;
    sourceUrl?: string;
  }>;
  statutoryDisclosure: string;
}

export const bankStatisticsService = {
  getStatistics: async (): Promise<BankStatisticsData> => {
    const res = await api.get<BankStatisticsData>("/bank-statistics");
    return res.data;
  },
};
