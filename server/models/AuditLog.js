import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true
  },
  email: String,
  action: {
    type: String,
    required: true,
    enum: [
      'LOGIN_SUCCESS',
      'LOGIN_FAILED',
      'LOGOUT',
      'REGISTER',
      'PASSWORD_RESET_REQUEST',
      'PASSWORD_RESET_SUCCESS',
      'PASSWORD_CHANGE',
      'EMAIL_VERIFICATION',
      '2FA_ENABLED',
      '2FA_DISABLED',
      '2FA_VERIFIED',
      'ACCOUNT_LOCKED',
      'PREFERENCES_UPDATED',
      'API_REQUEST',
      'UNAUTHORIZED_ACCESS',
      'SECURITY_EVENT'
    ]
  },
  ipAddress: String,
  userAgent: String,
  metadata: mongoose.Schema.Types.Mixed,
  severity: {
    type: String,
    enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
    default: 'LOW'
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  }
});

// Index for efficient queries
auditLogSchema.index({ userId: 1, timestamp: -1 });
auditLogSchema.index({ action: 1, timestamp: -1 });

export default mongoose.model('AuditLog', auditLogSchema);
