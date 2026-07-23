// src/routes/analytics.routes.js
import { Router } from 'express';
import { getDashboardSummary } from '../controllers/analytics.controller.js';

const router = Router();

router.get('/dashboard-summary', getDashboardSummary);

export default router;