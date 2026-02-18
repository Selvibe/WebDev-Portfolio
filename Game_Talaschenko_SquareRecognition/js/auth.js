// Получаем все кнопки выбора уровня
const levelButtons = document.querySelectorAll(".level-btn");

// Добавляем обработчик клика на каждую кнопку
levelButtons.forEach(button => {
    button.addEventListener("click", () => {
        const nameInput = document.getElementById("playerName");
        const name = nameInput.value.trim(); // получаем имя и убираем лишние пробелы

        // Проверка: если имя пустое, показываем предупреждение
        if (!name) {
            alert("Введите имя");
            return;
        }

        // Получаем уровень из data-атрибута кнопки
        const level = parseInt(button.dataset.level); 

        // Сохраняем имя и уровень игрока в localStorage
        localStorage.setItem("playerName", name);
        localStorage.setItem("secretLevel", level);

        // Переходим на страницу игры
        window.location.href = "pages/game.html";
    });

});
document.getElementById('toggleTheme')?.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    const isDark = document.body.classList.contains('dark-theme');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// При загрузке проверять тему
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-theme');
}