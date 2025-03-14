
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

// Add testing-library/jest-dom dependency
<lov-add-dependency>@testing-library/jest-dom@^5.16.5</lov-add-dependency>
<lov-add-dependency>@testing-library/react@^13.4.0</lov-add-dependency>
<lov-add-dependency>@testing-library/react-hooks@^8.0.1</lov-add-dependency>
<lov-add-dependency>@types/jest@^29.5.1</lov-add-dependency>
