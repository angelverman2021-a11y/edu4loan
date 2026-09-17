import { Request, Response, NextFunction } from 'express';
import { DocumentModel } from '../models/Document';
import { sendSuccess } from '../utils/apiResponse';

export const getDocuments = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const category = req.query.category as string | undefined;
    const filter: any = {};
    if (category) filter.category = category;

    const docs = await DocumentModel.find(filter).sort({ category: 1, isRequired: -1 });
    sendSuccess(res, docs, 200, undefined, { count: docs.length });
  } catch (err) {
    next(err);
  }
};

export const generatePersonalizedChecklist = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      estimatedLoanAmount = 400000,
      coApplicantType = 'salaried',
      hasCollateral = false,
      applyingThroughVidyaLakshmi = true,
    } = req.body;

    // Fetch all documents from catalog
    const allDocs = await DocumentModel.find({});

    const requiredDocs = allDocs.filter((doc) => {
      // Basic student KYC, VIT admission & academic docs are always required
      if (
        doc.category === 'student_kyc' ||
        doc.category === 'academic_records' ||
        doc.category === 'vit_bhopal_admission'
      ) {
        return true;
      }

      // Co-applicant KYC is always required for Indian education loans
      if (doc.category === 'coapplicant_kyc') {
        return true;
      }

      // Income proof based on co-applicant profession
      if (coApplicantType === 'salaried' && doc.category === 'coapplicant_income_salaried') {
        return true;
      }
      if (coApplicantType === 'self_employed' && doc.category === 'coapplicant_income_selfemployed') {
        return true;
      }

      // Collateral documents required only if loan > ₹7.5 Lakhs or student indicated collateral
      if ((estimatedLoanAmount > 750000 || hasCollateral) && doc.category === 'collateral_property') {
        return true;
      }

      // Vidya Lakshmi registration summary if applying via portal
      if (applyingThroughVidyaLakshmi && doc.name.includes('Vidya Lakshmi')) {
        return true;
      }

      return false;
    });

    sendSuccess(res, {
      estimatedLoanAmount,
      coApplicantType,
      hasCollateral,
      applyingThroughVidyaLakshmi,
      totalRequired: requiredDocs.length,
      documents: requiredDocs,
      guidanceNote:
        estimatedLoanAmount <= 750000
          ? 'Under RBI Model Scheme and CGFSEL/PM-Vidyalaxmi guidelines, loans up to ₹7.5 Lakhs do not mandate tangible physical collateral.'
          : 'For loans exceeding ₹7.5 Lakhs, banks mandate tangible property collateral (with title search report & valuation report) or liquid security (FD/LIC surrender value).',
    });
  } catch (err) {
    next(err);
  }
};

export const createDocument = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const doc = await DocumentModel.create(req.body);
    sendSuccess(res, doc, 201, 'Document catalog item created.');
  } catch (err) {
    next(err);
  }
};

export const updateDocument = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const doc = await DocumentModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    sendSuccess(res, doc, 200, 'Document updated.');
  } catch (err) {
    next(err);
  }
};

export const deleteDocument = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await DocumentModel.findByIdAndDelete(req.params.id);
    sendSuccess(res, { deletedId: req.params.id }, 200, 'Document removed.');
  } catch (err) {
    next(err);
  }
};
