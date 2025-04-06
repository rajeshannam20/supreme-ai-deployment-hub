
// DOM Elements
const apiUrlInput = document.getElementById('api-url');
const userIdInput = document.getElementById('user-id');
const testConnectionButton = document.getElementById('test-connection');
const connectionStatus = document.getElementById('connection-status');
const notifyTaskComplete = document.getElementById('notify-task-complete');
const notifyErrors = document.getElementById('notify-errors');
const saveButton = document.getElementById('save-settings');
const resetButton = document.getElementById('reset-settings');

// Default settings
const defaultSettings = {
  apiUrl: 'http://localhost:8000',
  userId: 'extension-user',
  notifications: {
    taskComplete: true,
    errors: true
  }
};

// Initialize settings page
document.addEventListener('DOMContentLoaded', () => {
  loadSettings();
  setupEventListeners();
});

// Load settings from Chrome storage
async function loadSettings() {
  const data = await chrome.storage.local.get([
    'apiUrl',
    'userId',
    'notifications'
  ]);
  
  // Populate form with saved settings or defaults
  apiUrlInput.value = data.apiUrl || defaultSettings.apiUrl;
  userIdInput.value = data.userId || defaultSettings.userId;
  
  const notifications = data.notifications || defaultSettings.notifications;
  notifyTaskComplete.checked = notifications.taskComplete !== false;
  notifyErrors.checked = notifications.errors !== false;
}

// Save settings to Chrome storage
function saveSettings() {
  const settings = {
    apiUrl: apiUrlInput.value.trim(),
    userId: userIdInput.value.trim(),
    notifications: {
      taskComplete: notifyTaskComplete.checked,
      errors: notifyErrors.checked
    }
  };
  
  chrome.storage.local.set(settings, () => {
    // Show saved message
    const successMessage = document.createElement('div');
    successMessage.textContent = 'Settings saved successfully!';
    successMessage.style.backgroundColor = '#d1fae5';
    successMessage.style.color = '#065f46';
    successMessage.style.padding = '10px';
    successMessage.style.borderRadius = '4px';
    successMessage.style.marginTop = '16px';
    
    document.querySelector('.settings-form').appendChild(successMessage);
    
    // Remove message after 3 seconds
    setTimeout(() => {
      successMessage.remove();
    }, 3000);
  });
}

// Test API connection
async function testConnection() {
  const apiUrl = apiUrlInput.value.trim();
  if (!apiUrl) {
    showConnectionStatus('Please enter API URL', false);
    return;
  }
  
  connectionStatus.textContent = 'Testing connection...';
  connectionStatus.className = '';
  
  try {
    const response = await fetch(`${apiUrl}/health-check`, {
      method: 'GET'
    });
    
    if (response.ok) {
      showConnectionStatus('Connection successful!', true);
    } else {
      showConnectionStatus('Connection failed: Server error', false);
    }
  } catch (error) {
    showConnectionStatus(`Connection failed: ${error.message}`, false);
  }
}

// Show connection status
function showConnectionStatus(message, isSuccess) {
  connectionStatus.textContent = message;
  if (isSuccess) {
    connectionStatus.classList.add('success');
    connectionStatus.classList.remove('error');
  } else {
    connectionStatus.classList.add('error');
    connectionStatus.classList.remove('success');
  }
}

// Reset settings to defaults
function resetSettings() {
  if (confirm('Are you sure you want to reset all settings to default?')) {
    apiUrlInput.value = defaultSettings.apiUrl;
    userIdInput.value = defaultSettings.userId;
    notifyTaskComplete.checked = defaultSettings.notifications.taskComplete;
    notifyErrors.checked = defaultSettings.notifications.errors;
    
    // Save default settings
    saveSettings();
  }
}

// Setup event listeners
function setupEventListeners() {
  testConnectionButton.addEventListener('click', testConnection);
  saveButton.addEventListener('click', saveSettings);
  resetButton.addEventListener('click', resetSettings);
}
