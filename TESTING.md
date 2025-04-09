
# DEVONN.AI Testing Guide

This document outlines how to run tests for the DEVONN.AI project, including the Chrome extension.

## Types of Tests

### Unit Tests

We use Jest for unit testing components, utilities, and business logic.

```bash
# Run all unit tests
npm test

# Run unit tests in watch mode (for development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

### Extension Tests

The Chrome extension has dedicated tests that validate its functionality:

```bash
# Run all extension tests
npm run test:extension
```

This script runs tests across multiple browsers and screen sizes, generating a comprehensive report.

### End-to-End Tests

We use Playwright for E2E testing:

```bash
# Run all E2E tests
npm run test:e2e

# Install Playwright browsers if needed
npx playwright install
```

## Test Structure

- `src/__tests__/` - Main application component tests
- `src/extension/__tests__/` - Chrome extension tests
- `src/extension/__tests__/e2e/` - End-to-end tests for the extension

## Writing Tests

### Unit Test Guidelines

1. Each component or utility should have corresponding test file(s)
2. Tests should be isolated and not depend on other tests
3. Use mocks for external dependencies
4. Test both success and error cases

### Extension Test Guidelines

1. Chrome API calls should be mocked
2. Test UI interactions and validation logic
3. Test storage operations
4. Verify proper error handling and user feedback

### E2E Test Guidelines

1. Tests should mimic real user behavior
2. Cover critical user flows
3. Test across multiple browsers and screen sizes
4. Use sensible timeouts to prevent flaky tests

## Continuous Integration

All tests are run automatically in CI:

```bash
# Run all tests for CI
npm run test:ci
```

This command runs both Jest and Playwright tests, generating coverage reports.

## Test Reports

After running tests, you can find reports in:

- Unit test coverage: `coverage/`
- Extension test results: `test-results/`
- E2E test report: `playwright-report/`

## Troubleshooting

### Extension Tests

If extension tests are failing:

1. Make sure the Chrome extension is properly built
2. Check that the extension ID is correct in the test configuration
3. Verify that Chrome API mocks are working correctly

### E2E Tests

If Playwright tests are failing:

1. Run with `--debug` flag to see the browser in action
2. Check for timing issues or selector changes
3. Ensure the app is running if testing against a live instance

For any persistent issues, check the error logs and consider updating test selectors or adding appropriate waits.
