// ============================================
// ГЛОБАЛНИ ПРОМЕНЛИВИ
// ============================================

let currentGenre = 'Приключенска';
let storyHistory = [];
let isReading = false;
let currentUtterance = null;
let isGenerating = false;
let wordQueue = [];
let queueRemainder = "";
let queueAnimatorRunning = false;
let queueRunId = 0;

const API_KEY_MODE_STORAGE = "openrouter-key-mode";
const API_KEY_VALUE_STORAGE = "openrouter-api-key";

const genreData = {
  'Приключенска': {
    colors: ['#11998e', '#38ef7d', '#f6d365'],
    animals: ['🦁', '🐺', '🦅'],
    particles: '⭐',
    emoji: '🗺️'
  },
  'Фентъзи': {
    colors: ['#667eea', '#764ba2', '#f093fb'],
    animals: ['🦊', '🦉', '🐱'],
    particles: '✨',
    emoji: '✨'
  },
  'Мистериозна': {
    colors: ['#1e3c72', '#2a5298', '#fdbb2d'],
    animals: ['🦇', '🕷️', '🐈‍⬛'],
    particles: '🌙',
    emoji: '🔮'
  },
  'Поучителна': {
    colors: ['#f8b500', '#fceabb', '#f8b500'],
    animals: ['🐢', '🦋', '🐝'],
    particles: '💫',
    emoji: '💡'
  },
  'Хумористична': {
    colors: ['#fa709a', '#fee140', '#30cfd0'],
    animals: ['🐒', '🦜', '🐸'],
    particles: '🎈',
    emoji: '😄'
  }
};



function initHeroesInline(count) {
  const container = document.getElementById("heroes-inline");
  if (!container) return;

  const total = Math.max(1, Math.min(5, Number(count) || 1));
  container.style.setProperty("--heroCount", total);
  container.innerHTML = "";

  for (let i = 1; i <= total; i++) {
    const input = document.createElement("input");
    input.type = "text";
    input.className = "hero-segment";
    input.placeholder = `Герой ${i}`;
    input.dataset.heroIndex = String(i);
    container.appendChild(input);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // ... твоите init-и
  const heroesCount = document.getElementById("heroes-count");
  if (heroesCount) {
    initHeroesInline(heroesCount.value);
    heroesCount.addEventListener("change", (e) => initHeroesInline(e.target.value));
  }
});


// ============================================
// DOM ЕЛЕМЕНТИ
// ============================================

const resultEl = document.getElementById("result");
const historyEl = document.getElementById("history");

// ============================================
// ИНИЦИАЛИЗАЦИЯ
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  initGenreButtons();
  initModals();
  initMouseParticles();
  initSparkles();
  updateAnimals();
  renderHistory();
});

// ============================================
// ЖАНР СИСТЕМА
// ============================================

function initGenreButtons() {
  const genreButtons = document.querySelectorAll('.genre-btn');
  
  genreButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      genreButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      currentGenre = btn.dataset.genre;
      updateTheme();
      
      // Синхронизиране на select елемента
      const genreSelect = document.getElementById('genre');
      if (genreSelect) {
        genreSelect.value = currentGenre;
      }
    });
  });
}

function updateTheme() {
  const genre = genreData[currentGenre];
  const body = document.body;
  
  // Смяна на градиент
  body.style.background = `linear-gradient(135deg, ${genre.colors[0]}, ${genre.colors[1]}, ${genre.colors[2]})`;
  body.style.backgroundSize = '400% 400%';
  
  // Обновяване на заглавие
  const title = document.getElementById('main-title');
  if (title) {
    title.textContent = `${genre.emoji} Генератор на Приказки ${genre.emoji}`;
  }
  
  // Обновяване на животни
  updateAnimals();
  
  // Обновяване на частици
  updateSparkles();
}

function updateAnimals() {
  const genre = genreData[currentGenre];
  const animals = document.querySelectorAll('.animal');
  
  animals.forEach((animal, index) => {
    animal.textContent = genre.animals[index] || '🐾';
  });
}

