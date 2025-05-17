import { io } from "socket.io-client";

export const initSocket = async () => {
    const options = {
        autoConnect: true, // Automatically reconnects without forcing a new connection
        reconnection: true, // Enables reconnection attempts
        reconnectionAttempts: Infinity, // Retry forever if disconnected
        timeout: 10000, // 10 seconds timeout
        transports: ["websocket"] // Use WebSocket instead of polling
    };

    const socket = io("http://localhost:3000");

    // Handle connection errors
    socket.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
    });

    return socket;
};
