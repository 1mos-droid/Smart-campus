import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api';
import AuthContext from '../context/AuthContext';
import QRCode from '../components/QRCode';
import './Lecturer.css';

const Dashboard = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user } = useContext(AuthContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [qrCodeValue, setQrCodeValue] = useState('');
    const [selectedCourseName, setSelectedCourseName] = useState('');

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                setLoading(true);
                const res = await api.get('/courses/lecturer');
                setCourses(res.data);
            } catch (err) {
                setError('Failed to fetch courses. Please try again later.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchCourses();
        }
    }, [user]);

    const generateQRCode = async (courseId, courseName) => {
        try {
            const res = await api.post(`/attendance/generate-qr`, { courseId });
            setQrCodeValue(res.data.qrCodeData);
            setSelectedCourseName(courseName);
            setIsModalOpen(true);
        } catch (err) {
            setError('Failed to generate QR code.');
            console.error(err);
        }
    };

    if (loading) {
        return <div className="loading-spinner"></div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="lecturer-dashboard-container">
            <header className="timetable-header">
                <h1>Lecturer Dashboard</h1>
                <p>Welcome, <strong>{user?.name || user?.lecturerId}</strong></p>
            </header>

            <AnimatePresence>
                {courses.length > 0 ? (
                    <div className="courses-grid">
                        {courses.map((course, index) => (
                            <motion.div
                                key={course.courseId}
                                className="course-card"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <div className="course-card-header">
                                    <h3>{course.name}</h3>
                                    <span>{course.courseId}</span>
                                </div>
                                <div className="course-card-body">
                                    <p><strong>Time:</strong> {course.schedule.day}, {course.schedule.startTime} - {course.schedule.endTime}</p>
                                    <p><strong>Venue:</strong> {course.venue.name}</p>
                                </div>
                                <div className="course-card-footer">
                                    <button
                                        onClick={() => generateQRCode(course.courseId, course.name)}
                                        className="action-button"
                                    >
                                        Generate QR Code
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <motion.div
                        className="no-courses"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <p>You are not assigned to any courses.</p>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        className="status-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="status-modal"
                            initial={{ scale: 0.8, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                        >
                            <h3>QR Code for {selectedCourseName}</h3>
                            <p>Students can scan this code to mark their attendance.</p>
                            <div className="qr-code-container">
                                {qrCodeValue && <QRCode value={qrCodeValue} />}
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="action-button">
                                Close
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Dashboard;
