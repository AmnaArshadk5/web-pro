const AuditLog = require('../models/AuditLog');

const createAuditLog = async (actorId, action, targetType, targetId, details = {}, ipAddress = null) => {
  try {
    await AuditLog.create({
      actorId,
      action,
      targetType,
      targetId,
      details,
      ipAddress,
    });
  } catch (error) {
    console.error('Failed to create audit log:', error);
  }
};

module.exports = { createAuditLog };
