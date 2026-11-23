let clicks = Number(localStorage.getItem("clicks")) || 0;
let record = Number(localStorage.getItem("record")) || 0;
document.getElementById("record").innerText = record;
document.getElementById("score").innerText=clicks;
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
    if (clicks > record) {
        record = clicks;
        localStorage.setItem("record", record);
        document.getElementById("record").innerText = record;
    }
    localStorage.setItem("clicks", clicks);
    document.getElementById("score").innerText = clicks;

    let plus = document.createElement("span");
    plus.className = "plus-one";
    plus.textContent = "+1";

    document.querySelector(".game > button").appendChild(plus);

    setTimeout(() => {
        plus.remove();
    }, 700);
}
function resetClicks() {
    clicks=0;
    localStorage.setItem("clicks", clicks);
    document.getElementById("score").innerText=clicks;
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

const miniArea = document.getElementById("miniGameArea");

if (miniArea) {
    const miniPipa = document.getElementById("miniPipa");
    const miniScoreText = document.getElementById("miniScore");
    const startMiniButton = document.getElementById("startMiniGame");

    let miniScore = 0;
    let miniRunning = false;

    // Движение Пипы за мышкой или пальцем
    function movePipa(event) {
        if (!miniRunning) return;

        const rect = miniArea.getBoundingClientRect();
        const x = event.clientX - rect.left;

        const halfPipa = miniPipa.offsetWidth / 2;
        const safeX = Math.max(halfPipa, Math.min(rect.width - halfPipa, x));

        miniPipa.style.left = safeX + "px";
    }

    miniArea.addEventListener("pointermove", movePipa);

    // Создание зерна
    function createGrain() {
        if (!miniRunning) return;

        const grain = document.createElement("div");
        grain.textContent = "🌾";
        grain.style.position = "absolute";
        grain.style.top = "0px";
        grain.style.left = Math.random() * 90 + "%";
        grain.style.fontSize = "25px";

        miniArea.appendChild(grain);

        let y = 0;

        const fall = setInterval(() => {
            if (!miniRunning) {
                clearInterval(fall);
                grain.remove();
                return;
            }

            y += 3;
            grain.style.top = y + "px";

            const grainRect = grain.getBoundingClientRect();
            const pipaRect = miniPipa.getBoundingClientRect();

            if (
                grainRect.bottom >= pipaRect.top &&
                grainRect.top <= pipaRect.bottom &&
                grainRect.right >= pipaRect.left &&
                grainRect.left <= pipaRect.right
            ) {
                miniScore++;
                miniScoreText.textContent = miniScore;
                grain.remove();
                clearInterval(fall);
            }

            if (y > miniArea.clientHeight) {
                grain.remove();
                clearInterval(fall);
            }
        }, 20);
    }

    // Начало игры
    startMiniButton.addEventListener("click", () => {
        if (miniRunning) return;

        miniScore = 0;
        miniScoreText.textContent = miniScore;
        miniRunning = true;
        startMiniButton.textContent = "Игра идёт!";

        const spawnTimer = setInterval(() => {
            if (!miniRunning) {
                clearInterval(spawnTimer);
                return;
            }

            createGrain();
        }, 1000);

        // Остановка через 30 секунд
        setTimeout(() => {
            miniRunning = false;
            startMiniButton.textContent = "Играть ещё раз";
            alert("Игра окончена! Пипа поймала зёрен: " + miniScore);
        }, 30000);
    });
}
