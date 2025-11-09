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

// Official Boggle dice configuration (shared constant)
const BOGGLE_DICE = [
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

// Randomize board with letters
function randomizeBoard() {
    // Shuffle the dice to randomize their positions on the board
    const shuffledDice = [...BOGGLE_DICE].sort(() => Math.random() - 0.5);

    const cells = document.querySelectorAll('.cell');
    cells.forEach((cell, index) => {
        // Pick a random face from the die at this position
        const die = shuffledDice[index];
        const randomFace = die[Math.floor(Math.random() * 6)];
        cell.value = randomFace;
    });
}

// Check if a word has a definition in the dictionary API
async function hasDefinition(word) {
    try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word.toLowerCase()}`);
        return response.ok;
    } catch (error) {
        return false;
    }
}

// Generate a board that has exactly one 8-letter word
async function generateEightLetterChallenge() {
    if (!dictionaryLoaded) {
        alert('Dictionary still loading... Please wait a moment and try again.');
        return;
    }

    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '<div class="loading">Generating 8-letter challenge board... This may take a moment.</div>';
    resultDiv.style.display = 'block';

    let attempts = 0;
    const maxAttempts = 1000; // Limit attempts to prevent infinite loop
    let foundBoard = null;
    let eightLetterWord = null;

    // Use setTimeout to allow UI updates
    setTimeout(async () => {
        while (attempts < maxAttempts && !foundBoard) {
            attempts++;

            // Generate random board
            const shuffledDice = [...BOGGLE_DICE].sort(() => Math.random() - 0.5);
            const board = [];
            for (let i = 0; i < 4; i++) {
                board[i] = [];
                for (let j = 0; j < 4; j++) {
                    const die = shuffledDice[i * 4 + j];
                    board[i][j] = die[Math.floor(Math.random() * 6)];
                }
            }

            // Find all words on this board
            const allWords = findAllWords(board);

            // Check for exactly one 8-letter word
            const eightLetterWords = allWords.filter(w => w.length === 8);
            const longerWords = allWords.filter(w => w.length > 8);

            if (eightLetterWords.length === 1 && longerWords.length === 0) {
                // Verify the 8-letter word has a definition
                const candidateWord = eightLetterWords[0];
                const wordHasDefinition = await hasDefinition(candidateWord);

                if (wordHasDefinition) {
                    foundBoard = board;
                    eightLetterWord = candidateWord;
                    break;
                }
            }

            // Update progress every 100 attempts
            if (attempts % 100 === 0) {
                resultDiv.innerHTML = `<div class="loading">Generating 8-letter challenge... Attempt ${attempts}/${maxAttempts}<br><small>Verifying word definitions...</small></div>`;
                // Allow UI to update
                await new Promise(resolve => setTimeout(resolve, 0));
            }
        }

        if (foundBoard) {
            // Set the board
            const cells = document.querySelectorAll('.cell');
            cells.forEach((cell, index) => {
                const row = Math.floor(index / 4);
                const col = index % 4;
                cell.value = foundBoard[row][col];
            });

            resultDiv.innerHTML = `
                <div class="success-message">
                    <strong>✓ 8-Letter Challenge Board Generated!</strong><br>
                    <small>Found in ${attempts} attempts</small><br>
                    <small>This board contains exactly one 8-letter word with a definition. Can you find it?</small><br>
                    <button class="expand-btn" onclick="revealChallengeSolution('${eightLetterWord}')">Reveal Solution</button>
                </div>
            `;
        } else {
            resultDiv.innerHTML = `
                <div class="error-message">
                    <strong>Challenge generation timed out</strong><br>
                    <small>Tried ${attempts} boards but couldn't find one with exactly one 8-letter word that has a definition.</small><br>
                    <small>Try again or use the regular Random button.</small>
                </div>
            `;
        }
    }, 100);
}

// Reveal the challenge solution
function revealChallengeSolution(word) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `
        <div class="success-message">
            <strong>8-Letter Word Solution:</strong><br>
            <span class="clickable-word" onclick="showDefinition('${word}')">${word}</span><br>
            <small>Click the word to see its definition</small>
            <div id="definition-display" class="definition-display"></div>
        </div>
    `;
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
        const response = await fetch('https://raw.githubusercontent.com/jesstess/Scrabble/master/scrabble/sowpods.txt');
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

// Global variable to store word paths
let wordPaths = new Map();

// DFS to find all valid words on the board
function findAllWords(board) {
    const foundWords = new Set();
    wordPaths = new Map(); // Reset paths
    const visited = Array(4).fill(null).map(() => Array(4).fill(false));

    function dfs(row, col, currentWord, path) {
        // Mark as visited
        visited[row][col] = true;

        // Add current cell to word
        const cellValue = board[row][col];
        currentWord += cellValue;
        const newPath = [...path, [row, col]];

        // Check if current word is valid (3+ letters)
        if (currentWord.length >= 3 && wordSet.has(currentWord)) {
            foundWords.add(currentWord);
            // Store the path for this word (keep first found path)
            if (!wordPaths.has(currentWord)) {
                wordPaths.set(currentWord, newPath);
            }
        }

        // Continue searching if word could potentially be extended
        // (optimization: could add prefix checking here with a trie)
        if (currentWord.length < 20) {  // reasonable max word length
            const neighbors = getNeighbors(row, col);
            for (const [newRow, newCol] of neighbors) {
                if (!visited[newRow][newCol] && board[newRow][newCol]) {
                    dfs(newRow, newCol, currentWord, newPath);
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
                dfs(i, j, '', []);
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
    setTimeout(async () => {
        const allWords = findAllWords(board);

        if (allWords.length === 0) {
            resultDiv.textContent = 'No valid words found!';
            return;
        }

        // Sort words alphabetically
        allWords.sort();

        // Group by length
        const wordsByLength = {};
        allWords.forEach(word => {
            const len = word.length;
            if (!wordsByLength[len]) {
                wordsByLength[len] = [];
            }
            wordsByLength[len].push(word);
        });

        // Find longest word(s)
        const longestLength = Math.max(...allWords.map(w => w.length));
        const longestWords = wordsByLength[longestLength];

        // Check which words have definitions
        resultDiv.textContent = 'Checking definitions for all words...';
        const definitionChecks = new Map();

        // Check all words in batches to avoid overwhelming the API
        const batchSize = 10;
        for (let i = 0; i < allWords.length; i += batchSize) {
            const batch = allWords.slice(i, i + batchSize);
            const results = await Promise.all(
                batch.map(async word => ({
                    word,
                    hasDefinition: await hasDefinition(word)
                }))
            );
            results.forEach(({ word, hasDefinition }) => {
                definitionChecks.set(word, hasDefinition);
            });
        }

        // Build HTML output
        let html = '<div class="result-summary">';
        if (longestWords.length === 1) {
            const word = longestWords[0];
            const hasDef = definitionChecks.get(word);
            if (hasDef) {
                html += `<strong>Longest word:</strong> <span class="clickable-word" onclick="showDefinition('${word}')">${word}</span> <span class="eye-icon" onclick="showWordPath('${word}')" title="Show path on board">👁️</span> (${longestLength} letters)<br>`;
            } else {
                html += `<strong>Longest word:</strong> <span class="no-definition-word">${word}</span> <span class="eye-icon" onclick="showWordPath('${word}')" title="Show path on board">👁️</span> (${longestLength} letters)<br>`;
            }
        } else {
            html += `<strong>Longest words (${longestLength} letters):</strong><br>`;
            const wordElements = longestWords.map(word => {
                const hasDef = definitionChecks.get(word);
                if (hasDef) {
                    return `<span class="clickable-word" onclick="showDefinition('${word}')">${word}</span> <span class="eye-icon" onclick="showWordPath('${word}')" title="Show path on board">👁️</span>`;
                } else {
                    return `<span class="no-definition-word">${word}</span> <span class="eye-icon" onclick="showWordPath('${word}')" title="Show path on board">👁️</span>`;
                }
            });
            html += wordElements.join(', ') + '<br>';
        }
        html += `<small>Found ${allWords.length} total words</small>`;
        html += `<div id="definition-display" class="definition-display"></div>`;
        html += `<button class="expand-btn" onclick="toggleWordList()">Show All Words</button>`;
        html += '</div>';

        // Add expandable word list
        html += '<div id="word-list" class="word-list" style="display: none;">';

        // Sort lengths in descending order
        const lengths = Object.keys(wordsByLength).map(Number).sort((a, b) => b - a);

        lengths.forEach(len => {
            const words = wordsByLength[len];
            html += `<div class="word-group">`;
            html += `<h4>${len}-letter words (${words.length}):</h4>`;
            html += `<div class="word-items">`;
            words.forEach(word => {
                const hasDef = definitionChecks.get(word);
                if (hasDef) {
                    html += `<span class="word-with-eye"><span class="clickable-word" onclick="showDefinition('${word}')">${word}</span> <span class="eye-icon" onclick="showWordPath('${word}')" title="Show path on board">👁️</span></span>`;
                } else {
                    html += `<span class="word-with-eye"><span class="no-definition-word">${word}</span> <span class="eye-icon" onclick="showWordPath('${word}')" title="Show path on board">👁️</span></span>`;
                }
            });
            html += `</div>`;
            html += `</div>`;
        });

        html += '</div>';

        resultDiv.innerHTML = html;
    }, 10);
}

// Show word path on the board
function showWordPath(word) {
    // Clear any previous highlighting
    clearWordPath();

    const path = wordPaths.get(word);
    if (!path) {
        console.log('No path found for word:', word);
        return;
    }

    const cells = document.querySelectorAll('.cell');
    const boardElement = document.getElementById('board');

    // Create SVG overlay for drawing lines
    let svg = document.getElementById('path-svg');
    if (!svg) {
        svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.id = 'path-svg';
        svg.style.position = 'absolute';
        svg.style.top = '0';
        svg.style.left = '0';
        svg.style.width = '100%';
        svg.style.height = '100%';
        svg.style.pointerEvents = 'none';
        svg.style.zIndex = '1';
        boardElement.style.position = 'relative';
        boardElement.appendChild(svg);
    }

    // Clear any existing paths in SVG
    svg.innerHTML = '';

    // Get board dimensions for calculating line positions
    const boardRect = boardElement.getBoundingClientRect();

    // Highlight each cell in the path with a number
    path.forEach(([row, col], index) => {
        const cellIndex = row * 4 + col;
        const cell = cells[cellIndex];

        // Add highlight class and number
        cell.classList.add('path-highlight');
        cell.dataset.pathNumber = index + 1;

        // Add animation delay
        cell.style.animationDelay = `${index * 0.1}s`;
    });

    // Draw lines connecting the cells
    for (let i = 0; i < path.length - 1; i++) {
        const [row1, col1] = path[i];
        const [row2, col2] = path[i + 1];

        const cellIndex1 = row1 * 4 + col1;
        const cellIndex2 = row2 * 4 + col2;

        const cell1 = cells[cellIndex1];
        const cell2 = cells[cellIndex2];

        const rect1 = cell1.getBoundingClientRect();
        const rect2 = cell2.getBoundingClientRect();

        // Calculate center positions relative to board
        const x1 = rect1.left - boardRect.left + rect1.width / 2;
        const y1 = rect1.top - boardRect.top + rect1.height / 2;
        const x2 = rect2.left - boardRect.left + rect2.width / 2;
        const y2 = rect2.top - boardRect.top + rect2.height / 2;

        // Create line element
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', x1);
        line.setAttribute('y1', y1);
        line.setAttribute('x2', x2);
        line.setAttribute('y2', y2);
        line.setAttribute('stroke', '#ff6b6b');
        line.setAttribute('stroke-width', '4');
        line.setAttribute('stroke-linecap', 'round');
        line.classList.add('path-line');

        // Add animation delay to match cell highlighting
        line.style.animation = `drawLine 0.3s ease forwards`;
        line.style.animationDelay = `${i * 0.1}s`;
        line.style.strokeDasharray = '1000';
        line.style.strokeDashoffset = '1000';

        svg.appendChild(line);
    }

    // Auto-clear after 3 seconds
    setTimeout(clearWordPath, 3000);
}

// Clear word path highlighting
function clearWordPath() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.classList.remove('path-highlight');
        delete cell.dataset.pathNumber;
        cell.style.animationDelay = '';
    });

    // Remove SVG overlay
    const svg = document.getElementById('path-svg');
    if (svg) {
        svg.innerHTML = '';
    }
}

// Toggle word list visibility
function toggleWordList() {
    const wordList = document.getElementById('word-list');
    const button = document.querySelector('.expand-btn');

    if (wordList.style.display === 'none') {
        wordList.style.display = 'block';
        button.textContent = 'Hide All Words';
    } else {
        wordList.style.display = 'none';
        button.textContent = 'Show All Words';
    }
}

// Show definition for a word
async function showDefinition(word) {
    const definitionDiv = document.getElementById('definition-display');
    definitionDiv.innerHTML = '<div class="loading">Loading definition...</div>';
    definitionDiv.style.display = 'block';

    try {
        // Try Free Dictionary API first
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word.toLowerCase()}`);

        if (!response.ok) {
            throw new Error('Definition not found');
        }

        const data = await response.json();

        if (data && data.length > 0) {
            const entry = data[0];
            let html = `<div class="definition-content">`;
            html += `<div class="definition-word">${word}</div>`;

            // Add phonetic if available
            if (entry.phonetic) {
                html += `<div class="phonetic">${entry.phonetic}</div>`;
            }

            // Add meanings
            if (entry.meanings && entry.meanings.length > 0) {
                entry.meanings.slice(0, 3).forEach((meaning, idx) => {
                    html += `<div class="meaning-section">`;
                    html += `<div class="part-of-speech">${meaning.partOfSpeech}</div>`;

                    if (meaning.definitions && meaning.definitions.length > 0) {
                        meaning.definitions.slice(0, 2).forEach((def, defIdx) => {
                            html += `<div class="definition-item">`;
                            html += `<span class="definition-number">${defIdx + 1}.</span> ${def.definition}`;
                            if (def.example) {
                                html += `<div class="example">"${def.example}"</div>`;
                            }
                            html += `</div>`;
                        });
                    }
                    html += `</div>`;
                });
            }

            html += `<button class="close-definition" onclick="closeDefinition()">Close</button>`;
            html += `</div>`;

            definitionDiv.innerHTML = html;
        } else {
            throw new Error('No definition found');
        }
    } catch (error) {
        definitionDiv.innerHTML = `
            <div class="definition-content">
                <div class="definition-word">${word}</div>
                <div class="definition-error">
                    <p>Definition not available.</p>
                    <p class="error-note">This word is valid in Scrabble but may not have an online definition available.</p>
                </div>
                <button class="close-definition" onclick="closeDefinition()">Close</button>
            </div>
        `;
    }
}

// Close definition display
function closeDefinition() {
    const definitionDiv = document.getElementById('definition-display');
    definitionDiv.style.display = 'none';
    definitionDiv.innerHTML = '';
}

// Initialize the board when page loads
document.addEventListener('DOMContentLoaded', () => {
    createBoard();
    document.querySelector('.cell').focus();
    loadDictionary();
});
