const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const Course = require('../models/Course');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Haversine formula to calculate distance between two GPS coordinates
function haversine(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // metres
    const φ1 = lat1 * Math.PI/180; // φ, λ in radians
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    const d = R * c; // in metres
    return d;
}

// @route   POST api/attendance/mark
// @desc    Mark attendance for a student
// @access  Private
router.post('/mark', auth, async (req, res) => {
    try {
        const {
            qrCodeData, // This will be a JSON string from the QR code
            studentLat,
            studentLng,
            deviceIdentifier // Device ID from frontend
        } = req.body;
        const studentId = req.user.id; // From authenticated user

        // SAFEGUARD: Parse JSON carefully
        let courseData;
        try {
            courseData = JSON.parse(qrCodeData);
        } catch (e) {
            return res.status(400).json({ message: 'Invalid QR Code data.' });
        }

        const { courseId, lecturerId, venueLat, venueLng } = courseData;

        // Verify course exists
        const course = await Course.findOne({ courseId });
        if (!course) {
            return res.status(404).json({ message: 'Course not found.' });
        }

        // --- 1. Location Check ---
        const distance = haversine(studentLat, studentLng, venueLat, venueLng);
        const MAX_DISTANCE = 50; // 50 meters tolerance
        
        if (distance > MAX_DISTANCE) { 
            return res.status(400).json({ 
                message: `Too far from venue. Distance: ${Math.round(distance)}m` 
            });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        // --- 2. Check: Has THIS STUDENT marked attendance for this course today? ---
        const existingAttendance = await Attendance.findOne({
            student: studentId,
            course: course._id,
            timestamp: { $gte: today, $lt: tomorrow }
        });

        if (existingAttendance) {
            return res.status(400).json({ message: 'You have already signed in today for this course.' });
        }

        // --- 3. (NEW) Check: Has THIS DEVICE been used by ANOTHER student today for this course? ---
        const deviceUsed = await Attendance.findOne({
            deviceIdentifier,
            course: course._id,
            timestamp: { $gte: today, $lt: tomorrow },
            student: { $ne: studentId } // Look for records NOT belonging to this student
        });

        if (deviceUsed) {
            return res.status(400).json({ message: 'This device has already been used by another student for this course today.' });
        }

        // --- 4. Save Attendance ---
        const newAttendance = new Attendance({
            student: studentId,
            course: course._id,
            studentLocation: { lat: studentLat, lng: studentLng },
            deviceIdentifier
        });

        await newAttendance.save();

        res.status(201).json({ message: 'Attendance marked successfully.' });

    } catch (error) {
        console.error("Attendance Error:", error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
