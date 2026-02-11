import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api';
import AuthContext from '../context/AuthContext';
import './Timetable.css';

const Timetable = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const res = await api.get('/courses/timetable');
        setCourses(res.data);
      } catch (err) {
        setError('Failed to fetch timetable. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchCourses();
    }
  }, [user]);

  const groupCoursesByDay = (courses) => {
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const grouped = courses.reduce((acc, course) => {
      if (!course.schedule || !course.schedule.day) return acc;
      const day = course.schedule.day;
      if (!acc[day]) {
        acc[day] = [];
      }
      acc[day].push(course);
      return acc;
    }, {});

    // Sort days according to the defined order
    const sortedGroup = {};
    daysOfWeek.forEach(day => {
        if (grouped[day]) {
            sortedGroup[day] = grouped[day].sort((a, b) => {
                // Sort courses within the day by start time
                return a.schedule.startTime.localeCompare(b.schedule.startTime);
            });
        }
    });

    return sortedGroup;
  };

  const groupedCourses = groupCoursesByDay(courses);

  if (loading) {
    return <div className="loading-spinner"></div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="timetable-container">
      <header className="timetable-header">
        <h1>My Timetable</h1>
        <p>Welcome, <strong>{user?.name || user?.studentId}</strong></p>
      </header>

      <AnimatePresence>
        {Object.keys(groupedCourses).length > 0 ? (
          Object.entries(groupedCourses).map(([day, dayCourses], index) => (
            <motion.div
              key={day}
              className="day-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <h2>{day}</h2>
              <div className="courses-grid">
                {dayCourses.map((course) => (
                  <motion.div
                    key={course.courseId}
                    className="course-card"
                    whileHover={{ scale: 1.03, y: -5 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <div className="course-card-header">
                      <h3>{course.name}</h3>
                      <span>{course.courseId}</span>
                    </div>
                    <div className="course-card-body">
                      <p><strong>Time:</strong> {course.schedule.startTime} - {course.schedule.endTime}</p>
                      <p><strong>Venue:</strong> {course.venue.name}</p>
                      <p><strong>Lecturer ID:</strong> {course.lecturerId}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))
        ) : (
          <motion.div
            className="no-courses"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p>No courses found in your timetable.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Timetable;
