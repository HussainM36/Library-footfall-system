// src/routes/user.routes.js
import { Router } from 'express';
import { bulkImportUsers } from '../controllers/user.controller.js';
import { uploadExcel } from '../middleware/upload.middleware.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router();

// Protect user upload capability behind library session validation
router.post('/import', protect, uploadExcel.single('excelFile'), bulkImportUsers);

export default router;