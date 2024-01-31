import type { Express } from 'express';

import { validateAccessToken } from '@/auth/auth.controllers.js';
import authRoutes from '@/auth/auth.routes.js';
import userRoutes from '@/user/user.routes.js';

export default function (app: Express) {
  app.use('/auth', authRoutes);
  app.use(validateAccessToken);
  app.use('/user', userRoutes);

  //   useErrorHandler(app);
}
