import * as yup from 'yup';
import dotenv from 'dotenv';

console.log('Create env variables...');

dotenv.config();

const envSchema = yup.object({
  NODE_ENV: yup.string().oneOf(['development', 'production']).required(),

  HOST: yup.string().trim().required(),
  PORT: yup.number().integer().positive().required(),

  JWT_PRIVATE_KEY: yup.string().trim().max(100).required(),

  ACCESS_TOKEN_NAME: yup.string().trim().max(20).required(),
  ACCESS_TOKEN_LIFETIME: yup.number().integer().positive().required(),

  CORS_PRODUCTION_MODE: yup.string().max(100).required(),

  REFRESH_TOKEN_NAME: yup.string().trim().max(20).required(),
  REFRESH_TOKEN_LIFETIME: yup.number().integer().positive().required(),

  REFRESH_COOKIE_NAME: yup.string().max(50).required(),
  REFRESH_COOKIE_MAX_AGE: yup.number().integer().positive().required(),
  REFRESH_COOKIE_DOMAIN: yup.string().max(50).required(),
  REFRESH_COOKIE_HTTP_ONLY: yup.boolean().required().defined(),
  REFRESH_COOKIE_SAME_SITE: yup.string().oneOf(['strict', 'lax']).required(),
  REFRESH_COOKIE_SECURE: yup.boolean().required().defined(),
  REFRESH_COOKIE_PATH: yup.string().max(50).required(),

  SRC_FILES_PATH: yup.string().max(255).required(),
  DST_FILES_PATH: yup.string().max(255).required(),

  DST_FILES_PUBLIC_PATH: yup.string().max(255).required(),
  SRC_TEMP_FILES_PATH: yup.string().max(255).required()
});

const env = envSchema.validateSync(process.env, { stripUnknown: true });

export { env };
