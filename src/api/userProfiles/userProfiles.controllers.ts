import fs from 'node:fs';
import path from 'node:path';
import { type Request, type Response, type NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

import { ErrorHandler } from '@/utils/ErrorHandler.js';
import { validationOptions } from '@/utils/yupOptions.js';
import { env } from '@/config/env.js';

import * as service from './userProfiles.services.js';
import * as schema from './userProfiles.schemas.js';

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

export const getProfileAvatar = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  (async () => {
    const { fileId } = await schema.getFile.validate(
      req.params,
      validationOptions
    );

    const fileData = await service.getFile(fileId);

    if (fileData === null) return;

    const fullFileName = path.join(
      env.DST_FILES_PATH,
      'users',
      String(fileData.userProfile.userId),
      'profile',
      'avatar',
      String(fileData.id)
    );

    const absolutePath = path.resolve(fullFileName);

    fs.promises
      .stat(fullFileName)
      .then(() => {
        res.sendFile(absolutePath, {
          headers: {
            'Content-Type': fileData.mimetype,
            'Accept-Ranges': 'bytes',
            'Content-Length': fileData.size
          }
        });
      })
      .catch((err) => {
        console.log(err);
        next(ErrorHandler.NotFoundError());
      });
  })().catch((err) => {
    next(err);
  });
};
