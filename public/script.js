const socket = io();

const screens = { lobby: document.getElementById('lobby'), waiting: document.getElementById('waiting'), game: document.getElementById('game') };
const usernameInput = document.getElementById('username');
const createRoomNameInput = document.getElementById('create-room-name');
const createRoomPassInput = document.getElementById('create-room-pass');
const errorMsg = document.getElementById('error-msg');
const boardElement = document.getElementById('board');
const modal = document.getElementById('modal');
const glitchOverlay = document.getElementById('glitch-overlay');
const roomListContainer = document.getElementById('room-list-container');

const passwordModal = document.getElementById('password-modal');
const manualJoinPassInput = document.getElementById('manual-join-pass');
const targetRoomLabel = document.getElementById('target-room-label');

let myColor = '';
let myTurn = false;
let roomCode = '';
let boardState = [];
let selectedSquare = null;
let lastMove = null;
let kingInCheck = null;
let selectedRoomToJoin = '';

// Variabel Timer & Captured Pieces
let myTime = 300; // 5 Menit dalam detik
let oppTime = 300;
let timerInterval = null;
let capturedByMe = [];
let capturedByOpp = [];

const PIECES = {
    'r': '♜', 'n': '♞', 's': '♆', 'b': '♝', 'q': '♛', 'k': '♚', 'p': '♟',
    'R': '♖', 'N': '♘', 'S': '♆', 'B': '♗', 'Q': '♕', 'K': '♔', 'P': '♙'
};

const INITIAL_BOARD = [
    ['r', 'n', 's', 'b', 'q', 'k', 'b', 's', 'n', 'r'],
    ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
    ['', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', ''],
    ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
    ['R', 'N', 'S', 'B', 'Q', 'K', 'B', 'S', 'N', 'R']
];

const showScreen = (screenName) => {
    Object.values(screens).forEach(s => s.classList.remove('active'));
    screens[screenName].classList.add('active');
    errorMsg.textContent = '';
};

// --- REAL-TIME ROOM LIST MANUAL ---
socket.on('roomListUpdate', (rooms) => {
    roomListContainer.innerHTML = '';
    const roomKeys = Object.keys(rooms);
    
    if (roomKeys.length === 0) {
        roomListContainer.innerHTML = '<p class="small-text">Tidak ada room manual aktif.</p>';
        return;
    }

    roomKeys.forEach(code => {
        const roomData = rooms[code];
        const item = document.createElement('div');
        item.className = 'room-item';
        
        const label = document.createElement('span');
        label.textContent = `${code} (Host: ${roomData.host}) ${roomData.hasPassword ? '🔒' : '🌐'}`;
        
        const joinBtn = document.createElement('button');
        joinBtn.className = 'btn primary';
        joinBtn.textContent = 'JOIN';
        
        joinBtn.addEventListener('click', () => {
            const username = usernameInput.value.trim() || 'HackerMisterius';
            if (roomData.hasPassword) {
                selectedRoomToJoin = code;
                targetRoomLabel.textContent = `Room "${code}" pakai password:`;
                manualJoinPassInput.value = '';
                passwordModal.classList.remove('hidden');
            } else {
                socket.emit('joinRoomManual', { username, roomName: code, password: '' });
            }
        });

        item.appendChild(label);
        item.appendChild(joinBtn);
        roomListContainer.appendChild(item);
    });
});

document.getElementById('btn-submit-pass').addEventListener('click', () => {
    const username = usernameInput.value.trim() || 'HackerMisterius';
    const password = manualJoinPassInput.value.trim();
    passwordModal.classList.add('hidden');
    socket.emit('joinRoomManual', { username, roomName: selectedRoomToJoin, password });
});

document.getElementById('btn-cancel-pass').addEventListener('click', () => {
    passwordModal.classList.add('hidden');
});

// --- TOMBOL AKSI ---
document.getElementById('btn-quickmatch').addEventListener('click', () => {
    const user = usernameInput.value.trim() || 'HackerMisterius';
    socket.emit('findMatch', user);
});

document.getElementById('btn-create').addEventListener('click', () => {
    const username = usernameInput.value.trim() || 'Player1';
    const roomName = createRoomNameInput.value.trim();
    const password = createRoomPassInput.value.trim();
    socket.emit('createRoom', { username, roomName, password });
});

socket.on('roomCreated', (data) => {
    roomCode = data.roomCode;
    myColor = data.color;
    document.getElementById('display-room-code').textContent = roomCode;
    showScreen('waiting');
});

socket.on('roomJoined', (data) => {
    roomCode = data.roomCode;
    myColor = data.color;
});

socket.on('startGame', (players) => {
    boardState = JSON.parse(JSON.stringify(INITIAL_BOARD));
    myTurn = myColor === 'white';
    myTime = 300;
    oppTime = 300;
    capturedByMe = [];
    capturedByOpp = [];
    updateCapturedUI();
    
    document.getElementById('my-name').textContent = myColor === 'white' ? players.white : players.black;
    document.getElementById('opp-name').textContent = myColor === 'white' ? players.black : players.white;
    
    if(myColor === 'black') document.getElementById('board').classList.add('flipped');
    
    updateTurnUI();
    renderBoard();
    startTimer();

    glitchOverlay.classList.remove('hidden');
    setTimeout(() => {
        glitchOverlay.classList.add('hidden');
        showScreen('game');
    }, 1800);
});

socket.on('errorMsg', (msg) => { errorMsg.textContent = msg; });

socket.on('opponentMove', ({ from, to, promotedPiece, isCapture, capturedPiece }) => {
    if (capturedPiece) {
        capturedByOpp.push(capturedPiece);
        updateCapturedUI();
    }
    executeMoveOnBoard(boardState, from.r, from.c, to.r, to.c, promotedPiece);
    lastMove = { from, to, isCapture };
    myTurn = true;
    
    postMoveChecks();
    renderBoard();
});

socket.on('gameOverTimeOut', (loserColor) => {
    clearInterval(timerInterval);
    const iLost = loserColor === myColor;
    endGame(iLost ? "Waktu Habis! Kamu Kalah." : "Waktu Lawan Habis! Kamu Menang.");
});

// --- TIMER & CAPTURED UI LOGIC ---
function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        if (myTurn && myTime > 0) {
            myTime--;
            if (myTime <= 0) {
                clearInterval(timerInterval);
                socket.emit('timeOut', { roomCode, loserColor: myColor });
            }
        } else if (!myTurn && oppTime > 0) {
            oppTime--;
        }
        updateTimerUI();
    }, 1000);
}

