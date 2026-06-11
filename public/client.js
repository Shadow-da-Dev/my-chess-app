const socket = io();
let myRoomCode = "";

// 1. Setup the basic visual board
var board = Chessboard('myBoard', {
    draggable: true,
    dropOffBoard: 'snapback',
    position: 'start',
    onDrop: handleMove
});

// 2. Handle dragging a piece
function handleMove(source, target) {
    // Send the move AND our specific room code to the server
    socket.emit('move', {
        room: myRoomCode,
        move: { source: source, target: target }
    });
}

// 3. Receive a move from our opponent
socket.on('move', function(move) {
    board.move(move.source + '-' + move.target);
});

// --- NEW LOBBY LOGIC ---

// Click "Create Private Game"
document.getElementById('createBtn').addEventListener('click', () => {
    socket.emit('createRoom');
});

// Click "Join Game"
document.getElementById('joinBtn').addEventListener('click', () => {
    const code = document.getElementById('roomInput').value.toUpperCase();
    if (code) {
        socket.emit('joinRoom', code);
    }
});

// When the server successfully puts us in a room
socket.on('roomJoined', (code) => {
    myRoomCode = code;
    // Hide the lobby menu and show the chessboard
    document.getElementById('lobby').style.display = 'none';
    document.getElementById('gameArea').style.display = 'block';
    document.getElementById('roomDisplay').innerText = "Room Code: " + code;
});

// If we type the wrong code
socket.on('errorMsg', (msg) => {
    alert(msg);
});
