const express = require("express");
const router = express.Router();
const ShiftManagement = require("../schema/ShiftManagement");

// Middleware to authenticate token
const authenticateToken = require("./AuthenticateToken");

// POST route to create a new shift (with token authentication)
router.post("/shift", authenticateToken, async (req, res) => {
  try {
    const { employeeId, employeeName, shiftType, notes } = req.body;

    // Create a new shift record
    const newShift = new ShiftManagement({
      employeeId,
      employeeName,
      shiftType,
      notes,
      userId: req.userId, // Assuming you store the userId in the token payload
    });

    // Save the shift record to the database
    await newShift.save();

    res.status(201).json({
      message: "Shift record created successfully!",
      data: newShift,
    });
  } catch (error) {
    console.error("Error creating shift record:", error);
    res.status(500).json({
      message: "Error creating shift record",
      error: error.message,
    });
  }
});

// GET route to fetch all shift records (with token authentication)
router.get("/shifts", authenticateToken, async (req, res) => {
  try {
    // Fetch all shift records for the logged-in user
    const shifts = await ShiftManagement.find({ userId: req.userId }); // Filtering by userId (assumed in token)

    if (shifts.length === 0) {
      return res.status(404).json({ message: "No shift records found." });
    }

    res.status(200).json({
      message: "Shift records fetched successfully!",
      data: shifts,
    });
  } catch (error) {
    console.error("Error fetching shift records:", error);
    res.status(500).json({
      message: "Error fetching shift records",
      error: error.message,
    });
  }
});

module.exports = router;
