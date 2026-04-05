const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name:         { type: String },
  email:        { type: String },
  phone:        { type: String, sparse: true },
  role:         { type: String, enum: ['worker', 'customer'] },
  skill:        { type: String },
  photo:        { type: String },
  city:         { type: String, default: '' },
  otp:          { type: String },
  otpExpires:   { type: Date },
  expoPushToken: { type: String },
  location: {
    type:        { type: String, default: 'Point' },
    coordinates: [Number]
  },
  rating:       { type: Number, default: 0 },
  totalRatings: { type: Number, default: 0 },
  isAvailable:  { type: Boolean, default: true },
  isSuspended:  { type: Boolean, default: false },
}, { timestamps: true });

UserSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('User', UserSchema);