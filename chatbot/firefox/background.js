browser.runtime.onInstalled.addListener(() => {
    browser.storage.sync.set({ apiKey: "" });
    console.log('OpenAI API Key is set to empty string.');
  });
  
  browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getApiKey') {
      browser.storage.sync.get(['apiKey'], (result) => {
        sendResponse(result.apiKey);
      });
      return true;
    }
    if (request.action === 'setApiKey') {
      browser.storage.sync.set({ apiKey: request.apiKey });
      sendResponse({ status: 'success' });
    }
  });
  