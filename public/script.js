/* ================================================================
   PICAZO — script.js  v46.0 (Viral Export + Flawless Avatars)
================================================================ */
'use strict';

const socket = io();

/* ════════════════════════════════════════════
   CONSTANTS & DATA
════════════════════════════════════════════ */
let audioCtx = null;

let roomCodeFromUrl = null;
const pathParts = window.location.pathname.split('/');
if (pathParts.length === 3 && pathParts[1] === 'r') {
  roomCodeFromUrl = pathParts[2];
}

let mySessionId = localStorage.getItem('picazo_session_id');
if (!mySessionId) {
  mySessionId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  localStorage.setItem('picazo_session_id', mySessionId);
}

function playTickSound() {
  if (S.isMuted) {
    return;
  }
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  
  osc.connect(gain); 
  gain.connect(audioCtx.destination);
  
  osc.type = 'sine'; 
  osc.frequency.setValueAtTime(800, audioCtx.currentTime);
  
  gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
  
  osc.start(); 
  osc.stop(audioCtx.currentTime + 0.1);
}

function playPopSound() {
  if (S.isMuted) {
    return;
  }
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  
  osc.type = 'sine';
  osc.frequency.setValueAtTime(500, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.05);
  
  gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
  
  osc.start();
  osc.stop(audioCtx.currentTime + 0.05);
}

function playSuccessSound() {
  if (S.isMuted) {
    return;
  }
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  
  osc.type = 'sine';
  osc.frequency.setValueAtTime(400, audioCtx.currentTime);
  osc.frequency.linearRampToValueAtTime(600, audioCtx.currentTime + 0.1);
  osc.frequency.linearRampToValueAtTime(1000, audioCtx.currentTime + 0.2);
  
  gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
  gain.gain.linearRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
  
  osc.start();
  osc.stop(audioCtx.currentTime + 0.3);
}

function playDrumroll() {
  if (S.isMuted) {
    return;
  }
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.type = 'sine';
  osc.frequency.setValueAtTime(60, audioCtx.currentTime);
  
  gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
  gain.gain.linearRampToValueAtTime(0.4, audioCtx.currentTime + 1.2);
  gain.gain.linearRampToValueAtTime(0.001, audioCtx.currentTime + 1.5);
  
  osc.start();
  osc.stop(audioCtx.currentTime + 1.5);
}

function playWinnerSound() {
  if (S.isMuted) {
    return;
  }
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  
  const notes = [523.25, 659.25, 783.99, 1046.50];
  notes.forEach((freq, i) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime + (i * 0.15));
      gain.gain.setValueAtTime(0, audioCtx.currentTime + (i * 0.15));
      gain.gain.linearRampToValueAtTime(0.1, audioCtx.currentTime + (i * 0.15) + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + (i * 0.15) + 1.0);
      osc.start(audioCtx.currentTime + (i * 0.15));
      osc.stop(audioCtx.currentTime + (i * 0.15) + 1.0);
  });
}

const COLORS = [
  '#000000',
  '#ffffff',
  '#c0c0c0',
  '#808080',
  '#ff0000',
  '#ff6600',
  '#ffcc00',
  '#ffff00',
  '#00cc00',
  '#00ffcc',
  '#0088ff',
  '#0000ff',
  '#8800ff',
  '#ff00ff',
  '#ff6699',
  '#cc3333',
  '#663300',
  '#996600',
  '#003366',
  '#006633'
];

// 🔥 BUG FIX: 100% Guaranteed safe rendering avatars
const PREMIUM_AVATARS = [
  // --- Modern Males (100% Guaranteed to Load) ---
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Nolan&backgroundColor=4a8fe8",
  "https://api.dicebear.com/7.x/micah/svg?seed=Jace&backgroundColor=f4b942",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Zane&backgroundColor=2ecc87",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Ezekiel&backgroundColor=f0525e",
  "https://api.dicebear.com/7.x/micah/svg?seed=Miles&backgroundColor=a855f7",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Axel&backgroundColor=4a8fe8",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Roman&backgroundColor=f4b942",
  "https://api.dicebear.com/7.x/micah/svg?seed=Silas&backgroundColor=2ecc87",

  // --- Modern Females (100% Guaranteed to Load) ---
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Amira&backgroundColor=ec4899",
  "https://api.dicebear.com/7.x/micah/svg?seed=Kaya&backgroundColor=f4b942",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Jade&backgroundColor=4a8fe8",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Eden&backgroundColor=2ecc87",
  "https://api.dicebear.com/7.x/micah/svg?seed=Lyra&backgroundColor=ec4899",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Zara&backgroundColor=f0525e",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Eliana&backgroundColor=a855f7",
  "https://api.dicebear.com/7.x/micah/svg?seed=Mila&backgroundColor=f4b942",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Rhea&backgroundColor=2ecc87"
];

let S = {
  avatarIdx: 0, 
  playerName: '', 
  players: [], 
  myId: mySessionId, 
  drawerIdx: -1,
  isDrawer: false,
  currentWord: '', 
  revealedIdx: [], 
  guessedIds: new Set(), 
  timeLeft: 85, 
  drawTime: 85,
  isDrawing: false, 
  tool: 'pencil', 
  color: '#000000', 
  brushSize: 3, 
  history: [], 
  isMuted: false, 
  ctxTarget: null, 
  dpr: window.devicePixelRatio || 1,
  customWords: null,
  roomSettings: null,
  shapeType: 'line',
  shapeStartX: 0,
  shapeStartY: 0,
  previewData: null
};

const CIRC = 2 * Math.PI * 25; 

/* ════════════════════════════════════════════
   DOM REFS & INITIALIZATION
════════════════════════════════════════════ */
const $ = id => document.getElementById(id);

const screenLobby = $('screen-lobby');
const screenGame = $('screen-game');
const timerNum = $('timer-num');
const tFg = $('t-fg');
const roundBadge = $('round-badge');
const wordDisplay = $('word-display');
const wordMeta = $('word-meta');
const playerList = $('player-list');
const chatMessages = $('chat-messages');
const chatInput = $('chat-input');
const btnChatSend = $('btn-chat-send');
const gameCanvas = $('game-canvas');
const canvasWrap = $('canvas-wrap');
const ctx = gameCanvas.getContext('2d', { willReadFrequently: true });
const overlayWordSelect = $('overlay-word-select');
const overlayRoundEnd = $('overlay-round-end');
const wsCards = $('ws-cards');
const contextMenu = $('context-menu');
const ctxName = $('ctx-name');
const ctxPts = $('ctx-pts');
const ctxAv = $('ctx-av');
const avImg = $('av-img'); 

