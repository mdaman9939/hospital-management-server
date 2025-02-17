const express = require("express");
const router = express.Router();
const DutyRostersSchedules = require("../schema/DutyRostersSchedules");
const AuthenticateToken = require("./AuthenticateToken");
const jwt = require("jsonwebtoken");

// POST API: Save Duty Roster
router.post("/duty-roster", AuthenticateToken, async (req, res) => {
  try {
    const {
      staffName,
      staffRole,
      contactInfo,
      dutyStart,
      dutyEnd,
      shiftType,
      assignedDate,
      assignedWard,
    } = req.body;

    // Extract userId from the token
    const token = req.headers.authorization.split(" ")[1]; // Get token from the authorization header
    const decoded = jwt.decode(token); // Decode the token to get user data
    const userId = decoded.id; // Assuming the token contains the user ID in the 'id' field

    // Create a new DutyRoster document and associate it with the userId
    const newDutyRoster = new DutyRostersSchedules({
      staffName,
      staffRole,
      contactInfo,
      dutyStart,
      dutyEnd,
      shiftType,
      assignedDate,
      assignedWard,
      userId, // Associate duty roster with the user
    });

    // Save the duty roster to the database
    const savedDutyRoster = await newDutyRoster.save();
    res.status(201).json({
      message: "Duty roster saved successfully!",
      data: savedDutyRoster,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error saving duty roster", error: error.message });
  }
});

// GET API: Retrieve all Duty Rosters for the authenticated user
router.get("/duty-roster", AuthenticateToken, async (req, res) => {
  try {
    // Extract userId from the token
    const token = req.headers.authorization.split(" ")[1]; // Get token from the authorization header
    const decoded = jwt.decode(token); // Decode the token to get user data
    const userId = decoded.id; // Assuming the token contains the user ID in the 'id' field

    // Fetch duty rosters associated with the userId
    const dutyRosters = await DutyRostersSchedules.find({ userId });
    if (dutyRosters.length === 0) {
      return res
        .status(200)
        .json({ message: "No duty rosters found.", data: [] });
    }

    res.status(200).json({
      message: "Duty rosters retrieved successfully!",
      data: dutyRosters,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching duty rosters", error: error.message });
  }
});

module.exports = router;
