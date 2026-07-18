// src/models/admin.model.js
import pool from '../config/db.js';

export const AdminModel = {
  /**
   * Find an admin or librarian by their username
   * @param {string} username 
   */
  findByUsername: async (username) => {
    const query = 'SELECT * FROM admin_credentials WHERE username = ? LIMIT 1';
    const [rows] = await pool.execute(query, [username]);
    return rows[0] || null;
  },

  /**
   * Find an admin or librarian by their admin_id
   * @param {number} adminId 
   */
  findById: async (adminId) => {
    const query = 'SELECT admin_id, username FROM admin_credentials WHERE admin_id = ? LIMIT 1';
    const [rows] = await pool.execute(query, [adminId]);
    return rows[0] || null;
  }
};