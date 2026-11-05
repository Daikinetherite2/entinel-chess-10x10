const socket = io();

// --- KAMUS BAHASA (DICTIONARY) ---
const TRANSLATIONS = {
    id: {
        input_name: "Masukkan Nama Anda...", btn_auto: "⚡ CARI LAWAN AUTO",
        ai_easy: "🟢 AI LEVEL: EASY (Noob)", ai_normal: "🟡 AI LEVEL: NORMAL (Tukang Makan)", ai_hard: "🔴 AI LEVEL: HARD (Pro & Safety)",
        btn_ai: "🤖 PLAY VS AI", div_manual: "// FIND A ROOM MANUAL //", searching_room: "Mencari room manual tersedia...",
        div_create: "// CREATE ROOM //", room_name: "Nama Room Baru", room_pass: "Password (Opsional)",
        time_1m: "⏱️ Timer: Bullet (1 Menit)", time_3m: "⏱️ Timer: Blitz (3 Menit)", time_5m: "⏱️ Timer: Standard (5 Menit)", time_10m: "⏱️ Timer: Rapid (10 Menit)",
        btn_create: "BUAT ROOM", modal_pass_title: "ROOM TERPROTEKSI", modal_pass_label: "Masukkan password untuk masuk:",
        btn_submit: "MASUK", btn_cancel: "BATAL", wait_title: "MENUNGGU LAWAN...", wait_desc: "Nama Room Kamu:", wait_sub: "Bagikan nama room ke temanmu atau tunggu lawan masuk.",
        opp_waiting: "Menunggu...", your_turn: "Giliran Kamu", opp_turn: "Giliran Lawan", spectating: "SPECTATING",
        btn_resign: "🏳️ RESIGN", btn_draw: "🤝 DRAW", btn_flip: "🔄 FLIP",
        log_title: "📝 MOVE LOG", log_no: "No.", log_white: "Putih", log_black: "Hitam",
        chat_title: "💬 TERMINAL CHAT", chat_ph: "> Ketik pesan lalu Enter...", btn_close_chat: "✖ TUTUP MENU",
        go_title: "Game Over", btn_back: "KEMBALI KE LOBBY",
        glitch_text: "UPLINK ESTABLISHED", glitch_sub: "INITIALIZING BATTLEFIELD...",
        err_empty_room: "Nama Room tidak boleh kosong!", bot_thinking: "Bot sedang berpikir...",
        time_out_lose: "Waktu Habis! Kamu Kalah.", time_out_win: "Waktu Lawan Habis! Kamu Menang.", time_out_spec: "Waktu Habis! Game Selesai.",
        draw_reject: "Bot Cyberpunk menolak tawaran Draw! Lanjutkan pertarungan!", draw_sent: "Tawaran Draw dikirim!",
        surrender_confirm: "Yakin ingin menyerah?", you_surrender: "Kamu Menyerah.", opp_surrender: "Lawan Menyerah! Kamu Menang.", spec_surrender: "Salah satu pemain menyerah! Game Selesai.",
        draw_offer: "Lawan menawarkan Draw. Terima?", draw_accept: "Draw Diterima.", draw_game: "Game Berakhir Draw.",
        checkmate: "Checkmate!", stalemate: "Stalemate! Game Draw.", win: "Menang.", black: "Hitam", white: "Putih",
        no_room: "Tidak ada room manual aktif.", btn_watch: "WATCH", btn_join: "JOIN", pass_req: "pakai password:"
    },
    ms: {
        input_name: "Masukkan Nama Anda...", btn_auto: "⚡ CARI LAWAN AUTO",
        ai_easy: "🟢 TAHAP AI: MUDAH (Noob)", ai_normal: "🟡 TAHAP AI: BIASA (Suka Makan)", ai_hard: "🔴 TAHAP AI: SUSAH (Pro & Selamat)",
        btn_ai: "🤖 MAIN VS AI", div_manual: "// CARI BILIK MANUAL //", searching_room: "Mencari bilik manual yang ada...",
        div_create: "// CIPTA BILIK //", room_name: "Nama Bilik Baru", room_pass: "Kata Laluan (Pilihan)",
        time_1m: "⏱️ Masa: Bullet (1 Minit)", time_3m: "⏱️ Masa: Blitz (3 Minit)", time_5m: "⏱️ Masa: Standard (5 Minit)", time_10m: "⏱️ Masa: Rapid (10 Minit)",
        btn_create: "CIPTA BILIK", modal_pass_title: "BILIK DILINDUNGI", modal_pass_label: "Masukkan kata laluan untuk masuk:",
        btn_submit: "MASUK", btn_cancel: "BATAL", wait_title: "MENUNGGU LAWAN...", wait_desc: "Nama Bilik Anda:", wait_sub: "Kongsikan nama bilik kepada rakan atau tunggu lawan.",
        opp_waiting: "Menunggu...", your_turn: "Giliran Anda", opp_turn: "Giliran Lawan", spectating: "MENONTON",
        btn_resign: "🏳️ MENYERAH", btn_draw: "🤝 SERI", btn_flip: "🔄 PUSING",
        log_title: "📝 REKOD GERAKAN", log_no: "No.", log_white: "Putih", log_black: "Hitam",
        chat_title: "💬 TERMINAL SEMBANG", chat_ph: "> Taip mesej & Enter...", btn_close_chat: "✖ TUTUP MENU",
        go_title: "Permainan Tamat", btn_back: "KEMBALI KE LOBI",
        glitch_text: "PAUTAN DITETAPKAN", glitch_sub: "MEMULAKAN MEDAN TEMPUR...",
        err_empty_room: "Nama Bilik tidak boleh kosong!", bot_thinking: "Bot sedang berfikir...",
        time_out_lose: "Masa Tamat! Anda Kalah.", time_out_win: "Masa Lawan Tamat! Anda Menang.", time_out_spec: "Masa Tamat! Permainan Selesai.",
        draw_reject: "Bot Cyberpunk menolak tawaran Seri! Teruskan!", draw_sent: "Tawaran Seri dihantar!",
        surrender_confirm: "Pasti mahu menyerah?", you_surrender: "Anda Menyerah.", opp_surrender: "Lawan Menyerah! Anda Menang.", spec_surrender: "Salah seorang menyerah! Permainan Selesai.",
        draw_offer: "Lawan menawarkan Seri. Terima?", draw_accept: "Seri Diterima.", draw_game: "Permainan Berakhir Seri.",
        checkmate: "Checkmate!", stalemate: "Stalemate! Permainan Seri.", win: "Menang.", black: "Hitam", white: "Putih",
        no_room: "Tiada bilik manual aktif.", btn_watch: "TONTON", btn_join: "MASUK", pass_req: "guna kata laluan:"
    },
    en: {
        input_name: "Enter Your Name...", btn_auto: "⚡ AUTO QUICKMATCH",
        ai_easy: "🟢 AI LEVEL: EASY (Noob)", ai_normal: "🟡 AI LEVEL: NORMAL (Greedy)", ai_hard: "🔴 AI LEVEL: HARD (Pro & Safe)",
        btn_ai: "🤖 PLAY VS AI", div_manual: "// FIND A ROOM //", searching_room: "Searching for available rooms...",
        div_create: "// CREATE ROOM //", room_name: "New Room Name", room_pass: "Password (Optional)",
        time_1m: "⏱️ Timer: Bullet (1 Min)", time_3m: "⏱️ Timer: Blitz (3 Min)", time_5m: "⏱️ Timer: Standard (5 Min)", time_10m: "⏱️ Timer: Rapid (10 Min)",
        btn_create: "CREATE ROOM", modal_pass_title: "PROTECTED ROOM", modal_pass_label: "Enter password to join:",
        btn_submit: "ENTER", btn_cancel: "CANCEL", wait_title: "WAITING FOR OPPONENT...", wait_desc: "Your Room Name:", wait_sub: "Share this room name or wait for an opponent.",
        opp_waiting: "Waiting...", your_turn: "Your Turn", opp_turn: "Opponent's Turn", spectating: "SPECTATING",
        btn_resign: "🏳️ RESIGN", btn_draw: "🤝 DRAW", btn_flip: "🔄 FLIP",
        log_title: "📝 MOVE LOG", log_no: "No.", log_white: "White", log_black: "Black",
        chat_title: "💬 TERMINAL CHAT", chat_ph: "> Type message & Enter...", btn_close_chat: "✖ CLOSE MENU",
        go_title: "Game Over", btn_back: "BACK TO LOBBY",
        glitch_text: "UPLINK ESTABLISHED", glitch_sub: "INITIALIZING BATTLEFIELD...",
        err_empty_room: "Room Name cannot be empty!", bot_thinking: "Bot is thinking...",
        time_out_lose: "Time's Up! You Lose.", time_out_win: "Opponent's Time Up! You Win.", time_out_spec: "Time's Up! Game Over.",
        draw_reject: "Bot rejects your draw offer! Fight on!", draw_sent: "Draw offer sent!",
        surrender_confirm: "Are you sure you want to resign?", you_surrender: "You Resigned.", opp_surrender: "Opponent Resigned! You Win.", spec_surrender: "A player resigned! Game Over.",
        draw_offer: "Opponent offers a draw. Accept?", draw_accept: "Draw Accepted.", draw_game: "Game ended in a Draw.",
        checkmate: "Checkmate!", stalemate: "Stalemate! Game is a Draw.", win: "Wins.", black: "Black", white: "White",
        no_room: "No active manual rooms.", btn_watch: "WATCH", btn_join: "JOIN", pass_req: "requires password:"
    },
    zh: {
        input_name: "输入您的名字...", btn_auto: "⚡ 自动匹配",
        ai_easy: "🟢 AI 难度: 简单", ai_normal: "🟡 AI 难度: 正常", ai_hard: "🔴 AI 难度: 困难",
        btn_ai: "🤖 挑战 AI", div_manual: "// 寻找房间 //", searching_room: "正在搜索可用房间...",
        div_create: "// 创建房间 //", room_name: "新房间名称", room_pass: "密码 (可选)",
        time_1m: "⏱️ 时间: 子弹 (1 分钟)", time_3m: "⏱️ 时间: 闪电 (3 分钟)", time_5m: "⏱️ 时间: 标准 (5 分钟)", time_10m: "⏱️ 时间: 快速 (10 分钟)",
        btn_create: "创建房间", modal_pass_title: "受保护的房间", modal_pass_label: "输入密码加入:",
        btn_submit: "进入", btn_cancel: "取消", wait_title: "等待对手...", wait_desc: "您的房间名称:", wait_sub: "分享房间名称或等待对手加入。",
        opp_waiting: "等待中...", your_turn: "你的回合", opp_turn: "对手回合", spectating: "观战中",
        btn_resign: "🏳️ 认输", btn_draw: "🤝 求和", btn_flip: "🔄 翻转",
        log_title: "📝 移动日志", log_no: "编号", log_white: "白方", log_black: "黑方",
        chat_title: "💬 终端聊天", chat_ph: "> 输入消息并按回车...", btn_close_chat: "✖ 关闭菜单",
        go_title: "游戏结束", btn_back: "返回大厅",
        glitch_text: "上行链接已建立", glitch_sub: "初始化战场...",
        err_empty_room: "房间名称不能为空！", bot_thinking: "AI 正在思考...",
        time_out_lose: "时间到！你输了。", time_out_win: "对手时间到！你赢了。", time_out_spec: "时间到！游戏结束。",
        draw_reject: "赛博朋克 AI 拒绝了您的求和！继续战斗！", draw_sent: "已发送求和请求！",
        surrender_confirm: "确定要认输吗？", you_surrender: "你已认输。", opp_surrender: "对手认输！你赢了。", spec_surrender: "一名玩家已认输！游戏结束。",
        draw_offer: "对手请求和棋。接受吗？", draw_accept: "已接受和棋。", draw_game: "游戏以平局结束。",
        checkmate: "将死！", stalemate: "逼和！平局。", win: "获胜。", black: "黑方", white: "白方",
        no_room: "没有活跃的房间。", btn_watch: "观战", btn_join: "加入", pass_req: "需要密码:"
    }
};

