import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth.middleware';
import { sendError } from '../utils/apiResponse';

export const requireRole = (allowedRoles: ('student' | 'admin')[] | 'student' | 'admin') => {
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      sendError(res, 401, 'UNAUTHORIZED', 'Authentication required prior to role verification.');
      return;
    }

    if (!roles.includes(req.user.role)) {
      sendError(
        res,
        403,
        'FORBIDDEN',
        `Access denied. Role '${req.user.role}' is not authorized for this resource.`
      );
      return;
    }

    next();
  };
};
