// Test the 8-letter challenge board generation

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

// Simplified word set for testing (include some 8-letter words)
const testWords = new Set([
    // 8-letter words
    'ATHLETES', 'THEORIES', 'MOTHERS', 'BROTHERS', 'SISTERS', 'HONESTLY',
    'SMOOTHLY', 'ENTIRELY', 'INTEREST', 'MINISTER', 'REGISTER', 'MOISTURE',
    // Shorter words
    'CAT', 'DOG', 'THE', 'AND', 'TEST', 'WORD', 'MOTHER', 'SISTER'
]);

function getNeighbors(row, col) {
    const neighbors = [];
    const directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],           [0, 1],
        [1, -1],  [1, 0],  [1, 1]
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

function findAllWords(board, wordSet) {
    const foundWords = new Set();
    const visited = Array(4).fill(null).map(() => Array(4).fill(false));

    function dfs(row, col, currentWord) {
        visited[row][col] = true;
        const cellValue = board[row][col];
        currentWord += cellValue;

        if (currentWord.length >= 3 && wordSet.has(currentWord)) {
            foundWords.add(currentWord);
        }

        if (currentWord.length < 20) {
            const neighbors = getNeighbors(row, col);
            for (const [newRow, newCol] of neighbors) {
                if (!visited[newRow][newCol] && board[newRow][newCol]) {
                    dfs(newRow, newCol, currentWord);
                }
            }
        }

        visited[row][col] = false;
    }

    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (board[i][j]) {
                dfs(i, j, '');
            }
        }
    }

    return Array.from(foundWords);
}

function generateRandomBoard() {
    const shuffledDice = [...BOGGLE_DICE].sort(() => Math.random() - 0.5);
    const board = [];
    for (let i = 0; i < 4; i++) {
        board[i] = [];
        for (let j = 0; j < 4; j++) {
            const die = shuffledDice[i * 4 + j];
            board[i][j] = die[Math.floor(Math.random() * 6)];
        }
    }
    return board;
}

console.log('Testing 8-Letter Challenge Board Generation');
console.log('='.repeat(60));
console.log();

console.log('Test dictionary contains:');
console.log('  8-letter words:', Array.from(testWords).filter(w => w.length === 8).length);
console.log('  Total test words:', testWords.size);
console.log();

console.log('Attempting to find a board with exactly one 8-letter word...');
console.log('(This is a simplified test with a small dictionary)');
console.log();

let attempts = 0;
const maxAttempts = 500;
let found = false;

while (attempts < maxAttempts && !found) {
    attempts++;

    const board = generateRandomBoard();
    const words = findAllWords(board, testWords);
    const eightLetterWords = words.filter(w => w.length === 8);
    const longerWords = words.filter(w => w.length > 8);

    if (eightLetterWords.length === 1 && longerWords.length === 0) {
        found = true;

        console.log(`✓ SUCCESS! Found a board in ${attempts} attempts`);
        console.log();
        console.log('Board:');
        console.log('┌───┬───┬───┬───┐');
        for (let i = 0; i < 4; i++) {
            console.log(`│ ${board[i].map(c => c.padEnd(2)).join(' │ ')} │`);
            if (i < 3) console.log('├───┼───┼───┼───┤');
        }
        console.log('└───┴───┴───┴───┘');
        console.log();
        console.log(`8-letter word found: ${eightLetterWords[0]}`);
        console.log(`Total words on board: ${words.length}`);
        console.log();
        console.log('All words by length:');
        const byLength = {};
        words.forEach(w => {
            const len = w.length;
            if (!byLength[len]) byLength[len] = [];
            byLength[len].push(w);
        });
        Object.keys(byLength).sort((a, b) => b - a).forEach(len => {
            console.log(`  ${len}-letter: ${byLength[len].join(', ')}`);
        });
    }

    if (attempts % 100 === 0) {
        console.log(`  Attempt ${attempts}...`);
    }
}

if (!found) {
    console.log(`✗ Could not find a suitable board in ${maxAttempts} attempts`);
    console.log('(This is expected with a small test dictionary)');
}

console.log();
console.log('='.repeat(60));
console.log('Test complete!');
console.log();
console.log('Note: The actual implementation uses the full SOWPODS dictionary');
console.log('with 267,627 words, which significantly increases the chances');
console.log('of finding a board with exactly one 8-letter word.');
