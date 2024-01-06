import express from 'express';
import { getAllUsers } from './user.controllers.js';

const router = express.Router();

router.get('/users', getAllUsers);

export default router;
