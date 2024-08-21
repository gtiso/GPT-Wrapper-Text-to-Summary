chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({ apiKey: "" });
    console.log('OpenAI API Key is set to empty string.');
  });
  
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getApiKey') {
      chrome.storage.sync.get(['apiKey'], (result) => {
        sendResponse(result.apiKey);
      });
      return true;
    }
    if (request.action === 'setApiKey') {
      chrome.storage.sync.set({ apiKey: request.apiKey });
      sendResponse({ status: 'success' });
    }
  });
  