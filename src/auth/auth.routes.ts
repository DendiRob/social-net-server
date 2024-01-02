import express from 'express';
// import { login, refresh, registration, logout } from './auth.controllers.js';
import { registration } from './auth.controllers.js';
// import { validateRefreshToken } from '@/helpers/jwtToken.js';
// import { registerGuard } from '@/modules/guards.js';

const router = express.Router();

// router.post('/login', login);
router.post('/registration', registration);
// router.post('/logout', logout);
// router.post('/refresh', refresh);

export default router;
