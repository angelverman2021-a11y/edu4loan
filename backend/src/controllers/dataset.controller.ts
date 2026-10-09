import { Request, Response } from 'express';
import { DatasetService } from '../services/dataset.service';
import { sendSuccess, sendError } from '../utils/apiResponse';

export class DatasetController {
  static getBanks(req: Request, res: Response) {
    try {
      const banks = DatasetService.getBanks();
      sendSuccess(res, banks, 'Banks retrieved successfully');
    } catch (error: any) {
      sendError(res, 500, 'INTERNAL_ERROR', error.message);
    }
  }

  static getLoanTypes(req: Request, res: Response) {
    try {
      const types = DatasetService.getLoanTypes();
      sendSuccess(res, types, 'Loan types retrieved successfully');
    } catch (error: any) {
      sendError(res, 500, 'INTERNAL_ERROR', error.message);
    }
  }

  static getLoanProducts(req: Request, res: Response) {
    try {
      const { type } = req.params;
      const products = DatasetService.getLoanProducts(type);
      
      // Attach bank info
      const banks = DatasetService.getBanks();
      const enrichedProducts = products.map(p => {
         const bank = banks.find(b => b.bank_id === p.bank_id);
         return {
           ...p,
           bankName: bank ? bank.bank_name : p.bank_id
         };
      });

      sendSuccess(res, enrichedProducts, 'Products retrieved successfully');
    } catch (error: any) {
      sendError(res, 500, 'INTERNAL_ERROR', error.message);
    }
  }

  static compareLoans(req: Request, res: Response) {
    try {
      const { loanProductIds, loanAmount, tenureMonths } = req.body;
      if (!loanProductIds || !Array.isArray(loanProductIds)) {
        return sendError(res, 400, 'BAD_REQUEST', 'loanProductIds must be an array');
      }
      const results = DatasetService.compareLoans(loanProductIds, loanAmount || 100000, tenureMonths || 12);
      sendSuccess(res, results, 'Comparison generated successfully');
    } catch (error: any) {
      sendError(res, 500, 'INTERNAL_ERROR', error.message);
    }
  }

  static getInterestRates(req: Request, res: Response) {
    try {
      const rates = DatasetService.getInterestRates();
      sendSuccess(res, rates, 200, 'Interest rates retrieved successfully');
    } catch (error: any) {
      sendError(res, 500, 'INTERNAL_ERROR', error.message);
    }
  }
}
