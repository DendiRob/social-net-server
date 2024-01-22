import prisma from 'prisma/prisma.js';
import { env } from '@/config/env.js';
import { genPassword, genUuid } from '@/utils/cryptoTools.js';
import { genBothTokens, verifyToken } from '@/utils/jwtTokens.js';
import { getUserByEmail } from '@/user/user.service.js';
import { ErrorHandler } from '@/utils/ErrorHandler.js';

const validateRefreshToken = (refresh: string) => {
  return verifyToken(refresh);
};

const genAndUpdateUserTokens = async (uuid: string) => {
  const payload = { uuid };
  const tokens = await genBothTokens(payload);
  await prisma.user.update({
    where: {
      uuid
    },
    data: {
      refreshToken: tokens[env.REFRESH_TOKEN_NAME]
    }
  });
  return tokens;
};

export const registration = async (
  email: string,
  password: string,
  name: string
) => {
  const userUuid = genUuid();
  const payload = { uuid: userUuid };
  const tokens = await genBothTokens(payload);

  const user = await prisma.user.create({
    data: {
      email,
      password: genPassword(password),
      name,
      uuid: userUuid,
      refreshToken: tokens[env.REFRESH_TOKEN_NAME]
    },
    select: {
      email: true,
      name: true,
      uuid: true,
      id: true
    }
  });

  return { ...tokens, ...user };
};

export const login = async (email: string, password: string) => {
  const user = await getUserByEmail(email);
  if (user === null) {
    ErrorHandler.UnauthorizedError({
      server: 'Такого аккаунта не существует',
      client: 'Такого аккаунта не существует'
    });
    return;
  }
  if (user?.password !== genPassword(password)) {
    ErrorHandler.BadRequestError({
      client: 'Неверный пароль',
      server: 'Неверный пароль'
    });
    return;
  }

  const tokens = await genAndUpdateUserTokens(user.uuid);
  return tokens;
};

export const logout = async (refresh: string) => {
  try {
    const user = await prisma.user.update({
      where: {
        refreshToken: refresh
      },
      data: { refreshToken: null },
      select: {
        id: true,
        email: true
      }
    });
    return user;
  } catch (error) {
    return error;
  }
};

export const refresh = async (refresh: string) => {
  const validateToken = validateRefreshToken(refresh);
  console.log(validateToken);
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (!validateToken) {
    ErrorHandler.UnauthorizedError({
      server: 'Невалидный токен',
      client: 'Пожайлуста, попробуйте войти заного'
    });
    return;
  }
  const user = await prisma.user.findUnique({
    where: {
      refreshToken: refresh
    },
    select: {
      uuid: true
    }
  });
  if (user === null) {
    ErrorHandler.UnauthorizedError({
      server: 'Такого аккаунта не существует',
      client: 'Такого аккаунта не существует'
    });
    return;
  }
  const tokens = await genAndUpdateUserTokens(user.uuid);
  return tokens;
};
