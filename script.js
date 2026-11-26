
/* =========================
   ОСНОВНОЙ КЛИКЕР
========================= */

const scoreElement = document.getElementById("score");
const recordElement = document.getElementById("record");
let soundEnabled = localStorage.getItem("pipaSound") !== "off";
let currentLaunguage = localStorage.getItem("pipaLanguage") || "ru";

if (scoreElement && recordElement) {
    let clicks = Number(localStorage.getItem("clicks")) || 0;
    let record = Number(localStorage.getItem("record")) || 0;
    let totalClicks = Number(localStorage.getItem("totalClicks")) || 0;

    /* =========================
       ПОЗДРАВЛЕНИЕ КОРОЛЕВЫ
    ========================= */

    function checkQueenReward() {
        if (
            totalClicks >= 10000 &&
            !localStorage.getItem("queenRewardUsed")
        ) {
            const modal = document.getElementById("queenModal");
            const video = document.getElementById("queenVideo");

            if (modal) {
                localStorage.setItem("queenRewardUsed", "yes");
                modal.style.display = "flex";

               if (video) {
    video.muted = !soundEnabled;
    video.play().catch(() => {});
}
            }
        }
    }

    window.closeQueenModal = function() {
        const modal = document.getElementById("queenModal");
        const video = document.getElementById("queenVideo");

        if (modal) {
            modal.style.display = "none";
        }

        if (video) {
            video.pause();
            video.currentTime = 0;
        }
    };

    // Проверка при запуске

    let currentRank = "";

    const rankElement = document.getElementById("rank");

  const ranks = [
    { clicks: 100000, ru: "💎 Правая лапа Пипы", en: "💎 Pipa's Right Hand" },
    { clicks: 10000, ru: "🧹 Прислуга Пипы", en: "🧹 Pipa's Servant" },
    { clicks: 5000, ru: "⭐ Легенда Пипы", en: "⭐ Pipa's Legend" },
    { clicks: 1000, ru: "👑 Поклонник Королевы", en: "👑 Queen's Fan" },
    { clicks: 500, ru: "🍎 Поставщик вкусняшек", en: "🍎 Treat Supplier" },
    { clicks: 100, ru: "🌾 Любитель чумизы", en: "🌾 Chumiza Lover" },
    { clicks: 1, ru: "🐥 Знакомый Пипы", en: "🐥 Pipa's Acquaintance" }
];

    // Звания
    function updateRank() {
        const rank = ranks.find(rank => totalClicks >= rank.clicks);
const newRank = rank
    ? (currentLanguage === "en" ? rank.en : rank.ru)
    : (currentLanguage === "en" ? "🐣 Newbie" : "🐣 Новичок");

        if (currentRank !== "" && currentRank !== newRank) {
            const notification = document.getElementById("rankNotification");
            const notificationText = document.getElementById("rankNotificationText");

            if (notification && notificationText) {
                notificationText.textContent = newRank;
                notification.classList.add("show");

                setTimeout(() => {
                    notification.classList.remove("show");
                }, 3000);
            }
        }

        currentRank = newRank;

        if (rankElement) {
            rankElement.textContent = newRank;
        }
    }

    updateRank();

    scoreElement.textContent = clicks;
    recordElement.textContent = record;

    /* =========================
       ЗВУК
    ========================= */

    const clickSound = new Audio("pipa_chirp (1)-[AudioTrimmer.com].mp3");
    /* =========================
       КЛИК ПО ПИПЕ
    ========================= */

    window.clickButton = function() {
        if (soundEnabled) {
            const sound = clickSound.cloneNode();
            sound.play().catch(() => {});
        }

        clicks++;
        totalClicks++;

        localStorage.setItem("totalClicks", totalClicks);

        updateRank();
        checkQueenReward();

        if (clicks > record) {
            record = clicks;
            localStorage.setItem("record", record);
            recordElement.textContent = record;
        }

        localStorage.setItem("clicks", clicks);
        scoreElement.textContent = clicks;

        const pipaButton = document.querySelector(".pipa-button");

        if (pipaButton) {
            const plus = document.createElement("span");
            plus.className = "plus-one";
            plus.textContent = "+1";

            pipaButton.appendChild(plus);

            setTimeout(() => plus.remove(), 700);
        }
    };

    /* =========================
       СБРОС КЛИКОВ
    ========================= */

    window.resetClicks = function() {
        clicks = 0;

        localStorage.setItem("clicks", clicks);
        scoreElement.textContent = clicks;
    };

    /* =========================
       СМЕНА ФОНА
    ========================= */

    const backgrounds = ["blue", "white", "purple", "feathers"];
    let currentBackground = 0;

    window.changeBackground = function() {
        currentBackground++;

        if (currentBackground >= backgrounds.length) {
            currentBackground = 0;
        }

        document.body.className = backgrounds[currentBackground];
    };

    /* =========================
       ПРОМОКОДЫ
    ========================= */
let promoMessageTimer;

window.activatePromo = function() {
    const input = document.getElementById("promoInput");
    const message = document.getElementById("promoMessage");

    if (!input || !message) return;

    const code = input.value.trim().toUpperCase();

    function showPromoMessage(text) {
        message.textContent = text;

        clearTimeout(promoMessageTimer);

        promoMessageTimer = setTimeout(() => {
            message.textContent = "";
        }, 2500);
    }

    const promoCodes = {
        "PIPA67": {
            clicks: 6767,
            message: "🎉 Получено 6767 кликов!"
        },
        "PIPA100": {
            clicks: 10000,
            message: "👑 Получено 10 000 кликов!"
        },
        "PIPA2027": {
            clicks: 2027,
            message: "🎊 Получено 2027 кликов!"
        },
        "PIPA^&": {
            clicks: 676767,
            message: "👑 Активирован секретный промокод"
        }
    };

    if (!promoCodes[code]) {
        showPromoMessage("❌ Неверный промокод!");
        return;
    }

    const storageKey = "promo_" + code;

    if (localStorage.getItem(storageKey)) {
        showPromoMessage("❌ Промокод уже использован!");
        return;
    }

    const bonus = promoCodes[code].clicks;

    clicks += bonus;
    totalClicks += bonus;

    localStorage.setItem("clicks", clicks);
    localStorage.setItem("totalClicks", totalClicks);
    localStorage.setItem(storageKey, "used");

    checkQueenReward();

    if (clicks > record) {
        record = clicks;
        localStorage.setItem("record", record);
    }

    scoreElement.textContent = clicks;
    recordElement.textContent = record;

    updateRank();

    showPromoMessage(promoCodes[code].message);
    input.value = "";
};
}
/* =========================
   МИНИ-ИГРА
========================= */

