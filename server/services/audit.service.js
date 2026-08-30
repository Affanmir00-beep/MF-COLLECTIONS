const AuditLog = require('../models/AuditLog');

const logAction = async ({ actor, action, entityType, entityId, before = null, after = null, ip = null }) => {
  try {
    await AuditLog.create({
      actor,
      action,
      entityType,
      entityId,
      before,
      after,
      ip
    });
  } catch (error) {
    console.error('Failed to write audit log:', error);
    // Never fail the main mutation if logging fails
  }
};

module.exports = {
  logAction
};
