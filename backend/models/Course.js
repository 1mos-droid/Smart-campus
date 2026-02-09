const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  courseId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  lecturerId: {
    type: String, // Assuming lecturerId for simplicity, could link to a User model for lecturers
    required: true
  },
  venue: {
    name: { type: String, required: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  schedule: {
    day: { type: String, required: true }, // e.g., "Monday"
    startTime: { type: String, required: true }, // e.g., "08:30 AM"
    endTime: { type: String, required: true } // e.g., "10:20 AM"
  }
});

module.exports = mongoose.model('Course', CourseSchema);