// Professional lobby & arena copy (kept separate for simple future editing)
const UI_COPY = {
  id: {
    nav_play:'Main', nav_rooms:'Room', nav_guide:'Panduan', hero_eyebrow:'DIMENSI BARU STRATEGI',
    hero_title_1:'Langkah berikutnya', hero_title_2:'milikmu.',
    hero_description:'Lebih banyak petak. Lebih banyak strategi. Rasakan catur 10×10 dengan bidak Sentinel eksklusif, pertandingan online, dan lawan AI.',
    btn_explore:'Lihat room ↗', benefit_1:'Multiplayer real-time', benefit_2:'3 tingkat kesulitan AI',
    board_eyebrow:'MEMPERKENALKAN', board_title:'Arena yang lebih besar.', sentinel_title:'Kenali bidak Sentinel.',
    sentinel_description:'Bidak unik yang memadukan langkah gajah dan kuda. Satu gerakan dapat mengubah segalanya.',
    sentinel_footnote:'BIDAK EKSKLUSIF 10×10', stat_squares:'Petak papan', stat_languages:'Bahasa', stat_moves:'Kemungkinan',
    play_label:'PERTANDINGANMU', play_heading:'Siap bermain?', play_description:'Siapkan profil dan pilih cara bermain favoritmu.',
    username_label:'NAMA PEMAIN', computer_heading:'LAWAN KOMPUTER', difficulty_label:'TINGKAT KESULITAN', time_label:'BATAS WAKTU',
    play_note:'Tidak perlu akun untuk mulai bermain.', multiplayer_label:'MULTIPLAYER', rooms_heading:'Room tersedia',
    create_heading:'BUAT ROOM SENDIRI', footer_tagline:'Dibuat untuk generasi pemikir berikutnya.',
    waiting_eyebrow:'LOBBY MATCHMAKING', btn_copy:'SALIN', btn_leave:'← Kembali ke lobby', arena_label:'PERTANDINGAN BERLANGSUNG',
    arena_heading:'Arena pertandingan', opponent_label:'LAWAN', you_label:'KAMU', mobile_chat:'💬 Chat & langkah',
    guide_eyebrow:'PANDUAN SINGKAT', guide_heading:'Cara bermain Sentinel Chess',
    guide_intro:'Sentinel Chess dimainkan di papan 10×10. Aturan dasarnya mirip catur biasa, dengan dua bidak Sentinel tambahan.',
    guide_rule1:'Klik bidak untuk melihat langkah legal, kemudian klik petak tujuan.',
    guide_rule2:'Sentinel (♆) memiliki kombinasi langkah gajah dan kuda.',
    guide_rule3:'Lakukan skakmat sebelum waktumu habis.', guide_done:'Mengerti', copied:'Kode room berhasil disalin!',
    leave_match_confirm:'Tinggalkan pertandingan ini? Game akan berakhir.',
    offline:'Terputus', online:'ONLINE', connecting:'Menghubungkan...', opponent_left:'Lawan meninggalkan pertandingan.',
    waiting_left:'Kembali ke lobby.', no_chat_ai:'Lawan AI tidak mendukung chat online.'
  },
  ms: {
    nav_play:'Main', nav_rooms:'Bilik', nav_guide:'Panduan', hero_eyebrow:'DIMENSI BAHARU STRATEGI',
    hero_title_1:'Langkah seterusnya', hero_title_2:'milik anda.',
    hero_description:'Lebih banyak petak, lebih banyak strategi. Alami catur 10×10 dengan bidak Sentinel eksklusif, perlawanan dalam talian dan AI.',
    btn_explore:'Lihat bilik ↗', benefit_1:'Multiplayer masa nyata', benefit_2:'3 tahap kesukaran AI',
    board_eyebrow:'MEMPERKENALKAN', board_title:'Medan lebih besar.', sentinel_title:'Kenali Sentinel.',
    sentinel_description:'Bidak unik yang menggabungkan pergerakan bishop dan knight. Satu langkah boleh mengubah permainan.',
    sentinel_footnote:'BIDAK EKSKLUSIF 10×10', stat_squares:'Petak papan', stat_languages:'Bahasa', stat_moves:'Kemungkinan',
    play_label:'PERLAWANAN ANDA', play_heading:'Sedia bermain?', play_description:'Sediakan nama dan pilih cara bermain pilihan anda.',
    username_label:'NAMA PEMAIN', computer_heading:'LAWAN KOMPUTER', difficulty_label:'KESUKARAN', time_label:'HAD MASA',
    play_note:'Tidak perlu akaun untuk mula bermain.', multiplayer_label:'MULTIPLAYER', rooms_heading:'Bilik tersedia',
    create_heading:'CIPTA BILIK SENDIRI', footer_tagline:'Dibina untuk generasi pemikir seterusnya.',
    waiting_eyebrow:'LOBI PERLAWANAN', btn_copy:'SALIN', btn_leave:'← Kembali ke lobi', arena_label:'PERLAWANAN BERLANGSUNG',
    arena_heading:'Arena perlawanan', opponent_label:'LAWAN', you_label:'ANDA', mobile_chat:'💬 Sembang & langkah',
    guide_eyebrow:'PANDUAN PANTAS', guide_heading:'Cara bermain Sentinel Chess',
    guide_intro:'Sentinel Chess dimainkan pada papan 10×10 dengan dua bidak Sentinel tambahan.',
    guide_rule1:'Klik bidak untuk melihat langkah sah, kemudian klik petak sasaran.',
    guide_rule2:'Sentinel (♆) bergerak seperti bishop dan knight.',
    guide_rule3:'Capai checkmate sebelum masa anda habis.', guide_done:'Faham', copied:'Kod bilik berjaya disalin!',
    leave_match_confirm:'Tinggalkan perlawanan ini? Permainan akan tamat.',
    offline:'Terputus', online:'DALAM TALIAN', connecting:'Menyambung...', opponent_left:'Lawan telah meninggalkan perlawanan.',
    waiting_left:'Kembali ke lobi.', no_chat_ai:'Mod AI tiada sembang dalam talian.'
  },
  en: {
    nav_play:'Play', nav_rooms:'Rooms', nav_guide:'How to play', hero_eyebrow:'A NEW DIMENSION OF STRATEGY',
    hero_title_1:'The next move', hero_title_2:'is yours.',
    hero_description:'More squares. More strategy. Experience 10×10 chess with the exclusive Sentinel piece, online matches, and AI opponents.',
    btn_explore:'Explore rooms ↗', benefit_1:'Real-time multiplayer', benefit_2:'3 AI difficulty levels',
    board_eyebrow:'INTRODUCING', board_title:'A bigger battlefield.', sentinel_title:'Meet the Sentinel.',
    sentinel_description:'One unique piece with the combined movement of a bishop and a knight. One move changes everything.',
    sentinel_footnote:'AN EXCLUSIVE 10×10 PIECE', stat_squares:'Board squares', stat_languages:'Languages', stat_moves:'Possibilities',
    play_label:'YOUR NEXT MATCH', play_heading:'Ready to play?', play_description:'Set your player name and choose how you want to play.',
    username_label:'PLAYER NAME', computer_heading:'PLAY THE COMPUTER', difficulty_label:'DIFFICULTY', time_label:'TIME CONTROL',
    play_note:'No account needed to start playing.', multiplayer_label:'MULTIPLAYER', rooms_heading:'Open rooms',
    create_heading:'CREATE YOUR OWN ROOM', footer_tagline:'Built for the next generation of thinkers.',
    waiting_eyebrow:'MATCHMAKING LOBBY', btn_copy:'COPY', btn_leave:'← Back to lobby', arena_label:'MATCH IN PROGRESS',
    arena_heading:'Game arena', opponent_label:'OPPONENT', you_label:'YOU', mobile_chat:'💬 Chat & moves',
    guide_eyebrow:'QUICK GUIDE', guide_heading:'How Sentinel Chess works',
    guide_intro:'Sentinel Chess is played on a 10×10 board. The rules are similar to standard chess, with two additional Sentinel pieces.',
    guide_rule1:'Select a piece to see legal moves, then select its destination.',
    guide_rule2:'The Sentinel (♆) combines the moves of a bishop and a knight.',
    guide_rule3:'Checkmate your opponent before your clock runs out.', guide_done:'Got it', copied:'Room code copied!',
    leave_match_confirm:'Leave this game? The match will end.',
    offline:'Offline', online:'ONLINE', connecting:'Connecting...', opponent_left:'Your opponent left the match.',
    waiting_left:'Back in the lobby.', no_chat_ai:'AI matches do not support online chat.'
  },
  zh: {
    nav_play:'开始', nav_rooms:'房间', nav_guide:'玩法', hero_eyebrow:'战略的新维度',
    hero_title_1:'下一步棋', hero_title_2:'由你决定。',
    hero_description:'更多棋格，更多策略。体验拥有独特 Sentinel 棋子的 10×10 象棋，与好友在线对战或挑战 AI。',
    btn_explore:'查看房间 ↗', benefit_1:'实时多人对战', benefit_2:'3 种 AI 难度',
    board_eyebrow:'全新体验', board_title:'更大的棋盘。', sentinel_title:'认识 Sentinel。',
    sentinel_description:'一种结合象与马走法的特殊棋子。一步棋就能改变战局。',
    sentinel_footnote:'专属 10×10 棋子', stat_squares:'棋格', stat_languages:'语言', stat_moves:'无限可能',
    play_label:'下一场对局', play_heading:'准备好了吗？', play_description:'设置玩家名称并选择游戏模式。',
    username_label:'玩家名称', computer_heading:'挑战电脑', difficulty_label:'难度', time_label:'时间限制',
    play_note:'无需注册即可开始。', multiplayer_label:'多人游戏', rooms_heading:'开放房间',
    create_heading:'创建自己的房间', footer_tagline:'为下一代棋手打造。',
    waiting_eyebrow:'匹配大厅', btn_copy:'复制', btn_leave:'← 返回大厅', arena_label:'对局进行中',
    arena_heading:'对局竞技场', opponent_label:'对手', you_label:'你', mobile_chat:'💬 聊天与记录',
    guide_eyebrow:'快速教程', guide_heading:'Sentinel Chess 玩法',
    guide_intro:'Sentinel Chess 使用 10×10 棋盘，基本规则类似传统国际象棋，并增加了 Sentinel 棋子。',
    guide_rule1:'点击棋子查看合法走法，然后选择目标格。',
    guide_rule2:'Sentinel (♆) 同时具备象和马的走法。',
    guide_rule3:'在时间耗尽前将死对手。', guide_done:'知道了', copied:'房间代码已复制！',
    leave_match_confirm:'确定离开对局吗？本局将结束。',
    offline:'已断线', online:'在线', connecting:'连接中...', opponent_left:'对手已退出对局。',
    waiting_left:'已返回大厅。', no_chat_ai:'AI 模式不支持在线聊天。'
  }
};
for (const lang of Object.keys(UI_COPY)) Object.assign(TRANSLATIONS[lang], UI_COPY[lang]);