const miniArea = document.getElementById("miniGameArea");

if (miniArea) {
    const miniPipa = document.getElementById("miniPipa");
    const miniScoreText = document.getElementById("miniScore");
    const startMiniButton = document.getElementById("startMiniGame");

    let miniScore = 0;
    const eatingSound = new Audio("pipa_chirp (1)-[AudioTrimmer.com].mp3");

    let miniRunning = false;
    let spawnTimer;
    let gameTimer;
    let fallTimers = [];

    // Движение Пипы
    function movePipa(event) {
        if (!miniRunning) return;

        const rect = miniArea.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const half = miniPipa.offsetWidth / 2;

        const safeX = Math.max(
            half,
            Math.min(rect.width - half, x)
        );

        miniPipa.style.left = safeX + "px";
    }

    miniArea.addEventListener("pointermove", movePipa);

    // Создание предметов
    function createItem() {
        if (!miniRunning) return;

        const item = document.createElement("div");
        const random = Math.random();

        let type;
        let points = 0;

        if (random < 0.55) {
            type = "🌾";
            points = 1;
        } else if (random < 0.65) {
            type = "✨";
            points = 3;
        } else {
            type = "💩";
        }

        item.textContent = type;
        item.style.position = "absolute";
        item.style.top = "0px";
        item.style.left = Math.random() * 90 + "%";
        item.style.fontSize = "27px";
        item.style.zIndex = "1";

        miniArea.appendChild(item);

        let y = 0;

        const fallTimer = setInterval(() => {
            if (!miniRunning) {
                clearInterval(fallTimer);
                item.remove();
                return;
            }

            y += 3;
            item.style.top = y + "px";

            const itemRect = item.getBoundingClientRect();
            const pipaRect = miniPipa.getBoundingClientRect();

            const caught =
                itemRect.bottom >= pipaRect.top &&
                itemRect.top <= pipaRect.bottom &&
                itemRect.right >= pipaRect.left &&
                itemRect.left <= pipaRect.right;

            if (caught) {
                clearInterval(fallTimer);
                item.remove();

                if (type === "💩") {
                    endGame();
                } else {
                    const sound = eatingSound.cloneNode();
                    sound.play().catch(() => {});

                    miniScore += points;
                    miniScoreText.textContent = miniScore;
                }
            }

            if (y > miniArea.clientHeight) {
                clearInterval(fallTimer);
                item.remove();
            }
        }, 20);

        fallTimers.push(fallTimer);
    }

    // Очистка предметов
    function clearItems() {
        fallTimers.forEach(timer => clearInterval(timer));
        fallTimers = [];

        miniArea.querySelectorAll("div").forEach(item => item.remove());
    }

    // Остановка игры
    function stopGame() {
        miniRunning = false;

        clearInterval(spawnTimer);
        clearTimeout(gameTimer);
        clearItems();
    }

    // Конец игры
    function endGame() {
        stopGame();

        startMiniButton.textContent = "Играть ещё раз";

        alert("Пипа поймала какашку! Очки: " + miniScore);
    }

    // Начало игры
    startMiniButton.addEventListener("click", () => {
        if (miniRunning) return;

        clearItems();

        miniScore = 0;
        miniScoreText.textContent = "0";

        miniRunning = true;
        startMiniButton.textContent = "Игра идёт!";

        spawnTimer = setInterval(createItem, 1000);

        gameTimer = setTimeout(() => {
            if (miniRunning) {
                stopGame();

                startMiniButton.textContent = "Играть ещё раз";

                alert("Время вышло! Очки: " + miniScore);
            }
        }, 30000);
    });
}
/* =========================
   МЕНЮ НАСТРОЕК
========================= */

