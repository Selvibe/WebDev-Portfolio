// ==========================
// Настройки уровней
// ==========================
const levels = [
    { size: 3, colors: 2, count: 6, time: 60 },
    { size: 4, colors: 3, count: 10, time: 50 },
    { size: 5, colors: 4, count: 16, time: 40 },
    { size: 6, colors: 4, count: 20, time: 35 }
];

let currentLevel = 0;
let score = 0;
let timer;

const sampleEl = document.getElementById('sample');
const grid = document.getElementById('grid');
const levelText = document.getElementById('level');
const scoreText = document.getElementById('score');
const timerText = document.getElementById('timer');

const playerName = localStorage.getItem('playerName') || 'Игрок';
const storedLevel = localStorage.getItem('secretLevel');

if (storedLevel !== null) {
    const lvl = parseInt(storedLevel);
    if (!isNaN(lvl) && lvl >= 0 && lvl < levels.length) {
        currentLevel = lvl;
    }
}


const COLORS = ['#ff595e', '#1982c4', '#6a4c93', '#8ac926'];

function randomColor(count) {
    return COLORS[Math.floor(Math.random() * count)];
}

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

function generateMatrix(size, colorsCount) {
    return Array.from({ length: size }, () =>
        Array.from({ length: size }, () => randomColor(colorsCount))
    );
}

function randomRotate(matrix) {
    let result = matrix;
    const turns = Math.floor(Math.random() * 4);
    for (let i = 0; i < turns; i++) {
        result = rotateMatrix(result);
    }
    return { matrix: result, angle: turns * 90 };
}

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

function startLevel() {
    grid.innerHTML = '';
    const level = levels[currentLevel];
    levelText.textContent = currentLevel + 1;

    const baseMatrix = generateMatrix(level.size, level.colors);
    const rotatedSample = randomRotate(baseMatrix);
    renderSquare(sampleEl, rotatedSample.matrix, rotatedSample.angle);

    const correctIndex = Math.floor(Math.random() * level.count);

    for (let i = 0; i < level.count; i++) {
        const square = document.createElement('div');
        square.className = 'square';

        let matrix, angle;

        if (i === correctIndex) {
            const rotated = randomRotate(baseMatrix);
            matrix = rotated.matrix;
            angle = rotated.angle;
            square.dataset.correct = 'true';
        } else {
            const wrong = generateMatrix(level.size, level.colors);
            const rotated = randomRotate(wrong);
            matrix = rotated.matrix;
            angle = rotated.angle;
        }

        renderSquare(square, matrix, angle);
        square.addEventListener('click', () => checkSquare(square));
        grid.appendChild(square);
    }

    startTimer(level.time);
}

function checkSquare(square) {
    if (square.dataset.correct) {
        score += 100 * (currentLevel + 1);
        currentLevel++;
        if (currentLevel >= levels.length) {
            endGame(true);
        } else {
            startLevel();
        }
    } else {
        score -= 50;
    }
    scoreText.textContent = score;
}

function startTimer(seconds) {
    clearInterval(timer);
    let time = seconds;
    timerText.textContent = time;

    timer = setInterval(() => {
        time--;
        timerText.textContent = time;

        if (time <= 0) {
            clearInterval(timer);
            endGame(false);
        }
    }, 1000);
}


function endGame(win) {
    clearInterval(timer);
    const results = JSON.parse(localStorage.getItem('ratings') || '[]');
    results.push({ name: playerName, score, date: new Date().toLocaleString() });
    localStorage.setItem('ratings', JSON.stringify(results));
    window.location.href = 'rating.html';
}

window.onload = () => {
    startLevel();
};

