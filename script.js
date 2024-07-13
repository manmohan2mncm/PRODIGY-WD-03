let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;
let isHumanVsAI = false;
const statusDisplay = document.querySelector('#status');
const aiPlayer = 'O';
const humanPlayer = 'X';

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function handleCellPlayed(clickedCell, clickedCellIndex) {
    board[clickedCellIndex] = currentPlayer;
    clickedCell.innerHTML = currentPlayer;
}

function handlePlayerChange() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    if (isHumanVsAI && currentPlayer === aiPlayer) {
        statusDisplay.innerHTML = `AI's turn`;
        setTimeout(handleAIMove, 500);
    } else {
        statusDisplay.innerHTML = `It's ${currentPlayer}'s turn`;
    }
}

function handleResultValidation() {
    let roundWon = false;
    for (let i = 0; i <= 7; i++) {
        const winCondition = winningConditions[i];
        let a = board[winCondition[0]];
        let b = board[winCondition[1]];
        let c = board[winCondition[2]];
        if (a === '' || b === '' || c === '') {
            continue;
        }
        if (a === b && b === c) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        statusDisplay.innerHTML = `Player ${currentPlayer} has won!`;
        gameActive = false;
        return;
    }

    let roundDraw = !board.includes('');
    if (roundDraw) {
        statusDisplay.innerHTML = `Game ended in a draw!`;
        gameActive = false;
        return;
    }

    handlePlayerChange();
}

function handleCellClick(clickedCellEvent) {
    const clickedCell = clickedCellEvent.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

    if (board[clickedCellIndex] !== '' || !gameActive) {
        return;
    }

    handleCellPlayed(clickedCell, clickedCellIndex);
    handleResultValidation();
}

function handleAIMove() {
    if (!gameActive) return;

    let availableCells = board.map((cell, index) => cell === '' ? index : null).filter(index => index !== null);
    if (availableCells.length === 0) return;

    const chosenCellIndex = availableCells[Math.floor(Math.random() * availableCells.length)];
    const chosenCell = document.querySelector(`.cell[data-index='${chosenCellIndex}']`);

    handleCellPlayed(chosenCell, chosenCellIndex);
    handleResultValidation();
}

function handleRestartGame() {
    gameActive = true;
    currentPlayer = humanPlayer;
    board = ['', '', '', '', '', '', '', '', ''];
    statusDisplay.innerHTML = `It's ${currentPlayer}'s turn`;
    document.querySelectorAll('.cell').forEach(cell => cell.innerHTML = '');
}

function handleModeSelection(event) {
    const mode = event.target.id;
    if (mode === 'human-vs-human') {
        isHumanVsAI = false;
    } else if (mode === 'human-vs-ai') {
        isHumanVsAI = true;
    }
    handleRestartGame();
}

document.querySelectorAll('.cell').forEach(cell => cell.addEventListener('click', handleCellClick));
document.querySelector('#reset').addEventListener('click', handleRestartGame);
document.querySelector('#human-vs-human').addEventListener('click', handleModeSelection);
document.querySelector('#human-vs-ai').addEventListener('click', handleModeSelection);

statusDisplay.innerHTML = `Select a game mode to start`;
