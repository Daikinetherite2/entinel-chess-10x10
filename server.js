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
        publicRooms[code] = {
            hasPassword: !!rooms[code].password,
            host: rooms[code].players[0] ? rooms[code].players[0].username : 'Unknown',
            playerCount: rooms[code].players.length
        };
    }
    io.emit('roomListUpdate', publicRooms);
}

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    updateRoomList();

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
            rooms[newRoomCode] = { players: [{ id: socket.id, username, color: 'white' }], spectators: [], password: '' };
            socket.join(newRoomCode);
            socket.emit('roomCreated', { roomCode: newRoomCode, color: 'white' });
            updateRoomList();
        }
    });

    socket.on('createRoom', ({ username, roomName, password }) => {
        if (!roomName) return socket.emit('errorMsg', 'Nama Room tidak boleh kosong!');
        if (rooms[roomName]) return socket.emit('errorMsg', 'Nama Room sudah terpakai!');

        rooms[roomName] = { 
            players: [{ id: socket.id, username, color: 'white' }], 
            spectators: [],
            password: password || '' 
        };
        
        socket.join(roomName);
        socket.emit('roomCreated', { roomCode: roomName, color: 'white' });
        updateRoomList();
    });

    socket.on('joinRoomManual', ({ username, roomName, password }) => {
        const room = rooms[roomName];
        if (!room) return socket.emit('errorMsg', 'Room tidak ditemukan!');
        
        if (room.password && room.password !== password) {
            return socket.emit('errorMsg', 'Password salah!');
        }

        if (room.players.length < 2) {
            room.players.push({ id: socket.id, username, color: 'black' });
            socket.join(roomName);
            socket.emit('roomJoined', { roomCode: roomName, color: 'black' });
            
            io.to(roomName).emit('startGame', {
                white: room.players[0].username,
                black: username
            });
        } else {
            room.spectators.push({ id: socket.id, username });
            socket.join(roomName);
            if (room.players[0]) {
                io.to(room.players[0].id).emit('requestSync', socket.id);
            }
        }
        updateRoomList();
    });

    socket.on('syncData', (data) => {
        io.to(data.targetId).emit('syncGame', data);
    });

    socket.on('move', (data) => {
        socket.to(data.roomCode).emit('opponentMove', data);
    });

    socket.on('timeOut', ({ roomCode, loserColor }) => {
        io.to(roomCode).emit('gameOverTimeOut', loserColor);
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
            rooms[code].spectators = rooms[code].spectators.filter(s => s.id !== socket.id);
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