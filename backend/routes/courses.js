const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const auth = require('../middleware/auth'); // We'll create this middleware next

// @route   GET api/courses/timetable
// @desc    Get all courses (timetable)
// @access  Private (students should see their specific timetable)
router.get('/timetable', auth, async (req, res) => {
  try {
    // In a real application, you'd filter courses based on the authenticated user's studentId
    // For MVP, returning all courses for demonstration.
    const courses = await Course.find({});
    res.json(courses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
