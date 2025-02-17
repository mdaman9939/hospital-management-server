const mongoose = require("mongoose");

// Define the schema for a patient
const PatientRegistrationAdmissionSchema = new mongoose.Schema({
  patientName: { type: String, required: true },
  patientAge: { type: Number, required: true },
  patientGender: { type: String, required: true },
  contactInfo: { type: String, required: true },
  admissionDate: { type: Date, required: true },
  address: { type: String, required: true },
  ward: { type: String, required: true },
  guardianContact: { type: String, required: true }, // Changed to String to handle phone numbers properly
  medicalHistory: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Add this line to store userId
});

// Create the model from the schema
const PatientRegistrationAdmission = mongoose.model(
  "PatientRegistrationAdmission",
  PatientRegistrationAdmissionSchema
);

module.exports = PatientRegistrationAdmission;
