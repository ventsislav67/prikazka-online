import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

/* ================= CONFIG ================= */
const MODELS = [
  "deepseek/deepseek-chat"
];

/* ================= OPENROUTER (NORMAL) ================= */
async function callOpenRouter(prompt, systemRole, apiKeyOverride) {
  const apiKey = apiKeyOverride || process.env.OPENROUTER_API_KEY;

  for (const model of MODELS) {
    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "Prikazka Generator"
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: systemRole },
            { role: "user", content: prompt }
          ]
        })
      });

      if (!res.ok) {
        console.error("OpenRouter HTTP:", res.status);
        continue;
      }

      const json = await res.json();
      if (json?.choices?.length) {
        return json.choices[0].message.content;
      }
    } catch (err) {
      console.error("OpenRouter error:", err.message);
    }
  }
  return null;
}

/* ================= OPENROUTER (STREAM) =================
   - stream:true връща SSE (data: {...})
   - ние парсваме и пращаме към клиента чист текст
======================================================== */
async function streamOpenRouter(prompt, systemRole, onDelta, apiKeyOverride) {
  const apiKey = apiKeyOverride || process.env.OPENROUTER_API_KEY;

  for (const model of MODELS) {
    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "Prikazka Generator"
        },
        body: JSON.stringify({
          model,
          stream: true,
          messages: [
            { role: "system", content: systemRole },
            { role: "user", content: prompt }
          ]
        })
      });

      if (!res.ok || !res.body) {
        console.error("OpenRouter STREAM HTTP:", res.status);
        continue;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");

      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // SSE идва на редове, разделени с \n\n или \n
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) continue;

          if (trimmed.startsWith("data:")) {
            const dataStr = trimmed.slice(5).trim();

            if (dataStr === "[DONE]") {
              return true;
            }

            try {
              const json = JSON.parse(dataStr);

              // OpenAI-style streaming delta
              const delta =
                json?.choices?.[0]?.delta?.content ??
                json?.choices?.[0]?.message?.content ??
                "";

              if (delta) onDelta(delta);
            } catch (e) {
              // ignore broken chunk
            }
          }
        }
      }

       return true;
    } catch (err) {
      console.error("OpenRouter stream error:", err.message);
    }
  }

  return false;
}


/* ================= EDITOR ================= */
async function editStory(story, length, apiKeyOverride) {
  const prompt = `


Ти си професионален редактор по български език и литература
с дългогодишен опит в редакция на детска художествена литература.

ОСНОВНА ЗАДАЧА:
Редактирай текста по-долу, БЕЗ да променяш:
- основния сюжет
- идеята
- жанра
- поуката
- последователността на събитията

ЕЗИКОВИ ИЗИСКВАНИЯ (ЗАДЪЛЖИТЕЛНИ):
- Поправи ВСИЧКИ правописни грешки
- Поправи ВСИЧКИ граматически грешки
- Уеднакви глаголните времена
- Коригирай неправилен словоред
- Замени неестествени или машинни формулировки
- Премахни излишни повторения
- Използвай ясен, литературен български език
- Направи текста плавен и подходящ за четене на глас

СТРУКТУРНО ИЗИСКВАНЕ (ЗАДЪЛЖИТЕЛНО):

- Приказката ТРЯБВА да бъде разделена на ТОЧНО ${length} абзаца
- Всеки абзац започва на НОВ РЕД
- Между абзаците има празен ред
- Не обединявай абзаци
- Ако не можеш да спазиш броя абзаци – пренапиши текста, докато го спазиш


КРИТИЧНИ ИЗИСКВАНИЯ ЗА ДЕТСКА БЕЗОПАСНОСТ:
- Текстът ТРЯБВА да бъде напълно подходящ за деца
- Забранени са внушения за:
  → омраза
  → отмъщение
  → физическа агресия
  → опасно или подражаемо поведение
- Ако има фантастичен, абсурден или магически елемент:
  → маркирай го ЯСНО като магия още при първата поява
  → направи го безобиден и символичен
  → премахни всякаква възможност за буквално тълкуване

СТРОГИ ПРАВИЛА (НЕ НАРУШАВАЙ):
1) Конфликтът НЕ МОЖЕ да започва от омраза или отмъщение.
   Ако такива мотиви присъстват, преформулирай ги като
   страх, недоразумение или емоционална реакция.

2) Действие, което дете може да повтори в реалния свят,
   НЕ МОЖЕ да остане без ясно приказно или магическо обяснение.
   Ако се появи — обезвреди го чрез контекст или формулировка.

СТИЛ И ТОН:
- Топъл, ясен, човешки разказ
- Без назидателност
- Поуката да бъде ПОКАЗАНА чрез действията на героя
- Съобразен с възрастта на детската аудитория

ТЕКСТ ЗА РЕДАКЦИЯ (САМО ТОЗИ):

<<<BEGIN_TEXT>>>
${story}
<<<END_TEXT>>>

ЗАБРАНЕНО:
- да добавяш нови сцени или герои
- да променяш смисъла
- да включваш инструкции, заглавия или коментари
- да повтаряш текста повече от веднъж

ФОРМАТ НА ИЗХОДА:
- Върни САМО редактирания текст
- Текстът да бъде САМО между <<<BEGIN_TEXT>>> и <<<END_TEXT>>>

ФИНАЛНА ПРОВЕРКА:
Задай си въпроса:
„Бих ли прочел това спокойно и уверено на дете на глас?“

Ако отговорът не е напълно „да“ —
коригирай проблемните части, докато стане „да“.
 
 КРИТИЧНО:
- Ако върнеш маркерите <<<BEGIN_TEXT>>> или <<<END_TEXT>>>,
  това се счита за грешка.
- Върни САМО съдържанието МЕЖДУ тях, без самите маркери.
-Върни САМО редактирания текст, без обяснения и маркиркери.







ТЕКСТ:
${story}
`;

  const edited = await callOpenRouter(
    prompt,
    "You are a strict Bulgarian language editor.",
    apiKeyOverride
  );

  if (!edited) return null;

  return edited
    .replace(/<s>|<\/s>/g, "")
    .trim();
}

