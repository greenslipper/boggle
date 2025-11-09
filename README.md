# Boggle Board App

A 4x4 Boggle board application with automatic word finding capabilities.

## Features

- **4x4 Interactive Grid**: Enter letters manually into each cell
- **Q → QU Conversion**: Automatically converts 'Q' to 'QU' (Boggle standard)
- **Keyboard Navigation**: Use arrow keys to move between cells
- **Random Board Generator**: Uses official Boggle dice configuration
- **Longest Word Finder**: Finds the longest valid English word on the board

## Boggle Rules Implemented

The word finder correctly implements all official Boggle rules:

1. **Minimum Length**: Words must be at least 3 letters long
2. **Adjacency**: Each letter must be adjacent (horizontally, vertically, or diagonally) to the previous letter
3. **No Cell Reuse**: Each cell can only be used once per word
4. **QU Handling**: QU counts as two letters

## How It Works

### Algorithm

The word finder uses a **Depth-First Search (DFS)** algorithm with backtracking:

1. **Dictionary Loading**: Loads 370,000+ English words from an external source
2. **Board Traversal**: Starting from each cell, explores all possible paths
3. **Word Validation**: Checks each path against the dictionary
4. **Backtracking**: Marks cells as visited during exploration, unmarks when backtracking

### Example

For this board:
```
┌───┬───┬───┬───┐
│ R │ A │ C │ E │
├───┼───┼───┼───┤
│ G │ L │ U │ T │
├───┼───┼───┼───┤
│ A │ E │ T │ E │
├───┼───┼───┼───┤
│ G │ R │ A │ L │
└───┴───┴───┴───┘
```

The algorithm finds **40 valid words**, with "CLEAR" being the longest (5 letters):
- Path: C[0,2] → L[1,1] → E[2,1] → A[3,2] → R[3,1]

## Usage

1. Open `index.html` in a web browser
2. Either:
   - Click "Random" to generate a random Boggle board
   - Manually enter letters into cells
3. Click "Find Longest Word" to find the longest valid word
4. Results show the longest word and total word count

## Testing

Run the test suite to verify the algorithm:

```bash
node test.js          # Basic tests
node final-test.js    # Comprehensive test with path verification
```

Open `test.html` in a browser for visual test results.

### Test Coverage

- ✓ Diagonal adjacency
- ✓ Cell reuse prevention
- ✓ QU handling
- ✓ Path validation
- ✓ Multiple word finding
- ✓ Edge cases

## Technical Details

### Files

- `index.html` - Main application interface
- `style.css` - Styling and responsive design
- `script.js` - Core logic including DFS algorithm
- `test.js` - Node.js test suite
- `final-test.js` - Comprehensive testing with path verification
- `test.html` - Browser-based testing

### Dictionary Source

Uses the `dwyl/english-words` dictionary from GitHub (370,000+ words).

### Performance

- Dictionary loads asynchronously on page load
- DFS with early termination for efficiency
- Handles all 16 cells × 8 neighbors × backtracking paths

## Official Boggle Dice Configuration

Uses the "New Boggle" standard dice:

```
AAEEGN  ABBJOO  ACHOPS  AFFKPS
AOOTTW  CIMOTU  DEILRX  DELRVY
DISTTY  EEGHNW  EEINSU  EHRTVW
EIOSST  ELRTTY  HIMNQU  HLNNRZ
```

## Browser Compatibility

Works in all modern browsers with ES6+ support.