function updateTimerUI() {
    document.getElementById('my-timer').textContent = formatTime(myTime);
    document.getElementById('opp-timer').textContent = formatTime(oppTime);
}

function formatTime(seconds) {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
}

function updateCapturedUI() {
    document.getElementById('my-captured').textContent = capturedByMe.map(p => PIECES[p] || p).join(' ');
    document.getElementById('opp-captured').textContent = capturedByOpp.map(p => PIECES[p] || p).join(' ');
}

// --- ENGINE CATUR UTAMA ---
const getColor = (piece) => piece ? (piece === piece.toUpperCase() ? 'white' : 'black') : null;
const isEnemy = (p1, p2) => p1 && p2 && getColor(p1) !== getColor(p2);

const getPseudoLegalMoves = (board, r, c) => {
    const moves = [];
    const piece = board[r][c];
    if (!piece) return moves;
    const color = getColor(piece);
    const type = piece.toLowerCase();
    
    const addIfValid = (nr, nc) => {
        if (nr >= 0 && nr < 10 && nc >= 0 && nc < 10) {
            if (!board[nr][nc] || isEnemy(piece, board[nr][nc])) moves.push({r: nr, c: nc});
            return !board[nr][nc];
        }
        return false;
    };

    const slide = (dirs) => {
        dirs.forEach(([dr, dc]) => {
            let nr = r + dr, nc = c + dc;
            while (addIfValid(nr, nc) && board[nr][nc] === '') { nr += dr; nc += dc; }
        });
    };

    if (type === 'p') {
        const dir = color === 'white' ? -1 : 1;
        const startRow = color === 'white' ? 8 : 1;
        if (board[r + dir] && board[r + dir][c] === '') {
            moves.push({r: r + dir, c});
            if (r === startRow && board[r + dir * 2][c] === '') moves.push({r: r + dir * 2, c});
        }
        if (board[r + dir] && board[r + dir][c - 1] && isEnemy(piece, board[r + dir][c - 1])) moves.push({r: r + dir, c: c - 1});
        if (board[r + dir] && board[r + dir][c + 1] && isEnemy(piece, board[r + dir][c + 1])) moves.push({r: r + dir, c: c + 1});
    }
    
    if (type === 'n') [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]].forEach(([dr, dc]) => addIfValid(r+dr, c+dc));
    if (type === 'b' || type === 'q' || type === 's') slide([[-1,-1],[-1,1],[1,-1],[1,1]]);
    if (type === 'r' || type === 'q') slide([[-1,0],[1,0],[0,-1],[0,1]]);
    if (type === 's') [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]].forEach(([dr, dc]) => addIfValid(r+dr, c+dc));
    if (type === 'k') [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]].forEach(([dr, dc]) => addIfValid(r+dr, c+dc));

    return moves;
};

