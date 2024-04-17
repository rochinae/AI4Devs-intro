const levelConfig = {
    beginner: { height: 9, width: 9, mines: 10 },
    intermediate: { height: 16, width: 16, mines: 40 },
    expert: { height: 16, width: 30, mines: 99 }
};

let board = [];
let currentLevel = 'beginner';

function createBoard() {
    const { height, width, mines } = levelConfig[currentLevel];
    board = [];
    for (let i = 0; i < height; i++) {
        board[i] = [];
        for (let j = 0; j < width; j++) {
            board[i][j] = {
                isMine: false,
                revealed: false,
                flagged: false,
                neighborMines: 0
            };
        }
    }
    // Add mines
    let minesPlaced = 0;
    while (minesPlaced < mines) {
        let x = Math.floor(Math.random() * height);
        let y = Math.floor(Math.random() * width);
        if (!board[x][y].isMine) {
            board[x][y].isMine = true;
            minesPlaced++;
        }
    }
    // Calculate neighbor mines
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            if (!board[i][j].isMine) {
                board[i][j].neighborMines = countNeighborMines(i, j);
            }
        }
    }
}

function countNeighborMines(x, y) {
    const { height, width } = levelConfig[currentLevel];
    let count = 0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            const newX = x + i;
            const newY = y + j;
            if (newX >= 0 && newX < height && newY >= 0 && newY < width) {
                if (board[newX][newY].isMine) {
                    count++;
                }
            }
        }
    }
    return count;
}

function revealCell(x, y) {
    const { height, width } = levelConfig[currentLevel];
    if (x < 0 || x >= height || y < 0 || y >= width || board[x][y].revealed) {
        return;
    }
    board[x][y].revealed = true;
    const cell = document.getElementById(`cell-${x}-${y}`);
    cell.classList.add('revealed');
    if (board[x][y].isMine) {
        cell.classList.add('bomb');
        alert('Game Over! You hit a mine!');
    } else {
        cell.textContent = board[x][y].neighborMines || '';
        if (board[x][y].neighborMines === 0) {
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    revealCell(x + i, y + j);
                }
            }
        }
    }
}

function flagCell(x, y) {
    const cell = document.getElementById(`cell-${x}-${y}`);
    if (cell.classList.contains('flagged')) {
        cell.classList.remove('flagged');
        board[x][y].flagged = false;
    } else {
        cell.classList.add('flagged');
        board[x][y].flagged = true;
    }
}

function initGame() {
    createBoard();
    const boardContainer = document.querySelector('.board');
    boardContainer.innerHTML = '';
    const { height, width } = levelConfig[currentLevel];
    boardContainer.classList.remove('level-beginner', 'level-intermediate', 'level-expert');
    boardContainer.classList.add(`level-${currentLevel}`);
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.id = `cell-${i}-${j}`;
            cell.addEventListener('click', () => revealCell(i, j));
            cell.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                flagCell(i, j);
            });
            boardContainer.appendChild(cell);
        }
    }
}

function restartGame() {
    createBoard();
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('revealed', 'bomb', 'flagged');
    });
}

document.getElementById('level-select').addEventListener('change', (event) => {
    currentLevel = event.target.value;
    restartGame();
});

document.getElementById('restart-btn').addEventListener('click', restartGame);

initGame();