const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Click "Create" -> Get assigned White ('w')
    socket.on('createRoom', () => {
        const roomCode = Math.random().toString(36).substring(2, 6).toUpperCase();
        socket.join(roomCode);
        socket.emit('roomJoined', roomCode);
        socket.emit('playerColor', 'w'); // <-- NEW: Assign White
        console.log(`Room created: ${roomCode}`);
    });

    // Click "Join" -> Get assigned Black ('b')
    socket.on('joinRoom', (roomCode) => {
        const room = io.sockets.adapter.rooms.get(roomCode);
        
        if (room && room.size === 1) { 
            socket.join(roomCode);
            socket.emit('roomJoined', roomCode);
            socket.emit('playerColor', 'b'); // <-- NEW: Assign Black
            console.log(`User joined room: ${roomCode}`);
        } else if (room && room.size >= 2) {
            socket.emit('errorMsg', 'Room is full! Only 2 players allowed.');
        } else {
            socket.emit('errorMsg', 'Room not found! Check the code.');
        }
    });

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
