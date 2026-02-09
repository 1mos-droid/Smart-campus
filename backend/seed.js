const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Course = require('./models/Course'); // Adjust path as necessary

dotenv.config();

const db = process.env.MONGO_URI || 'mongodb://localhost:27017/smart-campus';

const courses = [
  {
    courseId: 'PHYS143',
    name: 'Mechanics and Thermal Physics',
    lecturerId: 'LECT001',
    venue: {
      name: 'J.A. Kufuor Lecture Theatre',
      lat: 5.651,
      lng: -0.1875,
    },
    schedule: {
      day: 'Monday',
      startTime: '08:30 AM',
      endTime: '10:20 AM',
    },
  },
  {
    courseId: 'PHYS144',
    name: 'Electricity and Magnetism',
    lecturerId: 'LECT002',
    venue: {
      name: 'New N Block, N1',
      lat: 5.6505,
      lng: -0.1865,
    },
    schedule: {
      day: 'Tuesday',
      startTime: '01:30 PM',
      endTime: '03:20 PM',
    },
  },
  {
    courseId: 'PHYS102',
    name: 'Practical Physics 2',
    lecturerId: 'LECT003',
    venue: {
      name: 'Physics Department, G1 lab',
      lat: 5.652,
      lng: -0.188,
    },
    schedule: {
      day: 'Wednesday',
      startTime: '10:30 AM',
      endTime: '12:20 PM',
    },
  },
  {
    courseId: 'PHYS101',
    name: 'Practical Physics 1',
    lecturerId: 'LECT004',
    venue: {
      name: 'Physics Department, G1 annex Lab',
      lat: 5.6498,
      lng: -0.187,
    },
    schedule: {
      day: 'Friday',
      startTime: '11:30 AM',
      endTime: '01:20 PM',
    },
  },
  {
    courseId: 'MATH112',
    name: 'Calculus I',
    lecturerId: 'LECT005',
    venue: {
      name: 'Mathematics Department, Room 201',
      lat: 5.6525,
      lng: -0.1878,
    },
    schedule: {
      day: 'Monday',
      startTime: '11:30 AM',
      endTime: '12:20 PM',
    },
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(db);
    console.log('MongoDB Connected...');

    await Course.deleteMany({});
    console.log('Existing courses removed.');

    await Course.insertMany(courses);
    console.log('Courses seeded!');

    mongoose.connection.close();
    console.log('MongoDB connection closed.');
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
};

seedDB();
