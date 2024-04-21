// Import required modules
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

// Initialize the Express app and create a server
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Define constants for the chessboard size
const BOARD_SIZE = 8;

// Initialize an empty chessboard
let chessboard = Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(0));

// Define player positions (rooks on opposite corners)
let player1 = { x: BOARD_SIZE - 1, y: 0 };
let player2 = { x: 0, y: BOARD_SIZE - 1 };

// Define turn variable (player1 starts)
let currentPlayer = player1;

// Function to check if a move is valid
function isValidMove(x, y) {
    // Check if the move is within the bounds of the chessboard
    if (x < 0 || x >= BOARD_SIZE || y < 0 || y >= BOARD_SIZE) {
        return false;
    }
    // Check if the move is down or left
    if ((x < currentPlayer.x && y === currentPlayer.y) || (x === currentPlayer.x && y > currentPlayer.y)) {
        return true;
    }
    return false;
}

// Function to handle player moves
function movePlayer(x, y) {
    if (isValidMove(x, y)) {
        chessboard[currentPlayer.x][currentPlayer.y] = 0; // Clear current position
        currentPlayer.x = x;
        currentPlayer.y = y;
        chessboard[currentPlayer.x][currentPlayer.y] = 1; // Mark new position
        return true;
    }
    return false;
}

// Socket.io connection handler
io.on('connection', (socket) => {
    console.log('A user connected');
    
    // Send initial game state to the client
    socket.emit('initialState', { chessboard, currentPlayer });
    
    // Handle player moves
    socket.on('move', (data) => {
        if (data && data.x !== undefined && data.y !== undefined) {
            const { x, y } = data;
            if (movePlayer(x, y)) {
                // Broadcast updated game state to all clients
                io.emit('updateState', { chessboard, currentPlayer });
                // Check win condition
                if ((currentPlayer === player1 && currentPlayer.x === 0 && currentPlayer.y === BOARD_SIZE - 1) ||
                    (currentPlayer === player2 && currentPlayer.x === BOARD_SIZE - 1 && currentPlayer.y === 0)) {
                    io.emit('win', { winner: currentPlayer === player1 ? 'Player 1' : 'Player 2' });
                }
                // Switch player turns
                currentPlayer = currentPlayer === player1 ? player2 : player1;
            }
        }
    });
    
    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
