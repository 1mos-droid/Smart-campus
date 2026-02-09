const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Body parser for JSON

// DB Config
const db = process.env.MONGO_URI || 'mongodb://localhost:27017/smart-campus';

// Connect to MongoDB
mongoose
  .connect(db)
  .then(() => console.log('✅ MongoDB Connected...'))
  .catch(err => {
      console.log('❌ Database Connection Error:');
      console.error(err);
  });

// Define Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/attendance', require('./routes/attendance'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`🚀 Server started on port ${PORT}`));