const isCheck = (board, color) => {
    let kingPos = null;
    for (let r=0; r<10; r++) {
        for (let c=0; c<10; c++) {
            if (board[r][c] === (color === 'white' ? 'K' : 'k')) kingPos = {r, c};
        }
    }
    if (!kingPos) return false;

    for (let r=0; r<10; r++) {
        for (let c=0; c<10; c++) {
            if (getColor(board[r][c]) && getColor(board[r][c]) !== color) {
                const enemyMoves = getPseudoLegalMoves(board, r, c);
                if (enemyMoves.some(m => m.r === kingPos.r && m.c === kingPos.c)) return true;
            }
        }
    }
    return false;
};

const getLegalMoves = (board, r, c) => {
    const color = getColor(board[r][c]);
    const pseudoMoves = getPseudoLegalMoves(board, r, c);
    return pseudoMoves.filter(move => {
        const tempBoard = board.map(row => [...row]);
        tempBoard[move.r][move.c] = tempBoard[r][c];
        tempBoard[r][c] = '';
        return !isCheck(tempBoard, color);
    });
};

const executeMoveOnBoard = (board, r1, c1, r2, c2, promotedPiece = null) => {
    let piece = board[r1][c1];
    if (piece.toLowerCase() === 'p' && (r2 === 0 || r2 === 9)) {
        piece = promotedPiece || (getColor(piece) === 'white' ? 'Q' : 'q');
    }
    board[r2][c2] = piece;
    board[r1][c1] = '';
};

const postMoveChecks = () => {
    kingInCheck = null;
    updateTurnUI();

    const myColorTurn = (myTurn && myColor === 'white') || (!myTurn && myColor === 'black') ? 'white' : 'black';
    const isCurrentlyCheck = isCheck(boardState, myColorTurn);
    
    let hasLegalMoves = false;
    for (let r=0; r<10; r++) {
        for (let c=0; c<10; c++) {
            if (getColor(boardState[r][c]) === myColorTurn) {
                if (getLegalMoves(boardState, r, c).length > 0) hasLegalMoves = true;
            }
        }
    }

    if (isCurrentlyCheck) kingInCheck = myColorTurn;

    if (!hasLegalMoves) {
        if (isCurrentlyCheck) {
            endGame(`Checkmate! ${myColorTurn === 'white' ? 'Hitam' : 'Putih'} Menang.`);
        } else {
            endGame("Stalemate! Game Draw.");
        }
    }
};

