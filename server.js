const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { Chess } = require('chess.js');

// Setup the server and WebSocket
const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Tell the server to serve all the files inside our 'public' folder
app.use(express.static('public'));

// Initialize the chess engine to act as our referee
const chess = new Chess();

// Handle player connections
io.on('connection', (socket) => {
    console.log('A player connected:', socket.id);

    // Send the current state of the board
    socket.emit('boardState', chess.fen());

    // Listen for moves
    socket.on('move', (move) => {
        try {
            const result = chess.move(move);

            if (result) {
                // If the move is legal, update everyone
                io.emit('boardState', chess.fen());
            } else {
                // If illegal, reject it
                socket.emit('invalidMove', move);
            }
        } catch (error) {
            socket.emit('invalidMove', move);
        }
    });

    socket.on('disconnect', () => {
        console.log('A player disconnected:', socket.id);
    });
});

// NEW: Let Render choose the port but default to 3000 on your laptop
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is successfully running on http://localhost:${PORT}`);
});