const settingsButton = document.getElementById("settingsButton");
const settingsModal = document.getElementById("settingsModal");
const closeSettings = document.getElementById("closeSettings");
const applySettings = document.getElementById("applySettings");

const languageSelect = document.getElementById("languageSelect");
const soundSelect = document.getElementById("soundSelect");
if (languageSelect) {
    languageSelect.value =
        localStorage.getItem("pipaLanguage") || "ru";
}

if (soundSelect) {
    soundSelect.value =
        localStorage.getItem("pipaSound") || "on";
}

if (settingsButton && settingsModal) {
    settingsButton.addEventListener("click", () => {
        settingsModal.style.display = "flex";
    });
}

if (closeSettings && settingsModal) {
    closeSettings.addEventListener("click", () => {
        settingsModal.style.display = "none";
    });
}

if (applySettings) {
    applySettings.addEventListener("click", () => {
        localStorage.setItem("pipaLanguage", languageSelect.value);
        localStorage.setItem("pipaSound", soundSelect.value);
       soundEnabled = soundSelect.value === "on";
        settingsModal.style.display = "none";
    });
}
/* =========================
   ПЕРЕВОД ИНТЕРФЕЙСА
========================= */

function changeLanguage(lang) {
    currentLanguage = lang;

    const translations = {
        ru: {
            aboutTitle: "О Пипе 🦜",
            aboutText: "Пипа - волнистый попугайчик и главная героиня этой игры. Она любит чумизу, свой стенд и фрукты. Именно Пипа вдохновила меня создать этот кликер!",
            reset: "Сбросить клики",
            stats: "Статистика",
            background: "Сменить фон",
            title: "ПИПА КЛИКЕР",
            subtitle: "КЛИКАЙ НА ПИПУ",
            record: "Рекорд:",
            feed: "🌾 Покормить Пипу",
            promoPlaceholder: "Промокод",
            promoActivate: "Активировать",
            settingsTitle: "⚙️ Настройки",
            language: "Язык:",
            sound: "Звук:",
            soundOn: "Включён",
            soundOff: "Выключен",
            apply: "Применить",
            close: "Закрыть",
            queenTitle: "👑 КОРОЛЕВА ПИПА ПОЗДРАВЛЯЕТ ТЕБЯ!",
            queenText: "🎉 Ты набрал 10 000 общих кликов!"
        },
        en: {
            aboutTitle: "About Pipa 🦜",
            aboutText: "Pipa is a budgie and the main character of this game. She loves millet, her stand and fruit. Pipa inspired me to create this clicker!",
            reset: "Reset clicks",
            stats: "Statistics",
            background: "Change background",
            title: "PIPA CLICKER",
            subtitle: "CLICK ON PIPA",
            record: "Record:",
            feed: "🌾 Feed Pipa",
            promoPlaceholder: "Promo code",
            promoActivate: "Activate",
            settingsTitle: "⚙️ Settings",
            language: "Language:",
            sound: "Sound:",
            soundOn: "On",
            soundOff: "Off",
            apply: "Apply",
            close: "Close",
            queenTitle: "👑 QUEEN PIPA CONGRATULATES YOU!",
            queenText: "🎉 You reached 10,000 total clicks!"
        }
    };

    const t = translations[lang] || translations.ru;

    document.getElementById("aboutTitle").textContent = t.aboutTitle;
    document.getElementById("aboutText").textContent = t.aboutText;
    document.getElementById("resetButton").textContent = t.reset;
    document.querySelector(".stats-button span").textContent = t.stats;
    document.getElementById("backgroundButton").textContent = t.background;
    document.getElementById("mainTitle").textContent = t.title;
    document.getElementById("mainSubtitle").textContent = t.subtitle;
    document.getElementById("recordLabel").textContent = t.record;
    document.getElementById("feedButton").textContent = t.feed;
    document.getElementById("promoInput").placeholder = t.promoPlaceholder;
    document.getElementById("promoActivate").textContent = t.promoActivate;
    document.getElementById("settingsTitle").textContent = t.settingsTitle;
    document.getElementById("languageLabel").textContent = t.language;
    document.getElementById("soundLabel").textContent = t.sound;
    document.getElementById("soundOn").textContent = t.soundOn;
    document.getElementById("soundOff").textContent = t.soundOff;
    document.getElementById("applySettings").textContent = t.apply;
    document.getElementById("closeSettings").textContent = t.close;
    document.getElementById("queenTitle").textContent = t.queenTitle;
    document.getElementById("queenText").textContent = t.queenText;

    if (rankElement) {
        updateRank();
    }
}

changeLanguage(currentLanguage);
