

let demoMode = false;


function goToLevel(levelIndex, step = 0) {
    clearInterval(timer);

    demoMode = true;          // включаем демо-режим
    currentLevelIdx = levelIndex;
    subLevelStep = step;
    scoreText.textContent = score; // счёт не трогаем

    startLevel();
}


const levelConfigs = [
    { type: 'match', instructions: "Найди квадрат, совпадающий с образцом.", time: 40 },
    { type: 'hunt', instructions: "Уничтожай квадраты нужного цвета ДВОЙНЫМ кликом!", time: 30 },
    { type: 'sort', instructions: "Перетащи квадрат нужного цвета в ЗОНУ ЗАХВАТА.", time: 45 }
];

const COLORS = ['#ff595e', '#1982c4', '#6a4c93', '#8ac926'];
let currentLevelIdx = 0, subLevelStep = 0, score = 0, timer, currentTarget = null;
let playerName = localStorage.getItem('playerName') || 'Гость';
let baseDifficulty = parseInt(localStorage.getItem('secretLevel') || 0);

const grid = document.getElementById('grid'), sampleEl = document.getElementById('sample');
const timerText = document.getElementById('timer'), scoreText = document.getElementById('score'), levelText = document.getElementById('level');

window.onload = () => {
    // единый обработчик всех клавиш
    window.addEventListener('keydown', (e) => {
        const key = e.key.toLowerCase();

        if (key === 'y' || key === 'н') {
            nextStep();
            return;
        }

        if (!demoMode && e.key === 'F9') {
            demoMode = true;
            alert("Демо-режим включён");
            return;
        }

        if (demoMode) {
            if (key === '1') goToLevel(0);
            if (key === '2') goToLevel(1);
            if (key === '3') goToLevel(2);

            if (key === 'q') goToLevel(currentLevelIdx, 0);
            if (key === 'w') goToLevel(currentLevelIdx, 1);
            if (key === 'e') goToLevel(currentLevelIdx, 2);
        }
    });
    startLevel();
};

function startLevel() {
    const config = levelConfigs[currentLevelIdx];
    levelText.textContent = `${currentLevelIdx + 1} (Шаг ${subLevelStep + 1}/3)`;
    grid.innerHTML = ''; sampleEl.innerHTML = ''; currentTarget = null;
    
    document.getElementById('q-text')?.remove();
    document.querySelector('.game-wrapper').insertAdjacentHTML('afterbegin', `<h3 id="q-text" style="margin-bottom:20px; color: #71557A;">${config.instructions}</h3>`);
    
    const adjustedTime = config.time - (baseDifficulty * 5);
    if (config.type === 'match') renderMatchLevel();
    else if (config.type === 'hunt') renderHuntLevel();
    else if (config.type === 'sort') renderSortLevel();
    startTimer(adjustedTime);
}

function renderMatchLevel() {
    grid.className = 'grid-container';
    const size = 2 + baseDifficulty; 
    const baseMatrix = generateMatrix(size, 3);
    const correctIdx = Math.floor(Math.random() * 8);
    
    renderSquare(sampleEl, baseMatrix, true);

    for (let i = 0; i < 8; i++) {
        const sq = document.createElement('div');
        sq.className = 'square';
        const isCorrect = i === correctIdx;
        renderSquare(sq, isCorrect ? baseMatrix : generateMatrix(size, 3), false);
        if (isCorrect) currentTarget = sq;
        sq.onclick = () => isCorrect ? nextStep() : penalty();
        grid.appendChild(sq);
    }
}

function renderHuntLevel() {
    grid.className = 'hunt-area';

    const targetColor = COLORS[Math.floor(Math.random() * COLORS.length)];
    sampleEl.innerHTML = `
        <div class="sample-content">
            <div class="sample-color-box" style="background:${targetColor}"></div>
            <div class="sample-label">ЦЕЛЬ</div>
        </div>
    `;

    let enemyCount;
    let speedMin;
    let speedMax;

    if (baseDifficulty === 0) {
        enemyCount = 4;
        speedMin = 0.1;
        speedMax = 0.3;
    }
    else if (baseDifficulty === 1) {
        enemyCount = 5;
        speedMin = 0.3;
        speedMax = 0.5;
    }
    else {
        enemyCount = 6;
        speedMin = 0.6;
        speedMax = 0.9;
    }

    let targetsLeft = Math.floor(enemyCount * 0.6);

    for (let i = 0; i < enemyCount; i++) {
        const sq = document.createElement('div');
        sq.className = 'square floating-sq';

        const isTarget = i < targetsLeft;
        const color = isTarget ? targetColor : COLORS.find(c => c !== targetColor);

        sq.style.background = color;
        sq.style.position = 'absolute';

        // стартовая позиция
        sq.style.left = Math.random() * 80 + '%';
        sq.style.top = Math.random() * 60 + '%';

        // движение: случайные скорости
        let x = parseFloat(sq.style.left);
        let y = parseFloat(sq.style.top);

        let dx = (Math.random() - 0.5) * (speedMax - speedMin) + speedMin;
        let dy = (Math.random() - 0.5) * (speedMax - speedMin) + speedMin;

        // анимация
        function move() {
            x += dx;
            y += dy;

            // отскок от границ
            if (x < 0 || x > 90) dx *= -1;
            if (y < 0 || y > 70) dy *= -1;

            sq.style.left = x + '%';
            sq.style.top = y + '%';

            sq._anim = requestAnimationFrame(move);
        }
        move();

        sq.addEventListener('dblclick', () => {
            if (color === targetColor) {
                cancelAnimationFrame(sq._anim);
                sq.remove();

                targetsLeft--;
                if (targetsLeft <= 0) nextStep();
            } else {
                penalty();
            }
        });

        grid.appendChild(sq);
    }
}

