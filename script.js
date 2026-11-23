
/* =========================
   ОСНОВНОЙ КЛИКЕР
========================= */

const scoreElement = document.getElementById("score");
const recordElement = document.getElementById("record");

if (scoreElement && recordElement) {
    let clicks = Number(localStorage.getItem("clicks")) || 0;
    let record = Number(localStorage.getItem("record")) || 0;
    let totalClicks = Number(localStorage.getItem("totalClicks")) || 0;
   // ПОЗДРАВЛЕНИЕ КОРОЛЕВЫ

function checkQueenReward() {
    if (
        totalClicks >= 10000 &&
        !localStorage.getItem("queenRewardUsed")
    ) {
        localStorage.setItem("queenRewardUsed", "yes");

      const modal = document.getElementById("queenModal");
const video = document.getElementById("queenVideo");

if (modal) {
    localStorage.setItem("queenRewardUsed", "yes");

            if (video) {
                video.play().catch(() => {});
            }
        }
    }
}

window.closeQueenModal = function() {
    const modal = document.getElementById("queenModal");
    const video = document.getElementById("queenVideo");

    modal.style.display = "none";

    if (video) {
        video.pause();
        video.currentTime = 0;
    }
};

// Проверка при запуске
checkQueenReward();
    let currentRank = "";

    const rankElement = document.getElementById("rank");

    const ranks = [
        { clicks: 100000, title: "💎 Правая лапа Пипы" },
        { clicks: 10000, title: "🧹 Прислуга Пипы" },
        { clicks: 5000, title: "⭐ Легенда Пипы" },
        { clicks: 1000, title: "👑 Поклонник Королевы" },
        { clicks: 500, title: "🍎 Поставщик вкусняшек" },
        { clicks: 100, title: "🌾 Любитель чумизы" },
        { clicks: 1, title: "🐥 Знакомый Пипы" }
    ];

    // Звания
    function updateRank() {
        const rank = ranks.find(rank => totalClicks >= rank.clicks);
        const newRank = rank ? rank.title : "🐣 Новичок";

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

    // Звук
    const clickSound = new Audio("pipa_chirp (1)-[AudioTrimmer.com].mp3");
    let soundEnabled = true;

    window.toggleSound = function() {
        soundEnabled = !soundEnabled;

        const soundButton = document.getElementById("soundButton");

        if (soundButton) {
            soundButton.textContent =
                soundEnabled ? "Звук: Вкл." : "Звук: Выкл.";
        }
    };

    // Клик по Пипе
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

    // Сброс кликов
    window.resetClicks = function() {
        clicks = 0;

        localStorage.setItem("clicks", clicks);
        scoreElement.textContent = clicks;
    };

    // Смена фона
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

    window.activatePromo = function() {
        const input = document.getElementById("promoInput");
        const message = document.getElementById("promoMessage");

        if (!input || !message) return;

        const code = input.value.trim().toUpperCase();

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
            }
        };

        // Проверка промокода
        if (!promoCodes[code]) {
            message.textContent = "❌ Неверный промокод!";
            return;
        }

        // Проверка повторного использования
        const storageKey = "promo_" + code;

        if (localStorage.getItem(storageKey)) {
            message.textContent = "❌ Промокод уже использован!";
            return;
        }

        // Начисление кликов
        const bonus = promoCodes[code].clicks;

        clicks += bonus;
        totalClicks += bonus;

        localStorage.setItem("clicks", clicks);
        localStorage.setItem("totalClicks", totalClicks);
        localStorage.setItem(storageKey, "used");
       checkQueenReward();
        // Обновление рекорда
        if (clicks > record) {
            record = clicks;
            localStorage.setItem("record", record);
        }

        // Обновление интерфейса
        scoreElement.textContent = clicks;
        recordElement.textContent = record;

        updateRank();

        message.textContent = promoCodes[code].message;
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