let currentLang = 'id';
function t(key) { return TRANSLATIONS[currentLang][key] || key; }

function updateUILanguage() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        el.textContent = t(key);
        if (el.id === 'glitch-main') el.setAttribute('data-text', t(key));
    });
    document.querySelectorAll('[data-i18n-ph]').forEach(el => {
        const key = el.getAttribute('data-i18n-ph');
        el.placeholder = t(key);
    });
    const title = document.getElementById('hero-title');
    if (title) {
        title.replaceChildren();
        title.append(document.createTextNode(t('hero_title_1')));
        title.appendChild(document.createElement('br'));
        const em = document.createElement('em'); em.textContent = t('hero_title_2'); title.appendChild(em);
    }
    document.documentElement.lang = currentLang === 'zh' ? 'zh' : currentLang;
    renderRoomList(lastRoomList);
    if (typeof socket !== 'undefined') setConnectionStatus(socket.connected);
}

document.getElementById('lang-selector').addEventListener('change', (e) => {
    currentLang = e.target.value;
    updateUILanguage();
});

// --- ELEMEN UI & TOGGLE MOBILE ---
const screens = { lobby: document.getElementById('lobby'), waiting: document.getElementById('waiting'), game: document.getElementById('game') };
const usernameInput = document.getElementById('username');
const createRoomNameInput = document.getElementById('create-room-name');
const createRoomPassInput = document.getElementById('create-room-pass');
const createRoomTimerInput = document.getElementById('create-room-timer');
const errorMsg = document.getElementById('error-msg');
const boardElement = document.getElementById('board');
const modal = document.getElementById('modal');
const glitchOverlay = document.getElementById('glitch-overlay');
const roomListContainer = document.getElementById('room-list-container');
const aiLevelSelect = document.getElementById('ai-level');

