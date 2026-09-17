import { Request, Response, NextFunction } from 'express';
import { GovernmentScheme } from '../models/GovernmentScheme';
import { sendSuccess, sendError } from '../utils/apiResponse';
import { escapeRegex, parsePagination, buildPaginationMeta } from '../utils/querySafety';

export const getGovernmentSchemes = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const search = req.query.search as string | undefined;

    const filter: Record<string, any> = {};
    if (search && search.trim()) {
      const safePattern = new RegExp(escapeRegex(search.trim()), 'i');
      filter.$or = [
        { schemeName: safePattern },
        { schemeCode: safePattern },
        { managingAuthority: safePattern },
        { targetBeneficiaries: safePattern },
      ];
    }

    const [schemes, total] = await Promise.all([
      GovernmentScheme.find(filter).sort({ schemeName: 1 }).skip(skip).limit(limit).lean(),
      GovernmentScheme.countDocuments(filter),
    ]);

    const pagination = buildPaginationMeta(page, limit, total);
    sendSuccess(res, schemes, 200, undefined, {
      count: schemes.length,
      pagination,
      disclaimer:
        'Government subsidy schemes are subject to Government of India and Ministry of Education guidelines. Final qualification is determined during loan sanctioning.',
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Normalizes user-supplied scheme code and resolves common aliases
 */
const normalizeSchemeCode = (input: string): string => {
  const clean = input.trim().toUpperCase().replace(/[-\s]/g, '_');
  if (clean.includes('PM') && clean.includes('VIDYA')) return 'PM_VIDYALAXMI';
  if (clean.includes('VIDYA') && clean.includes('LAKSHMI')) return 'VIDYA_LAKSHMI_PORTAL';
  if (clean === 'CSIS' || clean.includes('INTEREST_SUBSIDY')) return 'CSIS';
  return clean;
};

export const getGovernmentSchemeByCode = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const rawCode = req.params.code;
    if (!rawCode) {
      sendError(res, 400, 'INVALID_CODE', 'Scheme code parameter is required.');
      return;
    }

    const normalizedCode = normalizeSchemeCode(rawCode);

    const scheme = await GovernmentScheme.findOne({
      $or: [
        { schemeCode: normalizedCode },
        { schemeCode: rawCode.toUpperCase() },
        { schemeCode: new RegExp(`^${escapeRegex(rawCode)}$`, 'i') },
      ],
    }).lean();

    if (!scheme) {
      sendError(res, 404, 'SCHEME_NOT_FOUND', `Government scheme '${rawCode}' not found.`);
      return;
    }

    sendSuccess(res, scheme, 200, undefined, {
      disclaimer:
        'Edu4Loan is an independent decision-support platform. Applications for Central Sector schemes must be completed through official designated government portals.',
    });
  } catch (err) {
    next(err);
  }
};

export const createGovernmentScheme = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const scheme = await GovernmentScheme.create(req.body);
    sendSuccess(res, scheme, 201, 'Government scheme created.');
  } catch (err) {
    next(err);
  }
};

export const updateGovernmentScheme = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const scheme = await GovernmentScheme.findByIdAndUpdate(req.params.id, req.body, { new: true });
    sendSuccess(res, scheme, 200, 'Government scheme updated.');
  } catch (err) {
    next(err);
  }
};
