let coinCount = 0;
let attempts = 0;
let successes = 0;
let failures = 0;
let miningChance = 1.0; // Initial mining chance (1%)

const gachaPool = [
  { name: 'Item A', chance: 0.10, reward: 0 },
  { name: 'Item B', chance: 0.07, reward: 2 },
  { name: 'Item C', chance: 0.06, reward: 3 },
  { name: 'Item D', chance: 0.05, reward: 4 },
  { name: 'Item E', chance: 0.04, reward: 5 },
];

window.addEventListener('load', () => {
  if (localStorage.getItem('gameState')) {
    const gameState = JSON.parse(localStorage.getItem('gameState'));
    coinCount = gameState.coinCount;
    attempts = gameState.attempts;
    successes = gameState.successes;
    failures = gameState.failures;
    updateCoinCounter();
    updateAttempts();
    updateMiningChance();
  }
});

document.getElementById('mineBtn').addEventListener('click', mineForCoins);
document.getElementById('pullBtn').addEventListener('click', pullFromGacha);

function mineForCoins() {
  attempts++;
  const chance = Math.random();

  // Check if the mining chance should be adjusted
  if (coinCount >= 1000) {
    coinCount -= 1000;
    updateCoinCounter();
    miningChance -= 0.0001; // Subtract 0.01% for every 1000 coins
    updateMiningChance();
  }

  // Determine if the mining attempt is successful
  if (chance <= miningChance / 100) { // Convert mining chance to percentage
    coinCount++;
    successes++;
  } else {
    failures++;
  }

  updateCoinCounter();
  updateAttempts();
  saveGameState();
  setTimeout(mineForCoins, 100);
}

function pullFromGacha() {
  if (coinCount > 0) {
    coinCount--;
    updateCoinCounter();
    const gachaResult = Math.floor(Math.random() * gachaPool.length);
    const reward = gachaPool[gachaResult].reward;
    coinCount += reward; // Add reward from gacha to total coins
    updateCoinCounter();
    displayGachaResult(gachaResult);
    saveGameState();
  } else {
    alert('You need at least 1 coin to pull from the gacha.');
  }
}

function updateCoinCounter() {
  document.getElementById('coinCount').textContent = coinCount;
}

function updateAttempts() {
  document.getElementById('attempts').textContent = `Attempts: ${attempts} (Succeeded: ${successes}, Failed: ${failures})`;
}

function updateMiningChance() {
  document.getElementById('chance').textContent = `Chance of success: ${miningChance.toFixed(2)}%`;
}

function displayGachaResult(resultIndex) {
  const resultItem = gachaPool[resultIndex];
  const message = `Gacha Result: ${resultItem.name} (Reward: ${resultItem.reward} coin)`;
  document.getElementById('result').textContent = message;
}

function saveGameState() {
  const gameState = {
    coinCount,
    attempts,
    successes,
    failures
  };
  localStorage.setItem('gameState', JSON.stringify(gameState));
}
