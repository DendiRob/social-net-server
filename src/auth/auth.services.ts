import prisma from 'prisma/prisma.js';
import { env } from '@/config/env.js';
import { genPassword, genUuid } from '@/utils/cryptoTools.js';
import { createToken } from '@/utils/jwtTokens.js';

export const registration = async (
  email: string,
  password: string,
  name: string
) => {
  const payload = { uuid: genUuid() };
  const tokens = {
    [env.ACCESS_TOKEN_NAME]: createToken(payload, {
      expiresIn: env.ACCESS_TOKEN_LIFETIME
    }),
    [env.REFRESH_TOKEN_NAME]: createToken(payload, {
      expiresIn: env.REFRESH_TOKEN_LIFETIME
    })
  };

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