// ============================================
// МАГИЧЕСКИ ЧАСТИЦИ
// ============================================

function initMouseParticles() {
  const container = document.getElementById('particles-container');
  if (!container) return;
  
  document.addEventListener('mousemove', (e) => {
    // Случайно генериране на частици
    if (Math.random() > 0.93) {
      createParticle(e.clientX, e.clientY, container);
    }
    
    // Движение на градиент
    const x = (e.clientX / window.innerWidth) * 20;
    const y = (e.clientY / window.innerHeight) * 20;
    document.body.style.backgroundPosition = `${x}% ${y}%`;
  });
}

function createParticle(x, y, container) {
  const genre = genreData[currentGenre];
  const particle = document.createElement('div');
  particle.className = 'particle';
  particle.textContent = genre.particles;
  particle.style.left = x + 'px';
  particle.style.top = y + 'px';
  particle.style.fontSize = (Math.random() * 20 + 10) + 'px';
  
  container.appendChild(particle);
  
  setTimeout(() => {
    particle.remove();
  }, 2000);
}

function initSparkles() {
  const container = document.getElementById('sparkles-container');
  if (!container) return;
  
  for (let i = 0; i < 15; i++) {
    createSparkle(container, i);
  }
}

function createSparkle(container, index) {
  const genre = genreData[currentGenre];
  const sparkle = document.createElement('div');
  sparkle.className = 'sparkle';
  sparkle.textContent = genre.particles;
  sparkle.style.left = Math.random() * 100 + '%';
  sparkle.style.top = Math.random() * 100 + '%';
  sparkle.style.animationDelay = (Math.random() * 3) + 's';
  
  container.appendChild(sparkle);
}

function updateSparkles() {
  const container = document.getElementById('sparkles-container');
  if (!container) return;
  
  const sparkles = container.querySelectorAll('.sparkle');
  const genre = genreData[currentGenre];
  
  sparkles.forEach(sparkle => {
    sparkle.textContent = genre.particles;
  });
}

function createMagicBurst() {
  const container = document.getElementById('particles-container');
  if (!container) return;
  
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;
  
  for (let i = 0; i < 20; i++) {
    setTimeout(() => {
      const angle = (Math.PI * 2 * i) / 20;
      const radius = 100;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      
      createParticle(x, y, container);
    }, i * 50);
  }
}

// ============================================
// HELPERS
// ============================================


function parseLength(value) {
  if (!value) return 3;
  const match = value.match(/\d+/);
  return match ? Number(match[0]) : 3;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function escapeHtml(value) {
  const div = document.createElement("div");
  div.textContent = value || "";
  return div.innerHTML;
}

function getApiKeyMode() {
  return localStorage.getItem(API_KEY_MODE_STORAGE) === "personal" ? "personal" : "basic";
}

function getPersonalApiKey() {
  return (localStorage.getItem(API_KEY_VALUE_STORAGE) || "").trim();
}

function buildRequestHeaders() {
  const headers = { "Content-Type": "application/json" };

  if (getApiKeyMode() === "personal") {
    const key = getPersonalApiKey();
    if (key) {
      headers["x-openrouter-key"] = key;
    }
  }

  return headers;
}

function initModals() {
  const helpBtn = document.getElementById("help-btn");
  const keyBtn = document.getElementById("key-btn");
  const overlay = document.getElementById("modal-overlay");
  const closeBtn = document.getElementById("modal-close");

  if (helpBtn) {
    helpBtn.addEventListener("click", openHelpModal);
  }

  if (keyBtn) {
    keyBtn.addEventListener("click", openApiKeyModal);
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", closeModal);
  }

  if (overlay) {
    overlay.addEventListener("click", (event) => {
      if (event.target === overlay) {
        closeModal();
      }
    });
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && overlay && overlay.style.display !== "none") {
      closeModal();
    }
  });
}

