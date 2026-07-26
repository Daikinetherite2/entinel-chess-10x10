const socket = io();

// UI Elements
const screens = { lobby: document.getElementById('lobby'), waiting: document.getElementById('waiting'), game: document.getElementById('game') };
const usernameInput = document.getElementById('username');
const roomInput = document.getElementById('room-input');
const errorMsg = document.getElementById('error-msg');
const boardElement = document.getElementById('board');
const modal = document.getElementById('modal');

// Game State Variables
let myColor = '';
let myTurn = false;
let roomCode = '';
let boardState = [];
let selectedSquare = null;
let lastMove = null;
let kingInCheck = null;

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

// Pindah Layar
const showScreen = (screenName) => {
    Object.values(screens).forEach(s => s.classList.remove('active'));
    screens[screenName].classList.add('active');
};

// --- LOGIKA LOBBY & SOCKET ---
document.getElementById('btn-create').addEventListener('click', () => {
    const user = usernameInput.value.trim() || 'Player1';
    socket.emit('createRoom', user);
});

document.getElementById('btn-join').addEventListener('click', () => {
    const user = usernameInput.value.trim() || 'Player2';
    const code = roomInput.value.trim().toUpperCase();
    if(code) socket.emit('joinRoom', { roomCode: code, username: user });
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
    boardState = JSON.parse(JSON.stringify(INITIAL_BOARD)); // Clone
    myTurn = myColor === 'white';
    
    document.getElementById('my-name').textContent = myColor === 'white' ? players.white : players.black;
    document.getElementById('opp-name').textContent = myColor === 'white' ? players.black : players.white;
    
    if(myColor === 'black') document.getElementById('board').classList.add('flipped');
    
    updateTurnUI();
    renderBoard();
    showScreen('game');
});

socket.on('errorMsg', (msg) => { errorMsg.textContent = msg; });

socket.on('opponentMove', ({ from, to, promotedPiece }) => {
    executeMoveOnBoard(boardState, from.r, from.c, to.r, to.c, promotedPiece);
    lastMove = { from, to };
    myTurn = true;
    
    postMoveChecks();
    renderBoard();
});

// --- ENGINE CATUR UTAMA ---

const getColor = (piece) => piece ? (piece === piece.toUpperCase() ? 'white' : 'black') : null;
const isEnemy = (p1, p2) => p1 && p2 && getColor(p1) !== getColor(p2);

// Pseudo-Legal Moves (Cara gerak dasar bidak tanpa peduli skak)
const getPseudoLegalMoves = (board, r, c) => {
    const moves = [];
    const piece = board[r][c];
    if (!piece) return moves;
    const color = getColor(piece);
    const type = piece.toLowerCase();
    
    const addIfValid = (nr, nc) => {
        if (nr >= 0 && nr < 10 && nc >= 0 && nc < 10) {
            if (!board[nr][nc] || isEnemy(piece, board[nr][nc])) moves.push({r: nr, c: nc});
            return !board[nr][nc]; // Return true kalau kosong (buat sliding pieces)
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
        // Maju 1
        if (board[r + dir] && board[r + dir][c] === '') {
            moves.push({r: r + dir, c});
            // Maju 2
            if (r === startRow && board[r + dir * 2][c] === '') moves.push({r: r + dir * 2, c});
        }
        // Makan silang
        if (board[r + dir] && board[r + dir][c - 1] && isEnemy(piece, board[r + dir][c - 1])) moves.push({r: r + dir, c: c - 1});
        if (board[r + dir] && board[r + dir][c + 1] && isEnemy(piece, board[r + dir][c + 1])) moves.push({r: r + dir, c: c + 1});
    }
    
    if (type === 'n') [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]].forEach(([dr, dc]) => addIfValid(r+dr, c+dc));
    if (type === 'b' || type === 'q' || type === 's') slide([[-1,-1],[-1,1],[1,-1],[1,1]]);
    if (type === 'r' || type === 'q') slide([[-1,0],[1,0],[0,-1],[0,1]]);
    if (type === 's') [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]].forEach(([dr, dc]) => addIfValid(r+dr, c+dc)); // Sentinel +Kuda
    if (type === 'k') [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]].forEach(([dr, dc]) => addIfValid(r+dr, c+dc));

    return moves;
};

