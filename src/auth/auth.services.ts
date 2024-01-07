import prisma from 'prisma/prisma.js';
import { env } from '@/config/env.js';
import { genPassword, genUuid } from '@/utils/cryptoTools.js';
import { genBothTokens } from '@/utils/jwtTokens.js';
import { getUserByEmail } from '@/user/user.service.js';
import { ErrorHandler } from '@/utils/ErrorHandler.js';

export const registration = async (
  email: string,
  password: string,
  name: string
) => {
  const payload = { uuid: genUuid() };
  const tokens = await genBothTokens(payload);

  await prisma.user.create({
    data: {
      email,
      password: genPassword(password),
      name,
      uuid: genUuid(),
      refreshToken: tokens[env.REFRESH_TOKEN_NAME]
    }
  });

  return tokens;
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
  const payload = { uuid: user.uuid };
  const tokens = await genBothTokens(payload);
  await prisma.user.update({
    where: {
      uuid: user.uuid
    },
    data: {
      refreshToken: tokens[env.REFRESH_TOKEN_NAME]
    }
  });

  return tokens;
};
