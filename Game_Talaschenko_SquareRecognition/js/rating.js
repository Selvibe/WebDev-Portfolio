const list = document.getElementById("list");
const newGameBtn = document.getElementById("newGame");

let ratings = JSON.parse(localStorage.getItem("ratings") || "[]");

ratings.sort((a, b) => b.score - a.score);

if (ratings.length === 0) {
    list.innerHTML = '<li>Рейтинг пуст</li>';
} else {
    ratings.forEach(player => {
        const li = document.createElement("li");
        li.textContent = `${player.name} — ${player.score} баллов (${player.date})`;
        list.appendChild(li);
    });
}

newGameBtn.addEventListener("click", () => {
    localStorage.removeItem("ratings");
    localStorage.removeItem("playerName");
    localStorage.removeItem("secretLevel");
    window.location.href = "../index.html";
});
