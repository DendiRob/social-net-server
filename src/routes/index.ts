import type { Express } from 'express';

import { validateAccessToken } from '@/api/auth/auth.controllers.js';
import authRoutes from '@/api/auth/auth.routes.js';
import userRoutes from '@/api/users/user.routes.js';
import useErrorHandler from '@/utils/error.js';

export default function (app: Express) {
  app.use('/auth', authRoutes);
  app.use(validateAccessToken);
  app.use('/users', userRoutes);

  useErrorHandler(app);
}
