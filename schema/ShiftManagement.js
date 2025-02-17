const mongoose = require("mongoose");

const ShiftManagementSchema = new mongoose.Schema(
  {
    employeeId: { type: String, required: true },
    employeeName: { type: String, required: true },
    shiftType: {
      type: String,
      enum: ["morning", "evening", "night"],
      required: true,
    },
    notes: { type: String, required: false },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Create the model from the schema
const ShiftManagement = mongoose.model(
  "ShiftManagement",
  ShiftManagementSchema
);

module.exports = ShiftManagement;
