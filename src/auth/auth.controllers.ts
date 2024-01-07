import { type Request, type Response, type NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

import formatErrors from '@/utils/errorFormatter.js';
import { ErrorHandler } from '@/utils/ErrorHandler.js';

import { MAX_EMAIL_LENGTH, MAX_PASSWORD_LENGTH } from './auth.constants.js';
import { env } from '@/config/env.js';

import * as service from './auth.services.js';

interface reqTypes {
  email: string;
  password: string;
  refresh: string;
  name: string;
}

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

const setCookieAndSendTokens = (
  tokens: any,
  res: Response,
  sectorMsg: string
) => {
  const refreshTokenName = env.REFRESH_TOKEN_NAME;
  if (tokens !== undefined) {
    res.cookie(
      refreshTokenName,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      tokens[refreshTokenName],
      getCookieOptions()
    );
    res.status(StatusCodes.OK).json(tokens);
  } else {
    console.log(`error auth ${sectorMsg} controller`);
  }
};

const typesValidator = (fields: string[], next: NextFunction) => {
  let hasError = false;
  fields.forEach((field) => {
    if (typeof field !== 'string') {
      hasError = true;
    }
  });

  if (hasError) {
    next(
      ErrorHandler.ForbiddenError({
        server: 'Проблемы с типами данных',
        client: 'Непредвиденные проблемы с данными'
      })
    );
    return true;
  } else {
    return false;
  }
};

const requestValidator = (req: Request, res: Response) => {
  const errors = formatErrors(req);
  if (errors.length !== 0) {
    res.status(StatusCodes.CONFLICT).json({ errors });
    return true;
  }
  return false;
};

const registration = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  (async () => {
    const { name, email, password }: Omit<reqTypes, 'refresh'> = req.body;

    if (requestValidator(req, res)) return;
    if (typesValidator([email, password, name], next)) return;

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
    setCookieAndSendTokens(tokensAfterReg, res, 'registration');
  })().catch((error) => {
    next(error);
  });
};

const login = (req: Request, res: Response, next: NextFunction): void => {
  (async () => {
    const { email, password }: Omit<reqTypes, 'refresh' | 'name'> = req.body;

    if (requestValidator(req, res)) return;
    if (typesValidator([email, password], next)) return;

    const tokens = await service.login(email, password);

    setCookieAndSendTokens(tokens, res, 'login');
  })().catch((e) => {
    next(e);
  });
};

const logout = (req: Request, res: Response, next: NextFunction): void => {
  (async () => {
    const { refresh }: Pick<reqTypes, 'refresh'> = req.cookies;

    if (requestValidator(req, res)) return;
    if (typesValidator([refresh], next)) return;

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
    const { refresh }: Pick<reqTypes, 'refresh'> = req.cookies;

    if (requestValidator(req, res)) return;
    if (typesValidator([refresh], next)) return;

    const tokens = await service.refresh(refresh);
    setCookieAndSendTokens(tokens, res, 'logout');
  })().catch((error) => {
    next(error);
  });
};

export { registration, login, logout, refresh };
