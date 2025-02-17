const mongoose = require("mongoose");

const PayrollLeaveManagementSchema = new mongoose.Schema(
  {
    employeeId: { type: String, required: true },
    employeeName: { type: String, required: true },
    basicSalary: { type: String, required: true },
    allowances: { type: String, required: true },
    deductions: { type: String, required: true },
    totalSalary: { type: String, required: true },
    leaveType: { type: String, required: true },
    leaveStartDate: { type: String, required: true },
    leaveEndDate: { type: String, required: true },
    leaveReason: { type: String, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "PayrollLeaveManagement",
  PayrollLeaveManagementSchema
);
