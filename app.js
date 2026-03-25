const characters = [
  { name: "Elsa",      emoji: "👸❄️" },
  { name: "Anna",      emoji: "👧🌷" },
  { name: "Olaf",      emoji: "⛄"   },
  { name: "Sven",      emoji: "🦌"   },
  { name: "Kristoff",  emoji: "🧊⛏️" },
  { name: "Bruni",     emoji: "🦎🔥" },
];

const board = document.getElementById("game-board");
const matchesDisplay = document.getElementById("matches");
const totalPairsDisplay = document.getElementById("total-pairs");
const restartBtn = document.getElementById("restart-btn");
const playAgainBtn = document.getElementById("play-again-btn");
const winOverlay = document.getElementById("win-overlay");

let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let lockBoard = false;

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function createCard(character, index) {
  const card = document.createElement("div");
  card.classList.add("card");
  card.dataset.name = character.name;
  card.dataset.index = index;

  card.innerHTML = `
    <div class="card-inner">
      <div class="card-back"></div>
      <div class="card-front">
        <span class="card-emoji">${character.emoji}</span>
        <span class="card-name">${character.name}</span>
      </div>
    </div>
  `;

  card.addEventListener("click", () => flipCard(card));
  return card;
}

function flipCard(card) {
  if (lockBoard) return;
  if (card.classList.contains("flipped")) return;
  if (card.classList.contains("matched")) return;

  card.classList.add("flipped");
  flippedCards.push(card);

  if (flippedCards.length === 2) {
    lockBoard = true;
    checkMatch();
  }
}

function checkMatch() {
  const [a, b] = flippedCards;
  const isMatch = a.dataset.name === b.dataset.name;

  if (isMatch) {
    a.classList.add("matched");
    b.classList.add("matched");
    matchedPairs++;
    matchesDisplay.textContent = matchedPairs;
    flippedCards = [];
    lockBoard = false;

    if (matchedPairs === characters.length) {
      setTimeout(() => winOverlay.classList.add("show"), 600);
    }
  } else {
    a.classList.add("shake");
    b.classList.add("shake");

    setTimeout(() => {
      a.classList.remove("flipped", "shake");
      b.classList.remove("flipped", "shake");
      flippedCards = [];
      lockBoard = false;
    }, 900);
  }
}

function initGame() {
  board.innerHTML = "";
  matchedPairs = 0;
  flippedCards = [];
  lockBoard = false;
  matchesDisplay.textContent = "0";
  totalPairsDisplay.textContent = characters.length;
  winOverlay.classList.remove("show");

  const pairs = [...characters, ...characters];
  cards = shuffle(pairs);

  cards.forEach((char, i) => {
    board.appendChild(createCard(char, i));
  });
}

restartBtn.addEventListener("click", initGame);
playAgainBtn.addEventListener("click", initGame);

initGame();