const passwordModal = document.getElementById('password-modal');
const manualJoinPassInput = document.getElementById('manual-join-pass');
const targetRoomLabel = document.getElementById('target-room-label');

const moveHistoryContainer = document.getElementById('move-history');
const chatMessagesContainer = document.getElementById('chat-messages');
const chatInput = document.getElementById('chat-input');

// Toggle Chat Mobile Elements
const btnToggleChat = document.getElementById('btn-toggle-chat');
const btnCloseChat = document.getElementById('btn-close-chat');
const sidePanel = document.getElementById('side-panel');

btnToggleChat.addEventListener('click', () => {
    sidePanel.classList.add('open');
    btnToggleChat.classList.remove('new-msg'); // Ilangin merah2 notif
});
btnCloseChat.addEventListener('click', () => {
    sidePanel.classList.remove('open');
});

let myColor = ''; let myTurn = false; let roomCode = ''; let boardState = [];
let selectedSquare = null; let lastMove = null; let kingInCheck = null; let selectedRoomToJoin = '';
let vsAI = false; let isSpectator = false; let isWhiteTurnSpectator = true;
let initialTimeLimit = 300; let myTime = 300; let oppTime = 300; let timerInterval = null;
let capturedByMe = []; let capturedByOpp = []; let moveLog = []; let moveCount = 1;
let lastRoomList = {}; let gameEnded = false; let launchToken = 0;

const PIECES = { 'r': '♜', 'n': '♞', 's': '♆', 'b': '♝', 'q': '♛', 'k': '♚', 'p': '♟', 'R': '♖', 'N': '♘', 'S': '♆', 'B': '♗', 'Q': '♕', 'K': '♔', 'P': '♙' };
// Decorative lobby preview uses the same setup as the playable chessboard.
function buildPreviewBoard() {
    const preview = document.getElementById('preview-board');
    if (!preview) return;
    const fragment = document.createDocumentFragment();
    INITIAL_BOARD.forEach((row, r) => row.forEach((piece, c) => {
        const square = document.createElement('div');
        square.className = `preview-square ${(r + c) % 2 === 0 ? 'light' : 'dark'}`;
        if (piece) {
            const symbol = document.createElement('span');
            symbol.className = `preview-piece ${getColor(piece)} ${piece.toLowerCase() === 's' ? 'sentinel' : ''}`;
            symbol.textContent = PIECES[piece]; square.appendChild(symbol);
        }
        fragment.appendChild(square);
    }));
    preview.replaceChildren(fragment);
}

