chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension Installed");
});

chrome.action.onClicked.addListener(() => {
  chrome.sidePanel.open({ tabId: chrome.tabs.TAB_ID_NONE });
});

chrome.runtime.onConnect.addListener((port) => {
  if (port.name === "sidepanel") {
    // Handle communication with side panel
  }
});
