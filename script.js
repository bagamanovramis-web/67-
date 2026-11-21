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

    document.querySelector("button").appendChild(plus);

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
