// src/routes/auth.routes.js
import { Router } from 'express';
import { loginAdmin } from '../controllers/auth.controller.js';
import { validateLogin } from '../validators/auth.validator.js';
import bcrypt from 'bcrypt';
import pool from '../config/db.js';

const router = Router();


// POST /api/auth/login
router.post('/login', validateLogin, loginAdmin);

export default router;