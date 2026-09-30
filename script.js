const rarityOrder = ["common", "rare", "epic", "legendary", "mythic"];
const rarityWeights = { common: 58, rare: 25, epic: 11, legendary: 4, mythic: 2 };
const rarityBoost = { common: 0, rare: 12, epic: 24, legendary: 38, mythic: 54 };

const allFighters = [
  { id: "freddy", name: "Freddy Fazbear", universe: "Five Nights at Freddy's", rarity: "common", health: 105, attack: 16, style: "slash", move: "Slash" },
  { id: "chica", name: "Chica", universe: "Five Nights at Freddy's", rarity: "common", health: 96, attack: 15, style: "dash", move: "Rapid Bite" },
  { id: "bonnie", name: "Bonnie", universe: "Five Nights at Freddy's", rarity: "rare", health: 110, attack: 18, style: "power", move: "Crushing Hook" },
  { id: "foxy", name: "Foxy", universe: "Five Nights at Freddy's", rarity: "rare", health: 104, attack: 19, style: "speed", move: "Pirate Rush" },
  { id: "golden-freddy", name: "Golden Freddy", universe: "Five Nights at Freddy's", rarity: "legendary", health: 125, attack: 26, style: "spectral", move: "Phantom Burst" },

  { id: "iron-man", name: "Iron Man", universe: "Marvel", rarity: "rare", health: 108, attack: 20, style: "tech", move: "Repulsor Beam" },
  { id: "captain-america", name: "Captain America", universe: "Marvel", rarity: "common", health: 118, attack: 18, style: "power", move: "Shield Slam" },
  { id: "spider-man", name: "Spider-Man", universe: "Marvel", rarity: "epic", health: 112, attack: 24, style: "speed", move: "Web Combo" },
  { id: "hulk", name: "Hulk", universe: "Marvel", rarity: "legendary", health: 138, attack: 28, style: "power", move: "Gamma Smash" },
  { id: "thor", name: "Thor", universe: "Marvel", rarity: "epic", health: 122, attack: 25, style: "lightning", move: "Stormbreaker Strike" },

  { id: "batman", name: "Batman", universe: "DC", rarity: "rare", health: 116, attack: 22, style: "precision", move: "Batarang Rain" },
  { id: "superman", name: "Superman", universe: "DC", rarity: "legendary", health: 132, attack: 30, style: "power", move: "Solar Blast" },
  { id: "wonder-woman", name: "Wonder Woman", universe: "DC", rarity: "epic", health: 120, attack: 25, style: "force", move: "Godslayer Spin" },
  { id: "flash", name: "Flash", universe: "DC", rarity: "epic", health: 104, attack: 23, style: "speed", move: "Speed Burst" },
  { id: "green-lantern", name: "Green Lantern", universe: "DC", rarity: "rare", health: 108, attack: 21, style: "energy", move: "Ring Wave" },

  { id: "scorpion", name: "Scorpion", universe: "Mortal Kombat", rarity: "epic", health: 116, attack: 24, style: "fire", move: "Toasty Spear" },
  { id: "sub-zero", name: "Sub-Zero", universe: "Mortal Kombat", rarity: "rare", health: 114, attack: 21, style: "ice", move: "Frost Breaker" },
  { id: "liu-kang", name: "Liu Kang", universe: "Mortal Kombat", rarity: "legendary", health: 126, attack: 28, style: "dragon", move: "Dragon Kick" },
  { id: "raiden", name: "Raiden", universe: "Mortal Kombat", rarity: "mythic", health: 140, attack: 33, style: "lightning", move: "Thunder Storm" },
  { id: "kitana", name: "Kitana", universe: "Mortal Kombat", rarity: "rare", health: 110, attack: 19, style: "precision", move: "Fan Swipe" }
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
  "I move with purpose and fight for the win.",
  "My fingers are quick and my aim is true.",
  "Every heartbeat pushes me harder to win.",
  "I feel the rhythm of battle and answer it.",
  "My focus is like steel and my timing is sharp."
];

const state = {
  coins: 120,
  collection: ["freddy"],
  selectedFighter: "freddy",
  currentBattle: null,
  inventory: {},
  comboMode: "normal",
  topWpm: 0,
  avgWpm: 0,
  wpmHistory: [],
  gameStarted: false,
  audioEnabled: true,
  lastSentenceStart: 0,
  revealTimeout: null
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
    if (saved.topWpm !== undefined) state.topWpm = saved.topWpm;
    if (saved.avgWpm !== undefined) state.avgWpm = saved.avgWpm;
    if (saved.wpmHistory) state.wpmHistory = saved.wpmHistory;
    if (saved.comboMode) state.comboMode = saved.comboMode;
  } catch (error) {
    console.warn("Save failed.");
  }
}

