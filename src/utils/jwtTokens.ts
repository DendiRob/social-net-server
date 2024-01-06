import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { env } from '@/config/env.js';
import { ErrorHandler } from './ErrorHandler.js';
import { getUserByUuid } from '@/user/user.service.js';

const privateKey = env.JWT_PRIVATE_KEY;
// options might be used for setting expiredTime
function createToken(payload = {}, options = {}) {
  return jwt.sign(payload, privateKey, { algorithm: 'HS256', ...options });
}

export async function genBothTokens(payload = {}) {
  const tokens = {
    [env.ACCESS_TOKEN_NAME]: createToken(payload, {
      expiresIn: env.ACCESS_TOKEN_LIFETIME
    }),
    [env.REFRESH_TOKEN_NAME]: createToken(payload, {
      expiresIn: env.REFRESH_TOKEN_LIFETIME
    })
  };
  return tokens;
}

function decodeToken(token: string) {
  return jwt.decode(token);
}

function verifyToken(token: string) {
  return jwt.verify(token, privateKey);
}
// эта функция вызвывается перед всеми обращениями к серверу,кроме логинки и прочей темы сайта,которой не нужна авториация
function validateAccessToken(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  (async () => {
    const accessToken = req.headers['access-token'];
    // чекнуть, что приходит
    if (typeof accessToken !== 'string') {
      next(ErrorHandler.UnauthorizedError());
      return;
    }

    const decodedToken = decodeToken(accessToken);
    if (decodedToken === null) {
      next(ErrorHandler.UnauthorizedError());
      return;
    }
    // проверяем сущ такой юзер
    const user = await getUserByUuid(decodedToken.sub as string);
    if (user === null) {
      next(
        ErrorHandler.UnauthorizedError({
          client: 'Такой аккаунт не существует'
        })
      );
      return;
    }

    const verifyAccess = verifyToken(accessToken);

    // added new data to request
    req.uuid = verifyAccess.sub as string;
    req.id = user.id;

    next();
  })().catch(() => {
    next(ErrorHandler.UnauthorizedError());
  });
}

function validateRefreshToken(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  (async () => {
    const refreshToken: string = req.cookies[env.REFRESH_COOKIE_NAME];
    // TODO: заменить на клиенте хранение refresh токена в куке, и потом убрать.
    // if (refreshToken === undefined) refreshToken = req.body.refreshToken;

    if (refreshToken === undefined) {
      next(ErrorHandler.UnauthorizedError());
      return;
    }

    const decodedToken = decodeToken(refreshToken);
    if (decodedToken === null) {
      next(ErrorHandler.UnauthorizedError());
      return;
    }

    const user = await getUserByUuid(decodedToken.sub as string);
    if (user === null) {
      next(ErrorHandler.UnauthorizedError());
      return;
    }

    const verifyRefresh = verifyToken(refreshToken);

    req.uuid = verifyRefresh.sub as string;

    next();
  })().catch(() => {
    next(ErrorHandler.UnauthorizedError());
  });
}

export { validateAccessToken, validateRefreshToken, createToken, verifyToken };
