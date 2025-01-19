const express = require("express");
const router = express.Router();
const meetingController = require("../controllers/meetingController");
const { authenticate } = require("../middleware/authMiddleware"); // To secure routes

// Create a meeting (hosted by the authenticated user)
router.post("/create", authenticate, meetingController.createMeeting);

// Join a meeting (add a participant)
router.post("/join/:meetingId", authenticate, meetingController.joinMeeting);

// Get meeting details
router.get("/:meetingId", authenticate, meetingController.getMeetingDetails);

// End a meeting
router.post("/end/:meetingId", authenticate, meetingController.endMeeting);

module.exports = router;