document.addEventListener('DOMContentLoaded', () => { 
  const themeCheckboxes = document.querySelectorAll('.theme-checkbox');
  
  function applyTheme(isDark) {
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('picazo-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('picazo-theme', 'light');
    }
    themeCheckboxes.forEach(cb => {
      cb.checked = isDark;
    });
  }

  if (localStorage.getItem('picazo-theme') === 'dark') {
    applyTheme(true);
  }

  themeCheckboxes.forEach(cb => {
    cb.addEventListener('change', (e) => applyTheme(e.target.checked));
  });

  const overlays = ['overlay-waiting', 'overlay-word-select', 'overlay-round-end'];
  overlays.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      document.body.appendChild(el);
      el.style.position = 'fixed';
      el.style.zIndex = '9999';
      el.style.borderRadius = '0';
      el.style.height = '100dvh';
      el.style.width = '100vw';
      el.style.top = '0';
      el.style.left = '0';
    }
  });

  if (roomCodeFromUrl && $('btn-private')) {
    $('btn-private').style.display = 'none';
  }

  const pColor = $('popup-color');
  if (pColor && pColor.parentNode !== document.body) {
    document.body.appendChild(pColor);
    pColor.classList.add('mobile-popup-fix');
  }
  
  const pSize = $('popup-size');
  if (pSize && pSize.parentNode !== document.body) {
    document.body.appendChild(pSize);
    pSize.classList.add('mobile-popup-fix');
  }

  const pShape = $('popup-shape');
  if (pShape && pShape.parentNode !== document.body) {
    document.body.appendChild(pShape);
    pShape.classList.add('mobile-popup-fix');
  }

  const fxStyle = document.createElement('style');
  fxStyle.innerHTML = `
    @keyframes canvasShake {
      0% { transform: translate(4px, 4px) rotate(0deg); }
      10% { transform: translate(-4px, -6px) rotate(-2deg); }
      20% { transform: translate(-6px, 0px) rotate(2deg); }
      30% { transform: translate(6px, 6px) rotate(0deg); }
      40% { transform: translate(4px, -4px) rotate(2deg); }
      50% { transform: translate(-4px, 6px) rotate(-2deg); }
      60% { transform: translate(-6px, 2px) rotate(0deg); }
      70% { transform: translate(6px, 2px) rotate(-2deg); }
      80% { transform: translate(-4px, -4px) rotate(2deg); }
      90% { transform: translate(4px, 6px) rotate(0deg); }
      100% { transform: translate(0px, 0px) rotate(0deg); }
    }
    .shake-canvas {
      animation: canvasShake 0.45s cubic-bezier(.36,.07,.19,.97) both !important;
    }
    @media (max-width: 768px) {
      .mobile-popup-fix {
        position: fixed !important;
        top: 50% !important;
        left: 50% !important;
        transform: translate(-50%, -50%) !important;
        z-index: 999999 !important;
        width: 90vw !important;
        max-width: 320px !important;
        background: var(--glass-b, #fff) !important;
        border-radius: 16px !important;
        box-shadow: 0px 20px 50px rgba(0,0,0,0.5) !important;
      }
    }
  `;
  document.head.appendChild(fxStyle);
  
  setupMobileLayout();

  if (!socket.connected) {
    const btn = $('btn-play');
    if (btn) {
      btn.innerHTML = '<span>Waking up server... ⏳</span>';
      btn.style.pointerEvents = 'none';
      btn.style.opacity = '0.6';
    }
  }

  $('btn-like').addEventListener('click', () => { 
    socket.emit('rateArt', 'like'); 
    showToast('👍 You liked the drawing!', 't-correct');
  });
  $('btn-dislike').addEventListener('click', () => { 
    socket.emit('rateArt', 'dislike'); 
    showToast('👎 You disliked the drawing!', 't-warn');
  });

  // 🔥 ADDED: VIRAL EXPORT LISTENER
  if ($('btn-export-round')) {
    $('btn-export-round').addEventListener('click', exportCanvas);
  }
});

/* ════════════════════════════════════════════
   CONNECTION & LOBBY LOGIC
════════════════════════════════════════════ */
socket.on('connect', () => {
  const btn = $('btn-play');
  if (btn) {
    btn.innerHTML = '<span>Play Now</span>';
    btn.style.pointerEvents = 'auto';
    btn.style.opacity = '1';
  }
  
  if (S.playerName && screenGame.classList.contains('active')) {
    socket.emit('joinGame', { 
      sessionId: S.myId,
      name: S.playerName, 
      avatarDef: PREMIUM_AVATARS[S.avatarIdx],
      roomId: roomCodeFromUrl,
      customWords: S.customWords,
      settings: S.roomSettings
    });
  }
});

socket.on('disconnect', () => {
  const btn = $('btn-play');
  if (btn && !screenGame.classList.contains('active')) {
    btn.innerHTML = '<span>Connecting... ⏳</span>';
    btn.style.pointerEvents = 'none';
    btn.style.opacity = '0.6';
  }
});

socket.on('kicked', () => {
  alert("You have been disconnected from this room (Voted out or Room Full).");
  window.location.href = '/'; 
});

function setAvatar(i) {
  S.avatarIdx = ((i % PREMIUM_AVATARS.length) + PREMIUM_AVATARS.length) % PREMIUM_AVATARS.length;
  
  if(avImg) {
    avImg.src = PREMIUM_AVATARS[S.avatarIdx];
  }
  
  $('av-dots').innerHTML = '';
  PREMIUM_AVATARS.forEach((_, j) => {
    const d = document.createElement('button'); 
    d.className = 'av-dot' + (j === S.avatarIdx ? ' active' : '');
    d.addEventListener('click', () => setAvatar(j)); 
    $('av-dots').appendChild(d);
  });
}

$('btn-av-prev').addEventListener('click', () => setAvatar(S.avatarIdx - 1));
$('btn-av-next').addEventListener('click', () => setAvatar(S.avatarIdx + 1));
setAvatar(0);

$('btn-play').addEventListener('click', () => {
  const name = $('inp-name').value.trim();
  if (!name) { 
    $('inp-name').classList.add('shake'); 
    setTimeout(() => {
      $('inp-name').classList.remove('shake');
    }, 500); 
    return; 
  }
  
  S.playerName = name; 
  transitionToGame();
});

$('btn-private').addEventListener('click', () => {
  $('modal-private').classList.remove('hidden');
});

$('btn-cancel-private').addEventListener('click', () => { 
  $('modal-private').classList.add('hidden'); 
  $('priv-invite-box').classList.add('hidden'); 
});

$('btn-start-private').addEventListener('click', () => {
  S.playerName = $('inp-name').value.trim() || 'Host';
  
  const getDropdownVal = (id, fallback) => {
      const el = document.getElementById(id);
      if (el) {
        return parseInt(el.value, 10) || fallback;
      }
      return fallback;
  };

  S.roomSettings = {
      maxPlayers: getDropdownVal('max-players', 8),
      rounds: getDropdownVal('rounds', 3),
      drawTime: getDropdownVal('draw-time', 85),
      hints: getDropdownVal('hints', 2)
  };

  const cwEl = $('priv-words');
  if (cwEl && cwEl.value.trim()) {
    S.customWords = cwEl.value.split(',').map(w => w.trim()).filter(w => w.length > 0);
  }
  
  roomCodeFromUrl = Math.random().toString(36).substr(2, 6).toUpperCase();
  const inviteLink = `${window.location.origin}/r/${roomCodeFromUrl}`; 
  window.history.pushState({}, '', `/r/${roomCodeFromUrl}`);
  
  navigator.clipboard.writeText(inviteLink).catch(()=>{});
  
  const startBtn = $('btn-start-private');
  const originalHTML = startBtn.innerHTML;
  startBtn.innerHTML = '<span>✓ Link Copied! Joining...</span>';
  startBtn.style.background = '#2ecc71'; 
  
  setTimeout(() => {
    $('modal-private').classList.add('hidden');
    startBtn.innerHTML = originalHTML;
    startBtn.style.background = '';
    showToast('🔗 Invite Link Copied to Clipboard!', 't-info');
    transitionToGame();
  }, 800);
});

$('btn-copy-priv').addEventListener('click', () => {
  navigator.clipboard.writeText($('priv-link-txt').textContent).catch(()=>{});
  $('btn-copy-priv').textContent = '✓ Copied!';
  
  setTimeout(() => {
    $('modal-private').classList.add('hidden');
    $('priv-invite-box').classList.add('hidden');
    $('btn-copy-priv').textContent = 'Copy';
    transitionToGame();
  }, 1200);
});

function transitionToGame() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  
  screenLobby.style.opacity = '0'; 
  screenLobby.style.transform = 'scale(1.08)';
  
  setTimeout(() => { 
    screenLobby.classList.remove('active'); 
    screenLobby.style.display = 'none'; 
    screenGame.classList.add('active'); 
    setupMobileLayout(); 
    initGame(); 
  }, 420);
}

