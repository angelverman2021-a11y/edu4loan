import { Request, Response, NextFunction } from 'express';
import * as bankService from '../services/bank.service';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { sendSuccess } from '../utils/apiResponse';

export const getBanks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await bankService.listBanks(req.query);
    sendSuccess(
      res,
      result.banks,
      200,
      undefined,
      { count: result.banks.length },
      result.pagination
    );
  } catch (err) {
    next(err);
  }
};

export const getBank = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const identifier = req.params.id;
    const bank = await bankService.getBankByIdOrSlug(identifier);
    sendSuccess(res, bank, 200);
  } catch (err) {
    next(err);
  }
};

export const createBank = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const adminUser = {
      id: req.user!.userId,
      email: (req as any).userEmail || 'admin@edu4loan.org',
      role: req.user!.role,
    };
    const bank = await bankService.createBank(req.body, adminUser, req.ip);
    sendSuccess(res, bank, 201, 'Bank entry created successfully.');
  } catch (err) {
    next(err);
  }
};

export const updateBank = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const adminUser = {
      id: req.user!.userId,
      email: (req as any).userEmail || 'admin@edu4loan.org',
      role: req.user!.role,
    };
    const bank = await bankService.updateBank(req.params.id, req.body, adminUser, req.ip);
    sendSuccess(res, bank, 200, 'Bank details updated successfully.');
  } catch (err) {
    next(err);
  }
};

export const deleteBank = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const adminUser = {
      id: req.user!.userId,
      email: (req as any).userEmail || 'admin@edu4loan.org',
      role: req.user!.role,
    };
    await bankService.deleteBank(req.params.id, adminUser, req.ip);
    sendSuccess(res, { deletedId: req.params.id }, 200, 'Bank entry removed.');
  } catch (err) {
    next(err);
  }
};
