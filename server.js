const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'public')));

const rooms = {}; 

function updateRoomList() {
    const publicRooms = {};
    for (const code in rooms) {
        if (rooms[code].players.length === 1) {
            publicRooms[code] = {
                hasPassword: !!rooms[code].password,
                host: rooms[code].players[0].username
            };
        }
    }
    io.emit('roomListUpdate', publicRooms);
}

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    updateRoomList();

    // --- QUICK MATCH (Auto) ---
    socket.on('findMatch', (username) => {
        let foundRoomCode = null;
        for (const code in rooms) {
            if (rooms[code].players.length === 1 && !rooms[code].password) {
                foundRoomCode = code;
                break;
            }
        }

        if (foundRoomCode) {
            rooms[foundRoomCode].players.push({ id: socket.id, username, color: 'black' });
            socket.join(foundRoomCode);
            socket.emit('roomJoined', { roomCode: foundRoomCode, color: 'black' });
            
            io.to(foundRoomCode).emit('startGame', {
                white: rooms[foundRoomCode].players[0].username,
                black: username
            });
            updateRoomList();
        } else {
            const newRoomCode = "AUTO-" + Math.random().toString(36).substring(2, 6).toUpperCase();
            rooms[newRoomCode] = { players: [{ id: socket.id, username, color: 'white' }], password: '' };
            socket.join(newRoomCode);
            socket.emit('roomCreated', { roomCode: newRoomCode, color: 'white' });
            updateRoomList();
        }
    });

    // --- CREATE ROOM MANUAL ---
    socket.on('createRoom', ({ username, roomName, password }) => {
        if (!roomName) return socket.emit('errorMsg', 'Nama Room tidak boleh kosong!');
        if (rooms[roomName]) return socket.emit('errorMsg', 'Nama Room sudah terpakai!');

        rooms[roomName] = { 
            players: [{ id: socket.id, username, color: 'white' }], 
            password: password || '' 
        };
        
        socket.join(roomName);
        socket.emit('roomCreated', { roomCode: roomName, color: 'white' });
        updateRoomList();
    });

    // --- JOIN ROOM MANUAL ---
    socket.on('joinRoomManual', ({ username, roomName, password }) => {
        const room = rooms[roomName];
        
        if (!room) return socket.emit('errorMsg', 'Room tidak ditemukan!');
        if (room.players.length >= 2) return socket.emit('errorMsg', 'Room sudah penuh!');
        
        if (room.password && room.password !== password) {
            return socket.emit('errorMsg', 'Password salah!');
        }

        room.players.push({ id: socket.id, username, color: 'black' });
        socket.join(roomName);
        socket.emit('roomJoined', { roomCode: roomName, color: 'black' });
        
        io.to(roomName).emit('startGame', {
            white: room.players[0].username,
            black: username
        });
        updateRoomList();
    });

    socket.on('move', (data) => {
        socket.to(data.roomCode).emit('opponentMove', data);
    });

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
        for (const code in rooms) {
            rooms[code].players = rooms[code].players.filter(p => p.id !== socket.id);
            if (rooms[code].players.length === 0) {
                delete rooms[code];
            }
        }
        updateRoomList();
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server SentinelChess Cyberpunk berjalan di http://localhost:${PORT}`);
});
