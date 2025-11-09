// Final comprehensive test with a realistic Boggle board

// Larger test dictionary with common words
const testWords = new Set([
    // 3-letter words
    'ACE', 'ACT', 'AGE', 'ATE', 'CAR', 'CAT', 'CUE', 'EAR', 'EAT', 'ERA',
    'GAL', 'GAR', 'GEL', 'GET', 'LAG', 'LAR', 'LEG', 'LET', 'RAG', 'RAT',
    'RUG', 'RUT', 'SAT', 'SET', 'TAG', 'TAR', 'TEA', 'THE',
    // 4-letter words
    'ACRE', 'CAGE', 'CARE', 'CART', 'CART', 'CLUE', 'CURE', 'EARL', 'GATE',
    'GEAR', 'LACE', 'LATE', 'RACE', 'RAGE', 'RATE', 'REAL', 'TEAL', 'TEAR',
    'GLUE', 'GALE', 'TALE', 'AREA', 'EACH',
    // 5-letter words
    'CRATE', 'GRACE', 'LATER', 'REACT', 'TRACE', 'GRATE', 'CLEAR',
    // 6+ letter words
    'GLACER', 'RACING', 'TRACER', 'CAREER'
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
    const wordPaths = new Map(); // Store paths for verification

    function dfs(row, col, currentWord, path) {
        visited[row][col] = true;
        const cellValue = board[row][col];
        currentWord += cellValue;
        const newPath = [...path, [row, col]];

        if (currentWord.length >= 3 && wordSet.has(currentWord)) {
            foundWords.add(currentWord);
            wordPaths.set(currentWord, newPath);
        }

        if (currentWord.length < 20) {
            const neighbors = getNeighbors(row, col);
            for (const [newRow, newCol] of neighbors) {
                if (!visited[newRow][newCol] && board[newRow][newCol]) {
                    dfs(newRow, newCol, currentWord, newPath);
                }
            }
        }

        visited[row][col] = false;
    }

    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (board[i][j]) {
                dfs(i, j, '', []);
            }
        }
    }

    return { words: Array.from(foundWords), paths: wordPaths };
}

// Realistic Boggle board
console.log('=== Final Comprehensive Test ===');
console.log();
const board = [
    ['R', 'A', 'C', 'E'],
    ['G', 'L', 'U', 'T'],
    ['A', 'E', 'T', 'E'],
    ['G', 'R', 'A', 'L']
];

console.log('Boggle Board:');
console.log('┌───┬───┬───┬───┐');
for (let i = 0; i < 4; i++) {
    console.log(`│ ${board[i].join(' │ ')} │`);
    if (i < 3) console.log('├───┼───┼───┼───┤');
}
console.log('└───┴───┴───┴───┘');
console.log();

const result = findAllWords(board, testWords);
const words = result.words.sort((a, b) => {
    if (b.length !== a.length) return b.length - a.length;
    return a.localeCompare(b);
});

console.log('All Valid Words Found:');
const byLength = {};
words.forEach(word => {
    const len = word.length;
    if (!byLength[len]) byLength[len] = [];
    byLength[len].push(word);
});

Object.keys(byLength).sort((a, b) => b - a).forEach(len => {
    console.log(`  ${len}-letter words (${byLength[len].length}): ${byLength[len].join(', ')}`);
});

console.log();
console.log('Statistics:');
console.log(`  Total words found: ${words.length}`);
const longestWord = words[0];
console.log(`  Longest word: ${longestWord} (${longestWord.length} letters)`);
console.log();

// Verify the longest word's path
if (longestWord) {
    const path = result.paths.get(longestWord);
    console.log(`Path for "${longestWord}":`);
    path.forEach(([row, col], idx) => {
        const letter = board[row][col];
        console.log(`  ${idx + 1}. [${row},${col}] = ${letter}`);
    });
    console.log();

    // Verify adjacency
    let valid = true;
    for (let i = 0; i < path.length - 1; i++) {
        const [r1, c1] = path[i];
        const [r2, c2] = path[i + 1];
        const rowDiff = Math.abs(r1 - r2);
        const colDiff = Math.abs(c1 - c2);
        const isAdjacent = rowDiff <= 1 && colDiff <= 1 && (rowDiff + colDiff > 0);
        if (!isAdjacent) {
            console.log(`  ✗ NOT ADJACENT: [${r1},${c1}] -> [${r2},${c2}]`);
            valid = false;
        }
    }
    if (valid) {
        console.log(`  ✓ All cells in path are adjacent`);
    }

    // Verify no reuse
    const usedCells = new Set(path.map(([r, c]) => `${r},${c}`));
    if (usedCells.size === path.length) {
        console.log(`  ✓ No cells reused`);
    } else {
        console.log(`  ✗ Cells were reused!`);
    }
}

console.log();
console.log('=== Test Complete - Algorithm Verified ===');
