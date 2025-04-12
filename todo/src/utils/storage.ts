export const storage = {
  get: (key: string): Promise<string | null> => { // Specify the return type
    return new Promise((resolve) => {
      if (typeof chrome !== "undefined" && chrome.storage) {
        chrome.storage.local.get([key], (result) => {
          resolve(result[key] || null); // Ensure null is returned if the key doesn't exist
        });
      } else {
        resolve(localStorage.getItem(key)); // This can return null
      }
    });
  },
  set: (key: string, value: string | number | object): Promise<void> => { // Specify the type for value
    return new Promise((resolve) => {
      if (typeof chrome !== "undefined" && chrome.storage) {
        chrome.storage.local.set({ [key]: value }, resolve);
      } else {
        localStorage.setItem(key, JSON.stringify(value));
        resolve();
      }
    });
  },
};
