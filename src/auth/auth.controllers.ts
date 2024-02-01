import { type Request, type Response, type NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

import { ErrorHandler } from '@/utils/ErrorHandler.js';

import { MAX_EMAIL_LENGTH, MAX_PASSWORD_LENGTH } from './auth.constants.js';
import { env } from '@/config/env.js';

import * as service from './auth.services.js';
import * as schema from './auth.schemas.js';
import { decodeToken, verifyToken } from '@/utils/jwtTokens.js';
import { getUserByUuid } from '@/users/user.service.js';
import { validationOptions } from '@/utils/yupOptions.js';

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
// убрать any
const setCookieAndSendData = (data: any, res: Response, sectorMsg: string) => {
  const refreshTokenName = env.REFRESH_TOKEN_NAME;
  if (data !== undefined) {
    res.cookie(
      refreshTokenName,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      data[refreshTokenName],
      getCookieOptions()
    );
    res.status(StatusCodes.OK).json(data);
  } else {
    console.log(`error auth ${sectorMsg} controller`);
  }
};

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

    const decodedToken = decodeToken(accessToken);
    if (decodedToken === null) {
      next(ErrorHandler.UnauthorizedError());
      return;
    }

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

    req.uuid = verifyAccess.sub as string;
    req.id = user.id;

    next();
  })().catch(() => {
    next(
      ErrorHandler.UnauthorizedError({
        server: 'Валидация токена'
      })
    );
  });
}

const registration = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  (async () => {
    const { name, email, password } = await schema.registerGuard.validate(
      req.body,
      validationOptions
    );

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

    const newData = await service.registration(email, name, password);
    setCookieAndSendData(newData, res, 'registration');
  })().catch((error) => {
    next(error);
  });
};

const login = (req: Request, res: Response, next: NextFunction): void => {
  (async () => {
    const { email, password } = await schema.loginGuard.validate(
      req.body,
      validationOptions
    );

    const newData = await service.login(email, password);

    setCookieAndSendData(newData, res, 'login');
  })().catch((e) => {
    next(e);
  });
};

const logout = (req: Request, res: Response, next: NextFunction): void => {
  (async () => {
    const { refresh } = await schema.refreshGuard.validate(
      req.cookies,
      validationOptions
    );

    const token = await service.logout(refresh);

    if (token !== undefined) {
      res.clearCookie('refresh');
      res.status(StatusCodes.OK).json(token);
    } else {
      console.log('error auth logout controller');
    }
  })().catch((error) => {
    next(error);
  });
};

const refresh = (req: Request, res: Response, next: NextFunction): void => {
  (async () => {
    const { refresh } = await schema.refreshGuard.validate(
      req.cookies,
      validationOptions
    );

    verifyToken(refresh);

    const newData = await service.refresh(refresh);
    setCookieAndSendData(newData, res, 'refresh');
  })().catch((error) => {
    next(error);
  });
};

export { registration, login, logout, refresh, validateAccessToken };
