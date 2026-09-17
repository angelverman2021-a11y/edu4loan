/**
 * Safe Query Building and Parameter Sanitization Utility
 * Guards against NoSQL injection, unbounded queries, and regex ReDoS attacks.
 */

export interface PaginationParams {
  page: number;
  limit: number;
  skip: number;
}

export interface PaginationResult {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/**
 * Escapes characters that have special meaning in regular expressions.
 * Ensures user query input is treated as literal search string.
 */
export const escapeRegex = (str: string): string => {
  if (typeof str !== 'string') return '';
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

/**
 * Validates and normalizes pagination parameters with strict bounds.
 */
export const parsePagination = (
  query: Record<string, any>,
  defaultLimit = 20,
  maxLimit = 100
): PaginationParams => {
  let page = parseInt(String(query.page || '1'), 10);
  if (isNaN(page) || page < 1) page = 1;

  let limit = parseInt(String(query.limit || defaultLimit), 10);
  if (isNaN(limit) || limit < 1) limit = defaultLimit;
  if (limit > maxLimit) limit = maxLimit;

  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

/**
 * Computes pagination metadata for API responses.
 */
export const buildPaginationMeta = (
  page: number,
  limit: number,
  total: number
): PaginationResult => {
  const totalPages = Math.ceil(total / limit) || 1;
  return {
    page,
    limit,
    total,
    totalPages,
  };
};

/**
 * Validates if string is a valid MongoDB 24-character hexadecimal ObjectId.
 */
export const isValidObjectId = (id: unknown): boolean => {
  if (typeof id !== 'string') return false;
  return /^[0-9a-fA-F]{24}$/.test(id);
};

/**
 * Sanitizes input string, returning undefined if invalid or empty.
 */
export const sanitizeString = (val: unknown): string | undefined => {
  if (typeof val !== 'string') return undefined;
  const trimmed = val.trim();
  return trimmed.length > 0 ? trimmed : undefined;
};
