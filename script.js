const rarityOrder = ["common", "rare", "epic", "legendary", "mythic"];
const rarityWeights = { common: 58, rare: 25, epic: 11, legendary: 4, mythic: 2 };
const rarityBoost = { common: 0, rare: 12, epic: 24, legendary: 38, mythic: 54 };

const allFighters = [
  { id: "freddy", name: "Freddy Fazbear", universe: "Five Nights at Freddy's", rarity: "common", health: 105, attack: 16 },
  { id: "chica", name: "Chica", universe: "Five Nights at Freddy's", rarity: "common", health: 96, attack: 15 },
  { id: "bonnie", name: "Bonnie", universe: "Five Nights at Freddy's", rarity: "rare", health: 110, attack: 18 },
  { id: "foxy", name: "Foxy", universe: "Five Nights at Freddy's", rarity: "rare", health: 104, attack: 19 },
  { id: "golden-freddy", name: "Golden Freddy", universe: "Five Nights at Freddy's", rarity: "legendary", health: 125, attack: 26 },

  { id: "iron-man", name: "Iron Man", universe: "Marvel", rarity: "rare", health: 108, attack: 20 },
  { id: "captain-america", name: "Captain America", universe: "Marvel", rarity: "common", health: 118, attack: 18 },
  { id: "spider-man", name: "Spider-Man", universe: "Marvel", rarity: "epic", health: 112, attack: 24 },
  { id: "hulk", name: "Hulk", universe: "Marvel", rarity: "legendary", health: 138, attack: 28 },
  { id: "thor", name: "Thor", universe: "Marvel", rarity: "epic", health: 122, attack: 25 },

  { id: "batman", name: "Batman", universe: "DC", rarity: "rare", health: 116, attack: 22 },
  { id: "superman", name: "Superman", universe: "DC", rarity: "legendary", health: 132, attack: 30 },
  { id: "wonder-woman", name: "Wonder Woman", universe: "DC", rarity: "epic", health: 120, attack: 25 },
  { id: "flash", name: "Flash", universe: "DC", rarity: "epic", health: 104, attack: 23 },
  { id: "green-lantern", name: "Green Lantern", universe: "DC", rarity: "rare", health: 108, attack: 21 },

  { id: "scorpion", name: "Scorpion", universe: "Mortal Kombat", rarity: "epic", health: 116, attack: 24 },
  { id: "sub-zero", name: "Sub-Zero", universe: "Mortal Kombat", rarity: "rare", health: 114, attack: 21 },
  { id: "liu-kang", name: "Liu Kang", universe: "Mortal Kombat", rarity: "legendary", health: 126, attack: 28 },
  { id: "raiden", name: "Raiden", universe: "Mortal Kombat", rarity: "mythic", health: 140, attack: 33 },
  { id: "kitana", name: "Kitana", universe: "Mortal Kombat", rarity: "rare", health: 110, attack: 19 }
];

const packDefinitions = [
  { id: "fnaf-pack", name: "FNAF Pack", group: "Five Nights at Freddy's", cost: 40 },
  { id: "marvel-pack", name: "Marvel Pack", group: "Marvel", cost: 50 },
  { id: "dc-pack", name: "DC Pack", group: "DC", cost: 55 },
  { id: "mk-pack", name: "Mortal Kombat Pack", group: "Mortal Kombat", cost: 60 }
];

const sentencePool = [
  "I will never back down from this fight.",
  "The power of my team is stronger than ever.",
  "Every strike I land makes them weaker.",
  "I am built for the pressure and the challenge.",
  "Victory belongs to the fighter who keeps moving.",
  "My courage fuels each attack and every step.",
  "The battle is fierce, but I am ready.",
  "I sharpen my focus and hit with true power.",
  "The arena shakes as I take control.",
  "My timing is perfect and my shot lands deep.",
  "No matter the danger, I stand my ground.",
  "I trust my skill and strike with confidence.",
  "The enemy is fast, but I am faster.",
  "I move with purpose and fight for the win."
];

const state = {
  coins: 120,
  collection: ["freddy"],
  selectedFighter: "freddy",
  currentBattle: null,
  inventory: {},
  comboMode: "normal"
};

