
import '@testing-library/jest-dom';

// Extend expect matchers
declare global {
  namespace jest {
    interface Matchers<R> {
      toHaveTextContent: (text: string) => R;
      toBeInTheDocument: () => R;
      toHaveValue: (value: string | number | RegExp) => R;
      toBeDisabled: () => R;
      toHaveClass: (className: string) => R;
      toHaveAttribute: (attr: string, value?: string) => R;
      toBeVisible: () => R;
      toBeChecked: () => R;
      toBePartiallyChecked: () => R;
      toBeRequired: () => R;
      toBeValid: () => R;
      toBeInvalid: () => R;
      toHaveStyle: (css: string | Record<string, any>) => R;
      toHaveFocus: () => R;
      toContainElement: (element: HTMLElement | null) => R;
      toContainHTML: (htmlText: string) => R;
      toHaveDescription: (text: string) => R;
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
