const levelButtons = document.querySelectorAll(".level-btn");

levelButtons.forEach(button => {
    button.addEventListener("click", () => {
        const nameInput = document.getElementById("playerName");
        const name = nameInput.value.trim();

        if (!name) {
            alert("Введите имя");
            return;
        }

        const level = parseInt(button.dataset.level) - 1; // <<< FIX

        localStorage.setItem("playerName", name);
        localStorage.setItem("secretLevel", level);

        window.location.href = "pages/game.html";
    });
});
