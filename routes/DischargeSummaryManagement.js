const express = require("express");
const router = express.Router();
const Dischargesummarymanagement = require("../schema/Dischargesummarymanagement");
const jwt = require("jsonwebtoken");
const authenticateToken = require("./AuthenticateToken"); // Import JWT authentication middleware

// Create Discharge Summary
router.post("/summary", authenticateToken, async (req, res) => {
  try {
    const {
      patientName,
      admissionDate,
      dischargeDate,
      diagnosis,
      treatments,
      medications,
      followUp,
      notes,
    } = req.body;

    // Optional: Validate if a summary for the same admission date exists for this user
    const existingSummary = await Dischargesummarymanagement.findOne({
      admissionDate,
      userId: req.userId,
    });

    if (existingSummary) {
      return res.status(400).json({
        message: "A discharge summary already exists for this admission date.",
      });
    }

    const newSummary = new Dischargesummarymanagement({
      patientName,
      admissionDate,
      dischargeDate,
      diagnosis,
      treatments,
      medications,
      followUp,
      notes,
      userId: req.userId, // Associate the logged-in user
    });

    await newSummary.save();
    res
      .status(201)
      .json({ message: "Discharge summary created successfully", newSummary });
  } catch (error) {
    console.error("Error saving discharge summary:", error);
    res.status(500).json({ message: "Failed to create discharge summary" });
  }
});

// Get Discharge Summaries for the Logged-in User
router.get("/summary", authenticateToken, async (req, res) => {
  try {
    const summaries = await Dischargesummarymanagement.find({
      userId: req.userId,
    }).sort({
      dischargeDate: -1,
    });

    if (!summaries || summaries.length === 0) {
      return res
        .status(404)
        .json({ message: "No discharge summaries found for this user." });
    }

    res.status(200).json(summaries);
  } catch (error) {
    console.error("Error fetching discharge summaries:", error);
    res.status(500).json({ message: "Error fetching discharge summaries." });
  }
});

module.exports = router;
