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

// Word dictionary (will be loaded from external source)
let wordSet = new Set();
let dictionaryLoaded = false;

// Load dictionary
async function loadDictionary() {
    try {
        // Using official Scrabble word list (SOWPODS)
        // SOWPODS = combination of British and American Scrabble dictionaries
        const response = await fetch('https://raw.githubusercontent.com/scrabblewords/scrabblewords/main/words/British/sowpods.txt');
        const text = await response.text();
        const words = text.split('\n').map(w => w.trim().toUpperCase()).filter(w => w.length >= 3);
        wordSet = new Set(words);
        dictionaryLoaded = true;
        console.log(`Dictionary loaded: ${wordSet.size} SOWPODS Scrabble words`);
    } catch (error) {
        console.error('Failed to load dictionary:', error);
        alert('Failed to load Scrabble dictionary. Please check your internet connection.');
    }
}

// Get board state as 2D array
function getBoardState() {
    const cells = document.querySelectorAll('.cell');
    const board = [];
    for (let i = 0; i < 4; i++) {
        board[i] = [];
        for (let j = 0; j < 4; j++) {
            const cellValue = cells[i * 4 + j].value.toUpperCase();
            board[i][j] = cellValue || '';
        }
    }
    return board;
}

// Get all adjacent neighbors for a cell (including diagonals)
function getNeighbors(row, col) {
    const neighbors = [];
    const directions = [
        [-1, -1], [-1, 0], [-1, 1],  // top row
        [0, -1],           [0, 1],    // middle row
        [1, -1],  [1, 0],  [1, 1]     // bottom row
    ];

    for (const [dr, dc] of directions) {
        const newRow = row + dr;
        const newCol = col + dc;
        if (newRow >= 0 && newRow < 4 && newCol >= 0 && newCol < 4) {
            neighbors.push([newRow, newCol]);
        }
    }
    return neighbors;
}

// DFS to find all valid words on the board
function findAllWords(board) {
    const foundWords = new Set();
    const visited = Array(4).fill(null).map(() => Array(4).fill(false));

    function dfs(row, col, currentWord, path) {
        // Mark as visited
        visited[row][col] = true;

        // Add current cell to word
        const cellValue = board[row][col];
        currentWord += cellValue;

        // Check if current word is valid (3+ letters)
        if (currentWord.length >= 3 && wordSet.has(currentWord)) {
            foundWords.add(currentWord);
        }

        // Continue searching if word could potentially be extended
        // (optimization: could add prefix checking here with a trie)
        if (currentWord.length < 20) {  // reasonable max word length
            const neighbors = getNeighbors(row, col);
            for (const [newRow, newCol] of neighbors) {
                if (!visited[newRow][newCol] && board[newRow][newCol]) {
                    dfs(newRow, newCol, currentWord, [...path, [newRow, newCol]]);
                }
            }
        }

        // Backtrack
        visited[row][col] = false;
    }

    // Start DFS from each cell
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (board[i][j]) {
                dfs(i, j, '', [[i, j]]);
            }
        }
    }

    return Array.from(foundWords);
}

// Find longest word
async function findLongestWord() {
    if (!dictionaryLoaded) {
        alert('Loading dictionary... Please wait and try again.');
        loadDictionary();
        return;
    }

    const board = getBoardState();

    // Check if board has any letters
    const hasLetters = board.some(row => row.some(cell => cell !== ''));
    if (!hasLetters) {
        alert('Please fill in some letters on the board first!');
        return;
    }

    // Show loading message
    const resultDiv = document.getElementById('result');
    resultDiv.textContent = 'Searching for longest word...';
    resultDiv.style.display = 'block';

    // Use setTimeout to allow UI to update
    setTimeout(() => {
        const allWords = findAllWords(board);

        if (allWords.length === 0) {
            resultDiv.textContent = 'No valid words found!';
            return;
        }

        // Find longest word(s)
        const longestLength = Math.max(...allWords.map(w => w.length));
        const longestWords = allWords.filter(w => w.length === longestLength);

        // Display result
        if (longestWords.length === 1) {
            resultDiv.innerHTML = `<strong>Longest word:</strong> ${longestWords[0]} (${longestLength} letters)<br><small>Found ${allWords.length} total words</small>`;
        } else {
            resultDiv.innerHTML = `<strong>Longest words (${longestLength} letters):</strong><br>${longestWords.join(', ')}<br><small>Found ${allWords.length} total words</small>`;
        }
    }, 10);
}

// Initialize the board when page loads
document.addEventListener('DOMContentLoaded', () => {
    createBoard();
    document.querySelector('.cell').focus();
    loadDictionary();
});