function setupMobileLayout() {
  const isMobile = window.innerWidth < 768;
  const gameBody = document.querySelector('.game-body');
  const lb = $('leaderboard-panel');
  const chat = $('chat-panel');
  const canvasCol = document.querySelector('.canvas-col');
  const chatForm = document.querySelector('.chat-form');
  let bottomRow = document.querySelector('.bottom-mobile-row');

  if (isMobile) {
    if (!bottomRow) {
      bottomRow = document.createElement('div');
      bottomRow.className = 'bottom-mobile-row';
      gameBody.appendChild(bottomRow);
    }
    if (!bottomRow.contains(lb)) {
      bottomRow.appendChild(lb);
    }
    if (!bottomRow.contains(chat)) {
      bottomRow.appendChild(chat);
    }

    if (canvasCol && gameBody.firstChild !== canvasCol) {
      gameBody.insertBefore(canvasCol, gameBody.firstChild);
    }
    if (chatForm && chatForm.parentNode !== gameBody) {
      gameBody.appendChild(chatForm);
    }
  } else {
    if (lb && lb.parentNode !== gameBody) {
      gameBody.appendChild(lb);
    }
    if (canvasCol && canvasCol.parentNode !== gameBody) {
      gameBody.appendChild(canvasCol);
    }
    if (chat && chat.parentNode !== gameBody) {
      gameBody.appendChild(chat);
    }

    gameBody.appendChild(lb);
    gameBody.appendChild(canvasCol);
    gameBody.appendChild(chat);

    if (bottomRow) {
      bottomRow.remove();
    }

    if (chatForm && chatForm.parentNode !== chat) {
      chat.appendChild(chatForm);
    }
  }
  
  setTimeout(resizeCanvas, 50);
}

window.addEventListener('resize', () => { 
  setupMobileLayout(); 
  resizeCanvas(); 
});

/* ════════════════════════════════════════════
   THE GOD SERVER LISTENERS
════════════════════════════════════════════ */
function initGame() {
  socket.emit('joinGame', { 
    sessionId: S.myId,
    name: S.playerName, 
    avatarDef: PREMIUM_AVATARS[S.avatarIdx],
    roomId: roomCodeFromUrl,
    customWords: S.customWords,
    settings: S.roomSettings
  });
  
  setupToolbar(); 
  setupChat(); 
  setupContextMenu(); 
  initCanvas();
  
  $('overlay-waiting').classList.remove('hidden');
  $('wait-title').textContent = 'Waiting for players...';
  $('wait-sub').textContent = 'Need at least 2 players to start.';
}

socket.on('currentPlayers', (serverPlayers) => {
  if (!screenGame.classList.contains('active')) {
    return;
  }
  S.players = serverPlayers.map(p => {
    return { ...p, isSelf: p.id === S.myId };
  });
  buildLeaderboard();
});

socket.on('playerJoined', (newPlayer) => {
  if (!screenGame.classList.contains('active')) {
    return;
  }
  if (S.players.find(p => p.id === newPlayer.id)) {
    return;
  }
  
  S.players.push({ ...newPlayer, isSelf: false });
  buildLeaderboard();
  addChat('system', '', `👋 ${newPlayer.name} joined!`);
  showToast(`👋 ${newPlayer.name} joined!`, 't-info');
});

socket.on('playerLeft', (id) => {
  if (!screenGame.classList.contains('active')) {
    return;
  }
  const idx = S.players.findIndex(p => p.id === id);
  if (idx !== -1) {
    const name = S.players[idx].name;
    S.players.splice(idx, 1);
    buildLeaderboard();
    addChat('system', '', `🚪 ${name} left.`);
  }
});

socket.on('gameAborted', () => {
  if (!screenGame.classList.contains('active')) {
    return;
  }
  overlayRoundEnd.classList.add('hidden');
  overlayWordSelect.classList.add('hidden');
  $('overlay-waiting').classList.remove('hidden');
  $('wait-title').textContent = 'Not enough players';
  $('wait-sub').textContent = 'Waiting for more players to join...';
});

socket.on('forceStartGame', () => {
  if (!screenGame.classList.contains('active')) {
    return;
  }
  $('wait-title').textContent = 'Players found!';
  $('wait-sub').textContent = 'Starting game...';
  setTimeout(() => {
    $('overlay-waiting').classList.add('hidden');
    showEventPopup('🎮', 'Game started!');
  }, 1500);
});

socket.on('gameState', (state) => {
  if (!screenGame.classList.contains('active')) {
    return;
  }
  
  S.timeLeft = state.time;
  S.currentWord = state.word;
  S.drawerIdx = state.players.findIndex(p => p.id === state.drawerId);
  S.isDrawer = (state.drawerId === S.myId);
  S.players = state.players.map(p => {
    return { ...p, isSelf: p.id === S.myId };
  });
  S.revealedIdx = state.revealedIdx || [];
  
  S.drawTime = state.time > S.drawTime ? state.time : S.drawTime; 
  
  roundBadge.textContent = `Round ${state.round}/${state.totalRounds}`;
  buildLeaderboard();

  $('overlay-waiting').classList.add('hidden');
  overlayRoundEnd.classList.add('hidden');

  if (S.isDrawer || state.phase !== 'drawing') {
    $('rate-bar').classList.add('hidden');
  } else {
    $('rate-bar').classList.remove('hidden');
  }

  if (state.phase === 'picking') {
    startWordSelectionUI(state.drawerId);
  } else if (state.phase === 'drawing') {
    overlayWordSelect.classList.add('hidden');
    renderWordBlanks();
  }
});

socket.on('artRated', (data) => {
  if (!screenGame.classList.contains('active')) {
    return;
  }
  const p = S.players.find(x => x.id === data.id);
  const finalName = p ? p.name : (data.name || 'Someone');
  const emoji = data.rating === 'like' ? '👍 liked' : '👎 disliked';
  
  addChat('system', '', `${finalName} ${emoji} the drawing!`);
  
  if (S.isDrawer) {
      floatPoints(data.rating === 'like' ? '👍' : '👎', window.innerWidth * 0.5, window.innerHeight * 0.4);
  }
});

socket.on('scoreUpdate', (serverPlayers) => {
  if (!screenGame.classList.contains('active')) {
    return;
  }
  S.players = serverPlayers.map(p => {
    return { ...p, isSelf: p.id === S.myId };
  });
  buildLeaderboard();
});

socket.on('yourTurn', (choices) => {
  if (!screenGame.classList.contains('active')) {
    return;
  }
  $('toolbar').style.pointerEvents = 'auto';
  $('toolbar').style.opacity = '1';
  wsCards.style.display = 'flex';
  
  const headerH2 = document.querySelector('.ws-header h2');
  const headerP = document.querySelector('.ws-header p');
  headerH2.textContent = 'Choose a Word';
  headerP.innerHTML = `Pick one to draw! Time left: <span id="ws-timer" class="ws-clock">15</span>s`;
  
  wsCards.innerHTML = '';
  choices.forEach(c => {
    const card = document.createElement('div'); 
    card.className = 'ws-card';
    card.innerHTML = `<span class="ws-emoji">${c.e}</span><div class="ws-word">${c.w}</div><div class="ws-len">${c.w.length} letters</div>`;
    
    card.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      socket.emit('wordPicked', c.w);
    });
    wsCards.appendChild(card);
  });
});

