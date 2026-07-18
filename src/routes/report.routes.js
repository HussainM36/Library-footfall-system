// src/routes/report.routes.js
import { Router } from 'express';
import { getDashboardOverviewData, filterVisitorLogs, fetchMasterReport } from '../controllers/report.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router();

// Protect metrics with session security validation middleware 
router.use(protect);

// 1. Dashboard core blocks and charts data route 
router.get('/overview', getDashboardOverviewData);

// 2. Real-time log searching / filter utility route
router.get('/search', filterVisitorLogs);

// 3. Document reporting metrics analytics processor (Daily, Weekly, Monthly, Custom)
router.get('/generate', fetchMasterReport);

export default router;