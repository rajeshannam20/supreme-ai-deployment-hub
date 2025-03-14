
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

// Add necessary dependencies
<lov-add-dependency>@testing-library/react-hooks@^8.0.1</lov-add-dependency>
<lov-add-dependency>@testing-library/react@^14.0.0</lov-add-dependency>
<lov-add-dependency>@testing-library/jest-dom@^6.0.0</lov-add-dependency>
<lov-add-dependency>jest@^29.5.0</lov-add-dependency>
<lov-add-dependency>jest-environment-jsdom@^29.5.0</lov-add-dependency>
<lov-add-dependency>ts-jest@^29.1.0</lov-add-dependency>

// Silence console errors during tests
console.error = jest.fn();
console.warn = jest.fn();
