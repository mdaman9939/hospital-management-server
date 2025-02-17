const mongoose = require("mongoose");

const AppointmentSchedulingSchema = new mongoose.Schema(
  {
    patientName: { type: String, require: true },
    contactNumber: { type: String, require: true },
    appointmentDate: { type: String, require: true },
    doctor: { type: String, require: true },
    reason: { type: String, require: true },
    appointmentTime: { type: String, require: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, // Add the userId field
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "AppointmentScheduling",
  AppointmentSchedulingSchema
);
