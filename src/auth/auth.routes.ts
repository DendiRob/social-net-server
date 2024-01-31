import express from 'express';

import { registration, login, logout, refresh } from './auth.controllers.js';
import {
  loginGuard,
  registerGuard,
  logoutGuard,
  refreshGuard
} from './auth.guard.js';

const router = express.Router();

router.post('/login', loginGuard, login);
router.post('/registration', registerGuard, registration);
router.post('/refresh', refreshGuard, refresh);
router.post('/logout', logoutGuard, logout);

export default router;