function startWordSelectionUI(drawerId) {
  overlayWordSelect.classList.remove('hidden');
  S.history = [];
  const r = gameCanvas.getBoundingClientRect();
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, r.width || gameCanvas.width / S.dpr, r.height || gameCanvas.height / S.dpr);
  
  if (S.myId !== drawerId) {
    $('toolbar').style.pointerEvents = 'none';
    $('toolbar').style.opacity = '0.4';
    wsCards.style.display = 'none';
    
    const headerH2 = document.querySelector('.ws-header h2');
    const headerP = document.querySelector('.ws-header p');
    headerH2.textContent = 'Waiting...';
    
    const artist = S.players.find(p => p.id === drawerId);
    const artistName = artist ? artist.name : 'Artist';
    headerP.innerHTML = `${artistName} is picking a word... <span id="ws-timer" class="ws-clock">15</span>s`;
  }
}

socket.on('wordPicked', (word) => {
  if (!screenGame.classList.contains('active')) {
    return;
  }
  overlayWordSelect.classList.add('hidden');
  S.currentWord = word; 
  S.revealedIdx = []; 
  renderWordBlanks(); 
  
  addChat('system', '', `A new round begins! 🖊️`);
  
  ctx.fillStyle = 'white'; 
  { const _r = gameCanvas.getBoundingClientRect(); ctx.fillRect(0, 0, _r.width || gameCanvas.width / S.dpr, _r.height || gameCanvas.height / S.dpr); }
  S.history = []; 
  
  if (!S.isDrawer) {
    $('rate-bar').classList.remove('hidden');
  }
});

socket.on('timeTick', (data) => {
  if (!screenGame.classList.contains('active')) {
    return;
  }
  S.timeLeft = data.time;
  
  if (data.phase === 'drawing') {
    updateTimerUI();
    if (S.timeLeft <= 15 && S.timeLeft > 0) {
      playTickSound();
    }
  } 
  else if (data.phase === 'picking') {
    if ($('ws-timer')) {
      $('ws-timer').textContent = S.timeLeft;
    }
    $('ws-timer-bar').style.transition = 'width 1s linear';
    $('ws-timer-bar').style.width = (S.timeLeft / 15 * 100) + '%';
  }
  else if (data.phase === 'roundEnd') {
    const cdSpan = $('re-countdown');
    if (cdSpan) {
      cdSpan.textContent = S.timeLeft;
    }
  }
});

socket.on('timeUp', (data) => {
  if (!screenGame.classList.contains('active')) {
    return;
  }
  
  $('rate-bar').classList.add('hidden');

  if (data.players) {
    S.players = data.players.map(p => {
      return { ...p, isSelf: p.id === S.myId };
    });
    buildLeaderboard();
  }

  if (data.phase === 'drawing') {
    showRoundEndUI(data.word, data.allGuessed);
  } else if (data.phase === 'gameOver') {
    showGameOverUI();
  }
});

socket.on('drawerDisconnected', () => {
  if (!screenGame.classList.contains('active')) {
    return;
  }
  addChat('system', '', '⚠️ The artist disconnected!');
});

socket.on('requestSync', () => {
  if (!screenGame.classList.contains('active')) {
    return;
  }
  if (S.isDrawer) {
    socket.emit('canvasCommand', { cmd: 'sync', data: gameCanvas.toDataURL() }); 
  }
});

socket.on('catchUpSync', (data) => {
  if (!screenGame.classList.contains('active')) {
    return;
  }
  $('overlay-waiting').classList.add('hidden');
  
  S.drawerIdx = S.players.findIndex(p => p.id === data.drawerId);
  S.isDrawer = (data.drawerId === S.myId);

  if (data.phase === 'picking') {
    startWordSelectionUI(data.drawerId);
  } else if (data.phase === 'drawing') {
    overlayWordSelect.classList.add('hidden');
    S.currentWord = data.word; 
    S.revealedIdx = data.revealedIdx || []; 
    S.timeLeft = data.time;
    renderWordBlanks(); 
    updateTimerUI();
    
    if (!S.isDrawer) {
        $('rate-bar').classList.remove('hidden');
    }

    const drawHDVectors = () => {
      const r = gameCanvas.getBoundingClientRect();
      data.strokes.forEach(stroke => {
        ctx.strokeStyle = stroke.color;
        ctx.lineWidth = stroke.size * r.width;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        const realX = stroke.x * r.width;
        const realY = stroke.y * r.height;  // fixed: use actual height not width*0.75

        if (stroke.type === 'start') {
          ctx.beginPath();
          ctx.moveTo(realX, realY);
          ctx.lineTo(realX, realY);
          ctx.stroke();
        } else if (stroke.type === 'move') {
          ctx.lineTo(realX, realY);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(realX, realY);
        }
      });
    };
    
    if (data.baseCanvasImage) {
      const img = new Image();
      img.onload = () => {
        const cssW = gameCanvas.width / S.dpr;
        const cssH = gameCanvas.height / S.dpr;
        ctx.drawImage(img, 0, 0, cssW, cssH);
        drawHDVectors();
      };
      img.src = data.baseCanvasImage;
    } else { 
      drawHDVectors(); 
    }
  }
});

socket.on('receiveChat', (data) => {
  if (!screenGame.classList.contains('active')) {
    return;
  }
  addChat(data.type, data.name, data.text, false);
});

socket.on('correctGuess', (data) => {
  if (!screenGame.classList.contains('active')) {
    return;
  }
  const guesser = S.players.find(p => p.id === data.guesserId);
  
  const gName = (data.guesserId === S.myId) ? 'You' : (guesser ? guesser.name : 'Someone'); 
  addChat('correct', gName, `🎉 Guessed the word! (+${data.pts} pts)`, false);
  
  playSuccessSound();
  if (canvasWrap) {
    canvasWrap.classList.remove('shake-canvas');
    void canvasWrap.offsetWidth; 
    canvasWrap.classList.add('shake-canvas');
  }
  
  if (data.guesserId === S.myId) { 
    showToast(`✅ You guessed it! +${data.pts} pts`, 't-correct'); 
    floatPoints(`+${data.pts}`, window.innerWidth * 0.5, window.innerHeight * 0.4); 
  }
});

socket.on('hintRevealed', (idx) => { 
  if (!screenGame.classList.contains('active')) {
    return;
  }
  if (!S.revealedIdx.includes(idx)) {
    S.revealedIdx.push(idx);
    renderWordBlanks(); 
    showToast('💡 Hint letter revealed!', 't-info');
  }
});

socket.on('canvasCommand', (payload) => {
  if (!screenGame.classList.contains('active')) {
    return;
  }
  if (payload && payload.cmd === 'sync') {
    const img = new Image();
    img.onload = () => {
      const cssW = gameCanvas.width / S.dpr;
      const cssH = gameCanvas.height / S.dpr;
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, cssW, cssH);
      ctx.drawImage(img, 0, 0, cssW, cssH);
    };
    img.src = payload.data;
  }
});

function buildLeaderboard() {
  const sorted = [...S.players].sort((a, b) => b.score - a.score);
  playerList.innerHTML = '';
  
  const drawerIdObj = S.players[S.drawerIdx];
  
  sorted.forEach((p, rank) => {
    const li = document.createElement('li');
    const isDrawer = (drawerIdObj && p.id === drawerIdObj.id); 
    
    li.className = 'player-item' + (isDrawer ? ' is-drawing' : '') + (p.guessed ? ' guessed' : '');
    
    const rankClass = rank === 0 ? 'gold' : rank === 1 ? 'silver' : rank === 2 ? 'bronze' : '';
    
    const avWrap = document.createElement('div'); 
    avWrap.className = 'pi-av';
    const avImgList = document.createElement('img');
    avImgList.src = p.avatarDef;
    avImgList.style.width = '100%'; 
    avImgList.style.height = '100%'; 
    avImgList.style.objectFit = 'cover';
    avWrap.appendChild(avImgList);
    
    let rankBadge = rank + 1;
    if (rank === 0) {
      rankBadge = '🥇';
    }
    if (rank === 1) {
      rankBadge = '🥈';
    }
    if (rank === 2) {
      rankBadge = '🥉';
    }
    
    li.innerHTML = `<div class="pi-rank ${rankClass}">${rankBadge}</div>`;
    li.appendChild(avWrap);
    
    let star = p.isSelf ? '⭐ ' : '';
    li.insertAdjacentHTML('beforeend', `<div class="pi-info"><div class="pi-name">${star}${escHtml(p.name)}</div><div class="pi-score">${p.score} pts</div></div>`);
    
    if (isDrawer) {
      li.insertAdjacentHTML('beforeend', `<span class="pi-badge">✏️</span>`);
    } else if (p.guessed) {
      li.insertAdjacentHTML('beforeend', `<span class="pi-badge">✅</span>`);
    }
    
    if (!p.isSelf) {
      li.style.cursor = 'pointer';
      li.addEventListener('click', e => openContextMenu(e, p));
    }
    
    playerList.appendChild(li);
  });
}

