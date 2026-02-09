const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  studentLocation: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  deviceIdentifier: { // For one-device policy
    type: String,
    required: true
  }
});

// To enforce one attendance record per student, per course, per day,
// a compound index is more appropriate.
AttendanceSchema.index({ student: 1, course: 1, timestamp: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', AttendanceSchema);