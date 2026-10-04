import { Request, Response, NextFunction } from "express";
import { Bank } from "../models/Bank";
import { LoanScheme } from "../models/LoanScheme";
import { sendSuccess } from "../utils/apiResponse";

export const getBankStatistics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const [banks, schemes] = await Promise.all([
      Bank.find({ isDemo: { $ne: true } }),
      LoanScheme.find({ isDemo: { $ne: true } }),
    ]);

    // Factual aggregations
    const totalPublishedBanks = banks.length;
    const totalPublishedSchemes = schemes.length;

    // Schemes count by bank
    const schemesPerBank = banks.map((bank) => ({
      bankName: bank.name,
      shortCode: bank.shortCode,
      category: bank.category,
      schemeCount: schemes.filter((s) => s.bankId.toString() === bank._id.toString()).length,
      hasCampusDesk: bank.vitBhopalTieUp?.onCampusDeskAvailable || false,
      turnaroundTime: bank.generalTurnaroundTimeDays || "Not published",
      officialPortal: bank.educationLoanPortalUrl,
    }));

    // Interest rate ranges
    const rateDistribution = schemes.map((s) => ({
      schemeName: s.schemeName,
      bankName: s.bankName,
      minRate: s.interestRate.minRate.value,
      maxRate: s.interestRate.maxRate.value,
      benchmarkType: s.interestRate.benchmarkType,
      spreadMin: s.interestRate.spreadPercentMin,
      spreadMax: s.interestRate.spreadPercentMax,
      source: s.interestRate.minRate.source,
      lastVerified: s.interestRate.minRate.lastVerified,
    }));

    // Quantum ranges
    const loanLimits = schemes.map((s) => ({
      schemeName: s.schemeName,
      bankName: s.bankName,
      maxInland: s.maxLoanAmountInland.value,
      collateralFreeThreshold: 750000,
    }));

    // Published turnaround times
    const turnaroundStats = banks.map((b) => ({
      bankName: b.name,
      publishedTime: b.generalTurnaroundTimeDays || "Not currently published by bank",
      source: b.overallSource.source,
      sourceUrl: b.overallSource.sourceUrl,
    }));

    const responseData = {
      summary: {
        totalPublishedBanks,
        totalPublishedSchemes,
        vitBhopalSupportedCount: schemes.filter((s) => s.vitBhopalEligible).length,
        zeroCollateralSchemesCount: schemes.length, // Under CGFSEL all schemes support zero collateral up to 7.5L
        notice: "Approval-rate statistics for this category are not currently available from a verified source.",
      },
      schemesPerBank,
      rateDistribution,
      loanLimits,
      turnaroundStats,
      statutoryDisclosure: "All statistics represent verified official published parameters. Edu4Loan does not calculate or display speculative approval rates.",
    };

    return sendSuccess(res, responseData);
  } catch (err) {
    next(err);
  }
};