function updateTimerUI() {
  timerNum.textContent = S.timeLeft;
  const progress = S.timeLeft / S.drawTime;
  tFg.style.strokeDashoffset = String(CIRC * (1 - progress));
  
  const warn = S.timeLeft <= 15;
  timerNum.className = 'timer-num' + (warn ? ' warn' : '');
  tFg.setAttribute('class', 't-fg' + (warn ? ' warn' : '')); 
}

function renderWordBlanks() {
  wordDisplay.innerHTML = ''; 
  if (!S.currentWord) { 
    wordMeta.textContent = ''; 
    return; 
  }
  
  wordMeta.textContent = S.isDrawer ? `You are drawing — ${S.currentWord.length} letters` : `${S.currentWord.length} letters`;

  for (let i = 0; i < S.currentWord.length; i++) {
    const ch = S.currentWord[i];
    const grp = document.createElement('div');
    const charEl = document.createElement('div');
    
    grp.className = 'wb-group'; 
    const revealed = S.revealedIdx.includes(i);
    charEl.className = 'wb-char' + (revealed && !S.isDrawer ? ' reveal' : '');
    charEl.textContent = S.isDrawer || revealed ? ch.toUpperCase() : '';
    
    grp.appendChild(charEl); 
    grp.insertAdjacentHTML('beforeend', `<div class="wb-line" style="width:20px"></div>`);
    wordDisplay.appendChild(grp);
  }
}

function showRoundEndUI(word, allGuessed) {
  addChat('system', '', `⏰ Turn over! Word was: "${word}"`);
  
  const oldBtnWrap = document.getElementById('podium-btns');
  if (oldBtnWrap) { 
    oldBtnWrap.style.display = 'none'; 
  }

  const sorted = [...S.players].sort((a, b) => b.score - a.score);
  $('re-emoji').textContent = allGuessed ? '🎉' : '⏰'; 
  $('re-title').textContent = allGuessed ? 'Everyone guessed!' : 'Turn Over!'; 
  
  const reWordP = document.getElementById('re-word');
  if(reWordP) { 
    reWordP.innerHTML = `The word was: <strong>${word}</strong>`; 
  }

  $('re-scores').innerHTML = sorted.map((p, i) => {
    let medal = '';
    if (i === 0) {
      medal = '🥇';
    }
    if (i === 1) {
      medal = '🥈';
    }
    if (i === 2) {
      medal = '🥉';
    }
    return `<div class="re-score-row" style="animation-delay:${i*0.07}s"><span class="re-score-name">${medal} ${escHtml(p.name)}</span><span class="re-score-pts">${p.score} pts</span></div>`;
  }).join('');
  
  overlayRoundEnd.classList.remove('hidden');
  $('re-next').style.display = '';
  $('re-next').innerHTML = `Next turn in <span id="re-countdown">4</span>s...`;
}

function showGameOverUI() {
  const sortedPlayers = [...S.players].sort((a, b) => b.score - a.score); 
  const winner = sortedPlayers[0];
  
  overlayRoundEnd.classList.remove('hidden'); 
  overlayRoundEnd.style.flexDirection = 'column'; 
  
  $('re-emoji').textContent = '🏆'; 
  $('re-title').textContent = 'Game Over!'; 
  
  const reWordP = document.getElementById('re-word'); 
  if(reWordP) { 
    reWordP.innerHTML = `Winner: <strong>${escHtml(winner ? winner.name : 'Unknown')}</strong>`; 
  }
  
  $('re-next').style.display = 'none';

  const top3 = sortedPlayers.slice(0, 3); 
  const rest = sortedPlayers.slice(3);
  
  let podiumHTML = '<div class="podium-top3">'; 
  const order = [1, 0, 2];
  
  order.forEach(idx => {
    const p = top3[idx];
    if (p) {
      const rank = idx + 1; 
      let crown = '🥉'; 
      let delay = 0.5; 
      
      if (rank === 1) {
        crown = '👑'; 
        delay = 2.8; 
      }
      if (rank === 2) {
        crown = '🥈';
        delay = 1.5; 
      }
      podiumHTML += `
        <div class="podium-place rank-${rank}" style="animation-delay: ${delay}s">
          <div class="podium-crown">${crown}</div>
          <div class="podium-av-wrap"><img src="${p.avatarDef}" alt="Avatar"></div>
          <div class="podium-name">${escHtml(p.name)}</div>
          <div class="podium-pts">${p.score} pts</div>
        </div>
      `;
    }
  });
  podiumHTML += '</div>';

  let restHTML = '<div class="re-scores-list">';
  rest.forEach((p, i) => { 
    restHTML += `
      <div class="re-score-row" style="animation-delay:${3.0 + (i * 0.08)}s">
        <div class="re-score-left">
          <span class="re-score-rank">#${i + 4}</span>
          <div class="re-score-av-wrap-small"><img class="re-score-av" src="${p.avatarDef}" alt="Avatar"></div>
          <span class="re-score-name">${escHtml(p.name)}</span>
        </div>
        <span class="re-score-pts">${p.score} pts</span>
      </div>
    `; 
  });
  restHTML += '</div>';

  $('re-scores').innerHTML = podiumHTML + restHTML;
  
  let oldBtnWrap = document.getElementById('podium-btns'); 
  if (oldBtnWrap) { 
    oldBtnWrap.remove(); 
  }

  const btnWrap = document.createElement('div'); 
  btnWrap.id = 'podium-btns'; 
  btnWrap.className = 'podium-btn-wrap';
  
  const playBtn = document.createElement('button'); 
  playBtn.innerHTML = '<span>🔄 Play Again</span>'; 
  playBtn.className = 'glass-fluid-btn play-btn'; 
  playBtn.onclick = () => { socket.emit('canvasCommand', { cmd: 'playAgain' }); };
  
  // 🔥 ADDED: VIRAL EXPORT BUTTON FOR GAME OVER
  const exportBtn = document.createElement('button'); 
  exportBtn.innerHTML = '<span>📸 Save Art</span>'; 
  exportBtn.className = 'glass-fluid-btn'; 
  exportBtn.style.background = '#8b5cf6';
  exportBtn.style.boxShadow = '0 8px 25px rgba(139,92,246,0.5)';
  exportBtn.onclick = () => exportCanvas();

  const homeBtn = document.createElement('button'); 
  homeBtn.innerHTML = '<span>🏠 Home</span>'; 
  homeBtn.className = 'glass-fluid-btn home-btn'; 
  homeBtn.onclick = () => location.reload(); 

  btnWrap.appendChild(playBtn); 
  btnWrap.appendChild(exportBtn); 
  btnWrap.appendChild(homeBtn);
  overlayRoundEnd.appendChild(btnWrap); 
  
  playDrumroll();
  setTimeout(() => {
    playWinnerSound();
    fireGrandConfetti();
    if (winner) { 
      showEventPopup('🏆', `${winner.name} wins the game!`); 
    }
  }, 2800);
}

