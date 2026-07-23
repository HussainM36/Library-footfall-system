// src/models/analytics.model.js
import pool from '../config/db.js';

/**
 * Helper to build SQL date filter clauses dynamically
 */
const buildDateWhereClause = (dateRange, startDate, endDate, tableAlias = 'f') => {
  let clause = `${tableAlias}.visit_date = CURDATE()`;
  let params = [];

  if (dateRange === 'weekly') {
    clause = `${tableAlias}.visit_date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)`;
  } else if (dateRange === 'monthly') {
    clause = `${tableAlias}.visit_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)`;
  } else if (dateRange === 'custom' && startDate && endDate) {
    clause = `${tableAlias}.visit_date BETWEEN ? AND ?`;
    params = [startDate, endDate];
  }

  return { clause, params };
};

export const AnalyticsModel = {
  /**
   * Fetch summary metrics (Totals, Student vs Faculty, Peak Hour, Top Purpose)
   */
  getTodaySummary: async ({ dateRange, startDate, endDate } = {}) => {
    const { clause: dateClause, params: dateParams } = buildDateWhereClause(dateRange, startDate, endDate, 'f');

    // 1. Total visitors & Role breakdown
    const summaryQuery = `
      SELECT 
        COUNT(f.log_id) AS totalToday,
        SUM(
          CASE 
            WHEN LOWER(u.designation) LIKE '%student%' OR LOWER(u.designation) LIKE '%sudent%' 
            THEN 1 ELSE 0 
          END
        ) AS studentsToday,
        SUM(
          CASE 
            WHEN LOWER(u.designation) NOT LIKE '%student%' AND LOWER(u.designation) NOT LIKE '%sudent%' 
            THEN 1 
            WHEN u.designation IS NULL 
            THEN 1 
            ELSE 0 
          END
        ) AS facultyToday
      FROM footfall_logs f
      LEFT JOIN users u ON f.membership_no = u.membership_no
      WHERE ${dateClause}
    `;

    // 2. Peak Hour calculation (Strict ONLY_FULL_GROUP_BY compliant)
    const peakHourQuery = `
      SELECT 
        DATE_FORMAT(entry_time, '%h:00 %p') AS peak_hour_start,
        COUNT(*) AS total_entries
      FROM footfall_logs f
      WHERE ${dateClause}
      GROUP BY DATE_FORMAT(entry_time, '%h:00 %p')
      ORDER BY total_entries DESC
      LIMIT 1
    `;

    // 3. Top Visit Purpose calculation
    const topPurposeQuery = `
      SELECT 
        COALESCE(p.purpose_name, 'General Visit') AS purpose_name,
        COUNT(*) AS purpose_count
      FROM footfall_logs f
      LEFT JOIN visit_purpose p ON f.purpose_id = p.purpose_id
      WHERE ${dateClause}
      GROUP BY COALESCE(p.purpose_name, 'General Visit')
      ORDER BY purpose_count DESC
      LIMIT 1
    `;

    const [[summary]] = await pool.execute(summaryQuery, dateParams);
    const [[peakHour]] = await pool.execute(peakHourQuery, dateParams);
    const [[topPurpose]] = await pool.execute(topPurposeQuery, dateParams);

    return {
      totalToday: Number(summary?.totalToday) || 0,
      studentsToday: Number(summary?.studentsToday) || 0,
      facultyToday: Number(summary?.facultyToday) || 0,
      peakHour: peakHour ? `${peakHour.peak_hour_start}` : 'No entries found',
      topPurpose: topPurpose ? topPurpose.purpose_name : 'N/A'
    };
  },

  /**
   * Fetch hourly traffic count for Heatmap Chart
   */
  getHourlyTraffic: async ({ dateRange, startDate, endDate } = {}) => {
    const { clause: dateClause, params: dateParams } = buildDateWhereClause(dateRange, startDate, endDate, 'footfall_logs');

    const query = `
      SELECT 
        DATE_FORMAT(entry_time, '%h %p') AS time,
        COUNT(*) AS count
      FROM footfall_logs
      WHERE ${dateClause}
      GROUP BY HOUR(entry_time), DATE_FORMAT(entry_time, '%h %p')
      ORDER BY HOUR(entry_time) ASC
    `;
    const [rows] = await pool.execute(query, dateParams);
    return rows;
  },

  /**
   * Fetch Purpose Distribution for Pie Chart
   */
  getPurposeDistribution: async ({ dateRange, startDate, endDate } = {}) => {
    const { clause: dateClause, params: dateParams } = buildDateWhereClause(dateRange, startDate, endDate, 'f');

    const query = `
      SELECT 
        COALESCE(p.purpose_name, 'General Visit') AS name,
        COUNT(*) AS value
      FROM footfall_logs f
      LEFT JOIN visit_purpose p ON f.purpose_id = p.purpose_id
      WHERE ${dateClause}
      GROUP BY COALESCE(p.purpose_name, 'General Visit')
    `;
    const [rows] = await pool.execute(query, dateParams);
    return rows;
  },

  /**
   * Filtered Visit Logs for UI Table & Generating PDF/Excel Reports
   */
  getFilteredLogs: async ({ dateRange, startDate, endDate, role, department } = {}) => {
    let whereClauses = [];
    let queryParams = [];

    // Date Filtering
    if (dateRange === 'weekly') {
      whereClauses.push('f.visit_date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)');
    } else if (dateRange === 'monthly') {
      whereClauses.push('f.visit_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)');
    } else if (dateRange === 'custom' && startDate && endDate) {
      whereClauses.push('f.visit_date BETWEEN ? AND ?');
      queryParams.push(startDate, endDate);
    } else {
      // Default to today
      whereClauses.push('f.visit_date = CURDATE()');
    }

    // Role/Designation Filter
    if (role && role !== 'all') {
      if (role === 'student') {
        whereClauses.push("(LOWER(u.designation) LIKE '%student%' OR LOWER(u.designation) LIKE '%sudent%')");
      } else {
        whereClauses.push("(LOWER(u.designation) NOT LIKE '%student%' AND LOWER(u.designation) NOT LIKE '%sudent%' OR u.designation IS NULL)");
      }
    }

    // Department Filter
    if (department && department !== 'all') {
      whereClauses.push('LOWER(u.department) LIKE ?');
      queryParams.push(`%${department.toLowerCase()}%`);
    }

    const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

    const query = `
      SELECT 
        f.log_id AS id,
        COALESCE(u.full_name, 'Unknown User') AS userName,
        COALESCE(u.designation, 'N/A') AS userRole,
        COALESCE(u.department, 'N/A') AS department,
        COALESCE(p.purpose_name, 'General Visit') AS purpose,
        DATE_FORMAT(f.entry_time, '%h:%i %p') AS time,
        f.visit_date AS date
      FROM footfall_logs f
      LEFT JOIN users u ON f.membership_no = u.membership_no
      LEFT JOIN visit_purpose p ON f.purpose_id = p.purpose_id
      ${whereSql}
      ORDER BY f.log_id DESC
    `;

    const [rows] = await pool.execute(query, queryParams);
    return rows;
  }
};