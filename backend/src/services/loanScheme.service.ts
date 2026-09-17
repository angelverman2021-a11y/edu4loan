import { LoanScheme, ILoanScheme } from '../models/LoanScheme';
import { Bank } from '../models/Bank';
import { logAuditAction } from './audit.service';
import {
  parsePagination,
  buildPaginationMeta,
  escapeRegex,
  PaginationResult,
  sanitizeString,
  isValidObjectId,
} from '../utils/querySafety';
import { AppError } from '../utils/apiResponse';

export interface SchemeQueryFilter {
  page?: string | number;
  limit?: string | number;
  search?: string;
  bank?: string;
  bankId?: string;
  degreeLevel?: string;
  course?: string;
  degree?: string;
  studyLocation?: string;
  loanAmount?: string | number;
  collateral?: 'free' | 'required' | 'unknown' | string;
  collateralRequirement?: string;
  studentCategory?: string;
  pmVidyalaxmi?: boolean | string;
  vidyaLakshmi?: boolean | string;
  status?: string;
  maxAmountMin?: number;
  vitBhopalEligible?: boolean | string;
}

export interface SchemeListResponse {
  schemes: ILoanScheme[];
  pagination: PaginationResult;
}

export const listLoanSchemes = async (query: SchemeQueryFilter = {}): Promise<SchemeListResponse> => {
  const { page, limit, skip } = parsePagination(query, 20, 100);
  const filter: any = {};

  // Bank filter (by ObjectId or slug/name lookup)
  const bankParam = sanitizeString(query.bankId) || sanitizeString(query.bank);
  if (bankParam) {
    if (isValidObjectId(bankParam)) {
      filter.bankId = bankParam;
    } else {
      const bankRecord = await Bank.findOne({
        $or: [
          { slug: bankParam.toLowerCase() },
          { name: { $regex: escapeRegex(bankParam), $options: 'i' } },
        ],
      });
      if (bankRecord) {
        filter.bankId = bankRecord._id;
      } else {
        // Return empty if bank filter was provided but no bank exists
        filter.bankId = null;
      }
    }
  }

  // Degree level filter
  const degree = sanitizeString(query.degreeLevel) || sanitizeString(query.degree) || sanitizeString(query.course);
  if (degree) {
    filter.targetDegreeLevel = { $regex: escapeRegex(degree), $options: 'i' };
  }

  // Status filter
  const status = sanitizeString(query.status);
  if (status) {
    filter.status = status;
  }

  // VIT Bhopal eligibility
  if (query.vitBhopalEligible !== undefined) {
    filter.vitBhopalEligible = query.vitBhopalEligible === true || query.vitBhopalEligible === 'true';
  }

  // Loan amount filter: Documented max loan amount covers requested loan
  // IMPORTANT: Matches schemes whose documented structure may cover this amount. Does NOT guarantee approval.
  const loanAmountNum = query.loanAmount ? parseFloat(String(query.loanAmount)) : query.maxAmountMin;
  if (loanAmountNum !== undefined && !isNaN(loanAmountNum) && loanAmountNum > 0) {
    filter['maxLoanAmountInland.value'] = { $gte: loanAmountNum };
  }

  // Collateral factual filter
  const collateralParam = (
    sanitizeString(query.collateral) || sanitizeString(query.collateralRequirement)
  )?.toLowerCase();
  if (collateralParam === 'free') {
    filter['collateral.upTo4Lakhs'] = { $regex: /no|nil/i };
  } else if (collateralParam === 'required') {
    filter['collateral.above7point5Lakhs'] = { $exists: true, $ne: '' };
  }

  // Concession / Category filter (e.g. girl student)
  const studentCat = sanitizeString(query.studentCategory)?.toLowerCase();
  if (studentCat && (studentCat.includes('girl') || studentCat.includes('female') || studentCat.includes('women'))) {
    filter['interestRate.girlChildConcessionPercent.value'] = { $gt: 0 };
  }

  // Search filter (schemeName, bankName, schemeCode)
  const search = sanitizeString(query.search);
  if (search) {
    const escaped = escapeRegex(search);
    filter.$or = [
      { schemeName: { $regex: escaped, $options: 'i' } },
      { bankName: { $regex: escaped, $options: 'i' } },
      { schemeCode: { $regex: escaped, $options: 'i' } },
      { overview: { $regex: escaped, $options: 'i' } },
    ];
  }

  // Factual sort by schemeName — strictly ZERO subjective ranking/rating
  const [schemes, total] = await Promise.all([
    LoanScheme.find(filter)
      .populate('bankId', 'name slug shortCode category logoUrl officialWebsite vidyaLakshmiRegistered pmVidyalaxmiRegistered')
      .sort({ schemeName: 1 })
      .skip(skip)
      .limit(limit),
    LoanScheme.countDocuments(filter),
  ]);

  return {
    schemes,
    pagination: buildPaginationMeta(page, limit, total),
  };
};

