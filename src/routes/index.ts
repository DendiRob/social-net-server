import type { Express } from 'express';
import authRoutes from '@/auth/auth.routes.js';

export default function (app: Express) {
  app.use(authRoutes);
  //   app.use(validateAccessToken);

  //   useErrorHandler(app);
}
