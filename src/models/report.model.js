// src/models/report.model.js
import pool from '../config/db.js';

export const ReportModel = {
  /**
   * 1. High-Level Dashboard Statistics (with Segmented Visitor Counts)
   */
  getDashboardStats: async () => {
    const query = `
      SELECT 
        COUNT(*) as total_today,
        SUM(CASE WHEN LOWER(u.designation) = 'student' THEN 1 ELSE 0 END) as students_today,
        SUM(CASE WHEN LOWER(u.designation) != 'student' THEN 1 ELSE 0 END) as faculty_staff_today,
        SUM(CASE WHEN f.exit_time IS NULL THEN 1 ELSE 0 END) as currently_inside
      FROM footfall_logs f
      JOIN users u ON f.membership_no = u.membership_no
      WHERE f.visit_date = CURDATE()
    `;
    const [rows] = await pool.execute(query);
    return rows[0] || { total_today: 0, students_today: 0, faculty_staff_today: 0, currently_inside: 0 };
  },

  /**
   * 2. Search / Filter Logs with Wildcards (Membership No, Name, Date)
   */
  searchLogs: async ({ membership_no, name, date }) => {
    // Changed "JOIN purpose p" to "JOIN visit_purpose p"
    // Note: If you get a column error, change p.purpose_name to p.purpose
    let query = `
      SELECT f.log_id, f.membership_no, u.full_name, u.department, u.designation, 
             f.visit_date, f.entry_time, f.exit_time, f.remarks, p.purpose_name
      FROM footfall_logs f
      JOIN users u ON f.membership_no = u.membership_no
      JOIN visit_purpose p ON f.purpose_id = p.purpose_id
      WHERE 1=1
    `;
    const params = [];

    if (membership_no) {
      query += ` AND f.membership_no = ?`;
      params.push(membership_no);
    }
    if (name) {
      query += ` AND u.full_name LIKE ?`;
      params.push(`%${name}%`);
    }
    if (date) {
      query += ` AND f.visit_date = ?`;
      params.push(date);
    }

    query += ` ORDER BY f.log_id DESC LIMIT 100`;
    const [rows] = await pool.execute(query, params);
    return rows;
  },

  /**
   * 3. Most Common Purpose Ranking
   */
  getPurposeRanking: async () => {
    // Changed "FROM purpose p" to "FROM visit_purpose p"
    const query = `
      SELECT p.purpose_name, COUNT(f.log_id) as total_visits
      FROM visit_purpose p
      LEFT JOIN footfall_logs f ON p.purpose_id = f.purpose_id
      GROUP BY p.purpose_id, p.purpose_name
      ORDER BY total_visits DESC
    `;
    const [rows] = await pool.execute(query);
    return rows;
  },

  /**
   * 4. Library Peak Hours (Hourly Distribution)
   */
  getPeakHours: async () => {
    const query = `
      SELECT HOUR(entry_time) as hour_of_day, COUNT(*) as visitor_count
      FROM footfall_logs
      WHERE visit_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
      GROUP BY HOUR(entry_time)
      ORDER BY hour_of_day ASC
    `;
    const [rows] = await pool.execute(query);
    return rows;
  },

  /**
   * 5. Master Report Ingestion Engine (Handles Date Ranges & Grouping Types)
   */
  generateMasterReport: async ({ startDate, endDate, groupBy }) => {
    let selectFields = '';
    let groupByClause = '';
    let segmentCondition = '';

    switch (groupBy) {
      case 'dept':
        selectFields = 'u.department AS metric_label, COUNT(f.log_id) AS total_visits';
        groupByClause = 'u.department';
        break;
      case 'student':
        selectFields = 'f.membership_no, u.full_name AS metric_label, u.department, COUNT(f.log_id) AS total_visits';
        groupByClause = 'f.membership_no, u.full_name, u.department';
        segmentCondition = "AND LOWER(u.designation) = 'student'";
        break;
      case 'faculty':
        selectFields = 'f.membership_no, u.full_name AS metric_label, u.department, COUNT(f.log_id) AS total_visits';
        groupByClause = 'f.membership_no, u.full_name, u.department';
        segmentCondition = "AND LOWER(u.designation) != 'student'";
        break;
      case 'purpose':
        selectFields = 'p.purpose_name AS metric_label, COUNT(f.log_id) AS total_visits';
        groupByClause = 'p.purpose_name';
        break;
      default:
        throw new Error("Invalid grouping selection parameters.");
    }

    // Changed "JOIN purpose p" to "JOIN visit_purpose p"
    const query = `
      SELECT ${selectFields}
      FROM footfall_logs f
      JOIN users u ON f.membership_no = u.membership_no
      JOIN visit_purpose p ON f.purpose_id = p.purpose_id
      WHERE f.visit_date BETWEEN ? AND ? ${segmentCondition}
      GROUP BY ${groupByClause}
      ORDER BY total_visits DESC
    `;

    const [rows] = await pool.execute(query, [startDate, endDate]);
    return rows;
  }
};