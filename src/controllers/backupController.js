import path from 'path';
import fs from 'fs';
import { exec } from 'child_process';
import { fileURLToPath } from 'url';

// Define __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure backups directory exists
const backupDir = path.join(__dirname, '../../backups');
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

// Helper to construct password argument matching .env key (DB_PASSWORD)
const getPasswordFlag = () => {
  // Read DB_PASSWORD (matches your .env file)
  const pass = process.env.DB_PASSWORD || process.env.DB_PASS;
  if (!pass || pass === 'undefined' || pass === 'null') {
    return '';
  }
  // Wrap password in double quotes to handle special characters like @, #, $, !
  return `--password="${pass}"`;
};

// Helper to resolve absolute binary paths for mysqldump and mysql on Windows
const resolveMySqlExecutable = (exeName) => {
  if (process.platform !== 'win32') return exeName;

  const possiblePaths = [
    process.env.MYSQL_BIN_PATH ? path.join(process.env.MYSQL_BIN_PATH.replace(/"/g, ''), exeName) : null,
    `C:\\Program Files\\MySQL\\MySQL Server 8.0\\bin\\${exeName}`,
    `C:\\Program Files\\MySQL\\MySQL Server 8.4\\bin\\${exeName}`,
    `C:\\xampp\\mysql\\bin\\${exeName}`
  ].filter(Boolean);

  for (const exePath of possiblePaths) {
    if (fs.existsSync(exePath)) {
      return `"${exePath}"`;
    }
  }

  return exeName;
};

/**
 * GET /api/backups
 */
export const listBackups = (req, res) => {
  try {
    const files = fs.readdirSync(backupDir)
      .filter(file => file.endsWith('.sql'))
      .map(file => {
        const filePath = path.join(backupDir, file);
        const stats = fs.statSync(filePath);
        return {
          filename: file,
          size: (stats.size / (1024 * 1024)).toFixed(2) + ' MB',
          createdAt: stats.birthtime
        };
      })
      .sort((a, b) => b.createdAt - a.createdAt);

    res.json({ success: true, backups: files });
  } catch (error) {
    console.error("Error listing backups:", error);
    res.status(500).json({ success: false, message: "Failed to fetch backup files." });
  }
};

/**
 * POST /api/backups/create
 */
export const createBackup = (req, res) => {
  const DB_HOST = process.env.DB_HOST || 'localhost';
  const DB_USER = process.env.DB_USER || 'root';
  const DB_NAME = process.env.DB_NAME || 'librarystudent';
  const passFlag = getPasswordFlag();

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `lms_backup_${timestamp}.sql`;
  const filePath = path.join(backupDir, filename);

  const mysqldumpExe = resolveMySqlExecutable('mysqldump.exe');
  
  // Construct command with space separation
  const dumpCmd = `${mysqldumpExe} -h ${DB_HOST} -u ${DB_USER} ${passFlag} ${DB_NAME} > "${filePath}"`;

  exec(dumpCmd, (error, stdout, stderr) => {
    if (error) {
      console.error("mysqldump error:", stderr || error.message);

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      return res.status(500).json({ 
        success: false, 
        message: stderr || "Failed to generate database dump." 
      });
    }

    res.json({ 
      success: true, 
      message: "Database snapshot created successfully!",
      filename 
    });
  });
};

/**
 * GET /api/backups/download/:filename
 */
export const downloadBackup = (req, res) => {
  const filename = req.params.filename;
  const safeFilename = path.basename(filename);
  const filePath = path.join(backupDir, safeFilename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ success: false, message: "Backup file not found." });
  }

  res.download(filePath, safeFilename, (err) => {
    if (err) {
      console.error("File download error:", err);
      if (!res.headersSent) {
        res.status(500).json({ success: false, message: "Could not download file." });
      }
    }
  });
};

/**
 * POST /api/backups/restore
 */
export const restoreBackup = (req, res) => {
  const DB_HOST = process.env.DB_HOST || 'localhost';
  const DB_USER = process.env.DB_USER || 'root';
  const DB_NAME = process.env.DB_NAME || 'librarystudent';
  const passFlag = getPasswordFlag();

  let filePath;

  if (req.file) {
    filePath = req.file.path;
  } else if (req.body.filename) {
    const safeFilename = path.basename(req.body.filename);
    filePath = path.join(backupDir, safeFilename);
  } else {
    return res.status(400).json({ success: false, message: "No backup file provided for restore." });
  }

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ success: false, message: "Selected backup file does not exist." });
  }

  const mysqlExe = resolveMySqlExecutable('mysql.exe');
  const restoreCmd = `${mysqlExe} -h ${DB_HOST} -u ${DB_USER} ${passFlag} ${DB_NAME} < "${filePath}"`;

  exec(restoreCmd, (error, stdout, stderr) => {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    if (error) {
      console.error("mysql restore error:", stderr || error.message);
      return res.status(500).json({ 
        success: false, 
        message: "Database restoration failed. Check database credentials or SQL syntax." 
      });
    }

    res.json({ success: true, message: "Database restored successfully!" });
  });
};