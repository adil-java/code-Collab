import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { ACTIONS } from "./action.js";

const app = express();
const server = createServer(app);

const connectedUsers = {}; // Store connected users

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Allow frontend
    methods: ["GET", "POST"],
  },
});

// Function to get all unique clients in a room
function getAllClients(roomID) {
  return Array.from(io.sockets.adapter.rooms.get(roomID) || []).map(
    (socketID) => ({
      socketID,
      username: connectedUsers[socketID]?.username || "Unknown",
    })
  );
}

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  // Handle user joining a room
  socket.on(ACTIONS.JOIN, ({ roomID, username }) => {
    console.log(`User ${username} joined room ${roomID}`);
    
    socket.username = username;
    socket.roomID = roomID; // Store roomID in socket object
    connectedUsers[socket.id] = { username, roomID }; // Store user details
    socket.join(roomID);

    const clients = getAllClients(roomID);

    io.to(roomID).emit(ACTIONS.JOINED, {
      clients,
      username,
    });
  });

  // Handle code change and broadcast updates
  socket.on(ACTIONS.CODE_CHANGE, ({ roomID, code }) => {
    console.log("Broadcasting code change:", code);
    io.to(roomID).emit(ACTIONS.CODE_CHANGE, { code });
  });

  // Handle user disconnecting
  socket.on("disconnect", () => {
    console.log(`${socket.username || "Unknown"} disconnected`);
    
    const { roomID } = connectedUsers[socket.id] || {};
    if (roomID) {
      delete connectedUsers[socket.id]; // Remove user from tracking
      const clients = getAllClients(roomID);
      io.to(roomID).emit(ACTIONS.DISCONNECTED, { socketID: socket.id, clients });
    }
  });
});

const port = 3000;
server.listen(port, () => {
  console.log(`Server running at: http://localhost:${port}`);
});