export const getLoanSchemeById = async (id: string): Promise<ILoanScheme> => {
  if (!isValidObjectId(id)) {
    throw new AppError(`Invalid loan scheme ID format: ${id}`, 400, 'INVALID_ID');
  }

  const scheme = await LoanScheme.findById(id).populate('bankId', 'name slug shortCode category logoUrl officialWebsite vitBhopalTieUp');
  if (!scheme) {
    throw new AppError(`Loan scheme not found with id: ${id}`, 404, 'NOT_FOUND');
  }
  return scheme;
};

export const compareLoanSchemes = async (ids: string[]) => {
  if (!ids || !Array.isArray(ids) || ids.length < 2) {
    throw new AppError('Please provide between 2 and 4 scheme IDs to compare (e.g. ?ids=id1,id2).', 400, 'VALIDATION_ERROR');
  }

  if (ids.length > 4) {
    throw new AppError('A maximum of 4 loan schemes can be compared simultaneously.', 400, 'VALIDATION_ERROR');
  }

  // Validate ObjectIds
  for (const id of ids) {
    if (!isValidObjectId(id)) {
      throw new AppError(`Invalid ObjectId format for scheme: ${id}`, 400, 'INVALID_ID');
    }
  }

  const schemes = await LoanScheme.find({ _id: { $in: ids } }).populate(
    'bankId',
    'name slug shortCode category logoUrl officialWebsite tollFreeNumber vitBhopalTieUp'
  );

  if (schemes.length === 0) {
    throw new AppError('No matching loan schemes found for the provided IDs.', 404, 'NOT_FOUND');
  }

  // Factual normalized comparison data
  // STRICT ARCHITECTURAL RULE: Absolutely NO ranking, winner, best, score, or recommendation!
  const comparisonData = schemes.map((s) => {
    const bankObj: any = s.bankId || {};
    return {
      id: s._id.toString(),
      schemeName: s.schemeName,
      schemeCode: s.schemeCode,
      overview: s.overview,
      bank: {
        id: bankObj._id ? bankObj._id.toString() : s.bankId?.toString(),
        name: s.bankName,
        slug: bankObj.slug || '',
        category: bankObj.category || 'public',
        logoUrl: bankObj.logoUrl || '',
        officialWebsite: bankObj.officialWebsite || '',
        tollFreeNumber: bankObj.tollFreeNumber || '',
        vitBhopalTieUp: bankObj.vitBhopalTieUp || null,
      },
      interestRate: {
        benchmarkType: s.interestRate.benchmarkType,
        benchmarkRatePercent: s.interestRate.benchmarkRatePercent,
        spreadPercentMin: s.interestRate.spreadPercentMin,
        spreadPercentMax: s.interestRate.spreadPercentMax,
        minRate: s.interestRate.minRate,
        maxRate: s.interestRate.maxRate,
        girlChildConcessionPercent: s.interestRate.girlChildConcessionPercent,
        promptServicingConcessionPercent: s.interestRate.promptServicingConcessionPercent || null,
        notes: s.interestRate.notes || '',
      },
      loanAmount: {
        inlandMax: s.maxLoanAmountInland,
      },
      collateral: {
        upTo4Lakhs: s.collateral.upTo4Lakhs,
        from4To7point5Lakhs: s.collateral.from4To7point5Lakhs,
        above7point5Lakhs: s.collateral.above7point5Lakhs,
        acceptableCollateralTypes: s.collateral.acceptableCollateralTypes,
        details: s.collateral.details,
      },
      marginMoney: {
        upTo4LakhsPercent: s.marginMoney.upTo4LakhsPercent,
        above4LakhsIndiaPercent: s.marginMoney.above4LakhsIndiaPercent,
        scholarshipAdjustmentAllowed: s.marginMoney.scholarshipAdjustmentAllowed,
        notes: s.marginMoney.notes || '',
      },
      moratorium: {
        courseDurationYears: s.moratorium.courseDurationYears,
        moratoriumBufferMonths: s.moratorium.moratoriumBufferMonths,
        repaymentTenureMaxYears: s.moratorium.repaymentTenureMaxYears,
        interestServicingDuringMoratorium: s.moratorium.interestServicingDuringMoratorium,
        explanation: s.moratorium.explanation,
      },
      feesAndCharges: {
        processingFee: s.processingFee,
        prepaymentPenalty: s.prepaymentPenalty,
      },
      eligibility: {
        degreeLevels: s.targetDegreeLevel,
        criteria: s.eligibilityCriteria,
        vitBhopalEligible: s.vitBhopalEligible,
        vitBhopalCategoryNote: s.vitBhopalCategoryNote || '',
      },
      taxBenefit: {
        section80EApplicable: s.section80ETaxBenefitApplicable,
      },
      officialPortals: {
        applicationUrl: s.officialApplicationUrl,
        circularUrl: s.officialCircularUrl,
      },
      verification: {
        source: s.source,
        status: s.status,
        lastVerified: s.lastVerified,
      },
    };
  });

  return {
    count: comparisonData.length,
    disclaimer:
      'Comparison values are extracted from official circulars and primary sources. Final rates, limits, and eligibility are determined exclusively by the lending bank upon formal application.',
    schemes: comparisonData,
    featureMatrix: [
      { feature: 'Bank Category', values: comparisonData.map((s) => s.bank.category) },
      {
        feature: 'Interest Rate (Min - Max)',
        values: comparisonData.map((s) => `${s.interestRate.minRate.value}% - ${s.interestRate.maxRate.value}%`),
      },
      {
        feature: 'Max Inland Limit',
        values: comparisonData.map((s) => `₹${s.loanAmount.inlandMax.value?.toLocaleString('en-IN')}`),
      },
      { feature: 'Collateral Framework (<= 4L)', values: comparisonData.map((s) => s.collateral.upTo4Lakhs) },
      { feature: 'Collateral Framework (4L - 7.5L)', values: comparisonData.map((s) => s.collateral.from4To7point5Lakhs) },
      { feature: 'Moratorium Details', values: comparisonData.map((s) => s.moratorium.explanation) },
      { feature: 'Processing Fee', values: comparisonData.map((s) => s.feesAndCharges.processingFee.value) },
    ],
  };
};

