import { storageService } from '../chrome-storage';

interface ChromeRuntimeError {
  message: string;
}

interface MockChromeStorage {
  local: {
    get: jest.Mock;
    set: jest.Mock;
    remove: jest.Mock;
    clear: jest.Mock;
  };
  runtime: {
    lastError: ChromeRuntimeError | null;
  };
}

// Mock chrome storage
const mockChromeStorage: MockChromeStorage = {
  local: {
    get: jest.fn(),
    set: jest.fn(),
    remove: jest.fn(),
    clear: jest.fn(),
  },
  runtime: {
    lastError: null,
  },
};

// @ts-expect-error - Mock chrome object
global.chrome = mockChromeStorage;

describe('ChromeStorageService', () => {
  beforeEach(() => {
    // Clear storage before each test
    localStorage.clear();
    mockChromeStorage.local.clear.mockClear();
    mockChromeStorage.local.get.mockClear();
  });

  describe('get', () => {
    it('should retrieve data from chrome storage', async () => {
      const testData = { test: 'value' };
      mockChromeStorage.local.get.mockImplementation((keys: string[], callback: (result: Record<string, unknown>) => void) => {
        callback({ testKey: testData });
      });

      const result = await storageService.get('testKey');
      expect(result).toEqual(testData);
    });

    it('should handle chrome storage errors', async () => {
      mockChromeStorage.runtime.lastError = { message: 'Test error' };
      mockChromeStorage.local.get.mockImplementation((keys: string[], callback: (result: Record<string, unknown>) => void) => {
        callback({});
      });

      const result = await storageService.get('testKey');
      expect(result).toBeNull();
      mockChromeStorage.runtime.lastError = null;
    });
  });

  // Add more test cases for set and remove methods
}); 