require("dotenv").config();
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require("body-parser");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");



const authRoutes = require("./routes/authRoutes");
const connectDB = require("./config/db");
const meetingRoutes = require("./routes/meetingRoutes");

const app = express()
const server = http.createServer(app); // Create an HTTP server
const io = new Server(server); // Initialize Socket.IO on the HTTP server

// Connect to MongoDB
connectDB();

app.use(bodyParser.json());
app.use(cors());

app.use(express.json()); // To parse incoming JSON request bodies


// Routes
app.use("/api/auth", authRoutes);
app.use("/api/meetings", meetingRoutes);


const PORT = process.env.PORT || 3000;

// Socket.IO setup
io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);
  
    // Join a room
    socket.on("joinRoom", (roomId) => {
      socket.join(roomId); // Add the user to the specified room
      console.log(`${socket.id} joined room ${roomId}`);
      socket.to(roomId).emit("userJoined", socket.id); // Notify others in the room
    });
  
    // Handle offer (SDP from a peer)
    socket.on("offer", ({ roomId, offer }) => {
      socket.to(roomId).emit("receiveOffer", { senderId: socket.id, offer });
    });
  
    // Handle answer (SDP from another peer)
    socket.on("answer", ({ roomId, answer }) => {
      socket.to(roomId).emit("receiveAnswer", { senderId: socket.id, answer });
    });
  
    // Handle ICE candidate
    socket.on("iceCandidate", ({ roomId, candidate }) => {
      socket.to(roomId).emit("receiveCandidate", { senderId: socket.id, candidate });
    });
  
    // Handle disconnect
    socket.on("disconnect", () => {
      console.log("A user disconnected:", socket.id);
      socket.broadcast.emit("userDisconnected", socket.id);
    });
  });
  
  // Default route
  app.get("/", (req, res) => {
    res.send("WebRTC Signaling Server is running");
  });

  
server.listen(PORT, ()=> {
    console.log(`Server is running on port ${PORT}`)
})