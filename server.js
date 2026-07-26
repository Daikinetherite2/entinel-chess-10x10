const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'public')));

// Menyimpan data room
const rooms = {}; 

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Bikin Room Baru
    socket.on('createRoom', (username) => {
        const roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        rooms[roomCode] = { players: [{ id: socket.id, username, color: 'white' }] };
        socket.join(roomCode);
        socket.emit('roomCreated', { roomCode, color: 'white' });
    });

    // Join Room
    socket.on('joinRoom', ({ roomCode, username }) => {
        const room = rooms[roomCode];
        if (room && room.players.length === 1) {
            room.players.push({ id: socket.id, username, color: 'black' });
            socket.join(roomCode);
            socket.emit('roomJoined', { roomCode, color: 'black' });
            
            // Beritahu kedua pemain game dimulai
            io.to(roomCode).emit('startGame', {
                white: room.players[0].username,
                black: username
            });
        } else {
            socket.emit('errorMsg', 'Room penuh atau tidak ditemukan!');
        }
    });

    // Handle Gerakan (Move)
    socket.on('move', (data) => {
        socket.to(data.roomCode).emit('opponentMove', data);
    });

    // Handle Resign & Draw
    socket.on('resign', (roomCode) => {
        socket.to(roomCode).emit('opponentResigned');
    });

    socket.on('drawOffer', (roomCode) => {
        socket.to(roomCode).emit('drawOffered');
    });

    socket.on('drawAccepted', (roomCode) => {
        io.to(roomCode).emit('gameDrawn');
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        // Clean up room jika pemain disconnect (bisa ditambahkan logika lanjutan)
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server jalan di http://localhost:${PORT}`);
});