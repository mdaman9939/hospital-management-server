const express = require("express");
const router = express.Router();
const PayrollLeaveManagement = require("../schema/PayrollLeaveManagement");
const authenticateToken = require("./AuthenticateToken");

// Create Payroll and Leave Record
router.post("/payroll-leave", authenticateToken, async (req, res) => {
  try {
    const {
      employeeId,
      employeeName,
      basicSalary,
      allowances,
      deductions,
      totalSalary,
      leaveType,
      leaveStartDate,
      leaveEndDate,
      leaveReason,
    } = req.body;

    // Create a new payroll and leave record
    const newRecord = new PayrollLeaveManagement({
      employeeId,
      employeeName,
      basicSalary,
      allowances,
      deductions,
      totalSalary,
      leaveType,
      leaveStartDate,
      leaveEndDate,
      leaveReason,
      userId: req.userId, // Link the record to the authenticated user
    });

    await newRecord.save();
    res.status(201).json({
      message: "Payroll and leave record created successfully!",
      newRecord,
    });
  } catch (error) {
    if (error.code === 11000) {
      const duplicateField = Object.keys(error.keyValue)[0];
      return res.status(400).json({
        message: `Duplicate entry detected for field: '${duplicateField}'. Please provide a unique value.`,
      });
    }

    console.error("Error creating payroll and leave record:", error);
    res.status(500).json({
      message: "Error creating payroll and leave record",
      error: error.message,
    });
  }
});

// Get all Payroll and Leave Records for the logged-in user
router.get("/payroll-leave", authenticateToken, async (req, res) => {
  try {
    const records = await PayrollLeaveManagement.find({
      userId: req.userId,
    }).sort({ createdAt: -1 });

    if (!records || records.length === 0) {
      return res
        .status(404)
        .json({ message: "No payroll and leave records found." });
    }

    res.status(200).json(records);
  } catch (error) {
    console.error("Error fetching payroll and leave records:", error);
    res
      .status(500)
      .json({ message: "Error fetching payroll and leave records." });
  }
});

module.exports = router;
