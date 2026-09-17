import { Request, Response, NextFunction } from 'express';
import { DocumentModel } from '../models/Document';
import { sendSuccess, sendError } from '../utils/apiResponse';
import { parsePagination, buildPaginationMeta, escapeRegex, sanitizeString, isValidObjectId } from '../utils/querySafety';

export const getDocuments = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { page, limit, skip } = parsePagination(req.query, 30, 100);
    const filter: any = {};

    const category = sanitizeString(req.query.category);
    if (category) filter.category = category;

    if (req.query.isRequired !== undefined) {
      filter.isRequired = String(req.query.isRequired).toLowerCase() === 'true';
    }

    const search = sanitizeString(req.query.search);
    if (search) {
      const escaped = escapeRegex(search);
      filter.$or = [
        { name: { $regex: escaped, $options: 'i' } },
        { description: { $regex: escaped, $options: 'i' } },
        { issuingAuthority: { $regex: escaped, $options: 'i' } },
      ];
    }

    const [docs, total] = await Promise.all([
      DocumentModel.find(filter)
        .sort({ category: 1, isRequired: -1, name: 1 })
        .skip(skip)
        .limit(limit),
      DocumentModel.countDocuments(filter),
    ]);

    sendSuccess(
      res,
      docs,
      200,
      undefined,
      { count: docs.length },
      buildPaginationMeta(page, limit, total)
    );
  } catch (err) {
    next(err);
  }
};

export const getDocumentById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!isValidObjectId(req.params.id)) {
      sendError(res, 400, 'INVALID_ID', 'Invalid document ID format.');
      return;
    }
    const doc = await DocumentModel.findById(req.params.id).lean();
    if (!doc) {
      sendError(res, 404, 'DOCUMENT_NOT_FOUND', 'Document not found.');
      return;
    }
    sendSuccess(res, doc, 200);
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
      collateralType = 'property',
      applyingThroughVidyaLakshmi = true,
      degreeLevel = 'Undergraduate',
    } = req.body;

    const loanAmt = Number(estimatedLoanAmount) || 400000;
    const coAppType = (coApplicantType || 'salaried').toLowerCase();

    // Fetch all catalog items
    const allDocs = await DocumentModel.find({ isDemo: false }).sort({ category: 1, name: 1 });

    const requiredDocuments: any[] = [];
    const optionalDocuments: any[] = [];
    const notApplicableDocuments: any[] = [];
    const verificationNotes: { documentName: string; tip: string; authority: string }[] = [];

    for (const doc of allDocs) {
      let status: 'required' | 'optional' | 'not_applicable' = 'optional';

      // 1. Mandatory Student KYC & Academic & VIT Bhopal Admission
      if (
        doc.category === 'student_kyc' ||
        doc.category === 'academic_records' ||
        doc.category === 'vit_bhopal_admission'
      ) {
        status = 'required';
      }

      // 2. Co-applicant KYC
      else if (doc.category === 'coapplicant_kyc') {
        status = 'required';
      }

      // 3. Co-applicant Income Proof
      else if (doc.category === 'coapplicant_income_salaried') {
        status = coAppType === 'salaried' ? 'required' : 'not_applicable';
      } else if (doc.category === 'coapplicant_income_selfemployed') {
        status = coAppType === 'self_employed' || coAppType === 'business' ? 'required' : 'not_applicable';
      }

      // 4. Collateral Property Documents
      else if (doc.category === 'collateral_property') {
        if (loanAmt > 750000 && (hasCollateral || collateralType === 'property')) {
          status = 'required';
        } else if (loanAmt <= 750000 && !hasCollateral) {
          status = 'not_applicable';
        } else {
          status = 'optional';
        }
      }

      // 5. Liquid Collateral (FD)
      else if (doc.category === 'collateral_liquid') {
        if (hasCollateral && collateralType === 'liquid') {
          status = 'required';
        } else {
          status = 'optional';
        }
      }

      // 6. Bank Specific Forms & Portal Forms
      else if (doc.category === 'bank_specific_forms') {
        if (applyingThroughVidyaLakshmi && doc.name.toLowerCase().includes('celfs')) {
          status = 'required';
        } else {
          status = 'required';
        }
      }

      // Categorize
      if (status === 'required') {
        requiredDocuments.push(doc);
        verificationNotes.push({
          documentName: doc.name,
          tip: doc.verificationTip,
          authority: doc.issuingAuthority,
        });
      } else if (status === 'optional') {
        optionalDocuments.push(doc);
      } else {
        notApplicableDocuments.push(doc);
      }
    }

    sendSuccess(res, {
      profileParameters: {
        estimatedLoanAmount: loanAmt,
        coApplicantType: coAppType,
        hasCollateral,
        collateralType,
        applyingThroughVidyaLakshmi,
        degreeLevel,
      },
      summary: {
        totalRequired: requiredDocuments.length,
        totalOptional: optionalDocuments.length,
        totalNotApplicable: notApplicableDocuments.length,
      },
      requiredDocuments,
      optionalDocuments,
      notApplicableDocuments,
      verificationNotes,
      disclaimer:
        'This personalized checklist is an educational guidance tool based on IBA model guidelines and VIT Bhopal admissions procedures. Final document requirements and formats are determined exclusively by the lending bank upon formal credit appraisal.',
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