function buildWriterPrompt({ hero, goal, age, language, genre, length, heroes, moral }) {
  const safeHeroes = Array.isArray(heroes) && heroes.length ? heroes : [hero];
  const extraHeroes = safeHeroes.length > 1 ? safeHeroes.slice(1).join(", ") : "няма";
  const moralText = (moral || "").trim();
  const isTeen = age === "12-16";
  const outputLanguage = language === "en" ? "английски" : "български";

  return `
Пиши детска приказка на ${outputLanguage} език.

Ти си професионален детски писател и разказвач с отлична езикова култура.
Пишеш качествени детски приказки, които се четат плавно и звучат естествено.

ОБЩИ ИЗИСКВАНИЯ:
- Перфектен правопис, граматика и стил
- Богат, жив, топъл и човешки разказ
- Ясно начало, силно развитие и запомнящ се край
- Поуката да бъде показана чрез действията на героя, без назидателност
- Подходяща за деца на възраст ${age} години
- Дължина: точно ${length} абзаца

СТРУКТУРА:
- Всеки абзац започва на нов ред
- Между абзаците има празен ред
- Не обединявай абзаци
- Не добавяй заглавие, инструкции или коментари

БЕЗОПАСНОСТ ЗА ДЕЦА:
- Приказката трябва да е напълно подходяща за деца
- Без насилие, омраза, отмъщение, самонараняване или опасно подражаемо поведение
- Ако има магически, фантастичен или абсурден елемент, направи го ясно безобиден, символичен или очевидно нереалистичен

СПЕЦИАЛНО ЗА 12-16:
${isTeen ? `- Позволен е по-богат речник и по-дълбоки теми
- Историята може да е по-плътна, но остава напълно безопасна` : `- Използвай нормален детски стил според възрастта, без да става бебешко.`}

ГЕРОИ:
Основен герой: ${hero}
Допълнителни герои: ${extraHeroes}

ОСНОВЕН ПРОБЛЕМ:
${goal}

ЖАНР: ${genre}

ПОУКА:
${moralText ? moralText : "Авторът избира поука според историята"}

ЖАНРОВИ УКАЗАНИЯ:
Ако жанрът е Приключенска, историята да има движение, изпитания и победа над трудностите.
Ако жанрът е Фентъзи, използвай магия, необикновени светове и ясна вътрешна логика.
Ако жанрът е Мистериозна, изгради загадка, улики и постепенно разкриване.
Ако жанрът е Поучителна, фокусирай се върху вътрешното израстване чрез преживяване.
Ако жанрът е Хумористична, използвай забавни ситуации и неочаквани, безопасни обрати.

Преди финалния отговор поправи всички езикови неточности и върни САМО текста на приказката.
`;
}