export const createLoanScheme = async (
  data: any,
  adminUser: { id: string; email: string; role: string },
  ipAddress?: string
): Promise<ILoanScheme> => {
  // Financial Data Safety Guard:
  // If source information is missing or incomplete, downgrade status from 'verified' to 'needs_verification'
  if (
    data.status === 'verified' &&
    (!data.source || !data.source.sourceUrl || !data.source.sourceUrl.startsWith('http'))
  ) {
    data.status = 'needs_verification';
  }

  const scheme = await LoanScheme.create(data);

  await logAuditAction({
    userId: adminUser.id,
    userEmail: adminUser.email,
    userRole: adminUser.role,
    action: 'CREATE',
    entityType: 'loanScheme',
    entityId: scheme._id.toString(),
    newValue: scheme.toObject(),
    reason: 'Admin created loan scheme with verified source metadata',
    ipAddress,
  });

  return scheme;
};

export const updateLoanScheme = async (
  id: string,
  data: any,
  adminUser: { id: string; email: string; role: string },
  ipAddress?: string
): Promise<ILoanScheme> => {
  const scheme = await LoanScheme.findById(id);
  if (!scheme) {
    const error: any = new Error(`Loan scheme not found with id: ${id}`);
    error.statusCode = 404;
    error.code = 'SCHEME_NOT_FOUND';
    throw error;
  }

  const oldValue = scheme.toObject();

  // Safety check on update
  if (
    data.status === 'verified' &&
    (!data.source || !data.source.sourceUrl || !data.source.sourceUrl.startsWith('http'))
  ) {
    data.status = 'needs_verification';
  }

  Object.assign(scheme, data);
  await scheme.save();

  await logAuditAction({
    userId: adminUser.id,
    userEmail: adminUser.email,
    userRole: adminUser.role,
    action: 'UPDATE',
    entityType: 'loanScheme',
    entityId: scheme._id.toString(),
    oldValue,
    newValue: scheme.toObject(),
    reason: 'Admin modified loan scheme parameters/rates',
    ipAddress,
  });

  return scheme;
};

export const deleteLoanScheme = async (
  id: string,
  adminUser: { id: string; email: string; role: string },
  ipAddress?: string
): Promise<ILoanScheme> => {
  const scheme = await LoanScheme.findByIdAndDelete(id);
  if (!scheme) {
    const error: any = new Error(`Loan scheme not found with id: ${id}`);
    error.statusCode = 404;
    error.code = 'SCHEME_NOT_FOUND';
    throw error;
  }

  await logAuditAction({
    userId: adminUser.id,
    userEmail: adminUser.email,
    userRole: adminUser.role,
    action: 'DELETE',
    entityType: 'loanScheme',
    entityId: scheme._id.toString(),
    oldValue: scheme.toObject(),
    reason: 'Admin deleted loan scheme',
    ipAddress,
  });

  return scheme;
};
