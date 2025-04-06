
// Background script for Devonn.AI Chrome Extension

// Initialize extension when installed
chrome.runtime.onInstalled.addListener(() => {
  console.log('Devonn.AI Assistant has been installed');
  
  // Set default settings
  chrome.storage.local.get(['apiUrl', 'userId'], (result) => {
    if (!result.apiUrl) {
      chrome.storage.local.set({
        apiUrl: 'http://localhost:8000',
        userId: 'extension-user',
        notifications: {
          taskComplete: true,
          errors: true
        }
      });
    }
  });
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'runTask') {
    runAgentTask(request.agentId, request.task)
      .then(result => sendResponse({ success: true, result }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true; // Keep the message channel open for async response
  }
});

// Run a task using an agent
async function runAgentTask(agentId, task) {
  const settings = await chrome.storage.local.get(['apiUrl']);
  const apiUrl = settings.apiUrl || 'http://localhost:8000';
  
  const response = await fetch(`${apiUrl}/agents/run/${agentId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(task)
  });
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  
  return await response.json();
}

// Check for agent updates periodically (every 15 minutes)
setInterval(async () => {
  try {
    const settings = await chrome.storage.local.get(['apiUrl', 'lastCheck']);
    const apiUrl = settings.apiUrl || 'http://localhost:8000';
    const lastCheck = settings.lastCheck || 0;
    const now = Date.now();
    
    // Only check if it's been at least 15 minutes since last check
    if (now - lastCheck < 15 * 60 * 1000) {
      return;
    }
    
    const response = await fetch(`${apiUrl}/agents/updates?since=${lastCheck}`);
    const data = await response.json();
    
    if (data.updates && data.updates.length > 0) {
      // Show notification about updates
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon48.png',
        title: 'Devonn.AI Updates Available',
        message: `${data.updates.length} agent updates available. Open the extension to refresh.`
      });
    }
    
    // Update the last check timestamp
    chrome.storage.local.set({ lastCheck: now });
  } catch (error) {
    console.error('Error checking for updates:', error);
  }
}, 15 * 60 * 1000); // Check every 15 minutes
