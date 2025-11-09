// Node.js test script for Boggle algorithm

// Test dictionary
const testWords = new Set([
    'CAT', 'CATS', 'TEA', 'EAT', 'ATE', 'SAT', 'SET',
    'ACE', 'CAST', 'EAST', 'TEST', 'SATE', 'SEAT', 'EATS',
    'THE', 'THESE', 'TEAS', 'ACES', 'QUEEN', 'QUE'
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

    function dfs(row, col, currentWord, path) {
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
                    dfs(newRow, newCol, currentWord, [...path, [newRow, newCol]]);
                }
            }
        }

        visited[row][col] = false;
    }

    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (board[i][j]) {
                dfs(i, j, '', [[i, j]]);
            }
        }
    }

    return Array.from(foundWords);
}

// Test 1: Simple board
console.log('=== Test 1: Simple Board ===');
const board1 = [
    ['C', 'A', 'T', 'S'],
    ['E', 'S', 'E', 'A'],
    ['T', 'E', 'A', 'T'],
    ['X', 'X', 'X', 'X']
];
console.log('Board:');
board1.forEach(row => console.log(row.join(' ')));
const words1 = findAllWords(board1, testWords);
console.log('Words found:', words1.sort());
console.log('Count:', words1.length);
const longest1 = words1.reduce((a, b) => a.length > b.length ? a : b, '');
console.log('Longest:', longest1, `(${longest1.length} letters)`);
console.log();

// Test 2: Board with QU
console.log('=== Test 2: QU Handling ===');
const board2 = [
    ['QU', 'E', 'E', 'N'],
    ['A', 'B', 'C', 'D'],
    ['E', 'F', 'G', 'H'],
    ['I', 'J', 'K', 'L']
];
console.log('Board:');
board2.forEach(row => console.log(row.join(' ')));
const words2 = findAllWords(board2, testWords);
console.log('Words found:', words2.sort());
console.log('QUE found?', words2.includes('QUE') ? '✓ YES' : '✗ NO');
console.log('QUEEN found?', words2.includes('QUEEN') ? '✓ YES' : '✗ NO');
console.log();

// Test 3: Diagonal adjacency
console.log('=== Test 3: Diagonal Adjacency ===');
const board3 = [
    ['C', 'X', 'X', 'X'],
    ['X', 'A', 'X', 'X'],
    ['X', 'X', 'T', 'X'],
    ['X', 'X', 'X', 'X']
];
console.log('Board (C, A, T on diagonal):');
board3.forEach(row => console.log(row.join(' ')));
const words3 = findAllWords(board3, testWords);
console.log('Words found:', words3.sort());
console.log('CAT found via diagonal?', words3.includes('CAT') ? '✓ YES (PASS)' : '✗ NO (FAIL)');
console.log();

// Test 4: No cell reuse
console.log('=== Test 4: No Cell Reuse ===');
const board4 = [
    ['T', 'A', 'C', 'X'],
    ['X', 'X', 'X', 'X'],
    ['X', 'X', 'X', 'X'],
    ['X', 'X', 'X', 'X']
];
console.log('Board (T-A-C in a line):');
board4.forEach(row => console.log(row.join(' ')));
const words4 = findAllWords(board4, testWords);
console.log('Words found:', words4.sort());
console.log('CAT found?', words4.includes('CAT') ? '✓ YES' : '✗ NO');
console.log('ACE found?', words4.includes('ACE') ? '✓ YES' : '✗ NO');
console.log();

// Test 5: Complex adjacency
console.log('=== Test 5: Complex Path ===');
const board5 = [
    ['S', 'E', 'A', 'T'],
    ['A', 'T', 'S', 'E'],
    ['T', 'E', 'A', 'S'],
    ['E', 'S', 'T', 'A']
];
console.log('Board:');
board5.forEach(row => console.log(row.join(' ')));
const words5 = findAllWords(board5, testWords);
console.log('Words found:', words5.sort());
console.log('Count:', words5.length);
const longest5 = words5.reduce((a, b) => a.length > b.length ? a : b, '');
console.log('Longest:', longest5, `(${longest5.length} letters)`);
console.log();

console.log('=== All Tests Complete ===');