function renderSortLevel() {
    grid.className = 'sort-container';

    const targetColor = COLORS[Math.floor(Math.random() * COLORS.length)];
    sampleEl.innerHTML = `
        <div class="sample-content">
            <div class="sample-color-box" style="background:${targetColor}"></div>
            <div class="sample-label">НУЖНЫЙ ЦВЕТ</div>
        </div>
    `;

    const zone = document.createElement('div');
    zone.id = 'drop-zone';
    zone.innerHTML = `<span class="zone-label">ЗОНА ЗАХВАТА</span>`;
    grid.appendChild(zone);

    const itemsRow = document.createElement('div');
    itemsRow.className = 'draggable-items-row';
    grid.appendChild(itemsRow);

    let minTargets, maxTargets;

    if (baseDifficulty === 0) {
        minTargets = 1;
        maxTargets = 2;
    } else if (baseDifficulty === 1) {
        minTargets = 3;
        maxTargets = 4;
    } else {
        minTargets = 5;
        maxTargets = 6;
    }

    let targetsToFind =
        Math.floor(Math.random() * (maxTargets - minTargets + 1)) + minTargets;

    // СЛУЧАЙНЫЕ ИНДЕКСЫ ПРАВИЛЬНЫХ
    const totalItems = 12;
    const correctIndexes = new Set();

    while (correctIndexes.size < targetsToFind) {
        correctIndexes.add(Math.floor(Math.random() * totalItems));
    }

    for (let i = 0; i < totalItems; i++) {
        const isCorrect = correctIndexes.has(i);
        const color = isCorrect
            ? targetColor
            : COLORS.find(c => c !== targetColor);

        const item = document.createElement('div');
        item.className = 'square draggable-item';
        item.style.background = color;
        item.draggable = true;

        if (isCorrect && !currentTarget) currentTarget = item;

        item.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('color', color);
            item.classList.add('dragging');
        });

        item.addEventListener('dragend', () => {
            item.classList.remove('dragging');
        });

        itemsRow.appendChild(item);
    }

    zone.addEventListener('dragover', (e) => {
        e.preventDefault();
        zone.classList.add('zone-active');
    });

    zone.addEventListener('dragleave', () => {
        zone.classList.remove('zone-active');
    });

    zone.addEventListener('drop', (e) => {
        e.preventDefault();
        zone.classList.remove('zone-active');

        if (e.dataTransfer.getData('color') === targetColor) {
            document.querySelector('.dragging')?.remove();
            targetsToFind--;

            if (targetsToFind <= 0) {
                nextStep();
            }
        } else {
            penalty();
        }
    });
}

function renderSquare(container, matrix, isSample) {
    container.innerHTML = '';
    const target = isSample ? document.createElement('div') : container;
    if (isSample) {
        const wrap = document.createElement('div');
        wrap.className = 'sample-content';
        target.className = 'sample-matrix-box';
        wrap.appendChild(target);
        wrap.insertAdjacentHTML('beforeend', '<div class="sample-label">ОБРАЗЕЦ</div>');
        container.appendChild(wrap);
    }
    target.style.display = 'grid';
    target.style.gridTemplateColumns = `repeat(${matrix.length}, 1fr)`;
    matrix.flat().forEach(c => {
        const cell = document.createElement('div');
        cell.style.background = c;
        cell.className = 'cell';
        target.appendChild(cell);
    });
}

function useHint() { score -= 150; scoreText.textContent = score; if (currentTarget) { currentTarget.classList.add('hint-highlight'); setTimeout(() => currentTarget.classList.remove('hint-highlight'), 1500); } }
function nextStep() { score += (100*(baseDifficulty+1)); scoreText.textContent = score; subLevelStep++; if(subLevelStep>=3){ subLevelStep=0; currentLevelIdx++; } if(currentLevelIdx>=levelConfigs.length) endGame(true); else startLevel(); }

//function penalty() { score -= 50; scoreText.textContent = score; grid.classList.add('shake'); setTimeout(() => grid.classList.remove('shake'), 500); }

function penalty() {

    score -= 50;
    scoreText.textContent = score;


    grid.classList.add('shake');
    setTimeout(() => grid.classList.remove('shake'), 500);


    setTimeout(() => {
        alert("Ошибка! Шаг начинается заново.");
        startLevel(); // перезапуск текущего шага/уровня
    }, 200);
}

function startTimer(s) { clearInterval(timer); let t = s; timerText.textContent = t; timer = setInterval(() => { t--; timerText.textContent = t; if(t<=0) endGame(false); }, 1000); }
function endGame(w) {
    clearInterval(timer);

    if (demoMode) {
        alert("Демо-режим: переход по таймеру отключён");
        return;
    }

    alert(w ? "Победа!" : "Время вышло!");
    const r = JSON.parse(localStorage.getItem('ratings') || '[]');
    r.push({ name: playerName, score: score, date: new Date().toLocaleDateString() });
    localStorage.setItem('ratings', JSON.stringify(r));
    window.location.href = 'rating.html';
}

function generateMatrix(s, c) { return Array.from({ length: s }, () => Array.from({ length: s }, () => COLORS[Math.floor(Math.random() * c)])); }