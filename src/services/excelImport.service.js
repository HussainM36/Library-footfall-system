// src/services/excelImport.service.js
import xlsx from 'xlsx';
import fs from 'fs';
import pool from '../config/db.js';

export const ExcelImportService = {
  /**
   * Parse uploaded excel sheet and import records into users table
   */
  importUsers: async (filePath) => {
    // 1. Read workbook file contents
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0]; // Targeted first worksheet sheet
    const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    if (sheetData.length === 0) {
      throw new Error('The uploaded Excel file appears to be empty.');
    }

    // 2. Map Excel headers structurally to match your exact user database schema columns
    const usersToInsert = sheetData.map(row => [
      row['Batch'] || row['batch'] || null,
      row['Membership No'] || row['membership_no'] || row['Membership_No'],
      row['Full Name'] || row['full_name'] || row['Full_Name'] || null,
      row['Department'] || row['department'] || null,
      row['Designation'] || row['designation'] || 'Student', // Defaults to Student if omitted
      row['Photo Path'] || row['photo_path'] || null,
      row['Email'] || row['email'] || null,
      row['Mobile'] || row['mobile'] || null,
      row['Status'] || row['status'] || 'active' // Auto defaults status to active
    ]);

    // Validate that membership number exists for rows
    const validUsers = usersToInsert.filter(user => user[1] !== undefined && user[1] !== null);

    if (validUsers.length === 0) {
      throw new Error('No valid records found. Ensure rows contain a structural column for "Membership No".');
    }

    // 3. Construct Bulk Insertion SQL query
    // Using INSERT IGNORE to prevent server crashes if duplicate membership numbers are uploaded
    const query = `
      INSERT IGNORE INTO users 
      (batch, membership_no, full_name, department, designation, photo_path, email, mobile, status) 
      VALUES ?
    `;

    let connection;
    try {
      connection = await pool.getConnection();
      const [result] = await connection.query(query, [validUsers]);
      
      return {
        totalRowsProcessed: sheetData.length,
        successfullyImported: result.affectedRows,
        skippedDuplicates: sheetData.length - result.affectedRows
      };
    } finally {
      if (connection) connection.release();
      // 4. Safely clean up file storage system regardless of operation outcome status
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
  }
};