const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  phone:    { type: String, required: true, unique: true },
  role:     { type: String, enum: ['worker','customer'] },
  skill:    { type: String },
  photo:    { type: String },
  location: {
    type:        { type: String, default: 'Point' },
    coordinates: [Number]
  },
  fcmToken:     { type: String },
  rating:       { type: Number, default: 0 },
  totalRatings: { type: Number, default: 0 },
  isAvailable:  { type: Boolean, default: true },
  isSuspended:  { type: Boolean, default: false },
}, { timestamps: true });

UserSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('User', UserSchema);