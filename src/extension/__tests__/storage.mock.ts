
import { DevonnSettings } from '../storage';

// Mock settings data
const mockSettings: DevonnSettings = {
  apiUrl: 'https://api.devonn.ai',
  userId: 'test-user',
  notifications: {
    taskComplete: true,
    errors: true
  },
  lastCheck: Date.now() // Adding the missing lastCheck property
};

// Mock storage implementation
export const mockChromeStorage = {
  get: jest.fn((keys, callback) => {
    callback({ settings: mockSettings });
  }),
  set: jest.fn((items, callback) => {
    if (callback) callback();
  })
};

// Setup chrome storage mock
export function setupChromeStorageMock() {
  Object.defineProperty(global, 'chrome', {
    value: {
      storage: {
        local: mockChromeStorage
      },
      runtime: {
        lastError: undefined
      }
    },
    writable: true
  });

  return mockChromeStorage;
}

// Reset mock between tests
export function resetChromeStorageMock() {
  mockChromeStorage.get.mockClear();
  mockChromeStorage.set.mockClear();
}