const PIECE_VALUES = { 'p': 10, 'n': 30, 'b': 30, 'r': 50, 's': 70, 'q': 90, 'k': 900 };
const INITIAL_BOARD = [
    ['r', 'n', 's', 'b', 'q', 'k', 'b', 's', 'n', 'r'], ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
    ['', '', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', '', ''],
    ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'], ['R', 'N', 'S', 'B', 'Q', 'K', 'B', 'S', 'N', 'R']
];

const showScreen = (screenName) => {
    Object.values(screens).forEach(s => s.classList.remove('active'));
    screens[screenName].classList.add('active');
    errorMsg.textContent = '';
};

// --- MULTIPLAYER LOBBY LOGIC ---
function renderRoomList(rooms) {
    lastRoomList = rooms || {};
    roomListContainer.replaceChildren();
    const roomKeys = Object.keys(lastRoomList);
    const count = document.getElementById('room-count');
    if (count) count.textContent = String(roomKeys.length);
    if (!roomKeys.length) {
        const empty = document.createElement('div');
        empty.className = 'empty-rooms';
        const icon = document.createElement('span'); icon.className = 'empty-icon'; icon.textContent = '♟';
        const msg = document.createElement('span'); msg.textContent = t('no_room');
        empty.append(icon, msg); roomListContainer.appendChild(empty);
        return;
    }
    roomKeys.forEach(code => {
        const roomData = lastRoomList[code];
        const item = document.createElement('div'); item.className = 'room-item';
        const isFull = roomData.playerCount >= 2;
        const details = document.createElement('div'); details.className = 'room-item-info';
        const title = document.createElement('strong'); title.textContent = code;
        const subtitle = document.createElement('small');
        subtitle.textContent = `${roomData.hasPassword ? '🔒' : '🌐'}  ${roomData.playerCount}/2  ·  ⏱ ${Math.round((roomData.timer || 300) / 60)} min`;
        details.append(title, subtitle);
        const joinBtn = document.createElement('button');
        joinBtn.type = 'button'; joinBtn.className = isFull ? 'btn ghost' : 'btn outline';
        joinBtn.textContent = isFull ? t('btn_watch') : t('btn_join');
        joinBtn.addEventListener('click', () => {
            vsAI = false;
            const username = usernameInput.value.trim() || 'Player';
            if (roomData.hasPassword) {
                selectedRoomToJoin = code;
                targetRoomLabel.textContent = `"${code}" — ${t('pass_req')}`;
                manualJoinPassInput.value = '';
                passwordModal.classList.remove('hidden');
                manualJoinPassInput.focus();
            } else socket.emit('joinRoomManual', { username, roomName: code, password: '' });
        });
        item.append(details, joinBtn); roomListContainer.appendChild(item);
    });
}

socket.on('roomListUpdate', (rooms) => { renderRoomList(rooms); });

document.getElementById('btn-submit-pass').addEventListener('click', () => {
    vsAI = false;
    const username = usernameInput.value.trim() || 'Player';
    const password = manualJoinPassInput.value.trim();
    passwordModal.classList.add('hidden');
    socket.emit('joinRoomManual', { username, roomName: selectedRoomToJoin, password });
});
document.getElementById('btn-cancel-pass').addEventListener('click', () => { passwordModal.classList.add('hidden'); });

document.getElementById('btn-quickmatch').addEventListener('click', () => {
    vsAI = false; isSpectator = false;
    const user = usernameInput.value.trim() || 'Player';
    socket.emit('findMatch', user);
});

document.getElementById('btn-create').addEventListener('click', () => {
    vsAI = false; isSpectator = false;
    const username = usernameInput.value.trim() || 'Player1';
    const roomName = createRoomNameInput.value.trim();
    const password = createRoomPassInput.value.trim();
    const timer = parseInt(createRoomTimerInput.value);
    if (!roomName) return errorMsg.textContent = t('err_empty_room');
    socket.emit('createRoom', { username, roomName, password, timer });
});

document.getElementById('btn-vs-ai').addEventListener('click', () => {
    const user = usernameInput.value.trim() || 'Player';
    vsAI = true; isSpectator = false; myColor = 'white'; myTurn = true; gameEnded = false;
    roomCode = 'AI MATCH';
    boardElement.classList.remove('flipped');
    boardState = JSON.parse(JSON.stringify(INITIAL_BOARD));
    
    initialTimeLimit = parseInt(createRoomTimerInput.value);
    myTime = initialTimeLimit; oppTime = initialTimeLimit; 
    capturedByMe = []; capturedByOpp = []; moveLog = []; moveCount = 1;
    resetSidePanels();
    
    document.getElementById('my-name').textContent = user;
    const levelName = { '1': 'EASY', '2': 'NORMAL', '3': 'HARD' }[aiLevelSelect?.value] || 'NORMAL';
    document.getElementById('opp-name').textContent = `Bot 🤖 (${levelName})`;
    document.getElementById('btn-resign').style.display = 'block';
    document.getElementById('btn-draw').style.display = 'block';

    setGameRoomLabel(); updateCapturedUI(); updateTurnUI(); renderBoard(); updateTimerUI(); startTimer();
    glitchOverlay.classList.remove('hidden');
    const token = ++launchToken;
    setTimeout(() => { if (token !== launchToken) return; glitchOverlay.classList.add('hidden'); showScreen('game'); }, 1800);
});

socket.on('roomCreated', (data) => {
    roomCode = data.roomCode; myColor = data.color;
    document.getElementById('display-room-code').textContent = roomCode;
    showScreen('waiting');
});
socket.on('roomJoined', (data) => { roomCode = data.roomCode; myColor = data.color; });

// --- CHAT SYSTEM ---
chatInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        const msg = chatInput.value.trim();
        if (msg !== '') {
            const username = document.getElementById('my-name').textContent.split(' ')[0] || 'Player';
            if (vsAI) {
                appendChat(username, msg, false);
                chatInput.value = '';
                showToast(t('no_chat_ai'));
                return;
            }
            socket.emit('sendChat', { roomCode, username, msg, isSpectator });
            chatInput.value = '';
        }
    }
});

document.getElementById('btn-send-chat').addEventListener('click', () => {
    chatInput.dispatchEvent(new KeyboardEvent('keypress', { key: 'Enter', bubbles: true }));
});

socket.on('receiveChat', (data) => { 
    appendChat(data.username, data.msg, data.isSpectator); 
    
    // Notifikasi merah di tombol HP kalau panel ketutup
    if(window.innerWidth < 768 && !sidePanel.classList.contains('open')) {
        btnToggleChat.classList.add('new-msg');
    }
});

function appendChat(username, msg, spec) {
    const div = document.createElement('div');
    div.className = 'chat-msg';
    const sender = document.createElement('span');
    sender.className = spec ? 'spec' : 'sender'; sender.textContent = `[${username}] `;
    div.append(sender, document.createTextNode(msg));
    chatMessagesContainer.appendChild(div);
    chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
}

// --- MOVE HISTORY LOGIC ---
function resetSidePanels() {
    moveHistoryContainer.innerHTML = `
        <div class="move-header" data-i18n="log_no">${t('log_no')}</div>
        <div class="move-header" data-i18n="log_white">${t('log_white')}</div>
        <div class="move-header" data-i18n="log_black">${t('log_black')}</div>
    `;
    chatMessagesContainer.innerHTML = '';
}

function getAlgebraic(r, c) {
    const cols = ['a','b','c','d','e','f','g','h','i','j'];
    return cols[c] + (10 - r);
}

function generateNotation(piece, from, to, isCapture, promotedPiece) {
    let p = piece.toUpperCase() === 'P' ? '' : PIECES[piece];
    let cap = isCapture ? 'x' : '';
    let dest = getAlgebraic(to.r, to.c);
    let prom = promotedPiece ? '=' + promotedPiece.toUpperCase() : '';
    if (piece.toUpperCase() === 'P' && isCapture) p = getAlgebraic(from.r, from.c).charAt(0);
    return p + cap + dest + prom;
}

function appendMoveToHistory(notation, isWhiteMove) {
    if (isWhiteMove) {
        const num = document.createElement('div'); num.className = 'move-num'; num.textContent = moveCount + '.';
        const m1 = document.createElement('div'); m1.className = 'move-w'; m1.textContent = notation;
        moveHistoryContainer.appendChild(num);
        moveHistoryContainer.appendChild(m1);
    } else {
        const m2 = document.createElement('div'); m2.className = 'move-b'; m2.textContent = notation;
        moveHistoryContainer.appendChild(m2);
        moveCount++;
    }
    moveHistoryContainer.scrollTop = moveHistoryContainer.scrollHeight;
}

// --- SPECTATOR SYNC ---
socket.on('requestSync', (targetId) => {
    socket.emit('syncData', {
        targetId, boardState, lastMove,
        whiteTime: myColor === 'white' ? myTime : oppTime,
        blackTime: myColor === 'black' ? myTime : oppTime,
        capturedByWhite: myColor === 'white' ? capturedByMe : capturedByOpp,
        capturedByBlack: myColor === 'black' ? capturedByMe : capturedByOpp,
        isWhiteTurn: myTurn ? (myColor === 'white') : (myColor === 'black'),
        moveLog: moveLog, moveCount: moveCount,
        players: {
            white: myColor === 'white' ? document.getElementById('my-name').textContent : document.getElementById('opp-name').textContent,
            black: myColor === 'black' ? document.getElementById('my-name').textContent : document.getElementById('opp-name').textContent
        }
    });
});

