// src/controllers/analytics.controller.js
import { AnalyticsModel } from '../models/analytics.model.js';

export const getDashboardSummary = async (req, res) => {
  try {
    // Disable HTTP Caching explicitly so browser always gets fresh live counts
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    const { dateRange, startDate, endDate, role, department } = req.query;
    const filterParams = { dateRange, startDate, endDate };

    // Fetch summaries & analytics concurrently passing user filter parameters
    const [summary, hourlyTraffic, purposeDistribution, visitLogs] = await Promise.all([
      AnalyticsModel.getTodaySummary(filterParams),
      AnalyticsModel.getHourlyTraffic(filterParams),
      AnalyticsModel.getPurposeDistribution(filterParams),
      AnalyticsModel.getFilteredLogs({ dateRange, startDate, endDate, role, department })
    ]);

    // Assign consistent colors for pie chart rendering
    const colors = ['#0052cc', '#00b8d9', '#36b37e', '#ffab00', '#6554c0'];
    const formattedPurposeData = (purposeDistribution || []).map((item, index) => ({
      ...item,
      color: colors[index % colors.length]
    }));

    res.status(200).json({
      success: true,
      data: {
        ...summary,
        hourlyTraffic: hourlyTraffic || [],
        purposeDistribution: formattedPurposeData,
        visitLogs: visitLogs || []
      }
    });
  } catch (error) {
    console.error("Dashboard Analytics Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve live database metrics."
    });
  }
};