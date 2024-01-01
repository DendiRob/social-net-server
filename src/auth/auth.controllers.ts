import { type Request, type Response, type NextFunction } from 'express';

import { ErrorHandler } from '@/utils/ErrorHandler.js';
import { MAX_EMAIL_LENGTH, MAX_PASSWORD_LENGTH } from './auth.constants.js';
import { env } from '@/config/env.js';

import * as service from './auth.services.js';
// import { ErrorHandler } from '@/helpers/ErrorHandler.js';
import { StatusCodes } from 'http-status-codes';

const getCookieOptions = (remove = false) => ({
  domain: env.REFRESH_COOKIE_DOMAIN,
  httpOnly: env.REFRESH_COOKIE_HTTP_ONLY,
  maxAge: remove ? 0 : env.REFRESH_COOKIE_MAX_AGE,
  path: env.REFRESH_COOKIE_PATH,
  sameSite: env.REFRESH_COOKIE_SAME_SITE,
  secure: env.REFRESH_COOKIE_SECURE
});

const registration = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    if (
      typeof email !== 'string' ||
      typeof password !== 'string' ||
      typeof name !== 'string'
    ) {
      next(ErrorHandler.ForbiddenError());
      return;
    }

    if (
      email.length > MAX_EMAIL_LENGTH ||
      password.length > MAX_PASSWORD_LENGTH
    ) {
      next(ErrorHandler.ForbiddenError());
      return;
    }

    const tokensAfterReg = await service.registartion(name, email, password);
    const refreshTokenName = env.REFRESH_TOKEN_NAME;
    if (tokensAfterReg !== undefined) {
      res.cookie(
        refreshTokenName,
        tokensAfterReg[refreshTokenName],
        getCookieOptions()
      );
      res.status(StatusCodes.OK).json(tokensAfterReg);
    } else {
      console.log('error auth controller');
    }
  } catch (error) {
    console.log(error);
  }
};

const login = (req: Request, res: Response, next: NextFunction): void => {};

const logout = (req: Request, res: Response, next: NextFunction): void => {};

const refresh = (req: Request, res: Response, next: NextFunction): void => {};

export default { registration, login, logout, refresh };
