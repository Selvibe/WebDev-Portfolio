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

const downloadBtn = document.getElementById("downloadBtn");
downloadBtn.onclick = () => {
    let textToFile = "РЕЙТИНГ ИГРОКОВ\n";

    ratings.forEach((item, index) => {
        textToFile += `${index + 1}. ${item.name} — ${item.score} очков\n`;
    });

    // виртуальный файл в памяти браузера
    const blob = new Blob([textToFile], { type: "text/plain" });
    
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "rating.txt"; // Имя файла, который скачается

    link.click();

    URL.revokeObjectURL(link.href);
};