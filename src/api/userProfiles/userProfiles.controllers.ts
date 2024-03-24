import { type Request, type Response, type NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

// import { ErrorHandler } from '@/utils/ErrorHandler.js';
// import { validationOptions } from '@/utils/yupOptions.js';

import * as service from './userProfiles.services.js';
// import * as schema from './userProfiles.schemas.js';

export const getProfile = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  (async () => {
    const profileData = await service.getProfile(req.id);

    res.status(StatusCodes.OK).json(profileData);
  })().catch((error) => {
    next(error);
  });
};
