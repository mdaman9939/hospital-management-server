const express = require("express");
const router = express.Router();
const Appointment = require("../schema/AppointmentScheduling"); // Ensure this path and name match your schema
const jwt = require("jsonwebtoken");
const authenticateToken = require("./AuthenticateToken"); // Import your JWT authentication middleware



// Create Appointment
router.post("/appointments", authenticateToken, async (req, res) => {
  try {
    const {
      patientName,
      contactNumber,
      appointmentDate,
      doctor,
      reason,
      appointmentTime,
    } = req.body;

    // Validate if the time slot is already booked for this user
    const existingAppointment = await Appointment.findOne({
      appointmentDate,
      appointmentTime,
      userId: req.userId, // Ensure we are checking within the current user's appointments
    });

    if (existingAppointment) {
      return res
        .status(400)
        .json({ message: "This time slot is already booked for you." });
    }

    const appointment = new Appointment({
      patientName,
      contactNumber,
      appointmentDate,
      doctor,
      reason,
      appointmentTime,
      userId: req.userId, // Store the userId of the logged-in user
    });

    await appointment.save();
    res
      .status(201)
      .json({ message: "Appointment successfully created!", appointment });
  } catch (error) {
    res.status(500).json({ message: "Error creating appointment", error });
  }
});

// Get route to fetch all appointments for the logged-in user
router.get("/appointments", authenticateToken, async (req, res) => {
  try {
    // Fetch all appointments for the logged-in user
    const appointments = await Appointment.find({ userId: req.userId }) // Filter appointments by userId
      .sort({
        appointmentDate: 1,
        appointmentTime: 1,
      });

    if (!appointments || appointments.length === 0) {
      return res
        .status(404)
        .json({ message: "No appointments found for this user." });
    }

    res.status(200).json(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ message: "Error fetching appointments." });
  }
});

module.exports = router;
