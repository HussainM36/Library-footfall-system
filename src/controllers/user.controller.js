// src/controllers/user.controller.js
import { ExcelImportService } from '../services/excelImport.service.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { HTTP_STATUS } from '../constants/index.js';
import db from '../config/db.js'; 

/**
 * Fetch all user records from the library database
 * GET /api/users
 */
export const getAllUsers = async (req, res, next) => {
  try {
    let users = [];
    if (db.models && db.models.User) {
      users = await db.models.User.findAll({ order: [['created_at', 'DESC']] });
    } else {
      const [rows] = await db.query('SELECT * FROM users ORDER BY created_at DESC');
      users = rows;
    }
    return sendSuccess(res, 'All database user accounts synchronized successfully.', users, HTTP_STATUS.OK);
  } catch (error) {
    console.error('Database query operation failure within user controller:', error);
    next(error);
  }
};

/**
 * Create a new user entry manually
 * POST /api/users
 */
export const createUser = async (req, res, next) => {
  try {
    const { membership_no, batch, full_name, department, designation, status, email, mobile } = req.body;

    if (!membership_no || !full_name) {
      return sendError(res, 'Membership ID and Full Name fields are mandatory.', null, HTTP_STATUS.BAD_REQUEST);
    }

    const queryStr = `
      INSERT INTO users (membership_no, batch, full_name, department, designation, status, email, mobile, created_at, updated_at) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `;
    
    await db.query(queryStr, [membership_no, batch || 'N/A', full_name, department, designation, status || 'Active', email || null, mobile || null]);

    return sendSuccess(res, 'User record registered into database successfully.', { membership_no }, HTTP_STATUS.CREATED);
  } catch (error) {
    console.error('Failed to insert user record:', error);
    next(error);
  }
};

/**
 * Update an existing user entry details
 * PUT /api/users/:membership_no
 */
export const updateUser = async (req, res, next) => {
  try {
    const { membership_no } = req.params;
    const { batch, full_name, department, designation, status, email, mobile } = req.body;

    const queryStr = `
      UPDATE users 
      SET batch = ?, full_name = ?, department = ?, designation = ?, status = ?, email = ?, mobile = ?, updated_at = NOW() 
      WHERE membership_no = ?
    `;

    const [result] = await db.query(queryStr, [batch || 'N/A', full_name, department, designation, status || 'Active', email || null, mobile || null, membership_no]);

    if (result.affectedRows === 0) {
      return sendError(res, 'No matching member profile located to modify.', null, HTTP_STATUS.NOT_FOUND);
    }

    return sendSuccess(res, 'User profile records modified successfully.', { membership_no }, HTTP_STATUS.OK);
  } catch (error) {
    console.error('Failed to modify database user records:', error);
    next(error);
  }
};

/**
 * Permanently purge a member from database registry
 * DELETE /api/users/:membership_no
 */
export const deleteUser = async (req, res, next) => {
  try {
    const { membership_no } = req.params;

    const [result] = await db.query('DELETE FROM users WHERE membership_no = ?', [membership_no]);

    if (result.affectedRows === 0) {
      return sendError(res, 'No user matching that membership ID found.', null, HTTP_STATUS.NOT_FOUND);
    }

    return sendSuccess(res, 'User record deleted from database execution successfully.', null, HTTP_STATUS.OK);
  } catch (error) {
    console.error('Failed to purge user entry from system table:', error);
    next(error);
  }
};

/**
 * Handle bulk uploading via Excel sheets
 * POST /api/users/import
 */
export const bulkImportUsers = async (req, res, next) => {
  try {
    if (!req.file) {
      return sendError(res, 'Please upload an Excel file.', null, HTTP_STATUS.BAD_REQUEST);
    }
    const result = await ExcelImportService.importUsers(req.file.path);
    return sendSuccess(res, 'Excel batch data import completed processing successfully.', result, HTTP_STATUS.OK);
  } catch (error) {
    next(error);
  }
};