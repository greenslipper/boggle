// Test the Free Dictionary API

const https = require('https');

async function testDefinition(word) {
    return new Promise((resolve, reject) => {
        const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word.toLowerCase()}`;

        https.get(url, (response) => {
            let data = '';

            response.on('data', (chunk) => {
                data += chunk;
            });

            response.on('end', () => {
                if (response.statusCode === 200) {
                    try {
                        const json = JSON.parse(data);
                        resolve({ success: true, data: json });
                    } catch (error) {
                        reject({ success: false, error: 'Parse error' });
                    }
                } else {
                    reject({ success: false, error: `HTTP ${response.statusCode}` });
                }
            });
        }).on('error', (error) => {
            reject({ success: false, error: error.message });
        });
    });
}

async function runTests() {
    console.log('Testing Free Dictionary API...\n');

    const testWords = ['CLEAR', 'GRACE', 'GRATE', 'LATER', 'CAT', 'QUIZ', 'ZEPHYR'];

    for (const word of testWords) {
        console.log(`\n${'='.repeat(60)}`);
        console.log(`Testing: ${word}`);
        console.log('='.repeat(60));

        try {
            const result = await testDefinition(word);

            if (result.success && result.data.length > 0) {
                const entry = result.data[0];

                console.log(`✓ Definition found!`);
                console.log(`\nWord: ${entry.word.toUpperCase()}`);

                if (entry.phonetic) {
                    console.log(`Pronunciation: ${entry.phonetic}`);
                }

                if (entry.meanings && entry.meanings.length > 0) {
                    console.log(`\nMeanings (${entry.meanings.length} parts of speech):`);

                    entry.meanings.slice(0, 3).forEach((meaning, idx) => {
                        console.log(`\n  ${idx + 1}. ${meaning.partOfSpeech.toUpperCase()}`);

                        if (meaning.definitions && meaning.definitions.length > 0) {
                            meaning.definitions.slice(0, 2).forEach((def, defIdx) => {
                                console.log(`     ${defIdx + 1}. ${def.definition}`);
                                if (def.example) {
                                    console.log(`        Example: "${def.example}"`);
                                }
                            });
                        }
                    });
                }

                // Check for synonyms
                if (entry.meanings[0].synonyms && entry.meanings[0].synonyms.length > 0) {
                    console.log(`\nSynonyms: ${entry.meanings[0].synonyms.slice(0, 5).join(', ')}`);
                }
            }
        } catch (error) {
            console.log(`✗ Failed: ${error.error}`);
        }

        // Small delay between requests
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log(`\n${'='.repeat(60)}`);
    console.log('All tests complete!');
    console.log('='.repeat(60));
}

runTests();