// Cek apakah posisi warna tertentu sedang di-Skak
const isCheck = (board, color) => {
    let kingPos = null;
    for (let r=0; r<10; r++) {
        for (let c=0; c<10; c++) {
            if (board[r][c] === (color === 'white' ? 'K' : 'k')) kingPos = {r, c};
        }
    }
    if (!kingPos) return false;

    // Cek apakah ada bidak musuh yang bisa menyerang King
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

// Filter gerak legal (simulasi gerak, cek kalau bikin diri sendiri terskak)
const getLegalMoves = (board, r, c) => {
    const color = getColor(board[r][c]);
    const pseudoMoves = getPseudoLegalMoves(board, r, c);
    return pseudoMoves.filter(move => {
        // Simulasi
        const tempBoard = board.map(row => [...row]);
        tempBoard[move.r][move.c] = tempBoard[r][c];
        tempBoard[r][c] = '';
        return !isCheck(tempBoard, color);
    });
};

// Eksekusi gerak di data array
const executeMoveOnBoard = (board, r1, c1, r2, c2, promotedPiece = null) => {
    let piece = board[r1][c1];
    // Pawn Promotion Otomatis ke Queen jika sampai ujung
    if (piece.toLowerCase() === 'p' && (r2 === 0 || r2 === 9)) {
        piece = promotedPiece || (getColor(piece) === 'white' ? 'Q' : 'q');
    }
    board[r2][c2] = piece;
    board[r1][c1] = '';
};

// Cek status setelah gerak
const postMoveChecks = () => {
    kingInCheck = null;
    updateTurnUI();

    const myColorTurn = (myTurn && myColor === 'white') || (!myTurn && myColor === 'black') ? 'white' : 'black';
    const isCurrentlyCheck = isCheck(boardState, myColorTurn);
    
    // Cek apakah ada langkah legal sama sekali
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
            
            const piece = boardState[r][c];
            if (piece) {
                const span = document.createElement('span');
                span.className = 'piece';
                span.textContent = PIECES[piece];
                if (piece.toLowerCase() === 's') span.classList.add(piece === 'S' ? 'white-sentinel' : 'black-sentinel');
                square.appendChild(span);
            }

            // Highlights
            if (lastMove && ((lastMove.from.r === r && lastMove.from.c === c) || (lastMove.to.r === r && lastMove.to.c === c))) square.classList.add('last-move');
            if (selectedSquare && selectedSquare.r === r && selectedSquare.c === c) square.classList.add('selected');
            if (kingInCheck && piece && piece.toLowerCase() === 'k' && getColor(piece) === kingInCheck) square.classList.add('in-check');
            
            // Dot Legal Moves
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
    if (!myTurn) return; // Bukan giliranmu

    const clickedPiece = boardState[r][c];

    if (selectedSquare) {
        if (isLegalMove) {
            // Gerak
            let promotedPiece = null;
            if (boardState[selectedSquare.r][selectedSquare.c].toLowerCase() === 'p' && (r === 0 || r === 9)) {
                promotedPiece = myColor === 'white' ? 'Q' : 'q'; // Auto Promote ke Queen
            }

            executeMoveOnBoard(boardState, selectedSquare.r, selectedSquare.c, r, c, promotedPiece);
            const moveData = { from: selectedSquare, to: {r, c}, promotedPiece };
            
            socket.emit('move', { roomCode, ...moveData });
            lastMove = moveData;
            myTurn = false;
            selectedSquare = null;
            
            postMoveChecks();
            renderBoard();
        } else if (getColor(clickedPiece) === myColor) {
            selectedSquare = { r, c }; // Pindah pilihan bidak
            renderBoard();
        } else {
            selectedSquare = null; // Batal pilih
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