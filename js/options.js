const popularityRadio = document.getElementById("popularity");
const scoreRadio = document.getElementById("score");

const gameplayType = localStorage.getItem("gameplayType");

if (gameplayType === "popularity") {
    popularityRadio.checked = true;
} else {
    scoreRadio.checked = true;
}

function setGameplayType(type) {
    localStorage.setItem("gameplayType", type);
}

popularityRadio.addEventListener("click", () => {
    setGameplayType("popularity");
});
scoreRadio.addEventListener("click", () => {
    setGameplayType("averageScore");
});
