import { type Request, type Response, type NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

import formatErrors from '@/utils/errorFormatter.js';
import { ErrorHandler } from '@/utils/ErrorHandler.js';

import { MAX_EMAIL_LENGTH, MAX_PASSWORD_LENGTH } from './auth.constants.js';
import { env } from '@/config/env.js';

import * as service from './auth.services.js';

// при релизе все настроить
const getCookieOptions = (remove = false) => ({
  httpOnly: false,
  maxAge: env.REFRESH_COOKIE_MAX_AGE,
  path: env.REFRESH_COOKIE_PATH
  // убираем samesite в none так как он оклоняет куки без https(только во время разработки)
  // временно ставим sameSite в таком виде так,как идет разработка
  // sameSite: env.REFRESH_COOKIE_SAME_SITE
  // secure: env.REFRESH_COOKIE_SECURE
});

const registration = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  (async () => {
    const { name, email, password } = req.body;

    const errors = formatErrors(req);
    if (errors.length !== 0) {
      res.status(StatusCodes.CONFLICT).json({ errors });
      return;
    }

    if (
      typeof email !== 'string' ||
      typeof password !== 'string' ||
      typeof name !== 'string'
    ) {
      next(
        ErrorHandler.ForbiddenError({
          server: 'Проблемы с типами данных',
          client: 'при регистрации что-то пошло не так'
        })
      );
      return;
    }

    if (
      email.length > MAX_EMAIL_LENGTH ||
      password.length > MAX_PASSWORD_LENGTH
    ) {
      next(
        ErrorHandler.ForbiddenError({
          server: 'Привышена максимальная длина пароля или емайла',
          client: 'Привышена максимальная длина пароля или емайла'
        })
      );
      return;
    }

    const tokensAfterReg = await service.registration(email, name, password);
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
  })().catch((error) => {
    next(error);
  });
};

const login = (req: Request, res: Response, next: NextFunction): void => {
  (async () => {
    const { email, password } = req.body;
    const errors = formatErrors(req);
    if (errors.length !== 0) {
      res.status(StatusCodes.BAD_REQUEST).json({ errors });
      return;
    }
    if (typeof email !== 'string' || typeof password !== 'string') {
      next(
        ErrorHandler.ForbiddenError({
          server: 'Проблемы с типами данных',
          client: 'при регистрации что-то пошло не так'
        })
      );
      return;
    }
    const tokens = await service.login(email, password);
    const refreshTokenName = env.REFRESH_TOKEN_NAME;
    if (tokens !== undefined) {
      res.cookie(
        refreshTokenName,
        tokens[refreshTokenName],
        getCookieOptions()
      );
      res.status(StatusCodes.OK).json(tokens);
    } else {
      console.log('error auth controller');
    }
  })().catch((e) => {
    next(e);
  });
};

const logout = (req: Request, res: Response, next: NextFunction): void => {};

const refresh = (req: Request, res: Response, next: NextFunction): void => {};

export { registration, login, logout, refresh };
