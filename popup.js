
// Global variables
let activeTab = 'agents';
let selectedAgentId = null;
let apiUrl = 'http://localhost:8000'; // Default API URL
let agents = [];
let memories = [];
let tools = [];

// DOM Elements
const agentsList = document.getElementById('agents-list');
const memoriesList = document.getElementById('memories-list');
const toolsList = document.getElementById('tools-list');
const taskInput = document.getElementById('task-description');
const runTaskBtn = document.getElementById('run-task-btn');
const searchInput = document.getElementById('memory-search');
const searchBtn = document.getElementById('search-btn');
const settingsBtn = document.getElementById('settings-btn');
const connectionStatus = document.getElementById('connection-status');
const tabButtons = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tab-content');

// Initialize the extension
document.addEventListener('DOMContentLoaded', async () => {
  await loadSettings();
  setupEventListeners();
  switchTab('agents');
  checkApiConnection();
});

// Load settings from Chrome storage
async function loadSettings() {
  const data = await chrome.storage.local.get(['apiUrl']);
  if (data.apiUrl) {
    apiUrl = data.apiUrl;
  }
}

// Save settings to Chrome storage
function saveSettings(settings) {
  chrome.storage.local.set(settings);
}

// Check API connection
async function checkApiConnection() {
  try {
    const response = await fetch(`${apiUrl}/health-check`, {
      method: 'GET'
    });
    
    if (response.ok) {
      connectionStatus.textContent = 'Connected';
      connectionStatus.classList.add('connected');
      loadAgents();
      loadTools();
    } else {
      throw new Error('API returned error');
    }
  } catch (error) {
    connectionStatus.textContent = 'Connection failed';
    connectionStatus.classList.add('error');
    console.error('API connection error:', error);
  }
}

// Setup event listeners
function setupEventListeners() {
  // Tab switching
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      switchTab(button.getAttribute('data-tab'));
    });
  });

  // Run task button
  runTaskBtn.addEventListener('click', runTask);
  
  // Search memories
  searchBtn.addEventListener('click', searchMemories);
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      searchMemories();
    }
  });

  // Settings button
  settingsBtn.addEventListener('click', openSettings);
}

// Switch between tabs
function switchTab(tabName) {
  activeTab = tabName;
  
  // Update tab buttons
  tabButtons.forEach(button => {
    if (button.getAttribute('data-tab') === tabName) {
      button.classList.add('active');
    } else {
      button.classList.remove('active');
    }
  });

  // Update tab content
  tabContents.forEach(content => {
    if (content.id === `${tabName}-tab`) {
      content.classList.add('active');
    } else {
      content.classList.remove('active');
    }
  });

  // Load content based on selected tab
  if (tabName === 'agents' && agents.length === 0) {
    loadAgents();
  } else if (tabName === 'memory' && selectedAgentId) {
    loadMemories(selectedAgentId);
  } else if (tabName === 'tools' && tools.length === 0) {
    loadTools();
  }
}

// Load agents from API
async function loadAgents() {
  document.getElementById('agents-loading').style.display = 'block';
  agentsList.innerHTML = '';
  
  try {
    const response = await fetch(`${apiUrl}/agents/list`);
    const data = await response.json();
    agents = data.agents || [];
    
    renderAgentsList();
  } catch (error) {
    console.error('Error loading agents:', error);
    agentsList.innerHTML = '<p class="error-message">Failed to load agents</p>';
  } finally {
    document.getElementById('agents-loading').style.display = 'none';
  }
}

// Render agents list
function renderAgentsList() {
  agentsList.innerHTML = '';
  
  if (agents.length === 0) {
    agentsList.innerHTML = '<p>No agents found</p>';
    return;
  }

  agents.forEach(agent => {
    const agentItem = document.createElement('div');
    agentItem.className = 'agent-item';
    if (agent.id === selectedAgentId) {
      agentItem.classList.add('selected');
    }
    
    agentItem.innerHTML = `
      <div class="agent-name">${agent.name}</div>
      <div class="agent-desc">${agent.desc || 'No description'}</div>
    `;
    
    agentItem.addEventListener('click', () => {
      selectAgent(agent.id);
    });
    
    agentsList.appendChild(agentItem);
  });

  updateTaskButtonState();
}

// Select an agent
function selectAgent(agentId) {
  selectedAgentId = agentId;
  
  // Update UI
  document.querySelectorAll('.agent-item').forEach(item => {
    item.classList.remove('selected');
  });
  
  document.querySelectorAll('.agent-item').forEach(item => {
    const name = item.querySelector('.agent-name').textContent;
    const agent = agents.find(a => a.name === name);
    if (agent && agent.id === agentId) {
      item.classList.add('selected');
    }
  });

  // Enable run task button
  updateTaskButtonState();
  
  // If on memory tab, load memories for selected agent
  if (activeTab === 'memory') {
    loadMemories(agentId);
  }
}