/* ════════════════════════════════════════════
   VIRAL EXPORT ENGINE (Client-Side Rendering)
════════════════════════════════════════════ */
function exportCanvas() {
  const w = gameCanvas.width;
  const h = gameCanvas.height;
  if (w === 0 || h === 0) return;

  const pad = 40;
  const off = document.createElement('canvas');
  off.width = w + pad * 2;
  off.height = h + pad * 2 + 100;
  const octx = off.getContext('2d');

  // Solid White Background
  octx.fillStyle = '#ffffff';
  octx.fillRect(0, 0, off.width, off.height);

  // Draw the actual drawing
  octx.drawImage(gameCanvas, pad, pad + 50);

  // Draw a sleek frame border around it
  octx.strokeStyle = '#cbd5e1';
  octx.lineWidth = 4;
  octx.strokeRect(pad, pad + 50, w, h);

  // Add the Picazo Branding
  octx.fillStyle = '#1e293b';
  octx.textAlign = 'center';
  octx.font = 'bold 36px sans-serif';
  octx.fillText('🎨 PICAZO', off.width / 2, pad + 20);

  // Add the URL and Word
  octx.fillStyle = '#64748b';
  octx.font = 'bold 22px sans-serif';
  let bottomText = 'Sketch it. Guess it. Win it.  |  picazo.game';
  if (S.currentWord) {
      bottomText = `Word: ${S.currentWord.toUpperCase()}  |  picazo.game`;
  }
  octx.fillText(bottomText, off.width / 2, off.height - 30);

  // Trigger Local Download
  const link = document.createElement('a');
  link.download = `Picazo_${S.currentWord || 'Art'}.png`;
  link.href = off.toDataURL('image/png');
  link.click();
  
  showToast('📸 Masterpiece Saved to Gallery!', 't-correct');
}

/* ════════════════════════════════════════════
   CANVAS DRAWING & SHAPE LOGIC
════════════════════════════════════════════ */
function initCanvas() {
  resizeCanvas();
  gameCanvas.addEventListener('touchstart', onDrawStart, { passive: false });
  gameCanvas.addEventListener('touchmove', onDrawMove, { passive: false });
  gameCanvas.addEventListener('touchend', onDrawEnd);
  gameCanvas.addEventListener('touchcancel', onDrawEnd);
  gameCanvas.addEventListener('mousedown', onDrawStart);
  window.addEventListener('mousemove', onDrawMove);
  window.addEventListener('mouseup', onDrawEnd);
}

socket.on('drawing', (data) => {
  if (!screenGame.classList.contains('active')) return;
  const r = gameCanvas.getBoundingClientRect();

  ctx.strokeStyle = data.color;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // data.size is normalized as fraction of CSS width; data.x and data.y are fractions of CSS width/height respectively
  ctx.lineWidth = data.size * r.width;
  const realX = data.x * r.width;
  const realY = data.y * r.height;

  if (data.type === 'start') {
    ctx.beginPath();
    ctx.moveTo(realX, realY);
    ctx.lineTo(realX, realY);
    ctx.stroke();
  } else if (data.type === 'move') {
    ctx.lineTo(realX, realY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(realX, realY);
  }
});

function resizeCanvas() {
  const r = canvasWrap.getBoundingClientRect();
  const W = Math.floor(r.width);
  const H = Math.floor(r.height) || Math.floor(W * 0.75);

  if (W === 0 || H === 0) return;

  S.dpr = window.devicePixelRatio || 1;

  const physW = Math.round(W * S.dpr);
  const physH = Math.round(H * S.dpr);

  // Preserve existing drawing as a full-resolution snapshot
  let snapshot = null;
  if (gameCanvas.width > 0 && gameCanvas.height > 0) {
    const offscreen = document.createElement('canvas');
    offscreen.width = gameCanvas.width;
    offscreen.height = gameCanvas.height;
    offscreen.getContext('2d').drawImage(gameCanvas, 0, 0);
    snapshot = offscreen;
  }

  // Set physical pixel size
  gameCanvas.width = physW;
  gameCanvas.height = physH;

  // Set CSS size to exactly match measured layout size (no subpixel gaps)
  gameCanvas.style.width = W + 'px';
  gameCanvas.style.height = H + 'px';

  // Apply DPR scale transform so all drawing coords are in CSS pixels
  ctx.setTransform(S.dpr, 0, 0, S.dpr, 0, 0);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // Fill white background covering full physical canvas
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, physW, physH);
  ctx.restore();

  // Restore previous drawing scaled to new size
  if (snapshot && snapshot.width > 0 && snapshot.height > 0) {
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.drawImage(snapshot, 0, 0, physW, physH);
    ctx.restore();
  }
}

function saveState() {
  if (S.history.length > 15) S.history.shift();
  // Save as an offscreen canvas so restoring works regardless of DPR
  const snap = document.createElement('canvas');
  snap.width = gameCanvas.width;
  snap.height = gameCanvas.height;
  snap.getContext('2d').drawImage(gameCanvas, 0, 0);
  S.history.push(snap);
}

function getXY(e) {
  const r = gameCanvas.getBoundingClientRect(); 
  let cx = e.clientX;
  let cy = e.clientY;
  
  if (e.touches && e.touches.length > 0) { 
    cx = e.touches[0].clientX; 
    cy = e.touches[0].clientY; 
  } else if (e.changedTouches && e.changedTouches.length > 0) { 
    cx = e.changedTouches[0].clientX; 
    cy = e.changedTouches[0].clientY; 
  }
  
  return { 
    x: cx - r.left, 
    y: cy - r.top 
  };
}

function onDrawStart(e) {
  if (e.type === 'touchstart') {
    e.preventDefault(); 
  }
  if (!S.isDrawer) {
    return;
  }
  
  S.isDrawing = true; 
  const pos = getXY(e); 
  saveState();

  if (S.tool === 'shape') {
      S.shapeStartX = pos.x;
      S.shapeStartY = pos.y;
      S.previewData = ctx.getImageData(0, 0, gameCanvas.width, gameCanvas.height);
      return;
  }
  
  if (S.tool === 'fill') { 
    floodFill(pos.x, pos.y, S.color); 
    S.isDrawing = false; 
    socket.emit('canvasCommand', { cmd: 'sync', data: gameCanvas.toDataURL() }); 
    return; 
  }
  
  const drawColor = S.tool === 'eraser' ? '#ffffff' : S.color; 
  const drawSize = S.tool === 'eraser' ? S.brushSize * 3 : S.brushSize;
  
  ctx.beginPath(); 
  ctx.moveTo(pos.x, pos.y); 
  ctx.lineTo(pos.x, pos.y); 
  ctx.strokeStyle = drawColor; 
  ctx.lineWidth = drawSize; 
  ctx.lineCap = 'round'; 
  ctx.lineJoin = 'round'; 
  ctx.stroke();
  
  const r = gameCanvas.getBoundingClientRect();
  socket.emit('drawing', {
    x: pos.x / r.width,
    y: pos.y / r.height,
    color: drawColor,
    size: drawSize / r.width,
    type: 'start'
  });
}

