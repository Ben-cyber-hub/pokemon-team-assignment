const fs = require('fs');
const path = require('path');

/**
 * Improved test results parser and formatter
 * - Better Windows compatibility
 * - Custom input/output path support
 * - More robust file handling
 */

// Default configuration - can be overridden with command line args
const config = {
  inputFile: 'test-results.json',
  outputFile: 'parsed-test-results.json',
  projectRoot: process.cwd()
};

// Process command line arguments
process.argv.slice(2).forEach(arg => {
  const [key, value] = arg.split('=');
  if (key && value) {
    config[key.replace('--', '')] = value;
  }
});

function resolveFilePath(filePath) {
  if (path.isAbsolute(filePath)) {
    return filePath;
  }
  return path.resolve(config.projectRoot, filePath);
}

function analyzeTestResults() {
  try {
    const inputPath = resolveFilePath(config.inputFile);
    
    if (!fs.existsSync(inputPath)) {
      console.error(`\x1b[31mError: Test results file not found at ${inputPath}\x1b[0m`);
      console.log('\x1b[33mTip: Make sure to run tests with the --json flag and redirect output:\x1b[0m');
      console.log('  npm test -- --json --outputFile=test-results.json');
      process.exit(1);
    }
    
    console.log(`\x1b[36mReading test results from: ${inputPath}\x1b[0m`);
    const results = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
    
    // Create a machine-readable version for later analysis
    const outputPath = resolveFilePath(config.outputFile);
    fs.writeFileSync(outputPath, JSON.stringify(formatResults(results), null, 2));
    console.log(`\x1b[36mWrote structured results to: ${outputPath}\x1b[0m\n`);
    
    printSummary(results);
    printFailures(results);
    printCommonIssues(results);
    
  } catch (error) {
    console.error('\x1b[31mError processing test results:', error.message, '\x1b[0m');
    process.exit(1);
  }
}

function formatResults(results) {
  const formatted = {
    summary: {
      totalSuites: results.numTotalTestSuites,
      failedSuites: results.numFailedTestSuites,
      passedSuites: results.numPassedTestSuites,
      totalTests: results.numTotalTests,
      failedTests: results.numFailedTests,
      passedTests: results.numPassedTests
    },
    failureCategories: {},
    failedTests: []
  };
  
  // Process each failed test
  results.testResults.forEach(suite => {
    if (suite.status === 'failed') {
      // Handle different file extensions and normalize path for Windows
      const suitePath = suite.name.replace(/\\/g, '/');
      const componentName = path.basename(suitePath)
        .replace('.test.tsx', '')
        .replace('.test.ts', '')
        .replace('.test.jsx', '')
        .replace('.test.js', '');
      
      suite.assertionResults
        .filter(test => test.status === 'failed')
        .forEach(test => {
          // Extract useful information from failure messages
          const errorMessage = test.failureMessages[0] || '';
          const errorType = extractErrorType(errorMessage);
          const codeSnippet = extractCodeSnippet(errorMessage);
          const locationInfo = extractLocationInfo(errorMessage);
          
          // Add to categorized failures
          if (!formatted.failureCategories[errorType]) {
            formatted.failureCategories[errorType] = [];
          }
          formatted.failureCategories[errorType].push({
            component: componentName,
            testName: test.title,
            fullName: test.fullName
          });
          
          // Add detailed failure info
          formatted.failedTests.push({
            component: componentName,
            testName: test.title,
            fullName: test.fullName,
            errorType: errorType,
            errorMessage: errorMessage.split('\n')[0], // First line of error
            codeSnippet: codeSnippet,
            location: locationInfo,
            duration: test.duration,
            file: suite.name
          });
        });
    }
  });
  
  return formatted;
}

// Rest of your functions remain the same...
function extractErrorType(message) {
  if (!message) return 'Unknown Error';
  
  if (message.includes('TestingLibraryElementError: Unable to find an element')) {
    return 'Element Not Found';
  } else if (message.includes('expect(')) {
    return 'Assertion Error';
  } else if (message.includes('ResizeObserver is not defined')) {
    return 'Missing Browser API';
  } else if (message.includes('must be used within')) {
    return 'Context Provider Missing';
  } else if (message.includes('Property') && message.includes('does not exist')) {
    return 'Type Error';
  } else {
    return 'Runtime Error';
  }
}