function loadState() {
  const raw = localStorage.getItem("typefight-save");
  if (!raw) return;

  try {
    const saved = JSON.parse(raw);
    if (saved.coins !== undefined) state.coins = saved.coins;
    if (saved.collection) state.collection = saved.collection;
    if (saved.selectedFighter) state.selectedFighter = saved.selectedFighter;
    if (saved.inventory) state.inventory = saved.inventory;
  } catch (error) {
    console.warn("Save failed.");
  }
}

function saveState() {
  const saveData = {
    coins: state.coins,
    collection: state.collection,
    selectedFighter: state.selectedFighter,
    inventory: state.inventory
  };
  localStorage.setItem("typefight-save", JSON.stringify(saveData));
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 1800);
}

function getSelectedFighter() {
  return allFighters.find(f => f.id === state.selectedFighter) || allFighters[0];
}

function getOwnedFighters() {
  return allFighters.filter(f => state.collection.includes(f.id));
}

function randomWeightedRarity() {
  const total = Object.values(rarityWeights).reduce((sum, val) => sum + val, 0);
  let random = Math.random() * total;
  let running = 0;

  for (const rarity of rarityOrder) {
    running += rarityWeights[rarity];
    if (random <= running) return rarity;
  }

  return "common";
}

function getUniverseFighters(universeName) {
  return allFighters.filter(f => f.universe === universeName);
}

function generatePackCard(universeName) {
  const pool = getUniverseFighters(universeName);
  const rarity = randomWeightedRarity();
  const sameRarity = pool.filter(f => f.rarity === rarity);
  const options = sameRarity.length ? sameRarity : pool;
  return options[Math.floor(Math.random() * options.length)];
}

function buyPack(packId, amount = 1) {
  const pack = packDefinitions.find(p => p.id === packId);
  if (!pack) return;

  const totalCost = pack.cost * amount;
  if (state.coins < totalCost) {
    showToast("Not enough coins!");
    return;
  }

  state.coins -= totalCost;
  state.inventory[packId] = (state.inventory[packId] || 0) + amount;

  for (let i = 0; i < amount; i++) {
    const fighter = generatePackCard(pack.group);
    if (!state.collection.includes(fighter.id)) {
      state.collection.push(fighter.id);
      showToast(`${fighter.name} joined your roster!`);
    } else {
      const refund = Math.floor(pack.cost * 0.4);
      state.coins += refund;
      showToast(`Duplicate! +${refund} coins`);
    }
  }

  saveState();
  renderAll();
}

function getComboMultiplier() {
  if (state.comboMode === "normal") return 1;
  if (state.comboMode === "combo") return 1.35;
  if (state.comboMode === "special") return 1.8;
  return 1;
}

function updateComboButtons() {
  document.querySelectorAll(".combo-btn").forEach(button => {
    const isActive = button.dataset.combo === state.comboMode;
    button.classList.toggle("active", isActive);
  });
}

function renderRoster() {
  const rosterList = document.getElementById("rosterList");
  rosterList.innerHTML = "";

  const owned = getOwnedFighters();
  owned.forEach(fighter => {
    const item = document.createElement("div");
    item.className = "fighter-item" + (fighter.id === state.selectedFighter ? " selected" : "");
    item.innerHTML = `
      <div class="fighter-main">
        <span class="fighter-name">${fighter.name}</span>
        <span class="fighter-meta">${fighter.universe}</span>
      </div>
      <span class="rarity-badge rarity-${fighter.rarity}">${fighter.rarity}</span>
    `;
    item.addEventListener("click", () => {
      state.selectedFighter = fighter.id;
      saveState();
      renderAll();
      if (!state.currentBattle) {
        showToast(`${fighter.name} is ready.`);
      }
    });
    rosterList.appendChild(item);
  });
}

function renderPacks() {
  const packList = document.getElementById("packList");
  packList.innerHTML = "";

  packDefinitions.forEach(pack => {
    const wrapper = document.createElement("div");
    wrapper.className = "pack-item";

    wrapper.innerHTML = `
      <div class="pack-head">
        <span class="pack-name">${pack.name}</span>
        <span class="pack-price">${pack.cost} coins</span>
      </div>
      <div class="pack-meta">${pack.group}</div>
    `;

    const packButtons = document.createElement("div");
    packButtons.className = "pack-buttons";

    [1, 3, 5].forEach(amount => {
      const btn = document.createElement("button");
      btn.className = "buy-btn";
      btn.textContent = `Buy ${amount}`;
      btn.addEventListener("click", () => buyPack(pack.id, amount));
      packButtons.appendChild(btn);
    });

    wrapper.appendChild(packButtons);
    packList.appendChild(wrapper);
  });
}

