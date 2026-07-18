// src/services/report.service.js
import { ReportModel } from '../models/report.model.js';

export const ReportService = {
  /**
   * Compile completely packed system dashboard metadata
   */
  getDashboardOverview: async () => {
    const [stats, purposeRank, peakHoursRaw] = await Promise.all([
      ReportModel.getDashboardStats(),
      ReportModel.getPurposeRanking(),
      ReportModel.getPeakHours()
    ]);

    // Format metrics explicitly mapped out for frontend charts visualization
    const chartsData = {
      // Perfect for a Pie Chart / Donut Chart
      visitorSegmentationPie: [
        { name: 'Students', value: Number(stats.students_today) || 0 },
        { name: 'Faculty & Staff', value: Number(stats.faculty_staff_today) || 0 }
      ],
      // Perfect for a Horizontal Bar Graph
      purposeRankingBar: purposeRank.slice(0, 5).map(item => ({
        purpose: item.purpose_name,
        visits: item.total_visits
      })),
      // Perfect for a Smooth Line Graph
      peakHoursLine: peakHoursRaw.map(item => ({
        hour: `${String(item.hour_of_day).padStart(2, '0')}:00`,
        visitors: item.visitor_count
      }))
    };

    return {
      counters: stats,
      visualizations: chartsData
    };
  },

  /**
   * Handle contextual date-range processing parameters
   */
  getProcessedReport: async ({ timeframe, startDate, endDate, groupBy }) => {
    let finalStartDate = startDate;
    let finalEndDate = endDate || new Date().toISOString().split('T')[0];

    // Auto-calculate structural intervals if shorthand strings are passed
    if (timeframe) {
      const today = new Date();
      if (timeframe === 'daily') {
        finalStartDate = today.toISOString().split('T')[0];
      } else if (timeframe === 'weekly') {
        const lastWeek = new Date(today.setDate(today.getDate() - 7));
        finalStartDate = lastWeek.toISOString().split('T')[0];
      } else if (timeframe === 'monthly') {
        const lastMonth = new Date(today.setMonth(today.getMonth() - 1));
        finalStartDate = lastMonth.toISOString().split('T')[0];
      }
    }

    if (!finalStartDate || !finalEndDate) {
      throw new Error('Please specify accurate temporal range parameters.');
    }

    return await ReportModel.generateMasterReport({
      startDate: finalStartDate,
      endDate: finalEndDate,
      groupBy
    });
  }
};