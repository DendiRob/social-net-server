import express from 'express';
import { getProfile, getProfileAvatar } from './userProfiles.controllers.js';

const router = express.Router();

router.get('/get-profile', getProfile);
router.get('/get-profile-avatar/:fileId', getProfileAvatar);

export default router;
