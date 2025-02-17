const mongoose = require("mongoose");

// MongoDB connection URL from environment
const dbURL = process.env.MONGO_DB_URL;
// connect to mongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(dbURL);
    console.log("mongodb connected successfully.");
  } catch (error) {
    console.error("error connecting to mongodb", error);
    process.exit(1); // exit the process with failure
  }
};

module.exports = connectDB;
