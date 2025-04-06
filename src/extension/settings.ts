
import { DevonnSettings, getSettings, saveSettings, defaultSettings } from './storage';

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Get form elements
  const apiUrlInput = document.getElementById('api-url') as HTMLInputElement;
  const userIdInput = document.getElementById('user-id') as HTMLInputElement;
  const testConnectionButton = document.getElementById('test-connection') as HTMLButtonElement;
  const connectionStatus = document.getElementById('connection-status') as HTMLDivElement;
  const notifyTaskComplete = document.getElementById('notify-task-complete') as HTMLInputElement;
  const notifyErrors = document.getElementById('notify-errors') as HTMLInputElement;
  const saveButton = document.getElementById('save-settings') as HTMLButtonElement;
  const resetButton = document.getElementById('reset-settings') as HTMLButtonElement;

  // Load settings
  loadSettings();
  
  // Setup event listeners
  setupEventListeners();

  /**
   * Load settings from Chrome storage
   */
  async function loadSettings(): Promise<void> {
    try {
      const settings = await getSettings();
      
      // Populate form with saved settings or defaults
      apiUrlInput.value = settings.apiUrl || defaultSettings.apiUrl;
      userIdInput.value = settings.userId || defaultSettings.userId;
      
      const notifications = settings.notifications || defaultSettings.notifications;
      notifyTaskComplete.checked = notifications.taskComplete !== false;
      notifyErrors.checked = notifications.errors !== false;
    } catch (error) {
      console.error('Error loading settings:', error);
      showErrorMessage('Failed to load settings. Please try again.');
    }
  }

  /**
   * Save settings to Chrome storage
   */
  async function saveSettingsHandler(): Promise<void> {
    const settings: Partial<DevonnSettings> = {
      apiUrl: apiUrlInput.value.trim(),
      userId: userIdInput.value.trim(),
      notifications: {
        taskComplete: notifyTaskComplete.checked,
        errors: notifyErrors.checked
      }
    };
    
    // Validate URL format
    if (!isValidUrl(settings.apiUrl!)) {
      showErrorMessage('Please enter a valid URL for the API endpoint.');
      return;
    }
    
    try {
      await saveSettings(settings);
      
      // Show saved message
      const successMessage = document.createElement('div');
      successMessage.textContent = 'Settings saved successfully!';
      successMessage.style.backgroundColor = '#d1fae5';
      successMessage.style.color = '#065f46';
      successMessage.style.padding = '10px';
      successMessage.style.borderRadius = '4px';
      successMessage.style.marginTop = '16px';
      
      document.querySelector('.settings-form')?.appendChild(successMessage);
      
      // Remove message after 3 seconds
      setTimeout(() => {
        successMessage.remove();
      }, 3000);
      
      // Reset connection status after URL change
      if (settings.apiUrl !== apiUrlInput.dataset.lastTestedUrl) {
        connectionStatus.textContent = '';
        connectionStatus.className = '';
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      showErrorMessage(`Failed to save settings: ${error}`);
    }
  }

  /**
   * Test API connection
   */
  async function testConnection(): Promise<void> {
    const apiUrl = apiUrlInput.value.trim();
    if (!apiUrl) {
      showConnectionStatus('Please enter API URL', false);
      return;
    }
    
    // Validate URL format
    if (!isValidUrl(apiUrl)) {
      showConnectionStatus('Invalid URL format', false);
      return;
    }
    
    connectionStatus.textContent = 'Testing connection...';
    connectionStatus.className = '';
    testConnectionButton.disabled = true;
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      const response = await fetch(`${apiUrl}/health-check`, {
        method: 'GET',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        showConnectionStatus('Connection successful!', true);
        // Store the last successfully tested URL
        apiUrlInput.dataset.lastTestedUrl = apiUrl;
      } else {
        showConnectionStatus(`Connection failed: Server returned ${response.status}`, false);
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        showConnectionStatus('Connection timed out after 5 seconds', false);
      } else {
        showConnectionStatus(`Connection failed: ${error.message}`, false);
      }
    } finally {
      testConnectionButton.disabled = false;
    }
  }

  /**
   * Show connection status
   */
  function showConnectionStatus(message: string, isSuccess: boolean): void {
    connectionStatus.textContent = message;
    if (isSuccess) {
      connectionStatus.classList.add('success');
      connectionStatus.classList.remove('error');
    } else {
      connectionStatus.classList.add('error');
      connectionStatus.classList.remove('success');
    }
  }

  /**
   * Show error message
   */
  function showErrorMessage(message: string): void {
    const errorMessage = document.createElement('div');
    errorMessage.textContent = message;
    errorMessage.style.backgroundColor = '#fee2e2';
    errorMessage.style.color = '#b91c1c';
    errorMessage.style.padding = '10px';
    errorMessage.style.borderRadius = '4px';
    errorMessage.style.marginTop = '16px';
    
    document.querySelector('.settings-form')?.appendChild(errorMessage);
    
    // Remove message after 5 seconds
    setTimeout(() => {
      errorMessage.remove();
    }, 5000);
  }

  /**
   * Reset settings to defaults
   */
  function resetSettings(): void {
    if (confirm('Are you sure you want to reset all settings to default?')) {
      apiUrlInput.value = defaultSettings.apiUrl;
      userIdInput.value = defaultSettings.userId;
      notifyTaskComplete.checked = defaultSettings.notifications.taskComplete;
      notifyErrors.checked = defaultSettings.notifications.errors;
      
      // Clear connection status
      connectionStatus.textContent = '';
      connectionStatus.className = '';
      
      // Save default settings
      saveSettings();
    }
  }

  /**
   * Validate URL format
   */
  function isValidUrl(string: string): boolean {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  }

  /**
   * Setup event listeners
   */
  function setupEventListeners(): void {
    testConnectionButton.addEventListener('click', testConnection);
    saveButton.addEventListener('click', saveSettingsHandler);
    resetButton.addEventListener('click', resetSettings);
    
    // Add enter key support for API URL field
    apiUrlInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        testConnection();
      }
    });
  }
});
