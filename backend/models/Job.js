const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  customer:    { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  worker:      { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  skill:       { type: String, required: true },
  description: { type: String },
  location: {
    type:        { type: String, default: 'Point' },
    coordinates: [Number]
  },
  status: {
    type: String,
    enum: ['open','accepted','in_progress','completed','rated'],
    default: 'open'
  },
  agreedAmount:   { type: Number },
  customerRating: { type: Number },
  workerRating:   { type: Number },
}, { timestamps: true });

JobSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Job', JobSchema);