socket.on('syncGame', (data) => {
    isSpectator = true; gameEnded = false; roomCode = data.roomCode || roomCode; boardState = data.boardState; lastMove = data.lastMove;
    myColor = 'white'; myTurn = false;
    document.getElementById('my-name').textContent = data.players.white;
    document.getElementById('opp-name').textContent = data.players.black;
    myTime = data.whiteTime; oppTime = data.blackTime; initialTimeLimit = data.timeLimit || 300;
    capturedByMe = data.capturedByWhite; capturedByOpp = data.capturedByBlack;
    isWhiteTurnSpectator = data.isWhiteTurn;
    
    resetSidePanels();
    moveLog = data.moveLog || []; moveCount = 1;
    moveLog.forEach(log => { appendMoveToHistory(log.notation, log.isWhite); });
    moveCount = data.moveCount || moveCount;

    document.getElementById('btn-resign').style.display = 'none';
    document.getElementById('btn-draw').style.display = 'none';
    document.getElementById('my-status').textContent = t('spectating');
    document.getElementById('my-status').classList.add('active');
    boardElement.classList.remove('flipped');

    setGameRoomLabel(); updateCapturedUI(); renderBoard(); updateTimerUI(); startTimer();
    glitchOverlay.classList.remove('hidden');
    const token = ++launchToken;
    setTimeout(() => { if (token !== launchToken) return; glitchOverlay.classList.add('hidden'); showScreen('game'); }, 1000);
});

socket.on('startGame', (players) => {
    vsAI = false; isSpectator = false; gameEnded = false;
    boardState = JSON.parse(JSON.stringify(INITIAL_BOARD));
    myTurn = myColor === 'white';
    initialTimeLimit = players.timeLimit || 300;
    myTime = initialTimeLimit; oppTime = initialTimeLimit; 
    capturedByMe = []; capturedByOpp = []; moveLog = []; moveCount = 1;
    resetSidePanels();
    
    document.getElementById('my-name').textContent = myColor === 'white' ? players.white : players.black;
    document.getElementById('opp-name').textContent = myColor === 'white' ? players.black : players.white;
    document.getElementById('btn-resign').style.display = 'block';
    document.getElementById('btn-draw').style.display = 'block';

    if(myColor === 'black') document.getElementById('board').classList.add('flipped');
    else document.getElementById('board').classList.remove('flipped');
    
    setGameRoomLabel(); updateCapturedUI(); updateTurnUI(); renderBoard(); updateTimerUI(); startTimer();
    glitchOverlay.classList.remove('hidden');
    const token = ++launchToken;
    setTimeout(() => { if (token !== launchToken) return; glitchOverlay.classList.add('hidden'); showScreen('game'); }, 1800);
});

socket.on('errorMsg', (msg) => { errorMsg.textContent = msg; });

socket.on('opponentMove', ({ from, to, promotedPiece, isCapture, capturedPiece, notation, moverColor }) => {
    if (gameEnded || !boardState.length) return;
    if (capturedPiece) {
        if (isSpectator) {
            if (moverColor === 'white') capturedByMe.push(capturedPiece);
            else capturedByOpp.push(capturedPiece);
        } else {
            capturedByOpp.push(capturedPiece);
        }
        updateCapturedUI();
    }
    executeMoveOnBoard(boardState, from.r, from.c, to.r, to.c, promotedPiece);
    lastMove = { from, to, isCapture };
    
    let isWhiteNow = isSpectator ? moverColor === 'white' : myColor === 'black';
    moveLog.push({notation, isWhite: isWhiteNow});
    appendMoveToHistory(notation, isWhiteNow);

    if (isSpectator) isWhiteTurnSpectator = !isWhiteTurnSpectator; 
    else myTurn = true;
    
    postMoveChecks(); renderBoard();
});

socket.on('gameOverTimeOut', (loserColor) => {
    clearInterval(timerInterval);
    if (isSpectator) endGame(t('time_out_spec'));
    else endGame(loserColor === myColor ? t('time_out_lose') : t('time_out_win'));
});

// --- AI LOGIC ---
function makeAIMove() {
    if (vsAI && !gameEnded && !myTurn && !isSpectator) {
        document.getElementById('opp-status').textContent = t('bot_thinking');
        const aiLevel = aiLevelSelect ? parseInt(aiLevelSelect.value) : 2;
        setTimeout(() => {
            if (gameEnded || !vsAI) return;
            let allMoves = [];
            for (let r = 0; r < 10; r++) {
                for (let c = 0; c < 10; c++) {
                    if (getColor(boardState[r][c]) === 'black') {
                        getLegalMoves(boardState, r, c).forEach(m => { allMoves.push({ from: { r, c }, to: m }); });
                    }
                }
            }
            if (allMoves.length > 0) {
                let bestMoves = []; let bestScore = -Infinity;
                allMoves.forEach(move => {
                    let score = 0;
                    const pieceMoved = boardState[move.from.r][move.from.c];
                    const pieceCaptured = boardState[move.to.r][move.to.c];
                    if (aiLevel >= 2 && pieceCaptured) score += getPieceValue(pieceCaptured);
                    if (aiLevel >= 3) {
                        const tempBoard = boardState.map(row => [...row]);
                        tempBoard[move.to.r][move.to.c] = pieceMoved;
                        tempBoard[move.from.r][move.from.c] = '';
                        const safeNow = !isSquareAttacked(boardState, move.from.r, move.from.c, 'white');
                        const safeAfter = !isSquareAttacked(tempBoard, move.to.r, move.to.c, 'white');
                        if (!safeAfter) score -= getPieceValue(pieceMoved);
                        if (!safeNow && safeAfter) score += getPieceValue(pieceMoved);
                        if (move.to.r >= 3 && move.to.r <= 6 && move.to.c >= 3 && move.to.c <= 6) score += 2;
                    }
                    score += Math.random();
                    if (score > bestScore) { bestScore = score; bestMoves = [move]; } 
                    else if (score === bestScore) { bestMoves.push(move); }
                });

                let chosenMove = bestMoves[Math.floor(Math.random() * bestMoves.length)];
                const pieceMoved = boardState[chosenMove.from.r][chosenMove.from.c];
                const isCapture = boardState[chosenMove.to.r][chosenMove.to.c] !== '';
                
                if (isCapture) {
                    capturedByOpp.push(boardState[chosenMove.to.r][chosenMove.to.c]);
                    updateCapturedUI();
                }
                let promotedPiece = null;
                if (pieceMoved.toLowerCase() === 'p' && (chosenMove.to.r === 0 || chosenMove.to.r === 9)) {
                    promotedPiece = 'q';
                }

                let notation = generateNotation(pieceMoved, chosenMove.from, chosenMove.to, isCapture, promotedPiece);
                moveLog.push({ notation, isWhite: false });
                appendMoveToHistory(notation, false);

                executeMoveOnBoard(boardState, chosenMove.from.r, chosenMove.from.c, chosenMove.to.r, chosenMove.to.c, promotedPiece);
                lastMove = { from: chosenMove.from, to: chosenMove.to, isCapture };
                myTurn = true;
                postMoveChecks(); renderBoard();
            }
        }, 800); 
    }
}

