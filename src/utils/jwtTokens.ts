import jwt from 'jsonwebtoken';

import { env } from '@/config/env.js';

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

export { createToken, verifyToken, decodeToken };
