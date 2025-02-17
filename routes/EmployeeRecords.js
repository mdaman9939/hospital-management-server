const express = require("express");
const router = express.Router();
const EmployeeRecords = require("../schema/EmployeeRecords");
const authenticateToken = require("./AuthenticateToken");

// Create Employee Record
// Create Employee Record
router.post("/employee-records", authenticateToken, async (req, res) => {
  try {
    const {
      name,
      employeeId,
      designation,
      department,
      contactNumber,
      email,
      dateOfJoining,
    } = req.body;

    const newRecord = new EmployeeRecords({
      name,
      employeeId,
      designation,
      department,
      contactNumber,
      email,
      dateOfJoining,
      userId: req.userId,
    });

    await newRecord.save();
    res.status(201).json({
      message: "Employee record successfully created!",
      newRecord,
    });
  } catch (error) {
    if (error.code === 11000) {
      // Handle duplicate key error
      const duplicateField = Object.keys(error.keyValue)[0];
      return res.status(400).json({
        message: `Duplicate entry detected for field: '${duplicateField}'. Please provide a unique value.`,
      });
    }

    console.error("Error creating employee record:", error);
    res.status(500).json({
      message: "Error creating employee record",
      error: error.message,
    });
  }
});

// Get all Employee Records for the logged-in user
router.get("/employee-records", authenticateToken, async (req, res) => {
  try {
    const employeeRecords = await EmployeeRecords.find({
      userId: req.userId,
    }).sort({ createdAt: -1 });

    if (!employeeRecords || employeeRecords.length === 0) {
      return res.status(404).json({ message: "No employee records found." });
    }

    res.status(200).json(employeeRecords);
  } catch (error) {
    console.error("Error fetching employee records:", error);
    res.status(500).json({ message: "Error fetching employee records." });
  }
});

module.exports = router;
