const socket = io();
let myRoomCode = "";
let myColor = "w"; // Default to white
const game = new Chess(); 

var board = Chessboard('myBoard', {
    draggable: true,
    dropOffBoard: 'snapback',
    position: 'start',
    onDragStart: handleDragStart,
    onDrop: handleMove
});

// NEW: Receive our color from the server
socket.on('playerColor', (color) => {
    myColor = color;
    // If we are black, physically flip the board!
    if (myColor === 'b') {
        board.orientation('black');
    }
});

// NEW: Strict dragging rules
function handleDragStart(source, piece, position, orientation) {
    if (game.game_over()) return false;

    // 1. You cannot move if it is not your turn
    if (game.turn() !== myColor) return false;

    // 2. You cannot touch the opponent's pieces
    if ((myColor === 'w' && piece.search(/^b/) !== -1) ||
        (myColor === 'b' && piece.search(/^w/) !== -1)) {
        return false;
    }
}

function handleMove(source, target) {
    let move = game.move({
        from: source,
        to: target,
        promotion: 'q' 
    });

    if (move === null) return 'snapback';

    socket.emit('move', {
        room: myRoomCode,
        move: { source: source, target: target }
    });

    checkGameStatus();
}

socket.on('move', function(moveData) {
    game.move({
        from: moveData.source,
        to: moveData.target,
        promotion: 'q'
    });
    board.position(game.fen()); 
    checkGameStatus();
});

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
