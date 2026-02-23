const list = document.getElementById("list");

// Загружаем рейтинг из localStorage
let ratings = JSON.parse(localStorage.getItem("ratings") || "[]");

// Сортировка по убыванию очков
ratings.sort((a, b) => b.score - a.score);

// Если рейтинг пуст, выводим сообщение
if (ratings.length === 0) {
    list.innerHTML = '<li>Рейтинг пуст</li>';
} else {
    ratings.forEach((item, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <strong>${index + 1}.</strong>
            ${item.name}
            <span>${item.score}</span>
        `;
        list.appendChild(li);
    });
}

// Находим кнопку
const downloadBtn = document.getElementById("downloadBtn");

// Вешаем на неё событие при клике
downloadBtn.onclick = () => {
    // 1. Формируем текст, который будет внутри файла
    let textToFile = "РЕЙТИНГ ИГРОКОВ\n";
    textToFile += "====================\n";

    ratings.forEach((item, index) => {
        textToFile += `${index + 1}. ${item.name} — ${item.score} очков\n`;
    });

    // 2. Создаем "виртуальный файл" в памяти браузера
    const blob = new Blob([textToFile], { type: "text/plain" });
    
    // 3. Создаем временную ссылку для скачивания
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "rating.txt"; // Имя файла, который скачается
    
    // 4. Имитируем нажатие на ссылку, чтобы файл скачался
    link.click();
    
    // Удаляем ссылку из памяти
    URL.revokeObjectURL(link.href);
};