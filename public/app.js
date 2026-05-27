// ============================================
// ГЛОБАЛНИ ПРОМЕНЛИВИ
// ============================================

let currentGenre = 'Приключенска';
let storyHistory = [];
let isReading = false;
let currentUtterance = null;

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

function saveStory(title, story) {
  const stories = JSON.parse(localStorage.getItem("stories")) || [];
  stories.unshift({ id: Date.now(), title, story });
  localStorage.setItem("stories", JSON.stringify(stories));
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

// ============================================

// ГЕНЕРИРАНЕ НА ПРИКАЗКА (API)
// ============================================

async function generate() {
 const heroInputs = Array.from(document.querySelectorAll("#heroes-inline .hero-segment"));
const hero = (heroInputs[0]?.value || "").trim();
  const goal = document.getElementById("goal").value.trim();
  const age = document.getElementById("age").value;
  const language = document.getElementById("language").value;
  const genre = currentGenre; // ✅ ТУК Е ПОПРАВКАТА
  const lengthRaw = document.getElementById("length").value;
  const length = parseLength(lengthRaw);

  if (!hero || !goal) {
    resultEl.textContent = "⚠️ Моля, попълни име на герой и проблем.";
    return;
  }

resultEl.textContent = "⏳ Генерирам приказка...";
try {
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        hero,
        goal,
        age,
        language,
        genre,
        length
      })
    });

    const data = await res.json();

    if (!res.ok || !data.story) {
      resultEl.textContent = "❌ Грешка при генериране.";
      return;
    }

    resultEl.textContent = '';
    await typeText(resultEl, data.story);
    saveStory(`Приказка за ${hero}`, data.story);

  } catch (err) {
    console.error(err);
    resultEl.textContent = "❌ Грешка при връзка със сървъра.";
  }

  // Визуални ефекти
  const generateBtn = document.getElementById('generate-btn');
  const improveBtn = document.getElementById('improve-btn');
  const storyContainer = document.getElementById('story-container');
  
  if (generateBtn) {
    generateBtn.classList.add('generating');
    generateBtn.querySelector('.btn-text').textContent = 'Магията работи...';
  }
  
  createMagicBurst();
  
  if (storyContainer) {
    storyContainer.style.display = 'block';
  }
  
  resultEl.textContent = "⏳ Генерирам приказка...";

  try {
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        hero,
        goal,
        age,
        language,
        genre,
        length
      })
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("SERVER ERROR:", data);

      if (res.status === 422) {
        resultEl.textContent =
          "⚠️ " + (data.error || "Текстът не покри качествените изисквания.");
        
        if (generateBtn) {
          generateBtn.classList.remove('generating');
          generateBtn.querySelector('.btn-text').textContent = 'Генерирай Приказка';
        }
        return;
      }

      resultEl.textContent = "❌ Вътрешна сървърна грешка.";
      
      if (generateBtn) {
        generateBtn.classList.remove('generating');
        generateBtn.querySelector('.btn-text').textContent = 'Генерирай Приказка';
      }
      return;
    }

    if (!data.story) {
      resultEl.textContent = "⚠️ Не успях да генерирам приказка.";
      
      if (generateBtn) {
        generateBtn.classList.remove('generating');
        generateBtn.querySelector('.btn-text').textContent = 'Генерирай Приказка';
      }
      return;
    }

    // Анимирано показване на текста
    resultEl.textContent = '';
    await typeText(resultEl, data.story);
    
    saveStory(`Приказка за ${hero}`, data.story);
    
    // Показване на бутон за подобряване
    if (improveBtn) {
      improveBtn.style.display = 'flex';
    }

  } catch (err) {
    console.error("FETCH ERROR:", err);
    resultEl.textContent = "❌ Грешка при връзка със сървъра.";
  } finally {
    if (generateBtn) {
      generateBtn.classList.remove('generating');
      generateBtn.querySelector('.btn-text').textContent = 'Генерирай Приказка';
    }
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
      headers: { "Content-Type": "application/json" },
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