// Update task button state
function updateTaskButtonState() {
  runTaskBtn.disabled = !selectedAgentId || !taskInput.value.trim();
}

// Run a task with the selected agent
async function runTask() {
  if (!selectedAgentId || !taskInput.value.trim()) {
    return;
  }
  
  const task = {
    user_id: 'extension-user',
    task_description: taskInput.value.trim(),
    context: 'Chrome Extension'
  };
  
  runTaskBtn.disabled = true;
  runTaskBtn.textContent = 'Running...';
  
  try {
    const response = await fetch(`${apiUrl}/agents/run/${selectedAgentId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(task)
    });
    
    const result = await response.json();
    
    // Create a notification with the result
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon48.png',
      title: 'Task Completed',
      message: result.output || 'No output returned'
    });
    
    // Clear task input
    taskInput.value = '';
  } catch (error) {
    console.error('Error running task:', error);
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon48.png',
      title: 'Task Failed',
      message: 'Failed to run the task. Please check the console for details.'
    });
  } finally {
    runTaskBtn.disabled = false;
    runTaskBtn.textContent = 'Run Task';
  }
}

// Load memories for an agent
async function loadMemories(agentId) {
  memoriesList.innerHTML = '<div class="loading-spinner">Loading memories...</div>';
  
  try {
    const response = await fetch(`${apiUrl}/memories/${agentId}`);
    const data = await response.json();
    memories = data || [];
    
    renderMemoriesList();
  } catch (error) {
    console.error('Error loading memories:', error);
    memoriesList.innerHTML = '<p class="error-message">Failed to load memories</p>';
  }
}

// Render memories list
function renderMemoriesList() {
  memoriesList.innerHTML = '';
  
  if (memories.length === 0) {
    memoriesList.innerHTML = '<p>No memories found</p>';
    return;
  }

  memories.forEach(memory => {
    const memoryItem = document.createElement('div');
    memoryItem.className = 'memory-item';
    
    const timestamp = new Date(memory.timestamp).toLocaleString();
    
    memoryItem.innerHTML = `
      <div class="memory-content">${memory.content}</div>
      <div class="memory-meta">
        <span>${memory.context || 'No context'}</span>
        <span>${timestamp}</span>
      </div>
    `;
    
    memoriesList.appendChild(memoryItem);
  });
}

// Search memories
async function searchMemories() {
  const query = searchInput.value.trim();
  if (!query) return;
  
  memoriesList.innerHTML = '<div class="loading-spinner">Searching memories...</div>';
  
  try {
    const params = new URLSearchParams({
      query: query,
      agent_id: selectedAgentId || ''
    });
    
    const response = await fetch(`${apiUrl}/memories/search?${params}`);
    const data = await response.json();
    memories = data || [];
    
    renderMemoriesList();
  } catch (error) {
    console.error('Error searching memories:', error);
    memoriesList.innerHTML = '<p class="error-message">Failed to search memories</p>';
  }
}

// Load tools from API
async function loadTools() {
  document.getElementById('tools-loading').style.display = 'block';
  toolsList.innerHTML = '';
  
  try {
    const response = await fetch(`${apiUrl}/tools`);
    const data = await response.json();
    tools = data.tools || [];
    
    renderToolsList();
  } catch (error) {
    console.error('Error loading tools:', error);
    toolsList.innerHTML = '<p class="error-message">Failed to load tools</p>';
  } finally {
    document.getElementById('tools-loading').style.display = 'none';
  }
}

// Render tools list
function renderToolsList() {
  toolsList.innerHTML = '';
  
  if (tools.length === 0) {
    toolsList.innerHTML = '<p>No tools found</p>';
    return;
  }

  tools.forEach(tool => {
    const toolItem = document.createElement('div');
    toolItem.className = 'tool-item';
    
    toolItem.innerHTML = `
      <div class="agent-name">${tool.name}</div>
      <div class="agent-desc">${tool.description || 'No description'}</div>
    `;
    
    toolsList.appendChild(toolItem);
  });
}

// Open settings dialog
function openSettings() {
  const currentApiUrl = apiUrl;
  
  const newApiUrl = prompt('Enter API URL:', currentApiUrl);
  if (newApiUrl && newApiUrl !== currentApiUrl) {
    apiUrl = newApiUrl;
    saveSettings({ apiUrl });
    
    // Reset connection status
    connectionStatus.textContent = 'Not connected';
    connectionStatus.classList.remove('connected', 'error');
    
    // Check connection with new URL
    checkApiConnection();
  }
}

// Listen for task input changes
taskInput.addEventListener('input', updateTaskButtonState);
