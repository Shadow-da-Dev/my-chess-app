const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // When a player clicks "Create Private Game"
    socket.on('createRoom', () => {
        // Generate a random 4-letter code
        const roomCode = Math.random().toString(36).substring(2, 6).toUpperCase();
        
        socket.join(roomCode); // Put the creator in the room
        socket.emit('roomJoined', roomCode); // Tell their browser it was successful
        console.log(`Room created: ${roomCode}`);
    });

    // When a player types a code and clicks "Join"
    socket.on('joinRoom', (roomCode) => {
        const room = io.sockets.adapter.rooms.get(roomCode);
        
        if (room && room.size === 1) { 
            // Room exists and has 1 person waiting!
            socket.join(roomCode);
            socket.emit('roomJoined', roomCode);
            console.log(`User joined room: ${roomCode}`);
        } else if (room && room.size >= 2) {
            socket.emit('errorMsg', 'Room is full! Only 2 players allowed.');
        } else {
            socket.emit('errorMsg', 'Room not found! Check the code.');
        }
    });

    // When a player moves a piece, only send it to their specific room
    socket.on('move', (data) => {
        socket.to(data.room).emit('move', data.move);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is successfully running on port ${PORT}`);
});
