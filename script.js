let clicks = Number(localStorage.getItem("clicks")) || 0;
document.getElementById("score").innerText=clicks;
function clickButton() {
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
