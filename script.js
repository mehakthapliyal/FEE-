const gameBoard = document.getElementById("gameBoard");
const timerEl = document.getElementById("timer");
const movesEl = document.getElementById("moves");
const matchesEl = document.getElementById("matches");
const messageEl = document.getElementById("message");
const restartBtn = document.getElementById("restartBtn");

const winModal = document.getElementById("winModal");
const winText = document.getElementById("winText");
const closeModalBtn = document.getElementById("closeModalBtn");

const allSymbols = [
  "🍓", "🍉", "🍋", "🍇", "🥝", "🍒", "🍍", "🥥",
  "🚀", "🛸", "🌈", "⚡", "🔥", "💎", "🎯", "🎮",
  "🐼", "🦊", "🐸", "🦄", "🐙", "🦋", "🌸", "⭐"
];

const pairCount = 8;

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let moves = 0;
let matches = 0;
let timer = 0;
let timerInterval = null;
let gameStarted = false;

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function getRandomSymbols() {
  return shuffle(allSymbols).slice(0, pairCount);
}

function updateTimer() {
  const minutes = String(Math.floor(timer / 60)).padStart(2, "0");
  const seconds = String(timer % 60).padStart(2, "0");
  timerEl.textContent = `${minutes}:${seconds}`;
}

function startTimer() {
  if (timerInterval) return;

  timerInterval = setInterval(() => {
    timer++;
    updateTimer();
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
}

function updateStats() {
  movesEl.textContent = moves;
  matchesEl.textContent = matches;
}

function createCard(symbol, index) {
  const card = document.createElement("div");
  card.className = "card";
  card.dataset.symbol = symbol;
  card.dataset.index = index;

  card.innerHTML = `
    <div class="card-inner">
      <div class="card-face card-back">?</div>
      <div class="card-face card-front">${symbol}</div>
    </div>
  `;

  card.addEventListener("click", () => flipCard(card));
  return card;
}

function flipCard(card) {
  if (
    lockBoard ||
    card === firstCard ||
    card.classList.contains("flipped") ||
    card.classList.contains("matched")
  ) {
    return;
  }

  if (!gameStarted) {
    gameStarted = true;
    startTimer();
    messageEl.textContent = "Game started. Match all the pairs.";
  }

  card.classList.add("flipped");

  if (!firstCard) {
    firstCard = card;
    return;
  }

  secondCard = card;
  moves++;
  updateStats();
  checkMatch();
}

function checkMatch() {
  const isMatch = firstCard.dataset.symbol === secondCard.dataset.symbol;

  if (isMatch) {
    firstCard.classList.add("matched");
    secondCard.classList.add("matched");
    matches++;
    updateStats();
    messageEl.textContent = "Perfect match! Keep going.";
    resetTurn();

    if (matches === pairCount) {
      stopTimer();
      showWinPopup();
    }
  } else {
    lockBoard = true;
    messageEl.textContent = "Oops, not a match.";

    setTimeout(() => {
      firstCard.classList.remove("flipped");
      secondCard.classList.remove("flipped");
      resetTurn();
    }, 850);
  }
}

function resetTurn() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}

function showWinPopup() {
  winText.textContent = `You won the game in ${timerEl.textContent} with ${moves} moves.`;
  winModal.classList.remove("hidden");
  messageEl.textContent = "Congratulations! You won the game.";
}

function hideWinPopup() {
  winModal.classList.add("hidden");
  initGame();
}

function initGame() {
  stopTimer();
  timer = 0;
  moves = 0;
  matches = 0;
  firstCard = null;
  secondCard = null;
  lockBoard = false;
  gameStarted = false;

  updateTimer();
  updateStats();
  messageEl.textContent = "Flip a card to start the game.";
  winModal.classList.add("hidden");

  const selectedSymbols = getRandomSymbols();
  const cards = shuffle([...selectedSymbols, ...selectedSymbols]);

  gameBoard.innerHTML = "";
  cards.forEach((symbol, index) => {
    gameBoard.appendChild(createCard(symbol, index));
  });
}

restartBtn.addEventListener("click", initGame);
closeModalBtn.addEventListener("click", hideWinPopup);

window.addEventListener("click", (e) => {
  if (e.target === winModal) {
    hideWinPopup();
  }
});

initGame();