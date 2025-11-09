// Quick verification that ACE should not be found in board4

const board4 = [
    ['T', 'A', 'C', 'X'],
    ['X', 'X', 'X', 'X'],
    ['X', 'X', 'X', 'X'],
    ['X', 'X', 'X', 'X']
];

console.log('Board layout:');
console.log('   0   1   2   3');
console.log('0: T   A   C   X');
console.log('1: X   X   X   X');
console.log('2: X   X   X   X');
console.log('3: X   X   X   X');
console.log();

console.log('To spell ACE we need:');
console.log('- A at position [0,1]');
console.log('- C at position [0,2]');
console.log('- E at position [?,?]');
console.log();

console.log('There is no E on the board!');
console.log('Result: ACE cannot be found ✓ CORRECT');
console.log();

console.log('To spell CAT we need:');
console.log('- C at position [0,2]');
console.log('- A at position [0,1] (adjacent horizontally)');
console.log('- T at position [0,0] (adjacent to A horizontally)');
console.log('Result: CAT can be found via path C->A->T ✓ CORRECT');
