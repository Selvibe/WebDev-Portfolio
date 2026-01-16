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
