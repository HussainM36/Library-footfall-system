// src/models/user.model.js
import pool from '../config/db.js';

export const UserModel = {
  /**
   * Find a user by their membership number
   * @param {string} membershipNo
   */
  findByMembershipNo: async (membershipNo) => {
    const query = `
      SELECT batch, membership_no, full_name, department, designation, photo_path, email, mobile, status 
      FROM users 
      WHERE membership_no = ? LIMIT 1
    `;
    const [rows] = await pool.execute(query, [membershipNo]);
    return rows[0] || null;
  }
};