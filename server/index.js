import express from 'express';
import { Server } from 'socket.io';
import http from 'http';
import router from './router.js';
import cors from 'cors'; // Import cors package
import { addUser, removeUser, getUser, getUsersInRoom } from './user.js';

const PORT = process.env.PORT || 5000;

const app = express();
const server = http.createServer(app);

// Enable CORS for the Express server
app.use(cors({
  origin: "http://localhost:3000", // Your frontend's origin
  methods: ["GET", "POST"],
  credentials: true
}));

// Set up Socket.IO with CORS configuration
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Your frontend's origin
    methods: ["GET", "POST"],
    credentials: true
  }
});

io.on('connection', (socket) => {
  console.log('New connection established');

  socket.on('join', ({ name, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, name, room });

    if (error) return callback(error);

    socket.emit('message', {
      user: 'admin',
      text: `${user.name}, welcome to the room ${user.room}.`
    });

    socket.broadcast.to(user.room).emit('message', {
      user: 'admin',
      text: `${user.name} has joined!`
    });

    socket.join(user.room);

    // Optionally, you can emit the current users in the room
    io.to(user.room).emit('roomData', {
      room: user.room,
      users: getUsersInRoom(user.room)
    });

    callback();
  });

  socket.on('sendMessage', (message, callback) => {
    const user = getUser(socket.id);

    if (user) {
      io.to(user.room).emit('message', { user: user.name, text: message });
      io.to(user.room).emit('roomData', { user: user.room, users: getUsersInRoom(user.room) });
      callback();
    } else {
      callback('User not found');
    }
  });

  socket.on('disconnect', () => {
    const user = removeUser(socket.id);

    if (user) {
      io.to(user.room).emit('message', {
        user: 'admin',
        text: `${user.name} has left the room.`
      });

      io.to(user.room).emit('roomData', {
        room: user.room,
        users: getUsersInRoom(user.room)
      });

      console.log(`${user.name} has disconnected from room ${user.room}`);
    } else {
      console.log('User was not found during disconnection');
    }
  });
});

// Use the router
app.use(router);

// Start the server
server.listen(PORT, () => console.log(`Server has started on port ${PORT}`));
