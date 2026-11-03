# ✨ Приказка Online — AI Story Generator

![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=nodedotjs&logoColor=white) ![JavaScript](https://img.shields.io/badge/JavaScript-ES%20Modules-F7DF1E?logo=javascript&logoColor=black) ![AI](https://img.shields.io/badge/AI-OpenRouter-A98EFF)

**Приказка Online** е уеб приложение за създаване, редактиране и четене на приказки с помощта на AI. Интерфейсът е на български език, с жанрове, визуални ефекти и възможности за работа с генерирани истории.

## 🌟 Функционалности

- Генериране и редактиране на приказки чрез AI.
- Избор на жанр и интерактивен интерфейс с визуални ефекти.
- Клиентска част: HTML, CSS, JavaScript.
- Сървърна част: Node.js, Express и OpenRouter интеграция.
- Клиентски функции за историята и синтез на реч, когато се поддържат от браузъра.

## 🚀 Стартиране локално

1. Инсталирай актуална LTS версия на Node.js.
2. Клонирай хранилището и изпълни npm install.
3. Копирай .env.example в .env и запиши в него свой валиден OPENROUTER_API_KEY.
4. Стартирай npm start и отвори http://localhost:3000.

**Важно:** AI заявките изискват работещ OpenRouter ключ. Файловете .env и node_modules са изключени от Git.

## 🗂️ Структура

| Файл | Предназначение |
|---|---|
| server.js | Express API и AI заявки |
| public/index.html | Основен интерфейс |
| public/style.css | Дизайн, теми и ефекти |
| public/app.js | Взаимодействия и клиентска логика |
| package.json | Зависимости и команди |

## 🔐 Сигурност

Никога не качвай истински API ключове и .env файлове. Не споделяй пароли или токени в issues и screenshots. Сървърното приложение не трябва да се излага публично без допълнителни ограничения за злоупотреба с API.

---

Разработено от [Ventsislav Kolev](https://github.com/ventsislav67).