function getPieceValue(piece) { return piece ? (PIECE_VALUES[piece.toLowerCase()] || 0) : 0; }
function isSquareAttacked(board, r, c, enemyColor) {
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            if (getColor(board[i][j]) === enemyColor) {
                if (getPseudoLegalMoves(board, i, j).some(m => m.r === r && m.c === c)) return true;
            }
        }
    }
    return false;
}

function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        if (isSpectator) {
            if (isWhiteTurnSpectator && myTime > 0) myTime--;
            else if (!isWhiteTurnSpectator && oppTime > 0) oppTime--;
        } else {
            if (myTurn && myTime > 0) {
                myTime--;
                if (myTime <= 0) {
                    clearInterval(timerInterval);
                    if (vsAI) endGame(t('time_out_lose'));
                    else socket.emit('timeOut', { roomCode, loserColor: myColor });
                }
            } else if (!myTurn && oppTime > 0) {
                oppTime--;
                if (oppTime <= 0 && vsAI) {
                    clearInterval(timerInterval);
                    endGame(t('time_out_win'));
                }
            }
        }
        updateTimerUI();
    }, 1000);
}

function updateTimerUI() {
    document.getElementById('my-timer').textContent = formatTime(myTime);
    document.getElementById('opp-timer').textContent = formatTime(oppTime);
    document.getElementById('my-timer').classList.toggle('low-time', myTime <= 30);
    document.getElementById('opp-timer').classList.toggle('low-time', oppTime <= 30);
}
function formatTime(seconds) { return `${Math.floor(seconds / 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`; }
function updateCapturedUI() {
    document.getElementById('my-captured').textContent = capturedByMe.map(p => PIECES[p] || p).join(' ');
    document.getElementById('opp-captured').textContent = capturedByOpp.map(p => PIECES[p] || p).join(' ');
}

// --- CATUR LOGIC ---
const getColor = (piece) => piece ? (piece === piece.toUpperCase() ? 'white' : 'black') : null;
const isEnemy = (p1, p2) => p1 && p2 && getColor(p1) !== getColor(p2);
const getPseudoLegalMoves = (board, r, c) => {
    const moves = []; const piece = board[r][c]; if (!piece) return moves;
    const color = getColor(piece); const type = piece.toLowerCase();
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
        const dir = color === 'white' ? -1 : 1; const startRow = color === 'white' ? 8 : 1;
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
    for (let r=0; r<10; r++) for (let c=0; c<10; c++) if (board[r][c] === (color === 'white' ? 'K' : 'k')) kingPos = {r, c};
    if (!kingPos) return false;
    for (let r=0; r<10; r++) {
        for (let c=0; c<10; c++) {
            if (getColor(board[r][c]) && getColor(board[r][c]) !== color) {
                if (getPseudoLegalMoves(board, r, c).some(m => m.r === kingPos.r && m.c === kingPos.c)) return true;
            }
        }
    }
    return false;
};

const getLegalMoves = (board, r, c) => {
    const color = getColor(board[r][c]);
    return getPseudoLegalMoves(board, r, c).filter(move => {
        const tempBoard = board.map(row => [...row]);
        tempBoard[move.r][move.c] = tempBoard[r][c];
        tempBoard[r][c] = '';
        return !isCheck(tempBoard, color);
    });
};

const executeMoveOnBoard = (board, r1, c1, r2, c2, promotedPiece = null) => {
    let piece = board[r1][c1];
    if (piece.toLowerCase() === 'p' && (r2 === 0 || r2 === 9)) piece = promotedPiece || (getColor(piece) === 'white' ? 'Q' : 'q');
    board[r2][c2] = piece; board[r1][c1] = '';
};

const postMoveChecks = () => {
    kingInCheck = null;
    if (!isSpectator) updateTurnUI();
    const colorTurn = isSpectator ? (isWhiteTurnSpectator ? 'white' : 'black') : ((myTurn && myColor === 'white') || (!myTurn && myColor === 'black') ? 'white' : 'black');
    const isCurrentlyCheck = isCheck(boardState, colorTurn);
    
    let hasLegalMoves = false;
    for (let r=0; r<10; r++) {
        for (let c=0; c<10; c++) {
            if (getColor(boardState[r][c]) === colorTurn) {
                if (getLegalMoves(boardState, r, c).length > 0) hasLegalMoves = true;
            }
        }
    }

    if (isCurrentlyCheck) kingInCheck = colorTurn;
    if (!hasLegalMoves) {
        if (isCurrentlyCheck) endGame(`${t('checkmate')} ${colorTurn === 'white' ? t('black') : t('white')} ${t('win')}`);
        else endGame(t('stalemate'));
    }
};

function renderBoard() {
    boardElement.innerHTML = '';
    let legalMovesForSelected = [];
    if (selectedSquare && !isSpectator && !gameEnded) legalMovesForSelected = getLegalMoves(boardState, selectedSquare.r, selectedSquare.c);

    for (let r = 0; r < 10; r++) {
        for (let c = 0; c < 10; c++) {
            const square = document.createElement('div');
            square.className = `square ${(r + c) % 2 === 0 ? 'light' : 'dark'}`;
            
            if (lastMove && lastMove.to.r === r && lastMove.to.c === c && lastMove.isCapture) square.classList.add('square-captured');

            const piece = boardState[r][c];
            if (piece) {
                const span = document.createElement('span');
                span.className = `piece ${getColor(piece)}-piece`; span.textContent = PIECES[piece];
                if (lastMove && lastMove.to.r === r && lastMove.to.c === c) span.classList.add('piece-moved');
                if (piece.toLowerCase() === 's') span.classList.add(piece === 'S' ? 'white-sentinel' : 'black-sentinel');
                square.appendChild(span);
            }

            if (lastMove && ((lastMove.from.r === r && lastMove.from.c === c) || (lastMove.to.r === r && lastMove.to.c === c))) square.classList.add('last-move');
            if (selectedSquare && selectedSquare.r === r && selectedSquare.c === c && !isSpectator) square.classList.add('selected');
            if (kingInCheck && piece && piece.toLowerCase() === 'k' && getColor(piece) === kingInCheck) square.classList.add('in-check');
            
            const isLegal = legalMovesForSelected.find(m => m.r === r && m.c === c);
            if (isLegal && !isSpectator) {
                square.classList.add('legal-move-hint');
                if (piece) square.classList.add('capture-hint');
            }

            if (!isSpectator) { square.tabIndex = 0; square.setAttribute('role', 'gridcell');
                square.addEventListener('click', () => onSquareClick(r, c, isLegal));
                square.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSquareClick(r, c, isLegal); } }); }
            boardElement.appendChild(square);
        }
    }
}

