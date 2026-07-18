// src/models/visit.model.js
import pool from '../config/db.js';

export const VisitModel = {
  /**
   * Log a new entry (Check-In)
   */
  createEntry: async (membershipNo, purposeId, remarks = null) => {
    const query = `
      INSERT INTO footfall_logs (membership_no, purpose_id, visit_date, entry_time, remarks)
      VALUES (?, ?, CURDATE(), CURTIME(), ?)
    `;
    const [result] = await pool.execute(query, [membershipNo, purposeId, remarks]);
    return result.insertId;
  },

  /**
   * Check if a user is currently checked in (has an entry but no exit_time today)
   */
  findActiveVisit: async (membershipNo) => {
    const query = `
      SELECT log_id FROM footfall_logs 
      WHERE membership_no = ? AND visit_date = CURDATE() AND exit_time IS NULL
      ORDER BY log_id DESC LIMIT 1
    `;
    const [rows] = await pool.execute(query, [membershipNo]);
    return rows[0] || null;
  },

  /**
   * Update exit time (Check-Out)
   */
  updateExit: async (logId) => {
    const query = `
      UPDATE footfall_logs 
      SET exit_time = CURTIME() 
      WHERE log_id = ?
    `;
    const [result] = await pool.execute(query, [logId]);
    return result.affectedRows > 0;
  }
};