function openModal(title, bodyHtml, afterRender) {
  const overlay = document.getElementById("modal-overlay");
  const modalTitle = document.getElementById("modal-title");
  const modalBody = document.getElementById("modal-body");
  const closeBtn = document.getElementById("modal-close");

  if (!overlay || !modalTitle || !modalBody) return;

  modalTitle.textContent = title;
  modalBody.innerHTML = bodyHtml;
  overlay.style.display = "grid";
  overlay.classList.add("is-open");

  if (typeof afterRender === "function") {
    afterRender();
  }

  if (closeBtn) {
    closeBtn.focus();
  }
}

function closeModal() {
  const overlay = document.getElementById("modal-overlay");
  const modalBody = document.getElementById("modal-body");

  if (!overlay) return;

  overlay.style.display = "none";
  overlay.classList.remove("is-open");

  if (modalBody) {
    modalBody.innerHTML = "";
  }
}

function openHelpModal() {
  openModal(
    "Как работи",
    `
      <div class="modal-panel">
        <ol class="modal-list">
          <li>Избери жанр, възраст, език и дължина на приказката.</li>
          <li>Напиши герой и основен проблем, а по желание добави поука.</li>
          <li>Натисни „Генерирай Приказка“ и изчакай магията да започне.</li>
          <li>Приказката се появява дума по дума, докато AI я създава.</li>
          <li>След края можеш да я прочетеш на глас, да я спреш или да я подобриш още.</li>
        </ol>
        <p class="modal-note">Последните приказки се пазят в историята на това устройство.</p>
      </div>
    `
  );
}

function openApiKeyModal() {
  const mode = getApiKeyMode();
  const savedKey = getPersonalApiKey();

  openModal(
    "API ключ",
    `
      <div class="modal-panel key-modal-panel">
        <div class="key-switch-row" role="group" aria-label="Избор на API ключ">
          <span id="basic-key-label" class="key-mode-label">Basic</span>
          <label class="switch" for="api-key-mode-toggle">
            <input id="api-key-mode-toggle" type="checkbox" ${mode === "personal" ? "checked" : ""}>
            <span class="slider"></span>
          </label>
          <span id="personal-key-label" class="key-mode-label">Мой личен ключ</span>
        </div>

        <div id="personal-key-field" class="personal-key-field">
          <label for="openrouter-key-input">OpenRouter API key</label>
          <input id="openrouter-key-input" class="magic-input modal-key-input" type="password" autocomplete="off" value="${mode === "personal" ? escapeHtml(savedKey) : ""}" placeholder="sk-or-...">
        </div>

        <div class="modal-actions">
          <button id="save-api-key-btn" class="modal-save-btn" type="button">Запази</button>
        </div>
        <p id="api-key-status" class="modal-save-status" aria-live="polite"></p>
      </div>
    `,
    initApiKeyModalControls
  );
}

function initApiKeyModalControls() {
  const toggle = document.getElementById("api-key-mode-toggle");
  const input = document.getElementById("openrouter-key-input");
  const saveBtn = document.getElementById("save-api-key-btn");
  const status = document.getElementById("api-key-status");
  const field = document.getElementById("personal-key-field");
  const basicLabel = document.getElementById("basic-key-label");
  const personalLabel = document.getElementById("personal-key-label");

  const syncUi = () => {
    const isPersonal = !!toggle?.checked;

    if (field) {
      field.hidden = !isPersonal;
    }
    if (input) {
      input.value = isPersonal ? (input.value || getPersonalApiKey()) : "";
    }
    if (basicLabel) {
      basicLabel.classList.toggle("active", !isPersonal);
    }
    if (personalLabel) {
      personalLabel.classList.toggle("active", isPersonal);
    }
  };

  if (toggle) {
    toggle.addEventListener("change", () => {
      syncUi();
      if (status) status.textContent = "";
      if (toggle.checked && input) {
        input.focus();
      }
    });
  }

  if (saveBtn) {
    saveBtn.addEventListener("click", () => {
      const isPersonal = !!toggle?.checked;
      const key = (input?.value || "").trim();

      if (isPersonal && !key) {
        if (status) status.textContent = "Въведи OpenRouter ключ или избери Basic.";
        return;
      }

      localStorage.setItem(API_KEY_MODE_STORAGE, isPersonal ? "personal" : "basic");

      if (isPersonal) {
        localStorage.setItem(API_KEY_VALUE_STORAGE, key);
      }

      if (status) {
        status.textContent = "Запазено.";
      }
    });
  }

  syncUi();
}