function saveState() {
  const saveData = {
    coins: state.coins,
    collection: state.collection,
    selectedFighter: state.selectedFighter,
    inventory: state.inventory,
    topWpm: state.topWpm,
    avgWpm: state.avgWpm,
    wpmHistory: state.wpmHistory,
    comboMode: state.comboMode
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

function getMoveLabel(fighter) {
  const moveMap = {
    slash: "Slash",
    dash: "Dash",
    power: "Power",
    speed: "Speed",
    precision: "Precision",
    lightning: "Thunder",
    energy: "Energy",
    spectral: "Phantom",
    force: "Force",
    dragon: "Dragon",
    ice: "Frost",
    fire: "Flame",
    tech: "Tech",
    "" : "Strike"
  };

  return fighter.move || moveMap[fighter.style] || "Strike";
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

function updateWpmDisplay() {
  const topWpm = Number(state.topWpm) || 0;
  const avgWpm = Number(state.avgWpm) || 0;

  document.getElementById("topWpmStat").textContent = topWpm.toFixed(1);
  document.getElementById("avgWpmStat").textContent = avgWpm.toFixed(1);
  document.getElementById("introTopWpm").textContent = topWpm.toFixed(1);
  document.getElementById("introAvgWpm").textContent = avgWpm.toFixed(1);
}

function awardWpm(typedText) {
  if (!state.currentBattle || !typedText.length) return;

  const sentence = state.currentBattle.sentence;
  let correctChars = 0;
  for (let i = 0; i < Math.min(typedText.length, sentence.length); i++) {
    if (typedText[i] === sentence[i]) correctChars++;
  }

  const elapsedMinutes = Math.max((Date.now() - state.lastSentenceStart) / 60000, 0.05);
  const wpm = (correctChars / 5) / elapsedMinutes;

  state.wpmHistory.push(wpm);
  state.topWpm = Math.max(state.topWpm, wpm);
  const total = state.wpmHistory.reduce((sum, entry) => sum + entry, 0);
  state.avgWpm = total / state.wpmHistory.length;

  updateWpmDisplay();
  saveState();
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
      showToast(`${fighter.name} selected.`);
    });

    rosterList.appendChild(item);
  });
}

function showPackReveal(fighter) {
  const overlay = document.getElementById("packRevealOverlay");
  const card = document.getElementById("revealCard");
  const revealName = document.getElementById("revealName");
  const revealUniverse = document.getElementById("revealUniverse");
  const revealRarity = document.getElementById("revealRarity");
  const revealHp = document.getElementById("revealHp");
  const revealAttack = document.getElementById("revealAttack");

  revealName.textContent = fighter.name;
  revealUniverse.textContent = fighter.universe;
  revealRarity.textContent = fighter.rarity.toUpperCase();
  revealHp.textContent = fighter.health;
  revealAttack.textContent = fighter.attack;

  card.className = `reveal-card rarity-${fighter.rarity}`;
  overlay.classList.remove("hidden");

  clearTimeout(state.revealTimeout);
  state.revealTimeout = setTimeout(() => {
    overlay.classList.add("hidden");
  }, 2200);
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
      showPackReveal(fighter);
    } else {
      const refund = Math.floor(pack.cost * 0.4);
      state.coins += refund;
      showToast(`Duplicate! +${refund} coins`);
    }
  }

  saveState();
  renderAll();
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
  const sentence = sentencePool[Math.floor(Math.random() * sentencePool.length)];
  state.lastSentenceStart = Date.now();
  return sentence;
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

  const playerPortrait = document.getElementById("playerPortrait");
  const enemyPortrait = document.getElementById("enemyPortrait");

  playerPortrait.classList.remove("summon");
  enemyPortrait.classList.remove("summon");
  void playerPortrait.offsetWidth;
  void enemyPortrait.offsetWidth;
  playerPortrait.classList.add("summon");
  enemyPortrait.classList.add("summon");

  document.getElementById("playerNamePlate").textContent = player.name;
  document.getElementById("enemyNamePlate").textContent = enemy.name;
  document.getElementById("typingInput").value = "";
  updateSentenceDisplay();
  renderBattleHealth();
  setBattleLog(`${player.name} faces ${enemy.name}. Type the sentence to attack!`);
  updateMoveTags();
}