function renderCollection() {
  const collectionList = document.getElementById("collectionList");
  collectionList.innerHTML = "";

  const owned = getOwnedFighters();
  owned.forEach(fighter => {
    const card = document.createElement("div");
    card.className = `collection-card rarity-${fighter.rarity}`;
    card.innerHTML = `
      <div class="meta">
        <span class="rarity-badge rarity-${fighter.rarity}">${fighter.rarity}</span>
        <span>${fighter.universe}</span>
      </div>
      <h3>${fighter.name}</h3>
      <div class="meta">
        <span>HP ${fighter.health}</span>
        <span>ATK ${fighter.attack}</span>
      </div>
      <div class="pull-tag">${fighter.id === "freddy" ? "Starter" : "Owned"}</div>
    `;
    collectionList.appendChild(card);
  });
}

function setBattleLog(message) {
  document.getElementById("battleLog").textContent = message;
}

function getRandomSentence() {
  return sentencePool[Math.floor(Math.random() * sentencePool.length)];
}

function createBattle() {
  const player = getSelectedFighter();
  const enemies = allFighters.filter(f => f.id !== player.id);
  const enemy = enemies[Math.floor(Math.random() * enemies.length)];

  state.currentBattle = {
    playerId: player.id,
    enemyId: enemy.id,
    playerHealth: player.health,
    enemyHealth: enemy.health,
    playerMaxHealth: player.health,
    enemyMaxHealth: enemy.health,
    sentence: getRandomSentence(),
    playerName: player.name,
    enemyName: enemy.name
  };

  document.getElementById("playerNamePlate").textContent = player.name;
  document.getElementById("enemyNamePlate").textContent = enemy.name;
  document.getElementById("typingInput").value = "";
  updateSentenceDisplay();
  renderBattleHealth();
  setBattleLog(`${player.name} faces ${enemy.name}. Type the sentence to attack!`);
}

function updateSentenceDisplay() {
  const sentenceBox = document.getElementById("sentenceBox");
  const input = document.getElementById("typingInput").value;
  const sentence = state.currentBattle ? state.currentBattle.sentence : "";

  if (!sentence) {
    sentenceBox.innerHTML = "Start a battle to begin typing.";
    return;
  }

  let html = "";
  for (let i = 0; i < sentence.length; i++) {
    const char = sentence[i];
    const typed = input[i];
    let className = "";
    if (i < input.length) {
      className = typed === char ? "correct" : "wrong";
    }
    html += `<span class="${className}">${char}</span>`;
  }

  sentenceBox.innerHTML = html;
}

function renderBattleHealth() {
  if (!state.currentBattle) return;

  const playerPercent = (state.currentBattle.playerHealth / state.currentBattle.playerMaxHealth) * 100;
  const enemyPercent = (state.currentBattle.enemyHealth / state.currentBattle.enemyMaxHealth) * 100;

  document.getElementById("playerHealthFill").style.width = `${Math.max(0, playerPercent)}%`;
  document.getElementById("enemyHealthFill").style.width = `${Math.max(0, enemyPercent)}%`;
  document.getElementById("playerHealthText").textContent = `${Math.max(0, state.currentBattle.playerHealth)} / ${state.currentBattle.playerMaxHealth}`;
  document.getElementById("enemyHealthText").textContent = `${Math.max(0, state.currentBattle.enemyHealth)} / ${state.currentBattle.enemyMaxHealth}`;
}

