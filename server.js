const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config(); // Load environment variables
const connectDb = require("./config/db");
const PatientRegistrationAdmissionRoutes = require("./routes/PatientRegistrationAdmission");
const AppointmentSchedulingRoutes = require("./routes/AppointmentScheduling");
const DischargesummarymanagementRoutes = require("./routes/DischargeSummaryManagement");
const DoctorProfilesSpecializationsRoutes = require("./routes/DoctorProfilesSpecializations");
const DutyRostersSchedulesRoutes = require("./routes/DutyRostersSchedules");
const EmployeeRecordsRoutes = require("./routes/EmployeeRecords");
const ShiftManagementRoutes = require("./routes/ShiftManagement");
const PayrollLeaveManagementRoutes = require("./routes/PayrollLeaveManagement");
const RegisterRoutes = require("./routes/Register");
const authenticateToken = require("./routes/AuthenticateToken");
const app = express();

// connectDb();
// Connect to database only when a request comes in
connectDb().then(() => console.log("Connected to MongoDB"));

// app.use(cors());
// //cors
app.use(
  cors({
    origin: [
      "https://hospital-management-peach-sigma-git-main-md-amans-projects.vercel.app/",
      "*",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Middleware to parse JSON bodies
app.use(express.json()); // Required if your API handles JSON
app.use(bodyParser.json());

app.use("/api", PatientRegistrationAdmissionRoutes);
app.use("/api", AppointmentSchedulingRoutes);
app.use("/api", DischargesummarymanagementRoutes);
app.use("/api", DoctorProfilesSpecializationsRoutes);
app.use("/api", DutyRostersSchedulesRoutes);
app.use("/api", EmployeeRecordsRoutes);
app.use("/api", ShiftManagementRoutes);
app.use("/api", PayrollLeaveManagementRoutes);
app.use("/api", RegisterRoutes);

app.get("/dashboard", authenticateToken, (req, res) => {
  res.json({ message: "Welcome to the dashboard!" });
});


app.get("/", (req, res) => {
  res.json({ message: "server is working fine" });
});
const PORT = process.env.PORT || 1000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
