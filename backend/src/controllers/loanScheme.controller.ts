import { Request, Response, NextFunction } from 'express';
import * as schemeService from '../services/loanScheme.service';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { sendSuccess } from '../utils/apiResponse';

export const getLoanSchemes = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await schemeService.listLoanSchemes(req.query);
    sendSuccess(
      res,
      result.schemes,
      200,
      undefined,
      { count: result.schemes.length },
      result.pagination
    );
  } catch (err) {
    next(err);
  }
};

export const compareSchemes = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const idsQuery = req.query.ids as string | undefined;
    const ids = idsQuery ? idsQuery.split(',').map((id) => id.trim()).filter(Boolean) : [];
    const result = await schemeService.compareLoanSchemes(ids);
    sendSuccess(res, result, 200, undefined, { disclaimer: result.disclaimer });
  } catch (err) {
    next(err);
  }
};

export const getLoanScheme = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const scheme = await schemeService.getLoanSchemeById(req.params.id);
    sendSuccess(res, scheme, 200);
  } catch (err) {
    next(err);
  }
};

export const createLoanScheme = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const adminUser = {
      id: req.user!.userId,
      email: (req as any).userEmail || 'admin@edu4loan.org',
      role: req.user!.role,
    };
    const scheme = await schemeService.createLoanScheme(req.body, adminUser, req.ip);
    sendSuccess(res, scheme, 201, 'Loan scheme created with verified source audit.');
  } catch (err) {
    next(err);
  }
};

export const updateLoanScheme = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const adminUser = {
      id: req.user!.userId,
      email: (req as any).userEmail || 'admin@edu4loan.org',
      role: req.user!.role,
    };
    const scheme = await schemeService.updateLoanScheme(req.params.id, req.body, adminUser, req.ip);
    sendSuccess(res, scheme, 200, 'Loan scheme updated successfully.');
  } catch (err) {
    next(err);
  }
};

export const deleteLoanScheme = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const adminUser = {
      id: req.user!.userId,
      email: (req as any).userEmail || 'admin@edu4loan.org',
      role: req.user!.role,
    };
    await schemeService.deleteLoanScheme(req.params.id, adminUser, req.ip);
    sendSuccess(res, { deletedId: req.params.id }, 200, 'Loan scheme deleted.');
  } catch (err) {
    next(err);
  }
};
