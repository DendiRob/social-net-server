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
router.post('/logout', logoutGuard, logout);
router.post('/refresh', refreshGuard, refresh);

export default router;
