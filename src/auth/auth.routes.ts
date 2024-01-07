import express from 'express';
// import { login, refresh, registration, logout } from './auth.controllers.js';
import { registration, login, logout } from './auth.controllers.js';
import { loginGuard, registerGuard, logoutGuard } from './auth.guard.js';
// import { validateRefreshToken } from '@/helpers/jwtToken.js';
// import { registerGuard } from '@/modules/guards.js';

const router = express.Router();

router.post('/login', loginGuard, login);
router.post('/registration', registerGuard, registration);
router.post('/logout', logoutGuard, logout);
// router.post('/refresh', refresh);

export default router;
