// src/routes/user.routes.js
import { Router } from 'express';
import { 
  bulkImportUsers, 
  getAllUsers, 
  createUser, 
  updateUser, 
  deleteUser 
} from '../controllers/user.controller.js';
import { uploadExcel } from '../middleware/upload.middleware.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router();

// Base Database Operations
router.get('/', getAllUsers);
router.post('/', createUser);
router.put('/:membership_no', updateUser);
router.delete('/:membership_no', deleteUser);

// Batch Spreadsheet Upload
router.post('/import', protect, uploadExcel.single('excelFile'), bulkImportUsers);

export default router;