function saveStory(title, story) {
  const stories = JSON.parse(localStorage.getItem("stories")) || [];
  stories.unshift({ id: Date.now(), title, story });
  localStorage.setItem("stories", JSON.stringify(stories.slice(0, 3)));
  renderHistory();
}

function renderHistory() {
  const stories = JSON.parse(localStorage.getItem("stories")) || [];
  if (!historyEl) return;
  
  const historyContainer = document.getElementById('history-container');
  
  if (stories.length === 0) {
    if (historyContainer) {
      historyContainer.style.display = 'none';
    }
    return;
  }
  
  if (historyContainer) {
    historyContainer.style.display = 'block';
  }
  
  historyEl.innerHTML = "";
stories.forEach(s => {
  if (!s || typeof s.story !== 'string') return;

  const li = document.createElement("li");
  li.className = 'history-item';

  const timestamp = new Date(s.id).toLocaleTimeString('bg-BG', {
    hour: '2-digit',
    minute: '2-digit'
  });

  li.innerHTML = `
    <div class="history-item-header">
      <span class="history-genre">📖 ${s.title || 'Приказка'}</span>
      <span class="history-time">${timestamp}</span>
    </div>
    <p class="history-preview">
      ${s.story.substring(0, 100)}...
    </p>
  `;

  li.onclick = () => {
    resultEl.textContent = s.story;
    document.getElementById('story-container').style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  historyEl.appendChild(li);
});

  
  ;
}

async function typeText(element, text) {
  const lines = text.split('\n');
  
  for (let line of lines) {
    await new Promise(resolve => setTimeout(resolve, 50));
    element.textContent += line + '\n';
  }
}

function resetWordQueue() {
  wordQueue = [];
  queueRemainder = "";
  queueRunId += 1;
  queueAnimatorRunning = false;
}

function enqueueStreamText(text, flush = false) {
  if (!text && !flush) return;

  queueRemainder += text;
  const tokens = queueRemainder.match(/\s+|\S+/g) || [];

  if (!flush && tokens.length > 0) {
    const lastToken = tokens[tokens.length - 1];
    if (!/\s/.test(lastToken)) {
      queueRemainder = lastToken;
      tokens.pop();
    } else {
      queueRemainder = "";
    }
  } else {
    queueRemainder = "";
  }

  if (tokens.length > 0) {
    wordQueue.push(...tokens);
    startWordAnimator();
  }
}

function getTokenDelay(token) {
  if (/^\s+$/.test(token)) {
    return token.includes("\n") ? 10 : 7;
  }

  return 42;
}

async function startWordAnimator() {
  if (queueAnimatorRunning) return;

  queueAnimatorRunning = true;
  const runId = queueRunId;

  while (queueRunId === runId && wordQueue.length > 0) {
    const token = wordQueue.shift();
    resultEl.textContent += token;
    await sleep(getTokenDelay(token));
  }

  if (queueRunId === runId) {
    queueAnimatorRunning = false;
  }
}

async function waitForWordQueueIdle() {
  while (queueAnimatorRunning || wordQueue.length > 0 || queueRemainder) {
    if (!queueAnimatorRunning && wordQueue.length > 0) {
      startWordAnimator();
    }
    await sleep(20);
  }
}

function showGenerationStatus() {
  const status = document.getElementById("generation-status");
  if (!status) return;

  status.hidden = false;
  status.classList.remove("has-text");

  const message = status.querySelector(".generation-message");
  if (message) {
    message.textContent = "✨ Магията работи...";
  }
}

function markGenerationTextStarted() {
  const status = document.getElementById("generation-status");
  if (!status) return;

  status.classList.add("has-text");

  const message = status.querySelector(".generation-message");
  if (message) {
    message.textContent = "✨ Приказката се пише...";
  }
}

function hideGenerationStatus() {
  const status = document.getElementById("generation-status");
  if (!status) return;

  status.hidden = true;
  status.classList.remove("has-text");
}

function setGenerateButtonLoading(isLoading) {
  const generateBtn = document.getElementById('generate-btn');
  if (!generateBtn) return;

  generateBtn.disabled = isLoading;
  generateBtn.classList.toggle('generating', isLoading);

  const text = generateBtn.querySelector('.btn-text');
  if (text) {
    text.textContent = isLoading ? 'Магията работи...' : 'Генерирай Приказка';
  }
}

function showStoryContainer() {
  const storyContainer = document.getElementById('story-container');
  if (storyContainer) {
    storyContainer.style.display = 'block';
  }
}

// ============================================

// ГЕНЕРИРАНЕ НА ПРИКАЗКА (API)
// ============================================

async function generate() {
  if (isGenerating) return;

  const heroInputs = Array.from(document.querySelectorAll("#heroes-inline .hero-segment"));
  const heroes = heroInputs.map(input => input.value.trim()).filter(Boolean);
  const hero = heroes[0] || "";
  const goal = document.getElementById("goal").value.trim();
  const age = document.getElementById("age").value;
  const language = document.getElementById("language").value;
  const genre = currentGenre;
  const lengthRaw = document.getElementById("length").value;
  const length = parseLength(lengthRaw);
  const moral = (document.getElementById("moral")?.value || "").trim();

  if (!hero || !goal) {
    showStoryContainer();
    hideGenerationStatus();
    resultEl.textContent = "⚠️ Моля, попълни име на герой и проблем.";
    return;
  }

  const improveBtn = document.getElementById('improve-btn');

  isGenerating = true;
  resetWordQueue();
  setGenerateButtonLoading(true);
  showStoryContainer();
  showGenerationStatus();
  resultEl.textContent = "";

  if (improveBtn) {
    improveBtn.style.display = 'none';
  }

  if (window.speechSynthesis && (window.speechSynthesis.speaking || window.speechSynthesis.pending)) {
    stopReading();
  }

  createMagicBurst();

  try {
    const res = await fetch("/api/generate-stream", {
      method: "POST",
      headers: buildRequestHeaders(),
      body: JSON.stringify({
        hero,
        heroes,
        goal,
        age,
        language,
        genre,
        length,
        moral
      })
    });

    if (!res.ok || !res.body) {
      const errorText = await res.text().catch(() => "");
      throw new Error(errorText || "Stream response error");
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let hasTextStarted = false;

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      if (!chunk) continue;

      if (!hasTextStarted && chunk.trim()) {
        hasTextStarted = true;
        markGenerationTextStarted();
      }

      enqueueStreamText(chunk);
    }

    const tail = decoder.decode();
    if (tail) {
      if (!hasTextStarted && tail.trim()) {
        hasTextStarted = true;
        markGenerationTextStarted();
      }
      enqueueStreamText(tail);
    }

    enqueueStreamText("", true);
    await waitForWordQueueIdle();

    const finalStory = resultEl.textContent.trim();
    if (!finalStory || finalStory.startsWith("[ERROR]") || finalStory === "SERVER_ERROR") {
      resultEl.textContent = "⚠️ Не успях да генерирам приказка.";
      return;
    }

    saveStory(`Приказка за ${hero}`, finalStory);

    if (improveBtn) {
      improveBtn.style.display = 'flex';
    }
  } catch (err) {
    console.error("FETCH ERROR:", err);
    resetWordQueue();
    resultEl.textContent = "❌ Грешка при връзка със сървъра.";
  } finally {
    isGenerating = false;
    hideGenerationStatus();
    setGenerateButtonLoading(false);
  }
}

// ============================================
// ПОДОБРЯВАНЕ НА ПРИКАЗКА (API)
// ============================================

async function improve() {
  const currentStory = resultEl.textContent;

  if (
    !currentStory ||
    currentStory.startsWith("⏳") ||
    currentStory.startsWith("⚠️") ||
    currentStory.startsWith("❌")
  ) {
    return;
  }

  const improveBtn = document.getElementById('improve-btn');
  if (improveBtn) {
    improveBtn.disabled = true;
  }

  resultEl.textContent = "⏳ Подобрявам приказката...";

  try {
    const res = await fetch("/api/improve", {
      method: "POST",
      headers: buildRequestHeaders(),
      body: JSON.stringify({ story: currentStory })
    });

    const data = await res.json();

    if (!res.ok || !data.story) {
      resultEl.textContent = "⚠️ Не успях да подобря текста.";
      return;
    }

    // Анимирано показване на подобрения текст
    resultEl.textContent = '';
    await typeText(resultEl, data.story);

  } catch (err) {
    console.error("IMPROVE ERROR:", err);
    resultEl.textContent = "❌ Грешка при подобряване.";
  } finally {
    if (improveBtn) {
      improveBtn.disabled = false;
    }
  }
}

// ============================================
// ЧЕТЕНЕ НА ГЛАС (SPEECH SYNTHESIS)
// ============================================

function readStory() {
  const storyText = resultEl.textContent;
  
  // Проверка за валиден текст
  if (!storyText || 
      storyText.trim() === '' || 
      storyText.startsWith("⏳") ||
      storyText.startsWith("⚠️") ||
      storyText.startsWith("❌")) {
    return;
  }
  
  // Спиране на предишно четене
  if (window.speechSynthesis.speaking) {
    window.speechSynthesis.cancel();
  }
  
  // Създаване на нов utterance
  const utterance = new SpeechSynthesisUtterance(storyText);
  utterance.lang = 'bg-BG';
  utterance.rate = 0.85;
  utterance.pitch = 1.1;
  utterance.volume = 1;
  
  // Event handlers
  utterance.onstart = () => {
    isReading = true;
    updateAudioButtons();
    const storyContainer = document.getElementById('story-container');
    if (storyContainer) {
      storyContainer.classList.add('reading');
    }
  };
  
  utterance.onend = () => {
    isReading = false;
    updateAudioButtons();
    const storyContainer = document.getElementById('story-container');
    if (storyContainer) {
      storyContainer.classList.remove('reading');
    }
  };
  
  utterance.onerror = (event) => {
    console.error('Speech synthesis error:', event);
    isReading = false;
    updateAudioButtons();
    const storyContainer = document.getElementById('story-container');
    if (storyContainer) {
      storyContainer.classList.remove('reading');
    }
  };
  
  currentUtterance = utterance;
  window.speechSynthesis.speak(utterance);
}

function stopReading() {
  if (window.speechSynthesis.speaking) {
    window.speechSynthesis.cancel();
  }
  isReading = false;
  updateAudioButtons();
  const storyContainer = document.getElementById('story-container');
  if (storyContainer) {
    storyContainer.classList.remove('reading');
  }
}

function updateAudioButtons() {
  const readBtn = document.getElementById('read-btn');
  const stopBtn = document.getElementById('stop-btn');
  
  if (readBtn) {
    readBtn.disabled = isReading;
  }
  if (stopBtn) {
    stopBtn.disabled = !isReading;
  }
}

// ============================================
// CLEANUP
// ============================================

window.addEventListener('beforeunload', () => {
  if (window.speechSynthesis.speaking) {
    window.speechSynthesis.cancel();
  }
});
