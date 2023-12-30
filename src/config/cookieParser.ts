import type { Express } from 'express';
import cookieParser from 'cookie-parser';

export default function (app: Express) {
  app.use(cookieParser());
}
