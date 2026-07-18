// src/routes/visit.routes.js
import { Router } from 'express';
import { logCheckIn, logCheckOut } from '../controllers/visit.controller.js';
import { validateCheckIn, validateCheckOut } from '../validators/visit.validator.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router();

// Protect all visitor logging endpoints
router.use(protect);

router.post('/check-in', validateCheckIn, logCheckIn);
router.post('/check-out', validateCheckOut, logCheckOut);

export default router;