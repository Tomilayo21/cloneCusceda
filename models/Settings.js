import mongoose from 'mongoose';

const SettingsSchema = new mongoose.Schema({
  logoUrl: { type: String, required: false },
  siteTitle: String,
  siteDescription: String,
  supportEmail: String,
  footerDescription: String,
  footerPhone: String,
  footerEmail: String,
  footerName: String,
  
});

export default mongoose.models.Settings || mongoose.model('Settings', SettingsSchema);
