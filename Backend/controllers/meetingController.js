const Meeting = require("../models/Meeting");
const { v4: uuidv4 } = require("uuid"); // For generating unique meeting IDs

// Create a new meeting
exports.createMeeting = async (req, res) => {
  try {
    const hostId = req.user.id; // Extract user ID from the token (set by `authenticate`)
    const meetingId = uuidv4(); // Generate a unique meeting ID

    const meeting = await Meeting.create({
      host: hostId,
      meetingId,
    });

    res.status(201).json({
      message: "Meeting created successfully!",
      meeting,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while creating the meeting." });
  }
};

// Join a meeting
exports.joinMeeting = async (req, res) => {
  try {
    const { meetingId } = req.params;
    const participantId = req.user.id;

    const meeting = await Meeting.findOne({ meetingId });

    if (!meeting || !meeting.isActive) {
      return res.status(404).json({ message: "Meeting not found or inactive." });
    }

    if (meeting.participants.includes(participantId)) {
      return res.status(400).json({ message: "You are already in this meeting." });
    }

    meeting.participants.push(participantId);
    await meeting.save();

    res.status(200).json({
      message: "Joined the meeting successfully!",
      meeting,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while joining the meeting." });
  }
};

// Get meeting details
exports.getMeetingDetails = async (req, res) => {
  try {
    const { meetingId } = req.params;

    const meeting = await Meeting.findOne({ meetingId })
      .populate("host", "name email") // Populate host details
      .populate("participants", "name email"); // Populate participant details

    if (!meeting) {
      return res.status(404).json({ message: "Meeting not found." });
    }

    res.status(200).json(meeting);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while fetching meeting details." });
  }
};

// End a meeting
exports.endMeeting = async (req, res) => {
  try {
    const { meetingId } = req.params;
    const userId = req.user.id;

    const meeting = await Meeting.findOne({ meetingId });

    if (!meeting) {
      return res.status(404).json({ message: "Meeting not found." });
    }

    if (String(meeting.host) !== userId) {
      return res.status(403).json({ message: "Only the host can end the meeting." });
    }

    meeting.isActive = false;
    meeting.endTime = new Date();
    await meeting.save();

    res.status(200).json({ message: "Meeting ended successfully!", meeting });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while ending the meeting." });
  }
};
