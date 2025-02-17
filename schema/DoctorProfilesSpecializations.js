const mongoose = require("mongoose");

const DoctorProfilesSpecializationsSchema = new mongoose.Schema(
  {
    doctorName: { type: String, require: true },
    qualification: { type: String, require: true },
    experience: { type: String, require: true },
    specializations: { type: [String], require: true },
    contactInfo: { type: String, require: true },
    clinicAddress: { type: String, require: true },
    biography: { type: String, require: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "DoctorProfilesSpecializations",
  DoctorProfilesSpecializationsSchema
);
