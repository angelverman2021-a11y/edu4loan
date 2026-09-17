import { Request, Response, NextFunction } from 'express';
import { FAQ } from '../models/FAQ';
import { sendSuccess, sendError } from '../utils/apiResponse';
import { escapeRegex, parsePagination, buildPaginationMeta } from '../utils/querySafety';

export const getFAQs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const category = req.query.category as string | undefined;
    const search = req.query.search as string | undefined;

    const filter: Record<string, any> = {};
    if (category) filter.category = category;

    if (search && search.trim()) {
      const safePattern = new RegExp(escapeRegex(search.trim()), 'i');
      filter.$or = [
        { question: safePattern },
        { answer: safePattern },
        { tags: safePattern },
      ];
    }

    const [faqs, total] = await Promise.all([
      FAQ.find(filter).sort({ isHighPriority: -1, createdAt: -1 }).skip(skip).limit(limit).lean(),
      FAQ.countDocuments(filter),
    ]);

    const pagination = buildPaginationMeta(page, limit, total);
    sendSuccess(res, faqs, 200, undefined, {
      count: faqs.length,
      pagination,
    });
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
