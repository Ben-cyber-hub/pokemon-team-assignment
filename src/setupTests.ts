import '@testing-library/jest-dom';
import { QueryClient } from '@tanstack/react-query';
import { config } from 'dotenv';

// Load environment variables from .env.test
config({ path: '.env.test' });

// Declare module augmentation for test environment
declare module '@testing-library/react' {
  interface RenderOptions {
    queryClient?: QueryClient;
  }
}

// Create global QueryClient for tests
declare global {
  interface Window {
    queryClient: QueryClient;
  }
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      cacheTime: 0,
    },
  },
});

// Mock ResizeObserver
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.ResizeObserver = ResizeObserverMock;

// Assign to window object for global access in tests
window.queryClient = queryClient;

// Make this a module
export { queryClient };