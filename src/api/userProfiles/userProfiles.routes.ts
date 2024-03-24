import express from 'express';
import { getProfile } from './userProfiles.controllers.js';

const router = express.Router();

router.get('/get-profile', getProfile);

export default router;
