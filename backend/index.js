const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const User = require("./models/User");

const app = express();
app.use(cors());
app.use(express.json());
const Wellness = require("./models/wellness");
const auth = require("./middleware/auth");
// 🔗 MongoDB connection
mongoose.connect("mongodb://localhost:27017/sentiraDB")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// 🔐 SECRET KEY
const SECRET = "sentira_secret";

// ==========================
// 🟢 REGISTER (OPTIONAL)
// ==========================
app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    res.json({ message: "User registered successfully" });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ==========================
// 🔵 LOGIN (IMPORTANT)
// ==========================
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      SECRET,
      { expiresIn: "1d" }
    );

     res.json({
      token,
      name: user.name
    });


  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/api/wellness", auth, async (req, res) => {
  try {
    const { heartRate, sleepHours, moodScore } = req.body;

    let stressStatus = "Low";
    if (heartRate > 100) stressStatus = "High";

    const entry = new Wellness({
      userId: req.user.id,
      heartRate,
      sleepHours,
      moodScore,
      stressStatus,
    });

    await entry.save();

    res.json(entry);
  } catch (err) {
    res.status(500).json({ message: "Error saving data" });
  }
});


app.get("/api/wellness", auth, async (req, res) => {
  try {
    const data = await Wellness.find({ userId: req.user.id }).sort({ date: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Error fetching data" });
  }
});
// ==========================
// 🔐 PROTECTED ROUTE EXAMPLE
// ==========================
app.get("/api/protected", (req, res) => {
  const token = req.headers.authorization;

  if (!token) return res.status(401).json({ message: "No token" });

  try {
    const decoded = jwt.verify(token, SECRET);
    res.json({ message: "Access granted", user: decoded });
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
});

// ==========================
// 🚀 START SERVER
// ==========================
app.listen(5000, () => {
  console.log("Server running on port 5000");
});