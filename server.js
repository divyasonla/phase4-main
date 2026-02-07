require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const Feedback = require('./models/Feedback');

const app = express();
const PORT = process.env.PORT || 3001;

// MongoDB Connection
const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  console.error('Error: MONGO_URI is not defined in the environment variables.');
  process.exit(1);
}

mongoose.connect(mongoUri)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Middleware
app.use(cors());
app.use(bodyParser.json());

app.post('/feedback', async (req, res) => {
  try {
    const { name, rating, comment } = req.body;
    // console.log('Request body:', req.body);
    const newFeedback = new Feedback({ name, rating, comment });
    await newFeedback.save();
    res.status(201).json({ message: 'Feedback submitted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit feedback' });
  }
});

app.get('/feedback', async (req, res) => {
  try {
    console.log('Fetching feedback list...');
    const feedbackList = await Feedback.find();
    // console.log('Feedback list fetched:', feedbackList);
    res.status(200).json(feedbackList);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch feedback' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Feedback Manager is running on http://localhost:${PORT}`);
});