function onSquareClick(r, c, isLegalMove) {
    if (!myTurn || isSpectator || gameEnded) return;
    const clickedPiece = boardState[r][c];
    
    if (selectedSquare) {
        if (isLegalMove) {
            const pieceMoved = boardState[selectedSquare.r][selectedSquare.c];
            const targetPiece = boardState[r][c];
            const isCapture = targetPiece !== '';
            let capturedPiece = null;

            if (isCapture) {
                capturedPiece = targetPiece;
                capturedByMe.push(capturedPiece);
                updateCapturedUI();
            }

            let promotedPiece = null;
            if (pieceMoved.toLowerCase() === 'p' && (r === 0 || r === 9)) {
                promotedPiece = myColor === 'white' ? 'Q' : 'q';
            }

            let notation = generateNotation(pieceMoved, selectedSquare, {r, c}, isCapture, promotedPiece);
            moveLog.push({ notation, isWhite: myColor === 'white' });
            appendMoveToHistory(notation, myColor === 'white');

            executeMoveOnBoard(boardState, selectedSquare.r, selectedSquare.c, r, c, promotedPiece);
            const moveData = { from: selectedSquare, to: {r, c}, promotedPiece, isCapture, capturedPiece, notation };
            
            if (vsAI) {
                lastMove = moveData; myTurn = false; selectedSquare = null;
                postMoveChecks(); renderBoard(); makeAIMove(); 
            } else {
                socket.emit('move', { roomCode, ...moveData });
                lastMove = moveData; myTurn = false; selectedSquare = null;
                postMoveChecks(); renderBoard();
            }
        } else if (getColor(clickedPiece) === myColor) {
            selectedSquare = { r, c }; renderBoard();
        } else {
            selectedSquare = null; renderBoard();
        }
    } else {
        if (getColor(clickedPiece) === myColor) {
            selectedSquare = { r, c }; renderBoard();
        }
    }
}

function updateTurnUI() {
    if (isSpectator) return;
    document.getElementById('my-status').classList.toggle('active', myTurn);
    document.getElementById('opp-status').classList.toggle('active', !myTurn);
    document.getElementById('my-player-card').classList.toggle('current-player', myTurn);
    document.getElementById('opponent-player-card').classList.toggle('current-player', !myTurn);
    document.getElementById('my-status').textContent = t('your_turn');
    document.getElementById('opp-status').textContent = t('opp_turn');
}

function endGame(msg) {
    if (gameEnded) return;
    gameEnded = true; myTurn = false;
    if (timerInterval) clearInterval(timerInterval);
    document.getElementById('modal-title').textContent = t('go_title');
    document.getElementById('modal-desc').textContent = msg;
    modal.classList.remove('hidden');
}

// --- BUTTON LISTENERS ---
document.getElementById('btn-flip').addEventListener('click', () => { boardElement.classList.toggle('flipped'); });
document.getElementById('btn-resign').addEventListener('click', () => {
    if (isSpectator) return;
    if(confirm(t('surrender_confirm'))) {
        if (vsAI) endGame(t('you_surrender'));
        else { socket.emit('resign', roomCode); endGame(t('you_surrender')); }
    }
});
document.getElementById('btn-draw').addEventListener('click', () => {
    if (isSpectator) return;
    if (vsAI) alert(t('draw_reject'));
    else { socket.emit('drawOffer', roomCode); alert(t('draw_sent')); }
});
socket.on('opponentResigned', () => {
    if (isSpectator) endGame(t('spec_surrender'));
    else endGame(t('opp_surrender'));
});
socket.on('drawOffered', () => {
    if (!isSpectator && confirm(t('draw_offer'))) {
        socket.emit('drawAccepted', roomCode); endGame(t('draw_accept'));
    }
});
socket.on('gameDrawn', () => endGame(t('draw_game')));

// Website interactions and quality-of-life enhancements.
let toastTimer;
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2700);
}
function setGameRoomLabel() {
    document.getElementById('game-room-label').textContent = roomCode === 'AI MATCH' ? 'AI MATCH' : (roomCode || 'LIVE MATCH');
}
function leaveActiveMatch() {
    if (screens.game.classList.contains('active') && !gameEnded && !confirm(t('leave_match_confirm'))) return false;
    if (screens.game.classList.contains('active') || screens.waiting.classList.contains('active')) {
        ++launchToken;
        if (!vsAI) socket.emit('leaveRoom');
        if (timerInterval) clearInterval(timerInterval);
        gameEnded = true; roomCode = '';
        glitchOverlay.classList.add('hidden');
        modal.classList.add('hidden');
    }
    return true;
}
function openRooms() {
    if (!leaveActiveMatch()) return;
    showScreen('lobby');
    document.getElementById('rooms-panel').scrollIntoView({ behavior:'smooth', block:'center' });
}
document.getElementById('btn-go-rooms').addEventListener('click', openRooms);
document.getElementById('nav-rooms').addEventListener('click', openRooms);
document.getElementById('nav-play').addEventListener('click', () => {
    if (!leaveActiveMatch()) return;
    showScreen('lobby');
    document.getElementById('play-panel').scrollIntoView({ behavior:'smooth', block:'center' });
});
document.getElementById('nav-guide').addEventListener('click', () => document.getElementById('guide-modal').classList.remove('hidden'));
function closeGuide() { document.getElementById('guide-modal').classList.add('hidden'); }
document.getElementById('btn-guide-close').addEventListener('click', closeGuide);
document.getElementById('btn-guide-done').addEventListener('click', closeGuide);
document.getElementById('guide-modal').addEventListener('click', e => { if (e.target.id === 'guide-modal') closeGuide(); });
document.getElementById('btn-copy-room').addEventListener('click', async () => {
    const code = document.getElementById('display-room-code').textContent;
    try {
        await navigator.clipboard.writeText(code);
        showToast(t('copied'));
    } catch (_) {
        const textArea = document.createElement('textarea');
        textArea.value = code; document.body.appendChild(textArea);
        textArea.select(); document.execCommand('copy'); textArea.remove();
        showToast(t('copied'));
    }
});
document.getElementById('btn-leave-wait').addEventListener('click', () => {
    ++launchToken; socket.emit('leaveRoom');
    glitchOverlay.classList.add('hidden');
    roomCode = ''; showScreen('lobby'); showToast(t('waiting_left'));
});
document.getElementById('btn-back').addEventListener('click', () => {
    if (!vsAI) socket.emit('leaveRoom');
    location.reload();
});
manualJoinPassInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') document.getElementById('btn-submit-pass').click();
});
window.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (!passwordModal.classList.contains('hidden')) passwordModal.classList.add('hidden');
    if (!document.getElementById('guide-modal').classList.contains('hidden')) closeGuide();
    sidePanel.classList.remove('open');
});
socket.on('opponentDisconnected', () => {
    if (screens.game.classList.contains('active')) endGame(t('opponent_left'));
    else if (screens.waiting.classList.contains('active')) { showScreen('lobby'); showToast(t('opponent_left')); }
});
function setConnectionStatus(connected) {
    document.getElementById('connection-status').classList.toggle('offline', !connected);
    document.getElementById('connection-label').textContent = t(connected ? 'online' : 'offline');
}
socket.on('connect', () => setConnectionStatus(true));
socket.on('disconnect', () => {
    setConnectionStatus(false);
    if (screens.game.classList.contains('active') && !vsAI) endGame(t('offline'));
});
setConnectionStatus(socket.connected);
try {
    const savedName = localStorage.getItem('sentinel-player-name');
    if (savedName) usernameInput.value = savedName.slice(0, 12);
} catch (_) { /* Private / restricted browser contexts may disable storage. */ }
usernameInput.addEventListener('input', () => {
    try { localStorage.setItem('sentinel-player-name', usernameInput.value); } catch (_) {}
});
buildPreviewBoard();
updateUILanguage();
