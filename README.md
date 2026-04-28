# 🔍 Salla & Zid Theme Detector — Chrome Extension

A production-ready **Chrome Extension (Manifest V3)** that detects whether a website is built on **Salla** or **Zid** platform and extracts the active **theme name**.

---

## 📁 Folder Structure

```
salla detected/
├── manifest.json          # Extension manifest (MV3)
├── background.js          # Service worker — message relay & tab events
├── content.js             # Injected into pages — detection logic
├── popup.html             # Extension popup UI
├── popup.js               # Popup controller
├── styles.css             # Dark premium UI styles (RTL Arabic)
├── generate-icons.html    # ← Open this ONCE to create PNG icons
├── icons/
│   ├── icon16.png
│   ├── icon32.png
│   ├── icon48.png
│   └── icon128.png
└── README.md
```

---

## ⚙️ How Detection Works

### Platform Detection (Multi-signal with Confidence Score)

| Signal | Salla | Zid | Points |
|--------|-------|-----|--------|
| `window.Salla` / `window.zid` global object | ✅ | ✅ | +40 |
| Known domain (`.salla.sa`, `.zid.store`, etc.) | ✅ | ✅ | +35 |
| CDN asset URLs (regex patterns) | ✅ | ✅ | +15 per match |
| HTML fingerprints (`<s-*>` components, `data-salla`, etc.) | ✅ | ✅ | +10 per match |
| `<meta name="generator">` tag | ✅ | ✅ | +20 |

**Confidence Threshold:** Score ≥ 20 → platform detected.

### Theme Detection (4-layer Strategy)

1. **Window globals** — `window.Salla.config.theme.slug`, `window.ZidConfig.theme.slug`
2. **Asset URL parsing** — regex on script/link `src`/`href` attributes
3. **Inline HTML patterns** — JSON blobs, `data-theme` attributes, JS variable assignments
4. **Body class / data attributes** — `<body class="theme-twilight">`, `data-theme="spark"`

If the detected slug matches a **known official theme** (Twilight, Spark, Scout, etc.) → marks as **Official**.  
Unknown slug → marks as **Custom theme**.

---

## 🚀 Installation (Local Development)

### Step 1 — Generate Icons
1. Open `generate-icons.html` in **Chrome** (double-click the file)
2. Click **"⬇️ Download All Icons"**
3. Move the 4 downloaded PNG files into the `icons/` folder:
   - `icon16.png`, `icon32.png`, `icon48.png`, `icon128.png`

### Step 2 — Load in Chrome
1. Open Chrome → go to `chrome://extensions/`
2. Enable **Developer mode** (top-right toggle)
3. Click **"Load unpacked"**
4. Select the `salla detected` folder
5. The extension appears in your toolbar 🎉

### Step 3 — Use It
1. Navigate to any Salla or Zid store
2. Click the extension icon in the toolbar
3. View platform, theme name, confidence score, and detection signals
4. Use **"إعادة الفحص"** to rescan at any time
5. Use **📋** to copy results to clipboard

---

## 🎨 UI Features

| Feature | Description |
|---------|-------------|
| **Dark premium UI** | Glassmorphism, ambient glow, smooth animations |
| **Arabic RTL** | Full right-to-left layout with Tajawal font |
| **Platform card** | Color-coded purple (Salla) / blue (Zid) with glow |
| **Confidence bar** | Animated bar — High 🟢 / Medium 🟡 / Low 🔴 |
| **Detection signals** | Expandable list of all signals found |
| **Copy to clipboard** | One-click copy of full detection report |
| **Loading state** | Dual-ring spinner with fade animation |
| **Error state** | Clear Arabic error messages |

---

## 🛡️ Permissions Used

| Permission | Why |
|------------|-----|
| `activeTab` | Access the current tab's URL and run scripts |
| `scripting` | Programmatically inject `content.js` on rescan |
| `storage` | Cache detection result for instant popup load |
| `host_permissions: <all_urls>` | Needed to inject content scripts on any store URL |

> **No external API calls. Everything runs 100% locally in the browser.**

---

## 🔧 Known Salla Themes Detected

`Twilight` · `Spark` · `Scout` · `Breeze` · `Lumen` · `Zeal` · `Orchid` · `Canvas` · `Plex` · `Nova` · `Atom` · `Flow` · `Halo` · `Aura`

## 🔧 Known Zid Themes Detected

`Default` · `Basic` · `Advanced` · `Luxury` · `Minimal` · `Modern` · `Elegant` · `Boutique` · `Fresh` · `Bold`

---

## 🧪 Test URLs

| Store | Platform |
|-------|----------|
| Any `.salla.sa` store | Salla |
| Any `.salla.com` store | Salla |
| Any `.zid.store` store | Zid |
| Your own preview (`salla theme preview`) | Salla |

---

## 📝 Notes

- If the popup shows **cached results**, click **"إعادة الفحص"** to force a fresh scan
- Cache is cleared automatically when you navigate to a new page
- Some stores with heavy CSP or iframe isolation may show lower confidence scores

---

*Built with Manifest V3 · No dependencies · 100% local execution*
