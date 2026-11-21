let clicks = Number(localStorage.getItem("clicks")) || 0;
document.getElementById("score").innerText=clicks;
let clickSound = new Audio("pipa_chirp (1).mp3");
function clickButton() {
    clickSound.currentTime = 0;
    clickSound.play();
    clicks++;
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
