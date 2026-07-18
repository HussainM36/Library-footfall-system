// src/services/auth.service.js
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { AdminModel } from '../models/admin.model.js';

export const AuthService = {
  /**
   * Authenticate admin/librarian and return a JWT token
   */
  login: async (username, password) => {
    // 1. Fetch admin record by username
    const admin = await AdminModel.findByUsername(username);
    if (!admin) {
      const error = new Error('Invalid username or password.');
      error.statusCode = 401;
      throw error;
    }

    // 2. Verify password with bcrypt
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      const error = new Error('Invalid username or password.');
      error.statusCode = 401;
      throw error;
    }

    // 3. Generate JWT Token using admin_id
    const payload = {
      id: admin.admin_id,
      username: admin.username,
      role: 'Admin' // Adjust if you add a role column later, otherwise defaults to Admin
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '1d'
    });

    // Remove password hash from response data
    const { password: _, ...adminData } = admin;

    return { admin: adminData, token };
  }
};