import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { 
  listBackups, 
  createBackup, 
  downloadBackup, 
  restoreBackup 
} from '../controllers/backupController.js';

// Re-create __filename and __dirname for Node ES module scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Multer storage configuration for temporary .sql upload processing
const upload = multer({
  dest: path.join(__dirname, '../../temp_uploads/'),
  fileFilter: (req, file, cb) => {
    if (file.originalname && file.originalname.endsWith('.sql')) {
      cb(null, true);
    } else {
      cb(new Error('Only .sql files are allowed!'), false);
    }
  }
});

// GET: Fetch list of all existing .sql backup snapshot files
router.get('/', listBackups);

// POST: Trigger new database snapshot generation
router.post('/create', createBackup);
router.post('/backup', createBackup); // Alias route to handle POST /api/system/backup requests

// GET: Direct stream download of a specific .sql backup file
router.get('/download/:filename', downloadBackup);

// POST: Restore database from existing backup filename or uploaded .sql file
router.post('/restore', upload.single('backupFile'), restoreBackup);

export default router;