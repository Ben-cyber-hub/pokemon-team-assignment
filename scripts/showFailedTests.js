const fs = require('fs');

try {
  const results = JSON.parse(fs.readFileSync('test-results.json', 'utf8'));
  const failedTests = results.testResults.filter(suite => suite.status === 'failed');

  if (failedTests.length === 0) {
    console.log('\x1b[32m✓ All tests passed\x1b[0m');
    process.exit(0);
  }

  console.log('\x1b[31m✕ Failed Tests:\x1b[0m\n');
  failedTests.forEach(suite => {
    console.log(`\x1b[1m${suite.name}\x1b[0m`);
    suite.assertionResults
      .filter(test => test.status === 'failed')
      .forEach(test => {
        console.log(`  \x1b[31m✕ ${test.title}\x1b[0m`);
        console.log(`    ${test.failureMessages.join('\n    ')}\n`);
      });
  });

  process.exit(1);
} catch (error) {
  console.error('Error processing test results:', error);
  process.exit(1);
} finally {
  // Clean up the results file
  if (fs.existsSync('test-results.json')) {
    fs.unlinkSync('test-results.json');
  }
}