/* ================= GENERATE ================= */
app.post("/api/generate", async (req, res) => {
  try {
    const apiKeyOverride = req.headers["x-openrouter-key"]?.trim() || null;

    const { hero, goal, age, language, genre, length, heroes, moral } = req.body;

    if (!hero || !goal || !length) {
      return res.status(400).json({ error: "Липсват задължителни данни." });
    }

    const safeHeroes = Array.isArray(heroes) && heroes.length ? heroes : [hero];
    const extraHeroes = safeHeroes.length > 1 ? safeHeroes.slice(1).join(", ") : "няма";
    const moralText = (moral || "").trim();

    const isTeen = age === "12-16";

    const writerPrompt = `
Пиши детска приказка на български език.


Ти си професионален детски писател и разказвач с отлична езикова култура.
Пишеш ИЗКЛЮЧИТЕЛНО качествени детски приказки, които се четат на един дъх
и звучат естествено, сякаш са написани от опитен автор.

ОБЩИ ИЗИСКВАНИЯ (ЗАДЪЛЖИТЕЛНИ):
- Перфектен правопис и граматика на български език
- Богат, жив, плавен и емоционален език
- Да не се повтаря името на героя във всяко изречение
- Да има ясно начало, силно развитие и запомнящ се край
- Да завършва с поука, показана ЧРЕЗ ДЕЙСТВИЯТА на героя (НЕ назидателно)
- Текстът да звучи естествено и литературно
- Подходяща за деца на възраст ${age} години
- Дължина: ${length} абзаца


СТРУКТУРНО ИЗИСКВАНЕ (ЗАДЪЛЖИТЕЛНО):

- Приказката ТРЯБВА да бъде разделена на ТОЧНО ${length} абзаца
- Всеки абзац започва на НОВ РЕД
- Между абзаците има празен ред
- Не обединявай абзаци
- Ако не можеш да спазиш броя абзаци – пренапиши текста, докато го спазиш


КОНТЕКСТ И БЕЗОПАСНОСТ ЗА ДЕЦА (ЗАДЪЛЖИТЕЛНО):

- Приказката ТРЯБВА да е напълно подходяща за деца
- Забранени са теми, които могат да се тълкуват буквално като:
  насилие, ядене на хора, самонараняване или опасно поведение
- Ако има абсурден, фантастичен или хумористичен елемент,
  той ТРЯБВА ясно да е:
  → безобиден
  → символичен
  → или очевидно нереалистичен за дете
- Никога не допускай двусмислие, което може да обърка дете

СПЕЦИАЛНО ЗА 12–16 (ЗАДЪЛЖИТЕЛНО):
${isTeen ? `- Позволен е по-богат речник, по-дълги изречения и по-дълбоки теми
- Да има повече свобода и “неограничено” усещане (по-плътна история)
- Но остава 100% безопасно и подходящо (без опасно подражаемо поведение)` : `- Нормален детски стил според възрастта, без да става “бебешко”.`}


ГЕРОИ:
Основен герой: ${hero}
Допълнителни герои: ${extraHeroes}

ОСНОВЕН ПРОБЛЕМ:
${goal}

ЖАНР: ${genre}

ПОУКА (ако е зададена):
${moralText ? moralText : "Авторът избира поука според историята"}

КРИТИЧНО ЗА ПОУКАТА:
${moralText ? `- Последният абзац трябва ясно да затвори историята и да съвпада по смисъл с поуката: "${moralText}"
- Поуката да е показана чрез действията на героите, не като лекция.` : `- Поуката да е показана чрез действията на героя, не като лекция.`}

СПЕЦИФИЧНИ ЖАНРОВИ УКАЗАНИЯ (ИЗПЪЛНЯВАЙ СТРОГО):

Ако жанрът е **Приключенска**:
- Историята да е изпълнена с движение, опасности и напрежение
- Героят да преминава през реални изпитания
- Да има усещане за риск, пътешествие и победа над трудностите
- Читателят да усеща, че всяка сцена води към нещо важно

Ако жанрът е **Фентъзи**:
- Използвай магия, необикновени същества и вълшебни светове
- Въображението да бъде на максимум
- Да има „уау“ моменти и изненадващи фантастични елементи
- Вълшебният свят да бъде ясен и последователен

Ако жанрът е **Мистериозна**:
- Изгради силна загадка още в началото
- Постепенно разкривай улики
- Поддържай напрежение до самия край
- Историята да държи вниманието без спад

Ако жанрът е **Поучителна**:
- Фокус върху вътрешното израстване на героя
- Поуката да бъде ясна, дълбока и полезна за деца
- Да учи чрез примери и преживявания, не чрез обяснения

Ако жанрът е **Хумористична**:
- Приказката да е наистина СМЕШНА
- Позволен е по-свободен и разговорен език
- Забавни ситуации, комични реакции и неочаквани обрати
- Целта е детето да се смее, не просто да се усмихне

КРИТИЧНО ЕЗИКОВО ИЗИСКВАНЕ (ЗАДЪЛЖИТЕЛНО):

Преди да върнеш финалния текст:
- Прочети текста като РЕДАКТОР по български език
- Поправи ВСИЧКИ правописни грешки
- Поправи ВСИЧКИ граматически грешки
- Поправи неправилни членувания, род, число и време
- Замени неестествени или грешни думи с правилни и естествени
- Увери се, че няма неволни повторения на думи, изрази или абзаци
- Увери се, че текстът звучи гладко при четене на глас

Ако откриеш дори минимална езикова неточност — ПОПРАВИ Я,
преди да върнеш окончателния текст.

ФИНАЛНО ИЗИСКВАНЕ (ОБЯВЯВА ВСИЧКИ ГОРНИ ПРАВИЛА):

Преди да върнеш окончателния отговор, направи финална проверка и се увери,
че приказката изпълнява АБСОЛЮТНО ВСИЧКИ изисквания, описани по-горе, включително:

- напълно правилен правопис, граматика и стил
- естествен и литературен български език
- ясно начало, развитие и запомнящ се край
- стриктно спазен жанр: ${genre}
- точна дължина: ${length} абзаца
- език, съобразен с възрастта: ${age} години
- липса на неволни повторения
- поука, показана чрез действията на героя, без назидателност

Ако дори ЕДНО от тези условия не е изпълнено,
ПОПРАВИ текста, преди да го върнеш.

ПОСЛЕДНА ПРОВЕРКА ПРЕДИ ВРЪЩАНЕ НА ТЕКСТА:

Задай си въпроса:
„Бих ли прочел тази приказка спокойно на 5–10 годишно дете на глас?“

Ако има дори МАЛКО съмнение —
пренапиши проблемните части, докато текстът стане напълно подходящ.


Върни САМО финалния текст на приказката, без обяснения.
`;

    const rawStory = await callOpenRouter(
      writerPrompt,
      "You are a professional Bulgarian children's writer.",
      apiKeyOverride
    );

    if (!rawStory) {
      return res.status(500).json({ error: "AI не отговори." });
    }

    const edited = await editStory(rawStory, Number(length), apiKeyOverride);

    if (!edited) {
      return res.status(500).json({ error: "Редакторът не отговори." });
    }

    res.json({ story: edited });

  } catch (err) {
    console.error("SERVER ERROR:", err);
    res.status(500).json({ error: "Вътрешна сървърна грешка." });
  }
});

