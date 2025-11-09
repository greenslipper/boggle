// Create the 4x4 board
function createBoard() {
    const board = document.getElementById('board');

    for (let i = 0; i < 16; i++) {
        const cell = document.createElement('input');
        cell.type = 'text';
        cell.className = 'cell';
        cell.maxLength = 2;
        cell.dataset.index = i;

        cell.addEventListener('input', handleInput);
        cell.addEventListener('keydown', handleKeydown);

        board.appendChild(cell);
    }
}

// Handle input in cells
function handleInput(e) {
    const cell = e.target;
    let value = cell.value.toUpperCase();

    // Replace Q with QU
    if (value === 'Q') {
        cell.value = 'QU';
    } else if (value.length > 0) {
        // Only allow letters
        value = value.replace(/[^A-Z]/g, '');

        // If Q is typed anywhere, replace with QU
        if (value.includes('Q')) {
            cell.value = 'QU';
        } else {
            // Only keep first letter if not QU
            cell.value = value.charAt(0);
        }
    }

    // Auto-advance to next cell if a letter was entered
    if (cell.value.length > 0) {
        const currentIndex = parseInt(cell.dataset.index);
        if (currentIndex < 15) {
            const nextCell = document.querySelector(`[data-index="${currentIndex + 1}"]`);
            if (nextCell) {
                nextCell.focus();
            }
        }
    }
}

// Handle keyboard navigation
function handleKeydown(e) {
    const currentIndex = parseInt(e.target.dataset.index);
    let targetIndex;

    switch(e.key) {
        case 'ArrowUp':
            e.preventDefault();
            targetIndex = currentIndex - 4;
            break;
        case 'ArrowDown':
            e.preventDefault();
            targetIndex = currentIndex + 4;
            break;
        case 'ArrowLeft':
            e.preventDefault();
            targetIndex = currentIndex - 1;
            break;
        case 'ArrowRight':
            e.preventDefault();
            targetIndex = currentIndex + 1;
            break;
        case 'Backspace':
            if (e.target.value === '') {
                e.preventDefault();
                targetIndex = currentIndex - 1;
            }
            break;
    }

    if (targetIndex !== undefined && targetIndex >= 0 && targetIndex < 16) {
        const targetCell = document.querySelector(`[data-index="${targetIndex}"]`);
        if (targetCell) {
            targetCell.focus();
        }
    }
}

// Randomize board with letters
function randomizeBoard() {
    // Official "New Boggle" dice configuration (16 dice, each with 6 sides)
    const boggleDice = [
        ['A', 'A', 'E', 'E', 'G', 'N'],
        ['A', 'B', 'B', 'J', 'O', 'O'],
        ['A', 'C', 'H', 'O', 'P', 'S'],
        ['A', 'F', 'F', 'K', 'P', 'S'],
        ['A', 'O', 'O', 'T', 'T', 'W'],
        ['C', 'I', 'M', 'O', 'T', 'U'],
        ['D', 'E', 'I', 'L', 'R', 'X'],
        ['D', 'E', 'L', 'R', 'V', 'Y'],
        ['D', 'I', 'S', 'T', 'T', 'Y'],
        ['E', 'E', 'G', 'H', 'N', 'W'],
        ['E', 'E', 'I', 'N', 'S', 'U'],
        ['E', 'H', 'R', 'T', 'V', 'W'],
        ['E', 'I', 'O', 'S', 'S', 'T'],
        ['E', 'L', 'R', 'T', 'T', 'Y'],
        ['H', 'I', 'M', 'N', 'U', 'QU'],
        ['H', 'L', 'N', 'N', 'R', 'Z']
    ];

    // Shuffle the dice to randomize their positions on the board
    const shuffledDice = [...boggleDice].sort(() => Math.random() - 0.5);

    const cells = document.querySelectorAll('.cell');
    cells.forEach((cell, index) => {
        // Pick a random face from the die at this position
        const die = shuffledDice[index];
        const randomFace = die[Math.floor(Math.random() * 6)];
        cell.value = randomFace;
    });
}

// Clear all cells
function clearBoard() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.value = '';
    });
    cells[0].focus();
}

// Initialize the board when page loads
document.addEventListener('DOMContentLoaded', () => {
    createBoard();
    document.querySelector('.cell').focus();
});
