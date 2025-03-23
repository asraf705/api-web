let performanceData = {};

/* global chrome */
chrome.webRequest.onCompleted.addListener(
  (details) => {
    const { url, timeStamp, statusCode } = details;
    
    if (!performanceData[url]) {
      performanceData[url] = {
        timestamps: [],
        responseTimes: [],
        statusCodes: [],
        errors: 0
      };
    }

    performanceData[url].timestamps.push(new Date().toISOString());
    performanceData[url].responseTimes.push(details.timeStamp);
    performanceData[url].statusCodes.push(statusCode);

    if (statusCode >= 400) {
      performanceData[url].errors++;
    }

    // Keep only last 30 entries
    if (performanceData[url].timestamps.length > 30) {
      performanceData[url].timestamps.shift();
      performanceData[url].responseTimes.shift();
      performanceData[url].statusCodes.shift();
    }

    chrome.storage.local.set({ performanceData });
  },
  { urls: ["<all_urls>"] }
);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'getPerformanceData') {
    sendResponse({ performanceData });
  }
});