function calculateDamage() {
  if (!state.currentBattle) return 0;

  const fighter = allFighters.find(f => f.id === state.selectedFighter);
  const inputText = document.getElementById("typingInput").value;
  const sentence = state.currentBattle.sentence;

  let correctChars = 0;
  for (let i = 0; i < Math.min(inputText.length, sentence.length); i++) {
    if (inputText[i] === sentence[i]) correctChars++;
  }

  const accuracy = sentence.length ? correctChars / sentence.length : 0;
  const inputRatio = inputText.length / sentence.length;
  const comboMultiplier = getComboMultiplier();
  const rarityMod = rarityBoost[fighter.rarity] || 0;

  let damage = Math.round((fighter.attack + rarityMod) * (0.4 + accuracy * 1.8 + inputRatio * 0.8) * comboMultiplier);

  if (inputText === sentence) {
    damage = Math.round(damage * 1.6);
  } else if (inputText.length < 6) {
    damage = Math.round(damage * 0.5);
  }

  return Math.max(5, damage);
}

function enemyCounter() {
  if (!state.currentBattle) return;

  const enemy = allFighters.find(f => f.id === state.currentBattle.enemyId);
  const counter = Math.max(8, Math.round(enemy.attack * (0.75 + Math.random() * 0.8)));
  state.currentBattle.playerHealth -= counter;

  setBattleLog(`${enemy.name} counters for ${counter} damage!`);
  renderBattleHealth();

  if (state.currentBattle.playerHealth <= 0) {
    state.currentBattle.playerHealth = 0;
    state.currentBattle = null;
    renderBattleHealth();
    setBattleLog("You were defeated. Try again and type more accurately!");
    document.getElementById("typingInput").value = "";
    updateSentenceDisplay();
  }
}

function attackButtonHandler() {
  if (!state.currentBattle) {
    createBattle();
    return;
  }

  const inputText = document.getElementById("typingInput").value;
  const sentence = state.currentBattle.sentence;

  if (!inputText.trim()) {
    showToast("Type the sentence first!");
    return;
  }

  const damage = calculateDamage();
  state.currentBattle.enemyHealth -= damage;

  setBattleLog(`${getSelectedFighter().name} deals ${damage} damage!`);

  if (state.currentBattle.enemyHealth <= 0) {
    state.currentBattle.enemyHealth = 0;
    renderBattleHealth();

    const reward = 35 + Math.floor(Math.random() * 30);
    state.coins += reward;
    setBattleLog(`${getSelectedFighter().name} wins! +${reward} coins.`);
    state.currentBattle = null;
    document.getElementById("typingInput").value = "";
    updateSentenceDisplay();
    saveState();
    renderCoins();
    return;
  }

  renderBattleHealth();
  enemyCounter();

  if (state.currentBattle && state.currentBattle.playerHealth > 0) {
    state.currentBattle.sentence = getRandomSentence();
    document.getElementById("typingInput").value = "";
    updateSentenceDisplay();
  }

  saveState();
  renderCoins();
}

function renderCoins() {
  document.getElementById("coinCount").textContent = state.coins;
}

function bindEvents() {
  document.getElementById("attackBtn").addEventListener("click", attackButtonHandler);
  document.getElementById("newBattleBtn").addEventListener("click", createBattle);
  document.getElementById("typingInput").addEventListener("input", updateSentenceDisplay);
  document.getElementById("typingInput").addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      attackButtonHandler();
    }
  });

  document.querySelectorAll(".combo-btn").forEach(button => {
    button.addEventListener("click", () => {
      state.comboMode = button.dataset.combo;
      updateComboButtons();
      showToast(`${state.comboMode.toUpperCase()} mode active`);
    });
  });
}

function renderAll() {
  renderCoins();
  renderRoster();
  renderPacks();
  renderCollection();
  updateComboButtons();

  const selected = getSelectedFighter();
  document.getElementById("playerNamePlate").textContent = selected.name;
  document.getElementById("playerHealthFill").style.width = "100%";
  document.getElementById("playerHealthText").textContent = `${selected.health} / ${selected.health}`;

  if (!state.currentBattle) {
    document.getElementById("enemyNamePlate").textContent = "Enemy";
    document.getElementById("enemyHealthFill").style.width = "100%";
    document.getElementById("enemyHealthText").textContent = "0 / 0";
    document.getElementById("sentenceBox").textContent = "Choose your fighter and start a battle.";
  } else {
    renderBattleHealth();
    updateSentenceDisplay();
  }
}

function init() {
  loadState();

  if (!state.collection.includes("freddy")) {
    state.collection.push("freddy");
  }
  if (!state.selectedFighter) {
    state.selectedFighter = "freddy";
  }

  bindEvents();
  renderAll();
  createBattle();
}

init();
