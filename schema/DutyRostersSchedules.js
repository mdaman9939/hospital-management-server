const mongoose = require('mongoose')

const DutyRostersSchedulesSchema = new mongoose.Schema(
  {
    staffName: {
      type: String,
      required: true,
    },
    staffRole: {
      type: String,
      required: true,
      enum: ["doctor", "nurse", "admin"], // You can extend this based on your needs
    },
    contactInfo: {
      type: String,
      required: true,
    },
    dutyStart: {
      type: String,
      required: true,
    },
    dutyEnd: {
      type: String,
      required: true,
    },
    shiftType: {
      type: String,
      required: true,
      enum: ["morning", "afternoon", "night"],
    },
    assignedDate: {
      type: String,
      required: true,
    },
    assignedWard: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  { timestamps: true }
);  // Automatically includes createdAt and updatedAt fields

const DutyRostersSchedules = mongoose.model(
  "DutyRostersSchedules",
  DutyRostersSchedulesSchema
)

module.exports = DutyRostersSchedules