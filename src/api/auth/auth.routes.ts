import express from 'express';

import { registration, login, logout, refresh } from './auth.controllers.js';

const router = express.Router();

router.post('/login', login);
router.post('/registration', registration);
router.post('/refresh', refresh);
router.post('/logout', logout);

export default router;
