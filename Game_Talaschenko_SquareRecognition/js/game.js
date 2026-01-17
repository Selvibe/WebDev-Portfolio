// Настройки уровней: размер поля, количество цветов, количество квадратов, время
const levels = [
    { size: 3, colors: 2, count: 6, time: 60 },
    { size: 4, colors: 3, count: 10, time: 50 },
    { size: 5, colors: 4, count: 16, time: 40 },
    { size: 6, colors: 4, count: 20, time: 35 }
];

let currentLevel = 0; // текущий уровень
let score = 0;        // очки игрока
let timer;            // таймер

// Получаем элементы DOM
const sampleEl = document.getElementById('sample');
const grid = document.getElementById('grid');
const levelText = document.getElementById('level');
const scoreText = document.getElementById('score');
const timerText = document.getElementById('timer');

// Получаем данные игрока из localStorage
const playerName = localStorage.getItem('playerName') || 'Игрок';
const storedLevel = localStorage.getItem('secretLevel');

// Если был сохранён уровень, устанавливаем его
if (storedLevel !== null) {
    const lvl = parseInt(storedLevel);
    if (!isNaN(lvl) && lvl >= 0 && lvl < levels.length) {
        currentLevel = lvl;
    }
}

// Цвета для квадратов
const COLORS = [
    '#A3C4F3', // голубой
    '#99c03f', // зелёный
    '#df6657', // розовый
    '#ffdc7b'  // жёлтый
];

// Получение случайного цвета
function randomColor(count) {
    return COLORS[Math.floor(Math.random() * count)];
}

// Функция поворота матрицы на 90 градусов по часовой стрелке
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
    const turns = Math.floor(Math.random() * 4); // число поворотов 0-3
    for (let i = 0; i < turns; i++) {
        result = rotateMatrix(result);
    }
    return { matrix: result, angle: turns * 90 }; // возвращаем угол для отображения
}

// Отображение квадрата на странице
function renderSquare(container, matrix, angle = 0) {
    container.innerHTML = '';
    container.style.display = 'grid';
    container.style.gridTemplateColumns = `repeat(${matrix.length}, 1fr)`;
    container.style.gridTemplateRows = `repeat(${matrix.length}, 1fr)`;
    container.style.transform = `rotate(${angle}deg)`; // поворот квадрата

    matrix.flat().forEach(color => {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.style.background = color;
        container.appendChild(cell);
    });
}

// Запуск уровня
function startLevel() {
    grid.innerHTML = '';
    const level = levels[currentLevel];
    levelText.textContent = currentLevel + 1;

    // создаём базовую матрицу для примера
    const baseMatrix = generateMatrix(level.size, level.colors);
    const rotatedSample = randomRotate(baseMatrix);
    renderSquare(sampleEl, rotatedSample.matrix, rotatedSample.angle);

    const correctIndex = Math.floor(Math.random() * level.count); // случайная "правильная" клетка

    // создаём квадраты для выбора
    for (let i = 0; i < level.count; i++) {
        const square = document.createElement('div');
        square.className = 'square';

        let matrix, angle;

        if (i === correctIndex) {
            const rotated = randomRotate(baseMatrix); // правильная копия
            matrix = rotated.matrix;
            angle = rotated.angle;
            square.dataset.correct = 'true'; // отмечаем как правильную
        } else {
            const wrong = generateMatrix(level.size, level.colors);
            const rotated = randomRotate(wrong); // случайный вариант
            matrix = rotated.matrix;
            angle = rotated.angle;
        }

        renderSquare(square, matrix, angle);
        square.addEventListener('click', () => checkSquare(square));
        grid.appendChild(square);
    }

    startTimer(level.time);
}

// Проверка выбранного квадрата
function checkSquare(square) {
    if (square.dataset.correct) {
        square.classList.add('correct');
        score += 100 * (currentLevel + 1);
        currentLevel++;
        if (currentLevel >= levels.length) {
            endGame(true);
        } else {
            startLevel();
        }
    } else {
        score -= 50; // штраф за ошибку
    }
    scoreText.textContent = score;
}

// Таймер уровня
function startTimer(seconds) {
    clearInterval(timer);
    let time = seconds;
    timerText.textContent = time;

    timer = setInterval(() => {
        time--;
        timerText.textContent = time;

        if (time <= 0) {
            clearInterval(timer);
            endGame(false); // время вышло
        }
    }, 1000);
}

// Завершение игры
function endGame(win) {
    clearInterval(timer);

    // сохраняем результаты в localStorage
    const results = JSON.parse(localStorage.getItem('ratings') || '[]');
    results.push({ name: playerName, score, date: new Date().toLocaleString() });
    localStorage.setItem('ratings', JSON.stringify(results));

    // возвращаем на главную страницу
    window.location.href = '../index.html';
}

// Запуск игры при загрузке страницы
window.onload = () => {
    startLevel();
};
