// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema(
//   {
//     _id: { type: String, required: true },
//     name: { type: String, required: true },
//     username: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     imageUrl: { type: String, required: true },
//     cartItems: { type: Object, default: {} },
//     welcomeSent: { type: Boolean, default: false }, 
//   },
//   {
//     minimize: false,
//   }
// );

// const User = mongoose.models.user || mongoose.model("user", userSchema);

// export default User;
























// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },            
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    imageUrl: { type: String, default: "" },
    cartItems: { type: Object, default: {} },
    welcomeSent: { type: Boolean, default: false },
    imagePublicId: { type: String, default: null },

    // NEW fields:
    passwordHash: { type: String },                   // hashed password (do not store plaintext)
    role: { type: String, enum: ["user", "admin", "seller"], default: "user" },
    // optional: emailVerified, reset tokens etc.
    emailVerified: { type: Boolean, default: false },
    resetToken: { type: String },
    resetTokenExpiry: { type: Date },
  },
  {
    timestamps: true, // adds createdAt, updatedAt
    minimize: false,
  }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
