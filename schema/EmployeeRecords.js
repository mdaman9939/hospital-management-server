const mongoose = require("mongoose");

// Schema for Employee Records
const EmployeeRecordsSchema = new mongoose.Schema({
  name: { type: String, required: true },
  employeeId: { type: String, required: true, unique: false },
  designation: { type: String, required: true },
  department: { type: String, required: true },
  contactNumber: { type: String, required: true },
  email: { type: String, required: true, unique: false },
  dateOfJoining: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
});

const EmployeeRecords = mongoose.model(
  "EmployeeRecords",
  EmployeeRecordsSchema
);
module.exports = EmployeeRecords;
