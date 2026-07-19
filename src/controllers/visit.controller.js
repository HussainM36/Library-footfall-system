// src/controllers/visit.controller.js
import { VisitService } from '../services/visit.service.js';
import { sendSuccess } from '../utils/response.js';
import { HTTP_STATUS } from '../constants/index.js';
import db from '../config/db.js'; // Imported to secure a reliable name fetch fallback

export const logCheckIn = async (req, res, next) => {
  try {
    const { membership_no, purpose_id, remarks } = req.body;
    const result = await VisitService.checkIn(membership_no, purpose_id, remarks);
    
    return sendSuccess(res, `Check-in successful! Welcome, ${result.user.full_name}.`, result, HTTP_STATUS.CREATED);
  } catch (error) {
    next(error);
  }
};

export const logCheckOut = async (req, res, next) => {
  try {
    const { membership_no } = req.body;
    
    // 1. Core check-out service layer action execution
    const result = await VisitService.checkOut(membership_no);
    
    // 2. Extract user metadata safely from the result payload
    let studentProfile = result?.user || (result?.full_name ? result : null);
    
    // 3. Robust Name Fallback: If service layer did not return user details, query the DB directly
    if (!studentProfile || !studentProfile.full_name) {
      const [rows] = await db.query(
        'SELECT membership_no, full_name, department, designation, batch FROM users WHERE membership_no = ?',
        [membership_no]
      );
      
      if (rows && rows.length > 0) {
        studentProfile = rows[0];
      } else {
        // Ultimate baseline fallback structure so frontend parsing doesn't break
        studentProfile = { membership_no, full_name: 'Registered Student' };
      }
    }
    
    return sendSuccess(
      res, 
      `Check-out recorded successfully! Goodbye, ${studentProfile.full_name}.`, 
      { user: studentProfile }, 
      HTTP_STATUS.OK
    );
  } catch (error) {
    next(error);
  }
};