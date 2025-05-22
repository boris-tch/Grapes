const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
app.use(cors()); // Enable CORS for all origins

const server = http.createServer(app);

// ✅ VERY IMPORTANT: allow CORS and WebSocket support
const io = new Server(server, {
  cors: {
    origin: "*", // Use specific domain in production if you want to limit access
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('✅ A user connected:', socket.id);

  socket.on('send_message', (data) => {
    io.emit('receive_message', data);
  });

  socket.on('disconnect', () => {
    console.log('❌ A user disconnected:', socket.id);
  });
});

server.listen(process.env.PORT || 5000, () => {
  console.log('🚀 Server running on port 5000');
});