/* ================= GENERATE (STREAM LIVE) =================
   - пращаме text/plain delta chunk-ове към клиента веднага
   - не буферираме целия текст преди отговор
=========================================================== */
app.post("/api/generate-stream", async (req, res) => {
  try {
    const { hero, goal, age, language, genre, length, heroes, moral } = req.body;

    if (!hero || !goal || !length) {
      return res.status(400).json({ error: "Липсват задължителни данни." });
    }

    const apiKeyOverride = req.headers["x-openrouter-key"]?.trim() || null;

    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders?.();

    const writerPrompt = buildWriterPrompt({ hero, goal, age, language, genre, length, heroes, moral });

    let sentAnyText = false;

    const ok = await streamOpenRouter(
      writerPrompt,
      "You are a professional Bulgarian children's writer.",
      (delta) => {
        sentAnyText = true;
        res.write(delta);
      },
      apiKeyOverride
    );

    if (!ok && !sentAnyText) {
      res.write("\n\n[ERROR] AI не отговори.\n");
    }

    res.end();

  } catch (err) {
    console.error("STREAM ERROR:", err);
    if (!res.headersSent) {
      res.status(500).end("SERVER_ERROR");
    } else {
      res.end("\n\n[ERROR] SERVER_ERROR\n");
    }
  }
});

/* ================= IMPROVE ================= */
app.post("/api/improve", async (req, res) => {
  try {
    const { story } = req.body;
    if (!story) {
      return res.status(400).json({ error: "Липсва текст." });
    }

    const apiKeyOverride = req.headers["x-openrouter-key"]?.trim() || null;

    const improved = await editStory(story, 3, apiKeyOverride);

    if (!improved) {
      return res.status(500).json({ error: "Не успях да подобря текста." });
    }

    res.json({ story: improved });

  } catch (err) {
    console.error("IMPROVE ERROR:", err);
    res.status(500).json({ error: "Грешка при подобряване." });
  }
});

/* ================= START ================= */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
