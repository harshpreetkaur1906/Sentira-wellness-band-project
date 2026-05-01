const mongoose = require("mongoose");

const wellnessSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  heartRate: Number,
  sleepHours: Number,
  moodScore: Number,
  stressStatus: String,
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Wellness", wellnessSchema);