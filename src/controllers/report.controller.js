// src/controllers/report.controller.js
import { ReportService } from '../services/report.service.js';
import { ReportModel } from '../models/report.model.js';
import { sendSuccess } from '../utils/response.js';
import { HTTP_STATUS } from '../constants/index.js';

export const getDashboardOverviewData = async (req, res, next) => {
  try {
    const analytics = await ReportService.getDashboardOverview();
    return sendSuccess(res, 'Dashboard metrics compiled successfully.', analytics, HTTP_STATUS.OK);
  } catch (error) {
    next(error);
  }
};

export const filterVisitorLogs = async (req, res, next) => {
  try {
    const { membership_no, name, date } = req.query;
    const logs = await ReportModel.searchLogs({ membership_no, name, date });
    return sendSuccess(res, 'Filtered search logs compiled.', logs, HTTP_STATUS.OK);
  } catch (error) {
    next(error);
  }
};

export const fetchMasterReport = async (req, res, next) => {
  try {
    const { timeframe, startDate, endDate, groupBy } = req.query;
    const reportData = await ReportService.getProcessedReport({ timeframe, startDate, endDate, groupBy });
    return sendSuccess(res, 'Analytical master records generated.', reportData, HTTP_STATUS.OK);
  } catch (error) {
    next(error);
  }
};