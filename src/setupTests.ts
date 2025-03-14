
import '@testing-library/jest-dom';

// Extend expect matchers
declare global {
  namespace jest {
    interface Matchers<R> {
      toHaveTextContent: (text: string) => R;
    }
  }
}

// Mock for window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Silence console errors during tests
console.error = jest.fn();
console.warn = jest.fn();
