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
    window.addEventListener('keydown', (e) => {
        if (e.key.toLowerCase() === 'y' || e.key.toLowerCase() === 'н') nextStep();
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
    sampleEl.innerHTML = `<div class="sample-content"><div class="sample-color-box" style="background:${targetColor}"></div><div class="sample-label">ЦЕЛЬ</div></div>`;
    
    let targetsCount = 0;
    for (let i = 0; i < 10; i++) {
        const sq = document.createElement('div');
        sq.className = 'square floating-sq'; 
        const isTarget = Math.random() > 0.4 || i < 2; 
        const color = isTarget ? targetColor : COLORS.find(c => c !== targetColor);
        if (isTarget) { targetsCount++; if (!currentTarget) currentTarget = sq; }
        sq.style.background = color;
        sq.style.left = Math.random() * 85 + '%';
        sq.style.top = Math.random() * 60 + '%';
        sq.style.position = 'absolute';
        sq.addEventListener('dblclick', () => {
            if (color === targetColor) {
                sq.style.transform = 'scale(0)';
                setTimeout(() => { sq.remove(); targetsCount--; if (targetsCount <= 0) nextStep(); }, 200);
            } else { penalty(); }
        });
        grid.appendChild(sq);
    }
}

function renderSortLevel() {
    grid.className = 'sort-container'; 
    const targetColor = COLORS[Math.floor(Math.random() * COLORS.length)];
    sampleEl.innerHTML = `<div class="sample-content"><div class="sample-color-box" style="background:${targetColor}"></div><div class="sample-label">НУЖНЫЙ ЦВЕТ</div></div>`;
    
    const zone = document.createElement('div');
    zone.id = 'drop-zone';
    zone.innerHTML = `<span class="zone-label">ЗОНА ЗАХВАТА</span>`;
    grid.appendChild(zone);

    const itemsRow = document.createElement('div');
    itemsRow.className = 'draggable-items-row';
    grid.appendChild(itemsRow);

    for (let i = 0; i < 7; i++) {
        const isCorrect = (i === 0); 
        const color = isCorrect ? targetColor : COLORS.find(c => c !== targetColor) || COLORS[1];
        const item = document.createElement('div');
        item.className = 'square draggable-item';
        item.style.background = color;
        item.draggable = true;
        if (isCorrect && !currentTarget) currentTarget = item;
        item.addEventListener('dragstart', (e) => { e.dataTransfer.setData('color', color); item.classList.add('dragging'); });
        item.addEventListener('dragend', () => item.classList.remove('dragging'));
        itemsRow.appendChild(item);
    }

    zone.addEventListener('dragover', (e) => { e.preventDefault(); zone.classList.add('zone-active'); });
    zone.addEventListener('dragleave', () => zone.classList.remove('zone-active'));
    zone.addEventListener('drop', (e) => {
        e.preventDefault(); zone.classList.remove('zone-active');
        if (e.dataTransfer.getData('color') === targetColor) { document.querySelector('.dragging')?.remove(); nextStep(); }
        else { penalty(); }
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
function changeTheme(t) { document.body.classList.remove('theme-neon', 'theme-coffee'); if(t!=='default') document.body.classList.add('theme-'+t); }
function nextStep() { score += (100*(baseDifficulty+1)); scoreText.textContent = score; subLevelStep++; if(subLevelStep>=3){ subLevelStep=0; currentLevelIdx++; } if(currentLevelIdx>=levelConfigs.length) endGame(true); else startLevel(); }
function penalty() { score -= 50; scoreText.textContent = score; grid.classList.add('shake'); setTimeout(() => grid.classList.remove('shake'), 500); }
function startTimer(s) { clearInterval(timer); let t = s; timerText.textContent = t; timer = setInterval(() => { t--; timerText.textContent = t; if(t<=0) endGame(false); }, 1000); }
function endGame(w) { clearInterval(timer); alert(w ? "Победа!" : "Время вышло!"); const r = JSON.parse(localStorage.getItem('ratings') || '[]'); r.push({ name: playerName, score: score, date: new Date().toLocaleDateString() }); localStorage.setItem('ratings', JSON.stringify(r)); window.location.href = 'rating.html'; }
function generateMatrix(s, c) { return Array.from({ length: s }, () => Array.from({ length: s }, () => COLORS[Math.floor(Math.random() * c)])); }