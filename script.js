/* =========================
   ОСНОВНОЙ КЛИКЕР
========================= */

const scoreElement = document.getElementById("score");
const recordElement = document.getElementById("record");

if (scoreElement && recordElement) {
    let clicks = Number(localStorage.getItem("clicks")) || 0;
    let record = Number(localStorage.getItem("record")) || 0;
   let totalClicks = Number(localStorage.getItem("totalClicks")) || 0;
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

function updateRank() {
    const rank = ranks.find(rank => totalClicks >= rank.clicks);

    const newRank = rank
        ? rank.title
        : "🐣 Новичок";

    if (currentRank !== "" && currentRank !== newRank) {
        alert("🎉 Новое звание!\n" + newRank);
    }

    currentRank = newRank;
    rankElement.textContent = newRank;
}
updateRank();
    scoreElement.innerText = clicks;
    recordElement.innerText = record;

    let clickSound = new Audio("pipa_chirp (1)-[AudioTrimmer.com].mp3");
    let soundEnabled = true;

    function toggleSound() {
        soundEnabled = !soundEnabled;

        document.getElementById("soundButton").innerText =
            soundEnabled ? "Звук: Вкл." : "Звук: Выкл.";
    }

    function clickButton() {
        if (soundEnabled) {
            let sound = clickSound.cloneNode();
            sound.play();
        }

        clicks++;
       totalClicks++;
       localStorage.setItem("totalClicks", totalClicks);
       updateRank();

        if (clicks > record) {
            record = clicks;
            localStorage.setItem("record", record);
            recordElement.innerText = record;
        }

        localStorage.setItem("clicks", clicks);
        scoreElement.innerText = clicks;

        let plus = document.createElement("span");
        plus.className = "plus-one";
        plus.textContent = "+1";

        document.querySelector(".game > button").appendChild(plus);

        setTimeout(() => plus.remove(), 700);
    }

    function resetClicks() {
        clicks = 0;
        localStorage.setItem("clicks", clicks);
        scoreElement.innerText = clicks;
    }

    let backgrounds = ["blue", "white", "purple"];
    let currentBackground = 0;

    function changeBackground() {
        currentBackground++;

        if (currentBackground >= backgrounds.length) {
            currentBackground = 0;
        }

        document.body.className = backgrounds[currentBackground];
    }
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