function extractCodeSnippet(message) {
  if (!message) return '';
  
  // Support both colored and plain text formats
  const coloredRegex = /\u001b\[0m \u001b\[90m (\d+) \|\u001b\[39m(.*)\n\u001b\[2m.*\u001b\[31m\u001b\[1m>\u001b\[22m\u001b\[2m\u001b\[39m\u001b\[90m (\d+) \|\u001b\[39m(.*)/;
  const plainRegex = /(\d+) \|(.*)\n.*> (\d+) \|(.*)/;
  
  let match = message.match(coloredRegex);
  if (!match) {
    match = message.match(plainRegex);
  }
  
  if (match) {
    return {
      line: match[3],
      code: match[4].trim()
    };
  }
  
  return null;
}

function extractLocationInfo(message) {
  if (!message) return '';
  
  // Support both colored and plain text formats
  const coloredRegex = /at Object\.<anonymous> \(\u001b\[22m\u001b\[2m\u001b\[0m\u001b\[36m(.*?)\u001b\[39m\u001b\[0m\u001b\[2m:(\d+):(\d+)/;
  const plainRegex = /at Object\.<anonymous> \((.*?):(\d+):(\d+)/;
  
  let match = message.match(coloredRegex);
  if (!match) {
    match = message.match(plainRegex);
  }
  
  if (match) {
    return {
      file: match[1],
      line: match[2],
      column: match[3]
    };
  }
  
  return null;
}

function printSummary(results) {
  console.log('\n================================================');
  console.log('               TEST RESULTS SUMMARY              ');
  console.log('================================================\n');
  
  console.log(`Total Test Suites: ${results.numTotalTestSuites}`);
  console.log(`  \x1b[32m✓ Passed: ${results.numPassedTestSuites}\x1b[0m`);
  console.log(`  \x1b[31m✕ Failed: ${results.numFailedTestSuites}\x1b[0m`);
  
  console.log(`\nTotal Tests: ${results.numTotalTests}`);
  console.log(`  \x1b[32m✓ Passed: ${results.numPassedTests}\x1b[0m`);
  console.log(`  \x1b[31m✕ Failed: ${results.numFailedTests}\x1b[0m\n`);
}

function printFailures(results) {
  // Keep your existing printFailures function...
  console.log('\n================================================');
  console.log('               DETAILED FAILURES                 ');
  console.log('================================================\n');
  
  const failedSuites = results.testResults.filter(suite => suite.status === 'failed');
  
  if (failedSuites.length === 0) {
    console.log('\x1b[32m✓ All tests passed\x1b[0m');
    return;
  }
  
  failedSuites.forEach(suite => {
    const componentName = path.basename(suite.name, '.test.tsx').replace('.test.ts', '');
    console.log(`\n\x1b[1m\x1b[4mComponent: ${componentName}\x1b[0m`);
    
    const failedTests = suite.assertionResults
      .filter(test => test.status === 'failed');
    
    failedTests.forEach((test, index) => {
      console.log(`\n${index + 1}. \x1b[31m✕ ${test.title}\x1b[0m`);
      
      const errorMessage = test.failureMessages[0] || '';
      const errorType = extractErrorType(errorMessage);
      console.log(`   Error Type: \x1b[33m${errorType}\x1b[0m`);
      
      // Print first line of error message
      const firstLine = errorMessage.split('\n')[0].replace(/\u001b\[\d+m/g, '');
      console.log(`   Message: ${firstLine}`);
      
      // Print code snippet if available
      const codeSnippet = extractCodeSnippet(errorMessage);
      if (codeSnippet) {
        console.log(`   Problem Code (line ${codeSnippet.line}): \x1b[36m${codeSnippet.code}\x1b[0m`);
      }
      
      console.log('');
    });
  });
}

function printCommonIssues(results) {
  // Keep your existing printCommonIssues function...
  const formatted = formatResults(results);
  const categories = formatted.failureCategories;
  
  console.log('\n================================================');
  console.log('               COMMON ISSUES                     ');
  console.log('================================================\n');
  
  for (const category in categories) {
    const failures = categories[category];
    if (failures.length > 0) {
      console.log(`\x1b[1m${category} (${failures.length} issues):\x1b[0m`);
      
      // Group issues by component
      const componentIssues = {};
      failures.forEach(failure => {
        if (!componentIssues[failure.component]) {
          componentIssues[failure.component] = [];
        }
        componentIssues[failure.component].push(failure.testName);
      });
      
      // Print grouped issues
      for (const component in componentIssues) {
        console.log(`  \x1b[36m${component}:\x1b[0m`);
        componentIssues[component].forEach((testName, i) => {
          console.log(`    ${i+1}. ${testName}`);
        });
      }
      
      // Print recommendation for this category
      printRecommendation(category);
      console.log('');
    }
  }
}

function printRecommendation(errorType) {
  const recommendations = {
    'Element Not Found': 'Add data-testid attributes to make elements easier to select in tests',
    'Assertion Error': 'Check expected vs actual values in your assertions',
    'Missing Browser API': 'Mock browser APIs like ResizeObserver in your Jest setup',
    'Context Provider Missing': 'Make sure to wrap components in required context providers',
    'Type Error': 'Check property names and types in your component props',
    'Runtime Error': 'Look for uncaught exceptions in your component code'
  };
  
  if (recommendations[errorType]) {
    console.log(`  \x1b[32mRecommendation: ${recommendations[errorType]}\x1b[0m`);
  }
}

// Display help if requested
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
  Test Results Analyzer
  ---------------------
  
  Usage:
    node showFailedTests.js [options]
    
  Options:
    --inputFile=<path>    Path to test results JSON file (default: test-results.json)
    --outputFile=<path>   Path to write parsed results (default: parsed-test-results.json)
    --projectRoot=<path>  Project root directory (default: current directory)
    
  Examples:
    node showFailedTests.js
    node showFailedTests.js --inputFile=custom-results.json
  `);
  process.exit(0);
}

// Run the analyzer
analyzeTestResults();