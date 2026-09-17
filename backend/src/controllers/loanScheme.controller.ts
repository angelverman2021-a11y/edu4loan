import { Request, Response, NextFunction } from 'express';
import * as schemeService from '../services/loanScheme.service';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { sendSuccess } from '../utils/apiResponse';

export const getLoanSchemes = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const bankId = req.query.bankId as string | undefined;
    const degreeLevel = req.query.degreeLevel as string | undefined;
    const status = req.query.status as string | undefined;
    const vitBhopalEligible =
      req.query.vitBhopalEligible !== undefined ? req.query.vitBhopalEligible === 'true' : undefined;
    const maxAmountMin = req.query.maxAmountMin ? parseFloat(req.query.maxAmountMin as string) : undefined;

    const schemes = await schemeService.listLoanSchemes({
      bankId,
      degreeLevel,
      status,
      vitBhopalEligible,
      maxAmountMin,
    });

    sendSuccess(res, schemes, 200, undefined, { count: schemes.length });
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
