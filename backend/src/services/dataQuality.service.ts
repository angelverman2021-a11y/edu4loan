import { Bank } from '../models/Bank';
import { LoanScheme } from '../models/LoanScheme';
import { GovernmentScheme } from '../models/GovernmentScheme';
import { Institution } from '../models/Institution';
import { DocumentModel } from '../models/Document';
import { Source } from '../models/Source';
import { getReviewThresholdDays } from './dataFreshness.service';

export interface QualityIssue {
  collection: string;
  id: string;
  name: string;
  issueType:
    | 'MISSING_SOURCE'
    | 'MISSING_SOURCE_URL'
    | 'MISSING_VERIFICATION_DATE'
    | 'EXPIRED_VERIFICATION'
    | 'MISSING_APPLICATION_URL'
    | 'INVALID_FINANCIAL_VALUE'
    | 'INVALID_STATUS'
    | 'DUPLICATE_RECORD'
    | 'ORPHANED_REFERENCE';
  severity: 'CRITICAL' | 'WARNING';
  details: string;
}

export interface CollectionQualitySummary {
  total: number;
  verified: number;
  needsVerification: number;
  expired: number;
  demo: number;
  issues: QualityIssue[];
}

export interface DataQualityReport {
  overall: {
    totalRecords: number;
    verifiedRecords: number;
    needsVerificationRecords: number;
    expiredRecords: number;
    demoRecords: number;
    totalIssues: number;
    criticalIssues: number;
    warningIssues: number;
  };
  collections: {
    banks: CollectionQualitySummary;
    loanSchemes: CollectionQualitySummary;
    governmentSchemes: CollectionQualitySummary;
    institutions: CollectionQualitySummary;
    documents: CollectionQualitySummary;
    sources: CollectionQualitySummary;
  };
  timestamp: string;
}