function onDrawMove(e) {
  if (e.type === 'touchmove') {
    e.preventDefault(); 
  }
  if (!S.isDrawer || !S.isDrawing) {
    return;
  }
  
  const pos = getXY(e); 

  if (S.tool === 'shape') {
      ctx.putImageData(S.previewData, 0, 0);
      ctx.beginPath();
      ctx.strokeStyle = S.color;
      ctx.lineWidth = S.brushSize;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (S.shapeType === 'line') {
          ctx.moveTo(S.shapeStartX, S.shapeStartY);
          ctx.lineTo(pos.x, pos.y);
      } else if (S.shapeType === 'rect') {
          ctx.rect(S.shapeStartX, S.shapeStartY, pos.x - S.shapeStartX, pos.y - S.shapeStartY);
      } else if (S.shapeType === 'circle') {
          const radius = Math.sqrt(Math.pow(pos.x - S.shapeStartX, 2) + Math.pow(pos.y - S.shapeStartY, 2));
          ctx.arc(S.shapeStartX, S.shapeStartY, radius, 0, 2 * Math.PI);
      }
      ctx.stroke();
      return;
  }

  ctx.lineTo(pos.x, pos.y); 
  ctx.stroke(); 
  ctx.beginPath(); 
  ctx.moveTo(pos.x, pos.y);
  
  const drawColor = S.tool === 'eraser' ? '#ffffff' : S.color; 
  const drawSize = S.tool === 'eraser' ? S.brushSize * 3 : S.brushSize;
  
  const r = gameCanvas.getBoundingClientRect();
  socket.emit('drawing', {
    x: pos.x / r.width,
    y: pos.y / r.height,
    color: drawColor,
    size: drawSize / r.width,
    type: 'move'
  });
}

function onDrawEnd(e) { 
  if (!S.isDrawer || !S.isDrawing) {
    return;
  } 
  S.isDrawing = false; 
  
  if (S.tool === 'shape') {
      socket.emit('canvasCommand', { cmd: 'sync', data: gameCanvas.toDataURL() });
      return;
  }

  ctx.closePath(); 
}

function floodFill(startX, startY, fillHex) {
  // startX/startY are in CSS (logical) pixel coords.
  // The canvas physical size = logical * dpr, so scale coords.
  const w = gameCanvas.width;
  const h = gameCanvas.height;

  // Read raw physical pixels by bypassing the DPR transform
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  const id = ctx.getImageData(0, 0, w, h);
  ctx.restore();

  const d = id.data;

  const xi = Math.round(startX * S.dpr);
  const yi = Math.round(startY * S.dpr);

  if (xi < 0 || xi >= w || yi < 0 || yi >= h) return;

  const idx = (yi * w + xi) * 4;
  const tr = d[idx];
  const tg = d[idx + 1];
  const tb = d[idx + 2];
  const ta = d[idx + 3];

  const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fillHex);
  const fc = r ? { r: parseInt(r[1], 16), g: parseInt(r[2], 16), b: parseInt(r[3], 16) } : null;

  if (!fc) return;
  if (tr === fc.r && tg === fc.g && tb === fc.b && ta === 255) return;

  function match(i) {
    return Math.abs(d[i] - tr) < 30 &&
      Math.abs(d[i + 1] - tg) < 30 &&
      Math.abs(d[i + 2] - tb) < 30 &&
      Math.abs(d[i + 3] - ta) < 30;
  }

  const stack = [xi + yi * w];
  const seen = new Uint8Array(w * h);

  while (stack.length) {
    const p = stack.pop();
    if (seen[p]) continue;

    const x = p % w;
    const y = Math.floor(p / w);

    if (x < 0 || x >= w || y < 0 || y >= h) continue;

    const i = p * 4;
    if (!match(i)) continue;

    seen[p] = 1;
    d[i] = fc.r;
    d[i + 1] = fc.g;
    d[i + 2] = fc.b;
    d[i + 3] = 255;

    if (x + 1 < w) stack.push(p + 1);
    if (x - 1 >= 0) stack.push(p - 1);
    if (y + 1 < h) stack.push(p + w);
    if (y - 1 >= 0) stack.push(p - w);
  }

  // Write back bypassing the DPR transform
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.putImageData(id, 0, 0);
  ctx.restore();
}

function setupToolbar() {
  ['pencil','fill','eraser'].forEach(t => { 
    if($('tool-' + t)) { 
      $('tool-' + t).addEventListener('click', () => { 
        S.tool = t; 
        gameCanvas.className = t === 'eraser' ? 'eraser' : ''; 
        document.querySelectorAll('.tool-btn[data-tool]').forEach(b => {
          b.classList.toggle('active', b.id === 'tool-' + t);
        }); 
      }); 
    }
  });

  if($('btn-shape-popup')) {
    $('btn-shape-popup').addEventListener('click', e => {
      e.stopPropagation();
      $('popup-shape').classList.toggle('hidden');
      $('popup-color').classList.add('hidden');
      $('popup-size').classList.add('hidden');
    });
  }

  document.querySelectorAll('.shape-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      S.tool = 'shape';
      S.shapeType = e.target.dataset.shape;
      gameCanvas.className = 'crosshair';
      document.querySelectorAll('.tool-btn[data-tool]').forEach(b => b.classList.remove('active'));
      if ($('btn-shape-popup')) $('btn-shape-popup').classList.add('active');
      $('popup-shape').classList.add('hidden');
    });
  });
  
  if($('tool-undo')) {
    $('tool-undo').addEventListener('click', () => { 
      triggerUndo(); 
    });
  }
  
  if($('tool-clear')) {
    $('tool-clear').addEventListener('click', () => { 
      triggerClear(); 
    });
  }
  
  $('size-slider').addEventListener('input', e => { 
    S.brushSize = +e.target.value; 
    $('size-val-txt').textContent = S.brushSize + 'px'; 
  });
  
  $('btn-color-popup').addEventListener('click', e => { 
    e.stopPropagation(); 
    $('popup-color').classList.toggle('hidden'); 
    $('popup-size').classList.add('hidden');
    if($('popup-shape')) $('popup-shape').classList.add('hidden');
  });
  
  $('btn-size-popup').addEventListener('click', e => { 
    e.stopPropagation(); 
    $('popup-size').classList.toggle('hidden'); 
    $('popup-color').classList.add('hidden');
    if($('popup-shape')) $('popup-shape').classList.add('hidden');
  });
  
  $('color-palette').innerHTML = COLORS.map(hex => {
    let activeClass = hex === S.color ? 'active' : '';
    return `<div class="c-swatch ${activeClass}" style="background:${hex}" onclick="S.color='${hex}'; document.getElementById('color-indicator').style.background='${hex}'; if(S.tool==='eraser'){ document.getElementById('tool-pencil').click(); }"></div>`;
  }).join('');
  
  document.addEventListener('click', e => {
    const pColor = $('popup-color');
    const pSize = $('popup-size');
    const pShape = $('popup-shape');
    
    if (pColor && !pColor.classList.contains('hidden') && !pColor.contains(e.target) && !$('btn-color-popup').contains(e.target)) {
      pColor.classList.add('hidden');
    }
    if (pSize && !pSize.classList.contains('hidden') && !pSize.contains(e.target) && !$('btn-size-popup').contains(e.target)) {
      pSize.classList.add('hidden');
    }
    if (pShape && !pShape.classList.contains('hidden') && !pShape.contains(e.target) && !$('btn-shape-popup').contains(e.target)) {
      pShape.classList.add('hidden');
    }
  });
}

function triggerUndo() {
  const snap = S.history.pop();
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (snap) {
    ctx.drawImage(snap, 0, 0);
  } else {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
  }
  ctx.restore();
  socket.emit('canvasCommand', { cmd: 'sync', data: gameCanvas.toDataURL() });
}

function triggerClear() {
  saveState();
  const r = gameCanvas.getBoundingClientRect();
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, r.width, r.height);
  socket.emit('canvasCommand', { cmd: 'sync', data: gameCanvas.toDataURL() });
}

