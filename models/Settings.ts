// import mongoose from 'mongoose';

// const SettingsSchema = new mongoose.Schema({
//   logoUrl: { type: String, required: false },
//   siteTitle: String,
//   siteDescription: String,
//   supportEmail: String,
//   footerDescription: String,
//   footerPhone: String,
//   footerEmail: String,
//   footerName: String,
  
// });

// export default mongoose.models.Settings || mongoose.model('Settings', SettingsSchema);






















// models/Settings.ts
import { ISettings } from "@/lib/Settings";
import mongoose, { Schema, Model, models } from "mongoose";
// import { ISettings } from "@/types/Settings";

const SettingsSchema = new Schema<ISettings>({
  logoUrl: String,
  siteTitle: String,
  siteDescription: String,
  supportEmail: String,
  footerDescription: String,
  footerPhone: String,
  footerEmail: String,
  footerName: String,
});

const Settings: Model<ISettings> = models.Settings || mongoose.model<ISettings>("Settings", SettingsSchema);

export default Settings;