// --- RENDERING UI ---
function renderBoard() {
    boardElement.innerHTML = '';
    let legalMovesForSelected = [];
    if (selectedSquare) legalMovesForSelected = getLegalMoves(boardState, selectedSquare.r, selectedSquare.c);

    for (let r = 0; r < 10; r++) {
        for (let c = 0; c < 10; c++) {
            const square = document.createElement('div');
            square.className = `square ${(r + c) % 2 === 0 ? 'light' : 'dark'}`;
            
            if (lastMove && lastMove.to.r === r && lastMove.to.c === c && lastMove.isCapture) {
                square.classList.add('square-captured');
            }

            const piece = boardState[r][c];
            if (piece) {
                const span = document.createElement('span');
                span.className = 'piece';
                span.textContent = PIECES[piece];

                if (lastMove && lastMove.to.r === r && lastMove.to.c === c) {
                    span.classList.add('piece-moved');
                }

                if (piece.toLowerCase() === 's') span.classList.add(piece === 'S' ? 'white-sentinel' : 'black-sentinel');
                square.appendChild(span);
            }

            if (lastMove && ((lastMove.from.r === r && lastMove.from.c === c) || (lastMove.to.r === r && lastMove.to.c === c))) square.classList.add('last-move');
            if (selectedSquare && selectedSquare.r === r && selectedSquare.c === c) square.classList.add('selected');
            if (kingInCheck && piece && piece.toLowerCase() === 'k' && getColor(piece) === kingInCheck) square.classList.add('in-check');
            
            const isLegal = legalMovesForSelected.find(m => m.r === r && m.c === c);
            if (isLegal) {
                square.classList.add('legal-move-hint');
                if (piece) square.classList.add('capture-hint');
            }

            square.addEventListener('click', () => onSquareClick(r, c, isLegal));
            boardElement.appendChild(square);
        }
    }
}

function onSquareClick(r, c, isLegalMove) {
    if (!myTurn) return;

    const clickedPiece = boardState[r][c];

    if (selectedSquare) {
        if (isLegalMove) {
            const targetPiece = boardState[r][c];
            const isCapture = targetPiece !== '';
            let capturedPiece = null;

            if (isCapture) {
                capturedPiece = targetPiece;
                capturedByMe.push(capturedPiece);
                updateCapturedUI();
            }

            let promotedPiece = null;
            if (boardState[selectedSquare.r][selectedSquare.c].toLowerCase() === 'p' && (r === 0 || r === 9)) {
                promotedPiece = myColor === 'white' ? 'Q' : 'q';
            }

            executeMoveOnBoard(boardState, selectedSquare.r, selectedSquare.c, r, c, promotedPiece);
            const moveData = { from: selectedSquare, to: {r, c}, promotedPiece, isCapture, capturedPiece };
            
            socket.emit('move', { roomCode, ...moveData });
            lastMove = moveData;
            myTurn = false;
            selectedSquare = null;
            
            postMoveChecks();
            renderBoard();
        } else if (getColor(clickedPiece) === myColor) {
            selectedSquare = { r, c };
            renderBoard();
        } else {
            selectedSquare = null;
            renderBoard();
        }
    } else {
        if (getColor(clickedPiece) === myColor) {
            selectedSquare = { r, c };
            renderBoard();
        }
    }
}

function updateTurnUI() {
    document.getElementById('my-status').style.opacity = myTurn ? '1' : '0';
    document.getElementById('opp-status').style.opacity = !myTurn ? '1' : '0';
    document.getElementById('opp-status').textContent = !myTurn ? 'Giliran Lawan' : '';
}

function endGame(msg) {
    myTurn = false;
    if (timerInterval) clearInterval(timerInterval);
    document.getElementById('modal-title').textContent = "Pertandingan Selesai";
    document.getElementById('modal-desc').textContent = msg;
    modal.classList.remove('hidden');
}

// --- KONTROL TAMBAHAN ---
document.getElementById('btn-flip').addEventListener('click', () => {
    boardElement.classList.toggle('flipped');
});

document.getElementById('btn-resign').addEventListener('click', () => {
    if(confirm('Yakin ingin menyerah?')) {
        socket.emit('resign', roomCode);
        endGame('Kamu Menyerah.');
    }
});

document.getElementById('btn-draw').addEventListener('click', () => {
    socket.emit('drawOffer', roomCode);
    alert('Tawaran Draw dikirim!');
});

socket.on('opponentResigned', () => endGame('Lawan Menyerah! Kamu Menang.'));
socket.on('drawOffered', () => {
    if(confirm('Lawan menawarkan Draw. Terima?')) {
        socket.emit('drawAccepted', roomCode);
        endGame('Draw Diterima.');
    }
});
socket.on('gameDrawn', () => endGame('Game Berakhir Draw.'));
