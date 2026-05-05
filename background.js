/**
 * Salla & Zid Theme Detector — Background Service Worker
 * Manages remote configuration and badge state.
 */

// ── Cloud Sync Configuration ──────────────────────────────────
const CONFIG_URL = "https://affiliate.iqla3.com/api/config"; 
const DEFAULT_CONFIG = {
  "themeLinks": {},
  "social": {
    "whatsapp": "+201284867755",
    "coffee": "https://www.buymeacoffee.com/magedghabour",
    "twitter": "https://twitter.com/magedghabour"
  },
  "marketing": {
    "toastMessage": "Salla Theme Detector • Cloud v2.2",
    "specialOffer": null
  },
  "salla_themes": {},
  "zid_themes": {}
};

const tabResults = {}; // Memory cache: tabId -> lastResult

async function fetchRemoteConfig() {
  try {
    const response = await fetch(CONFIG_URL + "?v=" + Date.now());
    if (response.ok) {
      const remoteData = await response.json();
      await chrome.storage.local.set({ "remoteConfig": remoteData });
      console.log("Remote config updated successfully from cloud");

      // Handle Push Notifications (Alert Messages)
      if (remoteData.marketing && remoteData.marketing.alertMessage) {
        const currentAlert = remoteData.marketing.alertMessage;
        const stored = await chrome.storage.local.get("lastAlertMessage");
        if (stored.lastAlertMessage !== currentAlert && currentAlert.trim() !== "") {
          chrome.notifications.create({
            type: "basic",
            iconUrl: "images/icon128.png",
            title: "Salla Theme Detector",
            message: currentAlert,
            priority: 2
          });
          await chrome.storage.local.set({ "lastAlertMessage": currentAlert });
        }
      }

      return remoteData;
    }
  } catch (e) {
    console.warn("Could not reach cloud, using local config:", e);
  }
  
  // Fallback to local or existing
  const local = await chrome.storage.local.get("remoteConfig");
  if (!local.remoteConfig) {
    await chrome.storage.local.set({ "remoteConfig": DEFAULT_CONFIG });
    return DEFAULT_CONFIG;
  }
  return local.remoteConfig;
}

chrome.runtime.onInstalled.addListener(() => {
  console.log("Salla Theme Detector Installed.");
  fetchRemoteConfig();
});

chrome.runtime.onStartup.addListener(() => {
  fetchRemoteConfig();
});

// ── Badge Cycling Logic ───────────────────────────────────────
let cycleTick = 0;
setInterval(() => {
  cycleTick++;
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach(tab => {
      const result = tabResults[tab.id];
      if (!result || !result.platform) return;

      const platform = result.platform;
      const themeName = (result.theme && result.theme.name) || "";
      
      let badgeText = "";
      // Cycle every few seconds
      if (cycleTick % 2 === 0) {
        badgeText = platform === "Salla" ? "سلة" : (platform === "Zid" ? "زد" : platform.substring(0, 4));
      } else {
        badgeText = themeName ? themeName.substring(0, 4) : "✓";
      }

      chrome.action.setBadgeText({ tabId: tab.id, text: badgeText });
      
      // Color coding
      let color = "#5b61f6";
      if (platform === "Salla") color = "#5b61f6";
      else if (platform === "Zid") color = "#00b8d4";
      else if (platform === "Shopify") color = "#95bf47";
      else if (platform === "WordPress") color = "#21759b";

      chrome.action.setBadgeBackgroundColor({ tabId: tab.id, color: color });
    });
  });
}, 3000);

// ── Message Listener ──────────────────────────────────────────
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const tabId = sender.tab ? sender.tab.id : null;

  if (message.action === "updateBadge") {
    if (tabId) {
      tabResults[tabId] = message.result;
    }
    return true;
  }

  if (message.action === "runDetection") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        const activeTab = tabs[0];
        
        // 1. Get latest config
        chrome.storage.local.get("remoteConfig", (storage) => {
          const remote = storage.remoteConfig || DEFAULT_CONFIG;

          // 2. Ping content script
          chrome.tabs.sendMessage(activeTab.id, { action: "ping" }, (pingRes) => {
            const scriptExists = !chrome.runtime.lastError && pingRes && pingRes.status === "alive";

            const proceedWithDetection = () => {
              chrome.tabs.sendMessage(activeTab.id, { 
                action: "detect",
                remoteConfig: remote
              }, (response) => {
                if (!chrome.runtime.lastError && response) {
                  tabResults[activeTab.id] = response;

                  if (response.platform && response.platform !== "Unknown") {
                    try {
                      const trackData = {
                        platform: response.platform,
                        theme_id: response.theme ? String(response.theme.id) : null,
                        theme_name: response.theme ? response.theme.name : null,
                        domain: activeTab.url ? new URL(activeTab.url).hostname : null
                      };
                      fetch("https://affiliate.iqla3.com/api/track", {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                          "Accept": "application/json",
                          "X-Extension-Key": "salla-ext-2024-maged-secret-key"
                        },
                        body: JSON.stringify(trackData)
                      }).catch(err => console.warn("Tracking error:", err));
                    } catch (e) { console.warn(e); }
                  }

                  sendResponse(response);
                } else {
                  sendResponse({ error: "Could not communicate with page." });
                }
              });
            };

            if (scriptExists) {
              proceedWithDetection();
            } else {
              // Inject script if missing
              chrome.scripting.executeScript({
                target: { tabId: activeTab.id },
                files: ["content.js"]
              }, () => {
                if (chrome.runtime.lastError) {
                  sendResponse({ error: "Injection failed: " + chrome.runtime.lastError.message });
                } else {
                  // Wait a bit for script to initialize
                  setTimeout(proceedWithDetection, 100);
                }
              });
            }
          });
        });
      }
    });
    return true; 
  }
});
