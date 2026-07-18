// src/services/visit.service.js
import { UserModel } from '../models/user.model.js';
import { VisitModel } from '../models/visit.model.js';

export const VisitService = {
  /**
   * Core Check-In Logic
   */
  checkIn: async (membershipNo, purposeId, remarks) => {
    // 1. Verify user exists
    const user = await UserModel.findByMembershipNo(membershipNo);
    if (!user) {
      const error = new Error('No user found with this membership number.');
      error.statusCode = 404;
      throw error;
    }

    if (user.status === 'inactive') {
      const error = new Error('This user account is currently marked inactive.');
      error.statusCode = 400;
      throw error;
    }

    // 2. Prevent duplicate active check-ins
    const activeVisit = await VisitModel.findActiveVisit(membershipNo);
    if (activeVisit) {
      const error = new Error('User is already checked in and hasn\'t checked out yet.');
      error.statusCode = 400;
      throw error;
    }

    // 3. Log entry
    const logId = await VisitModel.createEntry(membershipNo, purposeId, remarks);
    return { logId, user };
  },

  /**
   * Core Check-Out Logic
   */
  checkOut: async (membershipNo) => {
    // 1. Find open visit log
    const activeVisit = await VisitModel.findActiveVisit(membershipNo);
    if (!activeVisit) {
      const error = new Error('No active check-in found for this user today.');
      error.statusCode = 404;
      throw error;
    }

    // 2. Set exit timestamp
    await VisitModel.updateExit(activeVisit.log_id);
    return { logId: activeVisit.log_id };
  }
};