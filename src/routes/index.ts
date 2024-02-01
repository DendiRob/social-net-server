import type { Express } from 'express';

import { validateAccessToken } from '@/auth/auth.controllers.js';
import authRoutes from '@/auth/auth.routes.js';
import userRoutes from '@/users/user.routes.js';

export default function (app: Express) {
  app.use('/auth', authRoutes);
  app.use(validateAccessToken);
  app.use('/users', userRoutes);

  //   useErrorHandler(app);
}
