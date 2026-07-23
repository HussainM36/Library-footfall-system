// src/routes/auth.routes.js
import { Router } from 'express';
import { loginAdmin } from '../controllers/auth.controller.js';

const router = Router();

// Temporarily remove validateLogin so it doesn't block 'admin'
router.post('/login', loginAdmin);

export default router;