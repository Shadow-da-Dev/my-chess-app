const socket = io();
let myRoomCode = "";
const game = new Chess();

// Init Game Board (Game Screen)
var board = Chessboard('myBoard', {
    draggable: true,
    position: 'start',
    pieceTheme: 'https://unpkg.com/@chrisoakman/chessboardjs@1.0.0/dist/img/chesspieces/wikipedia/{piece}.png',
    onDrop: (source, target) => {
        let move = game.move({ from: source, to: target, promotion: 'q' });
        if (move === null) return 'snapback';
        socket.emit('move', { room: myRoomCode, move: { source, target } });
    }
});

// Button Listeners
document.getElementById('createBtn').addEventListener('click', () => {
    socket.emit('createRoom');
});

document.getElementById('joinBtn').addEventListener('click', () => {
    const code = document.getElementById('roomInput').value.toUpperCase();
    socket.emit('joinRoom', code);
});

// Socket Listeners
socket.on('roomJoined', (code) => {
    myRoomCode = code;
    // Switch to Game Screen
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active-screen'));
    document.getElementById('gameArea').classList.add('active-screen');
    document.getElementById('roomDisplay').innerText = "Room Code: " + code;
});

socket.on('move', (data) => {
    game.move({ from: data.source, to: data.target, promotion: 'q' });
    board.position(game.fen());
});

socket.on('errorMsg', (msg) => alert(msg));
