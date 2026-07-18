// src/middleware/upload.middleware.js
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Define the target storage directory path
const uploadDir = path.join('src', 'uploads', 'excel');

// Define where to store file and under what name
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Automatically create the directory recursively if it doesn't exist locally
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

// Filter out non-spreadsheet files
const fileFilter = (req, file, cb) => {
  const allowedExtensions = ['.xlsx', '.xls'];
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only Excel files (.xlsx, .xls) are allowed.'), false);
  }
};

export const uploadExcel = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});