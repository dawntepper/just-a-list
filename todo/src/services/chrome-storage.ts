interface ChromeStorageService {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T): Promise<void>;
  remove(key: string): Promise<void>;
}

class BrowserStorageService implements ChromeStorageService {
  private isExtensionEnvironment(): boolean {
    return typeof chrome !== 'undefined' && !!chrome.storage;
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      if (this.isExtensionEnvironment()) {
        return new Promise((resolve) => {
          chrome.storage.local.get([key], (result) => {
            const error = chrome.runtime.lastError;
            if (error) {
              console.error('Chrome storage get error:', error);
              resolve(null);
            } else {
              resolve(result[key] || null);
            }
          });
        });
      } else {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
      }
    } catch (error) {
      console.error('Storage get error:', error);
      return null;
    }
  }

  async set<T>(key: string, value: T): Promise<void> {
    try {
      if (this.isExtensionEnvironment()) {
        return new Promise((resolve, reject) => {
          chrome.storage.local.set({ [key]: value }, () => {
            const error = chrome.runtime.lastError;
            if (error) {
              reject(error);
            } else {
              resolve();
            }
          });
        });
      } else {
        localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.error('Storage set error:', error);
      throw error;
    }
  }

  async remove(key: string): Promise<void> {
    try {
      if (this.isExtensionEnvironment()) {
        return new Promise((resolve, reject) => {
          chrome.storage.local.remove(key, () => {
            const error = chrome.runtime.lastError;
            if (error) {
              reject(error);
            } else {
              resolve();
            }
          });
        });
      } else {
        localStorage.removeItem(key);
      }
    } catch (error) {
      console.error('Storage remove error:', error);
      throw error;
    }
  }
}

export const storageService = new BrowserStorageService(); 