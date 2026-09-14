require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth");

const app = express();


// Middleware

app.use(cors());

app.use(express.json());


// Routes

app.use("/api/auth", authRoutes);


// Health check

app.get("/", (req, res) => {
  res.json({
    message: "MotionCAPTCHA backend running"
  });
});


// MongoDB

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {

    console.log("MongoDB connected");

    app.listen(
      process.env.PORT || 5000,
      () => {
        console.log(
          `Server running on port ${process.env.PORT || 5000}`
        );
      }
    );

  })
  .catch((error) => {

    console.error(
      "MongoDB connection failed:",
      error
    );

  });