function updateMoveTags() {
  const selected = getSelectedFighter();
  const moveName = getMoveLabel(selected);
  const comboName = state.comboMode.charAt(0).toUpperCase() + state.comboMode.slice(1);

  const moveTag = document.getElementById("moveTag");
  const moveBoost = document.getElementById("moveBoost");

  mov
  eTag.textContent = `Move: ${moveName}`;
  moveBoost.textContent = `Combo: ${comboName}`;
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

function triggerBurst(x, y) {
  const burst = document.createElement("div");
  burst.className = "attack-burst";
  burst.style.left = `${x}px`;
  burst.style.top = `${y}px`;
  burst.style.setProperty("--dx", `${(Math.random() - 0.5) * 140}px`);
  burst.style.setProperty("--dy", `${(Math.random() - 0.5) * 160}px`);

  document.body.appendChild(burst);
  setTimeout(() => burst.remove(), 700);
}

function playSfx(type) {
  if (!state.audioEnabled) return;

  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;

  if (!state.audioCtx) {
    state.audioCtx = new AudioContextClass();
  }

  const ctx = state.audioCtx;
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();

  oscillator.connect(gain);
  gain.connect(ctx.destination);

  const patterns = {
    attack: { freq: 180, duration: 0.16, type: "square", volume: 0.04 },
    hit: { freq: 100, duration: 0.22, type: "sawtooth", volume: 0.05 },
    win: { freq: 420, duration: 0.28, type: "triangle", volume: 0.06 },
    lose: { freq: 90, duration: 0.28, type: "sawtooth", volume: 0.05 },
    pack: { freq: 330, duration: 0.35, type: "triangle", volume: 0.06 }
  };

  const config = patterns[type] || patterns.attack;
  oscillator.type = config.type;
  oscillator.frequency.value = config.freq;
  gain.gain.value = config.volume;

  oscillator.start();
  oscillator.stop(ctx.currentTime + config.duration);

  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + config.duration);
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
  const styleBoost = fighter.style === "power" ? 1.2 : fighter.style === "speed" ? 1.15 : fighter.style === "precision" ? 1.3 : 1.08;

  let damage = Math.round((fighter.attack + rarityMod) * (0.38 + accuracy * 1.8 + inputRatio * 0.8) * comboMultiplier * styleBoost);

  if (inputText === sentence) {
    damage = Math.round(damage * 1.7);
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
  playSfx("hit");
  renderBattleHealth();

  const playerPortrait = document.getElementById("playerPortrait");
  playerPortrait.classList.remove("hit");
  void playerPortrait.offsetWidth;
  playerPortrait.classList.add("hit");

  if (state.currentBattle.playerHealth <= 0) {
    state.currentBattle.playerHealth = 0;
    renderBattleHealth();
    playSfx("lose");
    state.currentBattle = null;
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

  const selectedFighter = getSelectedFighter();
  setBattleLog(`${selectedFighter.name} deals ${damage} damage with ${getMoveLabel(selectedFighter)}!`);
  playSfx("attack");

  const playerPortrait = document.getElementById("playerPortrait");
  const enemyPortrait = document.getElementById("enemyPortrait");
  const playerBox = playerPortrait.getBoundingClientRect();
  const enemyBox = enemyPortrait.getBoundingClientRect();
  const x = (playerBox.left + enemyBox.left) / 2;
  const y = (playerBox.top + enemyBox.top) / 2;
  triggerBurst(x, y);

  if (state.currentBattle.enemyHealth <= 0) {
    state.currentBattle.enemyHealth = 0;
    renderBattleHealth();
    playSfx("win");

    const reward = 35 + Math.floor(Math.random() * 30);
    state.coins += reward;
    setBattleLog(`${selectedFighter.name} wins! +${reward} coins.`);
    document.getElementById("typingInput").value = "";

    awardWpm(inputText);
    state.currentBattle = null;
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

  awardWpm(inputText);
  saveState();
  renderCoins();
}

function renderCoins() {
  document.getElementById("coinCount").textContent = state.coins;
}

function bindEvents() {
  document.getElementById("startBtn").addEventListener("click", () => {
    state.gameStarted = true;
    document.getElementById("introScreen").classList.add("hidden");
    document.getElementById("gameRoot").classList.remove("hidden");
    updateWpmDisplay();
    createBattle();
  });

  document.getElementById("attackBtn").addEventListener("click", attackButtonHandler);
  document.getElementById("newBattleBtn").addEventListener("click", createBattle);

  document.getElementById("typingInput").addEventListener("input", () => {
    updateSentenceDisplay();
    const current = document.getElementById("typingInput").value;
    if (current.length > 0 && state.currentBattle) {
      const now = Date.now();
      const elapsedMinutes = Math.max((now - state.lastSentenceStart) / 60000, 0.05);
      const cm = current.split("").filter(Boolean).length / 5;
      const liveWpm = cm / elapsedMinutes;
      document.getElementById("moveBoost").textContent = `Combo: ${state.comboMode.toUpperCase()} | WPM ${liveWpm.toFixed(1)}`;
    }
  });

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
      updateMoveTags();
      saveState();
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
  updateMoveTags();
  updateWpmDisplay();

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

  if (state.gameStarted) {
    document.getElementById("introScreen").classList.add("hidden");
    document.getElementById("gameRoot").classList.remove("hidden");
    createBattle();
  }
}

init();
