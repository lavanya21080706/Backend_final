const express = require("express");
const router = express.Router();
const UserData= require('../models/cart')
router.post('/userdata', async (req, res) => {
    try {
        // Create a new UserData document based on the request body
        const userData = new UserData(req.body);
        // Save the user data to the database
        await userData.save();
        // Send a success response
        res.status(201).json({ message: 'User data saved successfully' });
    } catch (error) {
        // If an error occurs, send a 500 Internal Server Error response
        res.status(500).json({ error: 'Failed to save user data' });
    }
});

router.get('/alldata', async (req, res) => {
    try {
      // Retrieve all documents from the collection
      const allData = await UserData.find();
  
      // Respond with the retrieved data
      res.status(200).json(allData);
    } catch (error) {
      console.error('Error fetching all data:', error);
      res.status(500).json({ message: "Error fetching all data" });
    }
  });
  router.get('/getcart/:id', async (req, res) => {
    try {

      const id = req.params.id;
  
      // Fetch details from the database based on the ID
      const details = await UserData.findById(id);
  
      // Check if details exist
      if (!details) {
        return res.status(404).json({ error: 'Details not found' });
      }
  
      // Return details as JSON response
      res.json(details);
    } catch (error) {
      console.error('Error fetching details:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

module.exports = router;