// models/Notification.js
import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
  type: { type: String, required: true }, // e.g., 'review', 'order'
  message: { type: String, required: true },
  link: { type: String }, // optional: e.g., link to the review page
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Notification || mongoose.model("Notification", NotificationSchema);
