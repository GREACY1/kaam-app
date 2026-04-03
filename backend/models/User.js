const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name:         { type: String },
  email:        { type: String, unique: true, sparse: true },
 phone: { type: String, sparse: true },
  role:         { type: String, enum: ['worker','customer'] },
  skill:        { type: String },
  otp:        { type: String },
otpExpires: { type: Date },
  photo:        { type: String },
  fcmToken:     { type: String },
  rating:       { type: Number, default: 0 },
  totalRatings: { type: Number, default: 0 },
  isAvailable:  { type: Boolean, default: true },
  isSuspended:  { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);