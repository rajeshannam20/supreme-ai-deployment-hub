
const fs = require('fs');
const path = require('path');

// Read the package.json file
const packageJsonPath = path.join(__dirname, '../package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Add or update test scripts
packageJson.scripts = {
  ...packageJson.scripts,
  "test": "jest",
  "test:watch": "jest --watch",
  "test:extension": "node scripts/run-extension-tests.js",
  "test:e2e": "playwright test",
  "test:ci": "jest --ci --coverage && playwright test",
  "test:coverage": "jest --coverage"
};

// Write the updated package.json
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

console.log('✅ Updated package.json with test scripts');
