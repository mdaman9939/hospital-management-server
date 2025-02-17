const express = require("express");
const router = express.Router();
const DoctorProfilesSpecializations = require("../schema/DoctorProfilesSpecializations");
const AuthenticateToken = require("./AuthenticateToken");
const jwt = require("jsonwebtoken");

// POST API: Add a new doctor profile
router.post("/doctor-profiles", AuthenticateToken, async (req, res) => {
  try {
    const {
      doctorName,
      qualification,
      experience,
      specializations,
      contactInfo,
      clinicAddress,
      biography,
    } = req.body;

    // Extract userId from the token
    const token = req.headers.authorization.split(" ")[1]; // Get token from the authorization header
    const decoded = jwt.decode(token); // Decode the token to get user data
    const userId = decoded.id; // Assuming the token contains the user ID in the 'id' field

    // Create a new doctor profile and associate it with the userId
    const newProfile = new DoctorProfilesSpecializations({
      doctorName,
      qualification,
      experience,
      specializations,
      contactInfo,
      clinicAddress,
      biography,
      userId, // Associate profile with the user
    });

    const savedProfile = await newProfile.save();
    res
      .status(201)
      .json({ message: "Profile added successfully!", data: savedProfile });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding profile", error: error.message });
  }
});

// GET API: Fetch all doctor profiles for the authenticated user
router.get("/doctor-profiles", AuthenticateToken, async (req, res) => {
  try {
    // Extract userId from the token
    const token = req.headers.authorization.split(" ")[1]; // Get token from the authorization header
    const decoded = jwt.decode(token); // Decode the token to get user data
    const userId = decoded.id; // Assuming the token contains the user ID in the 'id' field

    // Fetch doctor profiles associated with the userId
    const profiles = await DoctorProfilesSpecializations.find({ userId });
    res.status(200).json(profiles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
