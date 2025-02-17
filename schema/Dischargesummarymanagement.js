const mongoose = require("mongoose");

const DischargesummarymanagementSchema = new mongoose.Schema({
  patientName: { type: String, required: true },
  admissionDate: { type: String, required: false },
  dischargeDate: { type: String, required: false },
  diagnosis: { type: String, required: true },
  treatments: { type: String, required: true },
  medications: { type: String, required: true },
  followUp: { type: String, required: true },
  notes: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
});

module.exports = mongoose.model(
  "Dischargesummarymanagement",
  DischargesummarymanagementSchema
);
