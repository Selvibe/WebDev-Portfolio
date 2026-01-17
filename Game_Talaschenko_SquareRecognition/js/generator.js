// Цвета для генерации матрицы
const COLORS = ['#ff595e', '#1982c4', '#6a4c93', '#8ac926'];

// Получение случайного цвета
function randomColor(count) {
    return COLORS[Math.floor(Math.random() * count)];
}

// Поворот матрицы на 90 градусов
function rotateMatrix(matrix) {
    const size = matrix.length;
    const rotated = [];

    for (let x = 0; x < size; x++) {
        rotated[x] = [];
        for (let y = size - 1; y >= 0; y--) {
            rotated[x].push(matrix[y][x]);
        }
    }
    return rotated;
}

// Создание матрицы случайных цветов
function generateMatrix(size, colorsCount) {
    return Array.from({ length: size }, () =>
        Array.from({ length: size }, () => randomColor(colorsCount))
    );
}

// Случайное вращение матрицы
function randomRotate(matrix) {
    let result = matrix;
    const turns = Math.floor(Math.random() * 4);

    for (let i = 0; i < turns; i++) {
        result = rotateMatrix(result);
    }

    return { matrix: result, angle: turns * 90 };
}

// Отображение квадрата на странице
function renderSquare(container, matrix, angle = 0) {
    container.innerHTML = '';
    container.style.gridTemplateColumns = `repeat(${matrix.length}, 1fr)`;
    container.style.gridTemplateRows = `repeat(${matrix.length}, 1fr)`;
    container.style.transform = `rotate(${angle}deg)`;

    matrix.flat().forEach(color => {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.style.background = color;
        container.appendChild(cell);
    });
}

// ==========================
// Работа с рейтингом
// ==========================
const list = document.getElementById("list");

// Загружаем рейтинг из localStorage
let ratings = JSON.parse(localStorage.getItem("ratings") || "[]");

// Сортируем по убыванию очков
ratings.sort((a, b) => b.score - a.score);

// Если рейтинг пуст, показываем сообщение
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
