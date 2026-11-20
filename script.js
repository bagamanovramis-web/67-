let clicks = 0;

function clickButton() {
    clicks++;

    document.getElementById("score").innerText = clicks;

    let plus = document.createElement("span");
    plus.className = "plus-one";
    plus.textContent = "+1";

    document.querySelector("button").appendChild(plus);

    setTimeout(() => {
        plus.remove();
    }, 700);
}
