
import { loadSettings, saveSettingsHandler, testConnection, resetSettings } from '../settingsHandlers';
import { getSettings, saveSettings, defaultSettings } from '../storage';
import * as settingsUI from '../settingsUI';

// Mock dependencies
jest.mock('../storage', () => ({
  getSettings: jest.fn(),
  saveSettings: jest.fn(),
  defaultSettings: {
    apiUrl: 'https://api.default.com',
    userId: 'default-user',
    notifications: {
      taskComplete: true,
      errors: true
    }
  }
}));

jest.mock('../settingsUI', () => ({
  showConnectionStatus: jest.fn(),
  showErrorMessage: jest.fn(),
  showSuccessMessage: jest.fn(),
  showWarningMessage: jest.fn()
}));

// Mock fetch for testing API connections
global.fetch = jest.fn();

describe('settingsHandlers', () => {
  let apiUrlInput: HTMLInputElement;
  let userIdInput: HTMLInputElement;
  let notifyTaskComplete: HTMLInputElement;
  let notifyErrors: HTMLInputElement;
  let connectionStatus: HTMLDivElement;
  let testConnectionButton: HTMLButtonElement;
  let settingsForm: Element;
  
  beforeEach(() => {
    // Set up DOM elements
    document.body.innerHTML = `
      <div class="settings-form">
        <input id="api-url" type="text" />
        <input id="user-id" type="text" />
        <input id="notify-task-complete" type="checkbox" />
        <input id="notify-errors" type="checkbox" />
        <div id="connection-status"></div>
        <button id="test-connection">Test Connection</button>
      </div>
    `;
    
    // Get references to DOM elements
    apiUrlInput = document.getElementById('api-url') as HTMLInputElement;
    userIdInput = document.getElementById('user-id') as HTMLInputElement;
    notifyTaskComplete = document.getElementById('notify-task-complete') as HTMLInputElement;
    notifyErrors = document.getElementById('notify-errors') as HTMLInputElement;
    connectionStatus = document.getElementById('connection-status') as HTMLDivElement;
    testConnectionButton = document.getElementById('test-connection') as HTMLButtonElement;
    settingsForm = document.querySelector('.settings-form') as Element;
    
    // Reset mocks
    jest.clearAllMocks();
  });

  describe('loadSettings', () => {
    it('should load settings from storage and populate form', async () => {
      const mockSettings = {
        apiUrl: 'https://api.test.com',
        userId: 'test-user',
        notifications: {
          taskComplete: false,
          errors: true
        }
      };
      
      (getSettings as jest.Mock).mockResolvedValue(mockSettings);
      
      await loadSettings(apiUrlInput, userIdInput, notifyTaskComplete, notifyErrors);
      
      expect(apiUrlInput.value).toBe(mockSettings.apiUrl);
      expect(userIdInput.value).toBe(mockSettings.userId);
      expect(notifyTaskComplete.checked).toBe(false);
      expect(notifyErrors.checked).toBe(true);
    });

    it('should use default settings if none are saved', async () => {
      (getSettings as jest.Mock).mockResolvedValue({});
      
      await loadSettings(apiUrlInput, userIdInput, notifyTaskComplete, notifyErrors);
      
      expect(apiUrlInput.value).toBe(defaultSettings.apiUrl);
      expect(userIdInput.value).toBe(defaultSettings.userId);
      expect(notifyTaskComplete.checked).toBe(true);
      expect(notifyErrors.checked).toBe(true);
    });

    it('should handle errors when loading settings', async () => {
      (getSettings as jest.Mock).mockRejectedValue(new Error('Failed to load'));
      
      await loadSettings(apiUrlInput, userIdInput, notifyTaskComplete, notifyErrors);
      
      expect(settingsUI.showErrorMessage).toHaveBeenCalledWith(
        'Failed to load settings. Please try again.',
        expect.any(Element)
      );
    });
  });

  describe('saveSettingsHandler', () => {
    it('should save valid settings', async () => {
      apiUrlInput.value = 'https://api.valid.com';
      userIdInput.value = 'valid-user';
      notifyTaskComplete.checked = true;
      notifyErrors.checked = false;
      
      (saveSettings as jest.Mock).mockResolvedValue(undefined);
      
      await saveSettingsHandler(apiUrlInput, userIdInput, notifyTaskComplete, notifyErrors, connectionStatus);
      
      expect(saveSettings).toHaveBeenCalledWith({
        apiUrl: 'https://api.valid.com',
        userId: 'valid-user',
        notifications: {
          taskComplete: true,
          errors: false
        }
      });
      
      expect(settingsUI.showSuccessMessage).toHaveBeenCalled();
    });

    it('should validate URL format', async () => {
      apiUrlInput.value = 'invalid-url';
      userIdInput.value = 'valid-user';
      
      await saveSettingsHandler(apiUrlInput, userIdInput, notifyTaskComplete, notifyErrors, connectionStatus);
      
      expect(saveSettings).not.toHaveBeenCalled();
      expect(settingsUI.showErrorMessage).toHaveBeenCalledWith(
        'Please enter a valid URL for the API endpoint.',
        expect.any(Element)
      );
    });

    it('should validate email format for email-like user IDs', async () => {
      apiUrlInput.value = 'https://api.valid.com';
      userIdInput.value = 'invalid@email';
      
      await saveSettingsHandler(apiUrlInput, userIdInput, notifyTaskComplete, notifyErrors, connectionStatus);
      
      expect(saveSettings).not.toHaveBeenCalled();
      expect(settingsUI.showErrorMessage).toHaveBeenCalledWith(
        'Please enter a valid email address for User ID.',
        expect.any(Element)
      );
    });

    it('should handle empty API URL', async () => {
      apiUrlInput.value = '  ';
      userIdInput.value = 'valid-user';
      
      await saveSettingsHandler(apiUrlInput, userIdInput, notifyTaskComplete, notifyErrors, connectionStatus);
      
      expect(saveSettings).not.toHaveBeenCalled();
      expect(settingsUI.showErrorMessage).toHaveBeenCalledWith(
        'API URL cannot be empty.',
        expect.any(Element)
      );
    });
  });

  // We should add more comprehensive tests for testConnection and resetSettings
  // This is just a basic test to get started
  describe('testConnection', () => {
    beforeEach(() => {
      // Reset fetch mock
      (global.fetch as jest.Mock).mockReset();
    });

    it('should test a valid connection', async () => {
      apiUrlInput.value = 'https://api.valid.com';
      
      // Mock a successful response
      const mockResponse = {
        ok: true,
        status: 200,
        json: jest.fn().mockResolvedValue({ status: 'healthy' })
      };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);
      
      await testConnection(apiUrlInput, connectionStatus, testConnectionButton);
      
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.valid.com/health-check',
        expect.any(Object)
      );
      
      expect(settingsUI.showConnectionStatus).toHaveBeenCalledWith(
        'Connection successful!',
        true,
        connectionStatus
      );
    });

    // Add more tests for connection failures, timeouts, etc.
  });
});
