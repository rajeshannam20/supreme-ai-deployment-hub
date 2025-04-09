
const fs = require('fs');
const path = require('path');

// Read the package.json file
const packageJsonPath = path.join(__dirname, '../package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Add or update deployment and release scripts
packageJson.scripts = {
  ...packageJson.scripts,
  "test": "jest",
  "test:watch": "jest --watch",
  "test:extension": "node scripts/run-extension-tests.js",
  "test:e2e": "playwright test",
  "test:ci": "jest --ci --coverage && playwright test",
  "test:coverage": "jest --coverage",
  "build:dev": "node scripts/build-env.js development",
  "build:staging": "node scripts/build-env.js staging", 
  "build:prod": "node scripts/build-env.js production",
  "release:patch": "node scripts/release.js patch",
  "release:minor": "node scripts/release.js minor",
  "release:major": "node scripts/release.js major",
  "deploy:chrome": "chrome-webstore-upload upload --source ./dist"
};

// Write the updated package.json
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

console.log('✅ Updated package.json with deployment and release scripts');
