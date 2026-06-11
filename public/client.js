const socket = io();
let myRoomCode = "";
const game = new Chess(); // Create an instance of the chess rules engine

// 1. Setup the visual board
var board = Chessboard('myBoard', {
    draggable: true,
    dropOffBoard: 'snapback',
    position: 'start',
    onDragStart: handleDragStart,
    onDrop: handleMove
});

// Prevent moving pieces if the game is over or it's not your turn
function handleDragStart(source, piece, position, orientation) {
    if (game.game_over()) return false;

    // Only let White move white pieces and Black move black pieces
    if ((game.turn() === 'w' && piece.search(/^b/) !== -1) ||
        (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
        return false;
    }
}

// 2. Handle dragging/dropping a piece
function handleMove(source, target) {
    // Check if the move is legal in the rules engine
    let move = game.move({
        from: source,
        to: target,
        promotion: 'q' // Automatically promote pawns to a Queen for simplicity
    });

    // If the move is illegal, snap the piece back instantly
    if (move === null) return 'snapback';

    // If legal, broadcast it to the opponent via our private room
    socket.emit('move', {
        room: myRoomCode,
        move: { source: source, target: target }
    });

    checkGameStatus();
}

// 3. Receive a move from our opponent
socket.on('move', function(moveData) {
    game.move({
        from: moveData.source,
        to: moveData.target,
        promotion: 'q'
    });
    board.position(game.fen()); // Update the visual board position safely
    checkGameStatus();
});

// 4. Function to check for Checkmate / Stalemate
function checkGameStatus() {
    if (game.in_checkmate()) {
        alert("Game Over! Checkmate.");
    } else if (game.in_draw() || game.in_stalemate()) {
        alert("Game Over! Draw.");
    }
}

// --- LOBBY LOGIC ---
document.getElementById('createBtn').addEventListener('click', () => {
    socket.emit('createRoom');
});

document.getElementById('joinBtn').addEventListener('click', () => {
    const code = document.getElementById('roomInput').value.toUpperCase();
    if (code) {
        socket.emit('joinRoom', code);
    }
});

socket.on('roomJoined', (code) => {
    myRoomCode = code;
    document.getElementById('lobby').style.display = 'none';
    document.getElementById('gameArea').style.display = 'block';
    document.getElementById('roomDisplay').innerText = "Room Code: " + code;
});

socket.on('errorMsg', (msg) => {
    alert(msg);
});
