// Import necessary modules
const express = require("express");
const router = express.Router();
const PatientRegistrationAdmission = require("../schema/PatientRegistrationAdmission");
const jwt = require("jsonwebtoken");
const authenticateToken = require("./AuthenticateToken");

// Middleware to authenticate the user using JWT 
// aaise bhi authenticate kar sakte hai bhai seperate file mein bhi ek file main bhi 
const authenticateUser = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // Extract token from the "Bearer token" header
  console.log("Token extracted:", token); // Add this log

  if (!token) {
    return res
      .status(403)
      .json({ message: "Access denied, no token provided." });
  }

  jwt.verify(token, process.env.JWT_SECRET || "secretKey", (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token." });
    }

    req.userId = decoded.id; // Store the decoded user ID
    next();
  });
};

// POST route to handle patient registration
router.post("/register", authenticateToken, async (req, res) => {
  const patientData = req.body;

  // Validate required fields
  if (
    !patientData.patientName ||
    !patientData.patientAge ||
    !patientData.patientGender ||
    !patientData.contactInfo ||
    !patientData.admissionDate ||
    !patientData.address ||
    !patientData.ward ||
    !patientData.guardianContact ||
    !patientData.medicalHistory
  ) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    // Parse the admissionDate to a JavaScript Date object
    const admissionDate = new Date(patientData.admissionDate);

    // Check if admissionDate is a valid date
    if (isNaN(admissionDate.getTime())) {
      return res.status(400).json({ message: "Invalid admission date." });
    }

    // Create a new patient document with the parsed date and associate with the logged-in user
    const newPatient = new PatientRegistrationAdmission({
      ...patientData,
      admissionDate: admissionDate, // Use the parsed admissionDate
      userId: req.userId, // Store the userId from the JWT token
    });

    console.log("UserID in Token during registration:", req.userId); // Log to check the user ID

    // Save the patient data to MongoDB
    await newPatient.save();

    // Response with success message
    res
      .status(201)
      .json({ message: "Patient registered successfully.", data: newPatient });
  } catch (err) {
    console.error("Error saving patient data:", err);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

// GET route to fetch all patients for the logged-in user
router.get("/patient", authenticateToken, async (req, res) => {
  try {
    // Use the userId from the authenticated token
    const userId = req.userId; // Correct the reference to userId

    // Find all patients related to the logged-in user (filtering by userId)
    const patients = await PatientRegistrationAdmission.find({
      userId: userId, // Correct the reference here as well
    });

    if (!patients || patients.length === 0) {
      return res
        .status(404)
        .json({ message: "No patients found for this user." });
    }

    res.json(patients);
  } catch (error) {
    console.error("Error fetching patients:", error);
    res.status(500).json({ message: "Error fetching patients." });
  }
});

module.exports = router;
