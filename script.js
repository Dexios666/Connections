
const groups = [
  {
    name: "Best Lovable Cartoon",
    color: "yellow",
    words: ["Bubu", "Dudu", "Duti", "Buti"]
  },
  {
    name: "Best Eating Place",
    color: "green",
    words: ["Chowking", "Mang Inasal", "KFC", "Siomai House"]
  },
  {
    name: "Best Place",
    color: "blue",
    words: ["Hongkong", "Macau", "Baguio", "Benguet"]
  },
  {
    name: "Happy Third Anniversary Baby",
    color: "purple",
    words: ["Happy", "Third", "Anniversary", "Baby"]
  }
];

const board = document.getElementById("board");
const solvedGroups = document.getElementById("solvedGroups");
const submitBtn = document.getElementById("submitBtn");
const statusText = document.getElementById("status");
const mistakesText = document.getElementById("mistakes");
const winPanel = document.getElementById("winPanel");
const controls = document.querySelector(".controls");

let tiles = [];
let selected = [];
let solved = [];
let mistakes = 0;
let gameOver = false;

function shuffleArray(array) {
  const result = [...array];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

function startGame() {
  tiles = shuffleArray(
    groups.flatMap((group, groupIndex) =>
      group.words.map(word => ({
        word,
        groupIndex
      }))
    )
  );

  selected = [];
  solved = [];
  mistakes = 0;
  gameOver = false;

  winPanel.classList.add("hidden");
  controls.classList.remove("hidden");

  statusText.textContent = "Make your first guess! ♡";

  render();
}

function render() {
  board.innerHTML = "";

  tiles.forEach(tile => {
    const button = document.createElement("button");

    button.type = "button";
    button.className = "tile";
    button.textContent = tile.word;

    if (selected.includes(tile.word)) {
      button.classList.add("selected");
    }

    button.setAttribute(
      "aria-pressed",
      selected.includes(tile.word)
    );

    button.addEventListener("click", () => {
      toggleTile(tile.word);
    });

    board.appendChild(button);
  });

  renderSolvedGroups();
  renderMistakes();

  submitBtn.disabled = selected.length !== 4 || gameOver;

  document.getElementById("deselectBtn").disabled =
    selected.length === 0 || gameOver;

  document.getElementById("shuffleBtn").disabled = gameOver;
}

function renderSolvedGroups() {
  solvedGroups.innerHTML = "";

  solved.forEach(index => {
    const group = groups[index];

    const container = document.createElement("div");
    container.className = `solved-group ${group.color}`;

    const heading = document.createElement("strong");
    heading.textContent = group.name;

    const words = document.createElement("span");
    words.textContent = group.words.join(" · ");

    container.append(heading, words);
    solvedGroups.appendChild(container);
  });
}

function renderMistakes() {
  const remaining = 4 - mistakes;

  mistakesText.textContent =
    "● ".repeat(remaining).trim() +
    (remaining > 0 ? " " : "") +
    "○ ".repeat(mistakes).trim();

  mistakesText.style.color =
    mistakes >= 3 ? "#c0392b" : "#333";
}

function toggleTile(word) {
  if (gameOver) return;

  if (selected.includes(word)) {
    selected = selected.filter(item => item !== word);
  } else if (selected.length < 4) {
    selected.push(word);
  }

  statusText.textContent =
    selected.length === 4
      ? "Ready? Submit your guess! ♡"
      : `${selected.length} of 4 words selected`;

  render();
}

function submitGuess() {
  if (selected.length !== 4 || gameOver) return;

  const chosenTiles = tiles.filter(tile =>
    selected.includes(tile.word)
  );

  const groupIndex = chosenTiles[0].groupIndex;

  const correct = chosenTiles.every(
    tile => tile.groupIndex === groupIndex
  );

  if (correct) {
    solved.push(groupIndex);
    tiles = tiles.filter(tile => tile.groupIndex !== groupIndex);
    selected = [];

    statusText.textContent =
      `Correct! ${groups[groupIndex].name} ♡`;

    if (solved.length === groups.length) {
      finishGame();
      return;
    }
  } else {
    mistakes++;

    const counts = {};

    chosenTiles.forEach(tile => {
      counts[tile.groupIndex] =
        (counts[tile.groupIndex] || 0) + 1;
    });

    const oneAway = Object.values(counts).includes(3);

    selected = [];

    if (mistakes >= 4) {
      gameOver = true;
      statusText.textContent = "No guesses left! Here's the solution.";
      solved = [0, 1, 2, 3];

      controls.classList.add("hidden");
      winPanel.classList.remove("hidden");

      winPanel.querySelector("h2").textContent = "Puzzle revealed ♡";
      winPanel.querySelector("p").textContent =
        "Keep making beautiful memories together!";

    } else {
      statusText.textContent = oneAway
        ? "One away… you're so close! ♡"
        : "Not quite — try another combination!";
    }
  }

  render();
}

function finishGame() {
  gameOver = true;

  statusText.textContent = "Perfect game! You found every connection. ♡";

  controls.classList.add("hidden");
  winPanel.classList.remove("hidden");

  winPanel.querySelector("h2").textContent = "You got them all! ♡";
  winPanel.querySelector("p").innerHTML =
    "Four little connections, one very special us.<br>" +
    "Happy Third Anniversary, Baby! ❤️";

  render();
}

document.getElementById("shuffleBtn").addEventListener("click", () => {
  const unsolved = tiles.filter(
    tile => !solved.includes(tile.groupIndex)
  );

  tiles = shuffleArray(unsolved);
  render();
});

document.getElementById("deselectBtn").addEventListener("click", () => {
  selected = [];
  statusText.textContent = "Selection cleared. Choose four words! ♡";
  render();
});

submitBtn.addEventListener("click", submitGuess);

document.getElementById("restartBtn").addEventListener("click", startGame);

startGame();
