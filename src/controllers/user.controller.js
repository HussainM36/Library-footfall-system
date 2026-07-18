// src/controllers/user.controller.js
import { ExcelImportService } from '../services/excelImport.service.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { HTTP_STATUS } from '../constants/index.js';

export const bulkImportUsers = async (req, res, next) => {
  try {
    if (!req.file) {
      return sendError(res, 'Please upload an Excel file.', null, HTTP_STATUS.BAD_REQUEST);
    }

    const result = await ExcelImportService.importUsers(req.file.path);
    
    return sendSuccess(
      res, 
      'Excel batch data import completed processing successfully.', 
      result, 
      HTTP_STATUS.OK
    );
  } catch (error) {
    next(error);
  }
};