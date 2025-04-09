
# Devonn.AI Chrome Extension

This Chrome extension allows you to interact with Devonn.AI agents, tools, and memory directly from your browser.

## Features

- Access and run Devonn.AI agents
- Browse agent memories
- Search through agent knowledge
- View available tools
- Quick access to Devonn.AI functionality

## Installation

### Development Mode

1. Clone or download this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" (toggle in the top-right corner)
4. Click "Load unpacked" and select the folder containing the extension files
5. The Devonn.AI extension should now be installed and visible in your extensions list

### Configuration

1. Click on the extension icon in your browser toolbar
2. Click the "Settings" button at the bottom of the popup
3. Enter your Devonn.AI API URL (default: http://localhost:8000)
4. Click "Save Settings"

## Usage

1. Click on the Devonn.AI extension icon in your browser toolbar
2. Select an agent from the list
3. Type your task in the text area
4. Click "Run Task" to execute
5. Use the tabs to switch between Agents, Memory, and Tools

## Development

This extension is built with vanilla JavaScript, HTML, and CSS. The structure is as follows:

- `manifest.json` - Extension configuration
- `popup.html`, `popup.css`, `popup.js` - Main extension popup UI
- `settings.html`, `settings.css`, `settings.js` - Settings page
- `background.js` - Background service worker for notifications and updates
- `icons/` - Extension icons

## Testing

We use Jest and Playwright for testing. To run the tests:

```bash
# Run all tests
npm test

# Run tests with watch mode
npm run test:watch

# Run only extension tests
npm run test:extension

# Run end-to-end tests
npm run test:e2e

# Run tests with coverage reports
npm run test:coverage
```

For more detailed testing information, please see the [Testing Documentation](./TESTING.md).

## Documentation

Complete documentation for the extension and API is available in the following locations:

- [Extension Documentation](./src/extension/DOCUMENTATION.md) - Information about the Chrome extension
- [API Reference](https://devonn.ai/api) - Full API documentation
- [Deployment Guides](https://devonn.ai/documentation) - Guides for deploying in various environments

## Requirements

- Chrome browser (version 88 or later)
- Running Devonn.AI backend API (default: http://localhost:8000)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

