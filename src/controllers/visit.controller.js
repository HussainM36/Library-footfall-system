// src/controllers/visit.controller.js
import { VisitService } from '../services/visit.service.js';
import { sendSuccess } from '../utils/response.js';
import { HTTP_STATUS } from '../constants/index.js';

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
    await VisitService.checkOut(membership_no);
    
    return sendSuccess(res, 'Check-out recorded successfully.', null, HTTP_STATUS.OK);
  } catch (error) {
    next(error);
  }
};