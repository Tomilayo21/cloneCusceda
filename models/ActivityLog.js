import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema({
  action: String,
  detail: String,
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.models.ActivityLog || mongoose.model('ActivityLog', activityLogSchema);
