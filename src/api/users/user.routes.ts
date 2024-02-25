import express from 'express';
import { getViewer } from './user.controllers.js';

const router = express.Router();

router.get('/viewer', getViewer);

export default router;
