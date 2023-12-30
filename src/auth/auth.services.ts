// if (usersDatabase.has(email)) {
//   const conflictError = ErrorHandler.ConflictError({
//     server:
//       'Пользователь с таким адресом электронной почты уже зарегистрирован',
//     client: 'User with this email already exists'
//   });

//   res.status(conflictError.status).json({
//     error: {
//       message: conflictError.message,
//       payload: conflictError.payload
//     }
//   });
//   return;
// }
// import prisma from '@/prisma/prisma.js';
import { env } from '@/config/env.js';
// import { genToken, genPassword /*, genUuid */ } from '@/helpers/index.js';
// import { expiresJwt } from '@/config/jwt.js';

const getCookieOptions = (remove = false) => ({
  domain: env.REFRESH_COOKIE_DOMAIN,
  httpOnly: env.REFRESH_COOKIE_HTTP_ONLY,
  maxAge: remove ? 0 : env.REFRESH_COOKIE_MAX_AGE,
  path: env.REFRESH_COOKIE_PATH,
  sameSite: env.REFRESH_COOKIE_SAME_SITE,
  secure: env.REFRESH_COOKIE_SECURE
});

const registration = async (
  name: string,
  email: string,
  password: string
): Promise<void> => {
  try {
  } catch (error) {
    console.log();
  }
};
