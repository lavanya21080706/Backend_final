const express = require("express");
const router = express.Router();
const Feedback= require("../models/feedback");
router.post("/feedback", async (req, res) => {
    try {
      // Extract feedback data from the request body
      const { feedbackType, feedback } = req.body;
  
      // Create a new feedback instance using the Feedback model
      const newFeedback = new Feedback({
        feedbackType,
        feedback,
      });
  
      // Save the new feedback to the database
      const savedFeedback = await newFeedback.save();
  
      // Respond with the saved feedback data
      res.status(200).json(savedFeedback);
    } catch (error) {
      // If an error occurs, respond with an error message
      console.error("Error saving feedback:", error);
      res.status(500).json({ error: "Failed to save feedback" });
    }
  });
  

module.exports = router;