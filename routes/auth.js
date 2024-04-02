const express = require("express");
const router = express.Router();
const User = require('../models/user')
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

router.post("/register", async (req, res) => {
    try {
      const { name, email, password, mobile} = req.body;
      console.log("Received data:", { name, email, password, mobile });
  
      if (!name || !email || !mobile || !password) {
        return res.status(400).json({
          errorMessage: "Bad Request",
        });
      }
   
  
      //because of there is no forgot password in the figma so existing user also create another account
      const isExistingUser = await User.findOne({ email });
      if (isExistingUser) {
        return res.status(409).json({
          errorMessage: "Same details already registerd in Db so please login or create new account",
        });
      }
  
      //password regarding parameter1 password another is salt(no of rounds salt);
      const hashedPassword = await bcrypt.hash(password, 10);
      //db store
  
      const userData = new User({
        name,
        email,
        mobile,
        password: hashedPassword,
      });
  
      const userResponse = await userData.save();
  
      //token genreation
      const token = await jwt.sign(
        { userId: userResponse._id },
        process.env.JWT_SECRET
      );
      //final mesagge in this route
      res.json({
        message: "User registered successfully",
        token: token,
        name: name,
        password: hashedPassword,
        success: true,
      });
    } catch (err) {
      console.log(err);
    }
  });
 //login
  router.post("/login", async (req, res) => {
  try {
    let { email, mobile, password } = req.body;

    if (!password) {
      return res.status(400).json({
        errorMessage: "Bad Request! Password is required",
      });
    }

    let userDetails;
    if (email) {
      userDetails = await User.findOne({ email: email });
    } else if (mobile) {
      userDetails = await User.findOne({ mobile: mobile });
    } else {
      return res.status(400).json({
        errorMessage: "Bad Request! Email or mobile is required",
      });
    }

    if (!userDetails) {
      return res.status(401).json({ errorMessage: "Invalid credentials" });
    }

    const passwordMatch = await bcrypt.compare(password, userDetails.password);

    if (!passwordMatch) {
      return res.status(401).json({ errorMessage: "Invalid credentials" });
    }

    const token = await jwt.sign(
      { userId: userDetails._id },
      process.env.JWT_SECRET
    );

    res.status(200).json({
      message: "User logged in successfully",
      token: token,
      name: userDetails.name,
      success: true,
    });
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(500).json({ errorMessage: "Internal Server Error" });
  }
});
  module.exports = router;