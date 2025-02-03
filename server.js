const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Store usernames
const users = {};

// Socket.IO connection
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
  
    socket.on('new user', (username) => {
      users[socket.id] = username;
      io.emit('user joined', username);
    });
  
    socket.on('chat message', (msg) => {
      const username = users[socket.id];
      if (username) {
        console.log('Message received from', username, ':', msg);
        socket.broadcast.emit('chat message', { username, message: msg }); // Broadcast to others only
      }
    });
  
    socket.on('disconnect', () => {
      const username = users[socket.id];
      if (username) {
        delete users[socket.id];
        io.emit('user left', username);
      }
    });
  });
  
// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
