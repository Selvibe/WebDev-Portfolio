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
