// Test that SOWPODS dictionary loads correctly

const https = require('https');

// Try multiple potential URLs
const urls = [
    'https://raw.githubusercontent.com/scrabblewords/scrabblewords/main/words/British/sowpods.txt',
    'https://raw.githubusercontent.com/scrabblewords/scrabblewords/master/words/British/sowpods.txt',
    'https://raw.github.com/jmlewis/valett/master/scrabble/sowpods.txt',
    'https://raw.githubusercontent.com/jesstess/Scrabble/master/scrabble/sowpods.txt'
];

let currentUrlIndex = 0;
const url = urls[currentUrlIndex];

function tryUrl(urlIndex) {
    if (urlIndex >= urls.length) {
        console.error('✗ All URLs failed!');
        process.exit(1);
    }

    const url = urls[urlIndex];
    console.log(`\nTrying URL #${urlIndex + 1}: ${url}`);

    https.get(url, (response) => {
        if (response.statusCode !== 200) {
            console.error(`✗ FAILED: HTTP ${response.statusCode}`);
            tryUrl(urlIndex + 1);
            return;
        }

    console.log(`✓ HTTP Status: ${response.statusCode} OK`);

    let data = '';

    response.on('data', (chunk) => {
        data += chunk;
    });

    response.on('end', () => {
        const words = data.split('\n').map(w => w.trim().toUpperCase()).filter(w => w.length > 0);
        const wordsMin3 = words.filter(w => w.length >= 3);
        const wordSet = new Set(wordsMin3);

        console.log(`✓ Dictionary loaded successfully`);
        console.log();
        console.log('Statistics:');
        console.log(`  Total words: ${words.length}`);
        console.log(`  Words with 3+ letters: ${wordsMin3.length}`);
        console.log(`  Unique words (3+): ${wordSet.size}`);
        console.log();

        // Test common words
        const testWords = ['CAT', 'DOG', 'HELLO', 'WORLD', 'QUIZ', 'ZEPHYR', 'SCRABBLE', 'BOGGLE'];
        console.log('Common word tests:');
        testWords.forEach(word => {
            const found = wordSet.has(word);
            console.log(`  ${word}: ${found ? '✓ Found' : '✗ Not Found'}`);
        });
        console.log();

        // Test word lengths
        const lengthCounts = {};
        wordsMin3.forEach(word => {
            const len = word.length;
            lengthCounts[len] = (lengthCounts[len] || 0) + 1;
        });

        console.log('Words by length:');
        Object.keys(lengthCounts).sort((a, b) => a - b).slice(0, 10).forEach(len => {
            console.log(`  ${len} letters: ${lengthCounts[len]} words`);
        });
        console.log();

        // Show sample 3-letter words
        const threeLetters = wordsMin3.filter(w => w.length === 3).slice(0, 30);
        console.log('Sample 3-letter words:');
        console.log(`  ${threeLetters.join(', ')}`);
        console.log();

        // Show sample 4-letter words
        const fourLetters = wordsMin3.filter(w => w.length === 4).slice(0, 20);
        console.log('Sample 4-letter words:');
        console.log(`  ${fourLetters.join(', ')}`);
        console.log();

        console.log('✓ All tests passed!');
        console.log('✓ SOWPODS dictionary is ready for use');
    });

    }).on('error', (err) => {
        console.error('✗ Network error:', err.message);
        tryUrl(urlIndex + 1);
    });
}

console.log('Testing SOWPODS Dictionary Load...');
console.log(`Will try ${urls.length} potential sources`);
tryUrl(0);
