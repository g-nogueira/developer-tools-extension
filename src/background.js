'use strict';

// With background scripts you can communicate with popup
// and contentScript files.
// For more information on background script,
// See https://developer.chrome.com/extensions/background_pages

// const runCodeInTab = (tabId, code) => {
//   chrome.scripting.executeScript({
//     target: { tabId: tabId },
//     function: new Function(code),
//   });
// };



chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "runCodeInTab") {
    runCodeInTab(message.tabId, message.code);
  }
});