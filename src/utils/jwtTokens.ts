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
    if (typeof accessToken !== 'string') {
      next(ErrorHandler.UnauthorizedError());
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const decodedToken = decodeToken(JSON.parse(accessToken)); // TODO: разобраться с парсингом джсонов,почему-то автоматом не делается
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
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const verifyAccess = verifyToken(JSON.parse(accessToken));

    // added new data to request
    req.uuid = verifyAccess.sub as string;
    req.id = user.id;

    next();
  })().catch(() => {
    next(ErrorHandler.UnauthorizedError());
  });
}

export { validateAccessToken, createToken, verifyToken };
