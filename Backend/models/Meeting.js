const mongoose = require("mongoose");

const MeetingSchema = new mongoose.Schema(
  {
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model (host of the meeting)
      required: true,
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // List of users who joined the meeting
      },
    ],
    meetingId: {
      type: String, // Unique ID for the meeting
      required: true,
      unique: true,
    },
    startTime: {
      type: Date,
      default: Date.now, // When the meeting starts
    },
    endTime: {
      type: Date, // When the meeting ends
    },
    isActive: {
      type: Boolean,
      default: true, // Indicates if the meeting is currently ongoing
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

module.exports = mongoose.model("Meeting", MeetingSchema);
