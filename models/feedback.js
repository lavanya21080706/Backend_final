const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    feedbackType: {
    type: String,
    required: true, // Assuming feedback type is required
  },
  feedback: {
    type: String,
    required: true,
  }
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;