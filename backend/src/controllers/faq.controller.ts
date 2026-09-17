import { Request, Response, NextFunction } from 'express';
import { FAQ } from '../models/FAQ';
import { sendSuccess } from '../utils/apiResponse';

export const getFAQs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const category = req.query.category as string | undefined;
    const filter: any = {};
    if (category) filter.category = category;

    const faqs = await FAQ.find(filter).sort({ isHighPriority: -1, createdAt: -1 });
    sendSuccess(res, faqs, 200, undefined, { count: faqs.length });
  } catch (err) {
    next(err);
  }
};

export const createFAQ = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const faq = await FAQ.create(req.body);
    sendSuccess(res, faq, 201, 'FAQ item created.');
  } catch (err) {
    next(err);
  }
};

export const updateFAQ = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const faq = await FAQ.findByIdAndUpdate(req.params.id, req.body, { new: true });
    sendSuccess(res, faq, 200, 'FAQ item updated.');
  } catch (err) {
    next(err);
  }
};

export const deleteFAQ = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await FAQ.findByIdAndDelete(req.params.id);
    sendSuccess(res, { deletedId: req.params.id }, 200, 'FAQ item removed.');
  } catch (err) {
    next(err);
  }
};