export const runDataQualityAudit = async (): Promise<DataQualityReport> => {
  const thresholdDays = getReviewThresholdDays();
  const now = new Date();

  const [banks, schemes, govSchemes, institutions, documents, sources] = await Promise.all([
    Bank.find({}),
    LoanScheme.find({}),
    GovernmentScheme.find({}),
    Institution.find({}),
    DocumentModel.find({}),
    Source.find({}),
  ]);

  const bankIds = new Set(banks.map((b) => b._id.toString()));
  const sourceUrls = new Set(sources.map((s) => s.sourceUrl));

  // 1. Audit Banks
  const bankIssues: QualityIssue[] = [];
  const seenBankSlugs = new Set<string>();
  const seenBankNames = new Set<string>();

  let bankVerified = 0;
  let bankNeedsVerification = 0;
  let bankExpired = 0;
  let bankDemo = 0;

  for (const b of banks) {
    if (b.isDemo) bankDemo++;
    const status = b.overallSource?.status || 'needs_verification';
    if (status === 'verified') bankVerified++;
    else if (status === 'expired') bankExpired++;
    else bankNeedsVerification++;

    // Duplicate detection
    const normalizedName = b.name.trim().toLowerCase();
    if (seenBankSlugs.has(b.slug) || seenBankNames.has(normalizedName)) {
      bankIssues.push({
        collection: 'banks',
        id: b._id.toString(),
        name: b.name,
        issueType: 'DUPLICATE_RECORD',
        severity: 'CRITICAL',
        details: `Duplicate bank detected for slug '${b.slug}' or normalized name '${normalizedName}'`,
      });
    }
    seenBankSlugs.add(b.slug);
    seenBankNames.add(normalizedName);

    // Source validation
    if (!b.overallSource?.source || b.overallSource.source.trim() === '') {
      bankIssues.push({
        collection: 'banks',
        id: b._id.toString(),
        name: b.name,
        issueType: 'MISSING_SOURCE',
        severity: 'CRITICAL',
        details: 'Bank record is missing an authoritative source citation.',
      });
    }
    if (!b.overallSource?.sourceUrl || !b.overallSource.sourceUrl.startsWith('http')) {
      bankIssues.push({
        collection: 'banks',
        id: b._id.toString(),
        name: b.name,
        issueType: 'MISSING_SOURCE_URL',
        severity: 'CRITICAL',
        details: 'Bank record is missing a valid HTTP/HTTPS source URL.',
      });
    }

    // Expiry check
    if (b.overallSource?.lastVerified) {
      const vDate = new Date(b.overallSource.lastVerified);
      const days = Math.floor(Math.abs(now.getTime() - vDate.getTime()) / (1000 * 60 * 60 * 24));
      if (status === 'verified' && days > thresholdDays) {
        bankIssues.push({
          collection: 'banks',
          id: b._id.toString(),
          name: b.name,
          issueType: 'EXPIRED_VERIFICATION',
          severity: 'WARNING',
          details: `Verification is ${days} days old (exceeds threshold of ${thresholdDays} days).`,
        });
      }
    }
  }

  // 2. Audit Loan Schemes
  const schemeIssues: QualityIssue[] = [];
  const seenSchemeKeys = new Set<string>();

  let schemeVerified = 0;
  let schemeNeedsVerification = 0;
  let schemeExpired = 0;
  let schemeDemo = 0;

  for (const s of schemes) {
    if (s.isDemo) schemeDemo++;
    const status = s.status || 'needs_verification';
    if (status === 'verified') schemeVerified++;
    else if (status === 'expired') schemeExpired++;
    else schemeNeedsVerification++;

    // Orphaned bank check
    const bankRefId = s.bankId?.toString();
    if (!bankRefId || !bankIds.has(bankRefId)) {
      schemeIssues.push({
        collection: 'loanSchemes',
        id: s._id.toString(),
        name: s.schemeName,
        issueType: 'ORPHANED_REFERENCE',
        severity: 'CRITICAL',
        details: `Loan scheme references non-existent bankId: ${bankRefId}`,
      });
    }

    // Duplicate check
    const schemeKey = `${bankRefId}_${s.schemeName.trim().toLowerCase()}`;
    if (seenSchemeKeys.has(schemeKey)) {
      schemeIssues.push({
        collection: 'loanSchemes',
        id: s._id.toString(),
        name: s.schemeName,
        issueType: 'DUPLICATE_RECORD',
        severity: 'CRITICAL',
        details: `Duplicate loan scheme detected for bank '${s.bankName}' with scheme name '${s.schemeName}'`,
      });
    }
    seenSchemeKeys.add(schemeKey);

    // Financial values validation
    const minRate = s.interestRate?.minRate?.value;
    const maxRate = s.interestRate?.maxRate?.value;
    if (minRate !== undefined && (minRate < 0 || minRate > 35)) {
      schemeIssues.push({
        collection: 'loanSchemes',
        id: s._id.toString(),
        name: s.schemeName,
        issueType: 'INVALID_FINANCIAL_VALUE',
        severity: 'CRITICAL',
        details: `Invalid interest rate minimum: ${minRate}%`,
      });
    }
    if (maxRate !== undefined && (maxRate < 0 || maxRate > 35 || (minRate !== undefined && maxRate < minRate))) {
      schemeIssues.push({
        collection: 'loanSchemes',
        id: s._id.toString(),
        name: s.schemeName,
        issueType: 'INVALID_FINANCIAL_VALUE',
        severity: 'CRITICAL',
        details: `Invalid interest rate maximum: ${maxRate}%`,
      });
    }

    // Source & Application URLs
    if (!s.officialApplicationUrl || !s.officialApplicationUrl.startsWith('http')) {
      schemeIssues.push({
        collection: 'loanSchemes',
        id: s._id.toString(),
        name: s.schemeName,
        issueType: 'MISSING_APPLICATION_URL',
        severity: 'WARNING',
        details: 'Missing valid official application redirect URL.',
      });
    }
  }

  // 3. Audit Government Schemes
  const govIssues: QualityIssue[] = [];
  const seenGovCodes = new Set<string>();

  let govVerified = 0;
  let govNeedsVerification = 0;
  let govExpired = 0;
  let govDemo = 0;

  for (const g of govSchemes) {
    if (g.isDemo) govDemo++;
    const status = g.source?.status || 'needs_verification';
    if (status === 'verified') govVerified++;
    else if (status === 'expired') govExpired++;
    else govNeedsVerification++;

    if (seenGovCodes.has(g.schemeCode)) {
      govIssues.push({
        collection: 'governmentSchemes',
        id: g._id.toString(),
        name: g.schemeName,
        issueType: 'DUPLICATE_RECORD',
        severity: 'CRITICAL',
        details: `Duplicate government scheme code: ${g.schemeCode}`,
      });
    }
    seenGovCodes.add(g.schemeCode);

    if (!g.portalUrl || !g.portalUrl.startsWith('http')) {
      govIssues.push({
        collection: 'governmentSchemes',
        id: g._id.toString(),
        name: g.schemeName,
        issueType: 'MISSING_APPLICATION_URL',
        severity: 'CRITICAL',
        details: 'Missing valid official government portal URL.',
      });
    }
  }

  // 4. Audit Institutions
  const instIssues: QualityIssue[] = [];
  let instVerified = 0;
  let instNeedsVerification = 0;
  let instExpired = 0;
  let instDemo = 0;

  for (const inst of institutions) {
    if (inst.isDemo) instDemo++;
    instNeedsVerification++;
  }

  // 5. Audit Documents
  const docIssues: QualityIssue[] = [];
  let docVerified = 0;
  let docNeedsVerification = 0;
  let docExpired = 0;
  let docDemo = 0;

  for (const d of documents) {
    if (d.isDemo) docDemo++;
    const status = d.source?.status || 'needs_verification';
    if (status === 'verified') docVerified++;
    else if (status === 'expired') docExpired++;
    else docNeedsVerification++;
  }

  // 6. Audit Sources
  const sourceIssues: QualityIssue[] = [];
  let srcVerified = 0;
  let srcNeedsVerification = 0;
  let srcExpired = 0;
  let srcDemo = 0;

  for (const src of sources) {
    if (src.isDemo) srcDemo++;
    if (src.status === 'verified') srcVerified++;
    else if (src.status === 'expired') srcExpired++;
    else srcNeedsVerification++;

    if (!src.sourceUrl || !src.sourceUrl.startsWith('http')) {
      sourceIssues.push({
        collection: 'sources',
        id: src._id.toString(),
        name: src.sourceName,
        issueType: 'MISSING_SOURCE_URL',
        severity: 'CRITICAL',
        details: 'Source record has invalid or empty sourceUrl.',
      });
    }
  }

  const allIssues = [
    ...bankIssues,
    ...schemeIssues,
    ...govIssues,
    ...instIssues,
    ...docIssues,
    ...sourceIssues,
  ];

  const totalRecords =
    banks.length +
    schemes.length +
    govSchemes.length +
    institutions.length +
    documents.length +
    sources.length;

  const verifiedRecords =
    bankVerified + schemeVerified + govVerified + instVerified + docVerified + srcVerified;
  const needsVerificationRecords =
    bankNeedsVerification +
    schemeNeedsVerification +
    govNeedsVerification +
    instNeedsVerification +
    docNeedsVerification +
    srcNeedsVerification;
  const expiredRecords =
    bankExpired + schemeExpired + govExpired + instExpired + docExpired + srcExpired;
  const demoRecords = bankDemo + schemeDemo + govDemo + instDemo + docDemo + srcDemo;

  return {
    overall: {
      totalRecords,
      verifiedRecords,
      needsVerificationRecords,
      expiredRecords,
      demoRecords,
      totalIssues: allIssues.length,
      criticalIssues: allIssues.filter((i) => i.severity === 'CRITICAL').length,
      warningIssues: allIssues.filter((i) => i.severity === 'WARNING').length,
    },
    collections: {
      banks: {
        total: banks.length,
        verified: bankVerified,
        needsVerification: bankNeedsVerification,
        expired: bankExpired,
        demo: bankDemo,
        issues: bankIssues,
      },
      loanSchemes: {
        total: schemes.length,
        verified: schemeVerified,
        needsVerification: schemeNeedsVerification,
        expired: schemeExpired,
        demo: schemeDemo,
        issues: schemeIssues,
      },
      governmentSchemes: {
        total: govSchemes.length,
        verified: govVerified,
        needsVerification: govNeedsVerification,
        expired: govExpired,
        demo: govDemo,
        issues: govIssues,
      },
      institutions: {
        total: institutions.length,
        verified: instVerified,
        needsVerification: instNeedsVerification,
        expired: instExpired,
        demo: instDemo,
        issues: instIssues,
      },
      documents: {
        total: documents.length,
        verified: docVerified,
        needsVerification: docNeedsVerification,
        expired: docExpired,
        demo: docDemo,
        issues: docIssues,
      },
      sources: {
        total: sources.length,
        verified: srcVerified,
        needsVerification: srcNeedsVerification,
        expired: srcExpired,
        demo: srcDemo,
        issues: sourceIssues,
      },
    },
    timestamp: new Date().toISOString(),
  };
};
