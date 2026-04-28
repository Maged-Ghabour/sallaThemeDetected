/**
 * Background Service Worker — Salla & Zid Theme Detector
 * Handles tab updates and relays messages between popup and content script.
 */

// Clear cached result when navigating to a new page
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "loading") {
    chrome.storage.local.remove("detectionResult");
  }
});

// Relay messages from popup → content script → popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "runDetection") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs || !tabs[0]) {
        sendResponse({ error: "No active tab found" });
        return;
      }

      const tabId = tabs[0].id;
      const tabUrl = tabs[0].url || "";

      // Block chrome:// and extension pages
      if (
        tabUrl.startsWith("chrome://") ||
        tabUrl.startsWith("chrome-extension://") ||
        tabUrl.startsWith("about:") ||
        tabUrl.startsWith("edge://")
      ) {
        sendResponse({
          error: "Cannot scan this page. Please navigate to a website.",
        });
        return;
      }

      // 1. Get globals from MAIN world to bypass CSP
      chrome.scripting.executeScript(
        {
          target: { tabId },
          world: "MAIN",
          func: () => {
            const getT = (root) => root && root.config ? root.config.theme : null;
            return {
              salla: { theme: getT(window.Salla) || getT(window.SallaConfig) || getT(window.salla) },
              zid:   { theme: getT(window.zid) || getT(window.Zid) || getT(window.ZidConfig) },
              bare:  window.theme || null
            };
          }
        },
        (injectionResults) => {
          const globals = (injectionResults && injectionResults[0] && injectionResults[0].result) || {};

          // 2. Make sure content script is injected (runs in ISOLATED world)
          chrome.scripting.executeScript(
            {
              target: { tabId },
              files: ["content.js"],
            },
            () => {
              // 3. Send message to content script with globals
              setTimeout(() => {
                chrome.tabs.sendMessage(tabId, { action: "detect", globals: globals }, (response) => {
                  const msgError = chrome.runtime.lastError;
                  if (msgError || !response) {
                    chrome.storage.local.get("detectionResult", (data) => {
                      if (data.detectionResult) {
                        sendResponse(data.detectionResult);
                      } else {
                        sendResponse({ error: "Could not communicate with page. Try refreshing." });
                      }
                    });
                  } else {
                    sendResponse(response);
                  }
                });
              }, 150);
            }
          );
        }
      );
    });

    return true; // Keep async channel open
  }
});
