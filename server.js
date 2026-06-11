const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('createRoom', () => {
        const roomCode = Math.random().toString(36).substring(2, 6).toUpperCase();
        socket.join(roomCode);
        socket.emit('roomJoined', roomCode);
        console.log('Room created:', roomCode);
    });

    socket.on('joinRoom', (roomCode) => {
        const room = io.sockets.adapter.rooms.get(roomCode);
        if (room && room.size === 1) {
            socket.join(roomCode);
            socket.emit('roomJoined', roomCode);
        } else {
            socket.emit('errorMsg', 'Invalid room code');
        }
    });

    socket.on('move', (data) => {
        socket.to(data.room).emit('move', data.move);
    });
});

server.listen(3000, () => console.log('Server running on port 3000'));
