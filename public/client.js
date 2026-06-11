// 1. Connect to the real-time server
const socket = io();
let board = null;

// 2. What happens when a player drops a piece?
function onDrop(source, target) {
    // Package the move data
    const move = {
        from: source,
        to: target,
        promotion: 'q' // Always promote to a queen for simplicity right now
    };

    // Send the move to our server to see if it is legal
    socket.emit('move', move);
}

// 3. Configure the visual board
const config = {
    draggable: true,
    position: 'start',
    // NEW: Tell it to grab the piece images from the chessboard.js website!
    pieceTheme: 'https://chessboardjs.com/img/chesspieces/wikipedia/{piece}.png',
    onDrop: onDrop
}

// 4. Draw the board on the screen
board = Chessboard('myBoard', config);

// 5. Listen for the official board state from the server
socket.on('boardState', (fenString) => {
    // Update our visual board to match the server's exact layout
    board.position(fenString);
});

// 6. If the server says our move was illegal, log it
socket.on('invalidMove', (move) => {
    console.log("The server rejected that move:", move);
});