/* ════════════════════════════════════════════
   CHAT & GUESSING
════════════════════════════════════════════ */
function setupChat() {
  btnChatSend.addEventListener('click', sendGuess);
  chatInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') { e.preventDefault(); sendGuess(); }
  });

  // Mobile keyboard detection: when virtual keyboard opens, the visualViewport shrinks.
  // Toggle body class so CSS can hide panels and keep canvas/chat visible.
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', () => {
      const keyboardOpen = window.visualViewport.height < window.innerHeight * 0.75;
      document.body.classList.toggle('keyboard-open', keyboardOpen);
      if (!keyboardOpen) resizeCanvas();
    });
  }

  // Fallback for browsers without visualViewport
  chatInput.addEventListener('focus', () => {
    if (window.innerWidth < 768) {
      document.body.classList.add('keyboard-open');
    }
  });
  chatInput.addEventListener('blur', () => {
    document.body.classList.remove('keyboard-open');
    setTimeout(resizeCanvas, 100);
  });
}

function getEditDistance(a, b) {
  if (a.length === 0) return b.length; 
  if (b.length === 0) return a.length;
  
  const matrix = []; 
  
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i]; 
  }
  
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= b.length; i++) { 
    for (let j = 1; j <= a.length; j++) { 
      if (b.charAt(i - 1) === a.charAt(j - 1)) { 
        matrix[i][j] = matrix[i - 1][j - 1]; 
      } else { 
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, 
          Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1)
        ); 
      } 
    } 
  }
  return matrix[b.length][a.length];
}

function sendGuess() {
  const val = chatInput.value.trim(); 
  if (!val) {
    return; 
  }
  
  chatInput.value = '';
  
  const me = S.players.find(p => p.id === S.myId);
  const word = (S.currentWord || '').toLowerCase().trim();
  const guess = val.toLowerCase().trim();

  if (S.isDrawer || (me && me.guessed)) { 
    if (word && (guess === word || getEditDistance(guess, word) <= 2)) {
      addChat('close', '', `🤫 Shh! You already know the word!`, false);
      return; 
    }
    addChat('normal', S.playerName, val); 
    return; 
  }
  
  if (word && guess === word) {
    const pts = Math.floor((S.timeLeft / S.drawTime) * 400) + 100;
    socket.emit('correctGuess', { guesserId: S.myId, pts: pts });
  } else if (word && guess.length > 2) {
    const threshold = word.length <= 5 ? 1 : 2;
    
    if (getEditDistance(guess, word) <= threshold) { 
      addChat('normal', S.playerName, val); 
      addChat('close', '', `🤏 '${val}' is very close!`, false); 
    } else { 
      addChat('normal', S.playerName, val); 
    }
  } else { 
    addChat('normal', S.playerName, val); 
  }
}

function addChat(type, name, text, broadcast = true) {
  const div = document.createElement('div'); 
  
  let typeClass = 'normal';
  if (type === 'correct') {
    typeClass = 'correct';
  }
  if (type === 'system') {
    typeClass = 'system';
  }
  if (type === 'close') {
    typeClass = 'close';
  }
  
  div.className = 'chat-msg ' + typeClass;
  
  if (type === 'system' || type === 'close') {
    div.innerHTML = `<span class="msg-text">${escHtml(text)}</span>`;
  } else {
    div.innerHTML = `<span class="msg-name">${escHtml(name)}:</span> <span class="msg-text">${escHtml(text)}</span>`;
  }
    
  chatMessages.appendChild(div); 
  chatMessages.scrollTop = chatMessages.scrollHeight;
  
  if (type === 'normal') {
    playPopSound();
  }
  
  if (broadcast && type === 'normal') { 
    socket.emit('chatMessage', { type, name, text }); 
  }
}

$('btn-mute').addEventListener('click', () => { 
  S.isMuted = !S.isMuted; 
  
  if (S.isMuted) {
    $('mute-icon').innerHTML = `<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>`;
  } else {
    $('mute-icon').innerHTML = `<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>`;
  }
});

function setupContextMenu() {
  document.addEventListener('click', e => { 
    if (!contextMenu.contains(e.target)) {
      contextMenu.classList.add('hidden'); 
    }
  });
  
  $('ctx-kick').addEventListener('click', () => { 
    contextMenu.classList.add('hidden'); 
    if (S.ctxTarget) {
      socket.emit('voteKick', S.ctxTarget.id);
      showToast(`🗳️ Vote kick initiated for ${S.ctxTarget.name}`, 't-warn'); 
    }
  });
  
  $('ctx-report').addEventListener('click', () => { 
    contextMenu.classList.add('hidden'); 
    if (S.ctxTarget) {
      showToast(`🚩 ${S.ctxTarget.name} reported`, 't-warn'); 
    }
  });
  
  $('ctx-mute').addEventListener('click', () => { 
    contextMenu.classList.add('hidden'); 
    if (S.ctxTarget) {
      showToast(`🔇 ${S.ctxTarget.name} muted locally`, 't-info'); 
    }
  });
  
  $('ctx-close').addEventListener('click', () => { 
    contextMenu.classList.add('hidden'); 
  });
}

function openContextMenu(e, player) {
  e.stopPropagation(); 
  S.ctxTarget = player; 
  ctxName.textContent = player.name; 
  ctxPts.textContent = player.score + ' pts';
  
  ctxAv.innerHTML = ''; 
  const img = document.createElement('img'); 
  img.src = player.avatarDef; 
  img.style.width = '100%'; 
  img.style.height = '100%'; 
  img.style.objectFit = 'cover'; 
  ctxAv.appendChild(img);
  
  contextMenu.classList.remove('hidden'); 
  contextMenu.style.left = Math.min(e.clientX, window.innerWidth - 200) + 'px'; 
  contextMenu.style.top = Math.min(e.clientY, window.innerHeight - 240) + 'px';
}

function showEventPopup(icon, msg) { 
  if(!$('event-popup')) {
    return; 
  }
  
  $('event-popup-icon').textContent = icon; 
  $('event-popup-msg').textContent = msg; 
  $('event-popup').classList.remove('hidden'); 
  
  setTimeout(() => {
    $('event-popup').classList.add('hidden');
  }, 2800); 
}

function showToast(msg, type = 't-info') { 
  const tc = $('toast-container');
  const t = document.createElement('div'); 
  
  t.className = 'toast ' + type; 
  t.textContent = msg; 
  tc.prepend(t); 
  
  setTimeout(() => { 
    t.classList.add('fade-out'); 
    setTimeout(() => {
      t.remove();
    }, 380); 
  }, 3800); 
}

function floatPoints(text, x, y) { 
  const el = document.createElement('div'); 
  el.className = 'float-pts'; 
  el.textContent = text; 
  el.style.left = x + 'px'; 
  el.style.top = y + 'px'; 
  document.body.appendChild(el); 
  
  setTimeout(() => {
    el.remove();
  }, 1300); 
}

function escHtml(str) { 
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); 
}

function fireGrandConfetti() {
  if (typeof confetti === 'undefined') {
    return;
  }
  
  const duration = 4000; 
  const end = Date.now() + duration;
  
  confetti({ 
    particleCount: 250, 
    spread: 360, 
    origin: { y: 0.4, x: 0.5 }, 
    startVelocity: 65, 
    colors: ['#4a8fe8', '#2ecc87', '#f4b942', '#ec4899', '#8b5cf6', '#ffffff'], 
    zIndex: 99999 
  });
  
  (function frame() {
    confetti({ 
      particleCount: 10, 
      angle: 60, 
      spread: 100, 
      origin: { x: -0.1, y: 0.8 }, 
      colors: ['#4a8fe8', '#2ecc87', '#f4b942', '#ec4899'], 
      zIndex: 99999 
    });
    
    confetti({ 
      particleCount: 10, 
      angle: 120, 
      spread: 100, 
      origin: { x: 1.1, y: 0.8 }, 
      colors: ['#f4b942', '#ec4899', '#8b5cf6', '#ffffff'], 
      zIndex: 99999 
    });
    
    if (Date.now() < end) { 
      requestAnimationFrame(frame); 
    }
  }());
}
