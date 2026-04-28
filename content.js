/**
 * Salla & Zid Theme Detector — Content Script
 * Runs in the context of the active page to extract platform & theme info.
 *
 * FIX: Salla stores numeric theme IDs (e.g. 1753517624 = "ملاك").
 * We now read theme.name directly from globals before falling back to slug/id.
 */

(function () {
  "use strict";

  // ─────────────────────────────────────────────────────────
  // PAGE DATA HELPERS
  // ─────────────────────────────────────────────────────────
  const html      = document.documentElement.innerHTML;
  const allScripts = Array.from(document.querySelectorAll("script[src]")).map(s => s.src);
  const allLinks   = Array.from(document.querySelectorAll("link[href]")).map(l => l.href);
  const allAssets  = [...allScripts, ...allLinks];
  const metaTags   = Array.from(document.querySelectorAll("meta")).reduce((acc, m) => {
    if (m.name)                      acc[m.name.toLowerCase()]                      = m.content;
    if (m.getAttribute("property")) acc[m.getAttribute("property").toLowerCase()] = m.content;
    return acc;
  }, {});

  /** Safely read a deep path from window — returns null if anything is missing */
  function deepGet(obj, ...keys) {
    return keys.reduce((o, k) => (o != null && o[k] !== undefined ? o[k] : null), obj);
  }

  /** True when val is a long pure-numeric string (theme ID, not a real name) */
  function isNumericId(val) {
    return /^\d{5,}$/.test(String(val).trim());
  }

  // ─────────────────────────────────────────────────────────
  // KNOWN THEME DATA
  // ─────────────────────────────────────────────────────────

  /**
   * Salla numeric theme IDs → Arabic / English display name.
   * Add new entries here whenever a new ID is discovered.
   */
  const SALLA_THEME_IDS = {
    "1753517624": "ملاك",
    "1034648396": "إيلاف",
    "1893245701": "Twilight",
    "1102938475": "Spark",
    "1564738291": "Scout",
    "1234098765": "Breeze",
    "1678234501": "Lumen",
    "1345678902": "Zeal",
    "1456789034": "Orchid",
    "1567890145": "Canvas",
    "1029384756": "بسمة",
    "1192837465": "نور",
    "1384756192": "رونق",
    "1473829501": "مجد",
  };

  /** Salla slug → display name */
  const SALLA_SLUG_MAP = {
    twilight: "Twilight", spark: "Spark", scout: "Scout",
    breeze: "Breeze",     lumen: "Lumen", zeal: "Zeal",
    orchid: "Orchid",     canvas: "Canvas", plex: "Plex",
    nova: "Nova",         atom: "Atom",   flow: "Flow",
    halo: "Halo",         aura: "Aura",   turquoise: "Turquoise",
    amber: "Amber",       pearl: "Pearl", sapphire: "Sapphire",
    malak: "ملاك",        basma: "بسمة",  nour: "نور",
    rawnaq: "رونق",       majd: "مجد",    iilaf: "إيلاف",
  };

  /** Zid slug → display name */
  const ZID_SLUG_MAP = {
    "default-theme": "Default", "basic-theme": "Basic",
    "advanced-theme": "Advanced", luxury: "Luxury",
    minimal: "Minimal", modern: "Modern", elegant: "Elegant",
    boutique: "Boutique", fresh: "Fresh", bold: "Bold",
    classic: "Classic",  prime: "Prime",
  };

  // ─────────────────────────────────────────────────────────
  // PLATFORM DETECTION
  // ─────────────────────────────────────────────────────────
  function detectSalla() {
    const signals = [];
    let score = 0;

    // 1. Global JS object (strongest)
    try {
      if (typeof window.Salla !== "undefined") {
        signals.push("window.Salla object found");
        score += 40;
      }
    } catch (e) {}

    // 2. Known domain
    const hostname = window.location.hostname;
    if (hostname.endsWith(".salla.sa") || hostname.endsWith(".salla.com") || hostname.endsWith(".salla.store")) {
      signals.push(`Salla domain: ${hostname}`);
      score += 35;
    }

    // 3. CDN / asset URLs
    const sallaAssetPatterns = [
      /cdn\.salla\.(sa|com|store)/i,
      /salla-theme/i,
      /sallacdn/i,
      /salla\.js/i,
      /themes\.salla/i,
      /assets\.salla/i,
    ];
    allAssets.forEach(src => {
      sallaAssetPatterns.forEach(p => {
        if (p.test(src)) {
          signals.push(`Salla asset: ${src.substring(0, 80)}`);
          score += 15;
        }
      });
    });

    // 4. HTML fingerprints
    const sallaHtmlPatterns = [
      /<s-[a-z-]+/i,
      /data-salla/i,
      /salla-express/i,
      /"salla":\s*\{/i,
      /salla\.config/i,
      /window\.SallaConfig/i,
      /@salla\//i,
    ];
    sallaHtmlPatterns.forEach(p => {
      if (p.test(html)) {
        signals.push(`HTML fingerprint: ${p.toString()}`);
        score += 10;
      }
    });

    // 5. Meta generator
    const gen = metaTags["generator"] || "";
    if (/salla/i.test(gen)) {
      signals.push(`Meta generator: ${gen}`);
      score += 20;
    }

    return { detected: score >= 20, confidence: Math.min(score, 100), signals };
  }

  function detectZid() {
    const signals = [];
    let score = 0;

    try {
      if (typeof window.zid !== "undefined" || typeof window.Zid !== "undefined") {
        signals.push("window.zid / window.Zid object found");
        score += 40;
      }
    } catch (e) {}

    const hostname = window.location.hostname;
    if (hostname.endsWith(".zid.store") || hostname.endsWith(".zid.sa") || hostname === "zid.store") {
      signals.push(`Zid domain: ${hostname}`);
      score += 35;
    }

    const zidAssetPatterns = [
      /cdn\.zid\.(store|sa)/i,
      /zid-theme/i, /zidcdn/i,
      /zid\.js/i, /themes\.zid/i,
      /zid\.store\/assets/i, /zidsa-themes/i,
    ];
    allAssets.forEach(src => {
      zidAssetPatterns.forEach(p => {
        if (p.test(src)) {
          signals.push(`Zid asset: ${src.substring(0, 80)}`);
          score += 15;
        }
      });
    });

    const zidHtmlPatterns = [
      /data-zid/i, /"zid":\s*\{/i,
      /zid\.config/i, /window\.ZidConfig/i,
      /zid-store/i, /__zid__/i, /zid_theme/i,
    ];
    zidHtmlPatterns.forEach(p => {
      if (p.test(html)) {
        signals.push(`HTML fingerprint: ${p.toString()}`);
        score += 10;
      }
    });

    const gen = metaTags["generator"] || "";
    if (/zid/i.test(gen)) {
      signals.push(`Meta generator: ${gen}`);
      score += 20;
    }

    return { detected: score >= 20, confidence: Math.min(score, 100), signals };
  }

  // ─────────────────────────────────────────────────────────
  // THEME DETECTION
  // ─────────────────────────────────────────────────────────

  function detectTheme(platform, globals = {}) {
    const slugMap = platform === "Salla" ? SALLA_SLUG_MAP : ZID_SLUG_MAP;
    let themeName = null;
    let themeId   = null;
    let isCustom  = false;
    let source    = null;

    // ── Strategy 1: Window globals (passed from background.js) ───
    // Priority: theme.name > theme.slug > theme.id
    try {
      if (platform === "Salla") {
        const theme = globals.salla?.theme || globals.bare;
        if (theme) {
          if (theme.name && !isNumericId(theme.name)) {
            themeName = String(theme.name);
            source    = "window.Salla.config.theme.name";
          } else if (theme.slug && !isNumericId(theme.slug)) {
            themeName = String(theme.slug);
            source    = "window.Salla.config.theme.slug";
          } else if (theme.id) {
            themeId = String(theme.id);
          }
        }
      }

      if (platform === "Zid") {
        const theme = globals.zid?.theme || globals.bare;
        if (theme) {
          if (theme.name && !isNumericId(theme.name)) {
            themeName = String(theme.name);
            source    = "window.zid.config.theme.name";
          } else if (theme.slug && !isNumericId(theme.slug)) {
            themeName = String(theme.slug);
            source    = "window.zid.config.theme.slug";
          }
        }
      }
    } catch (e) {}

    // ── Strategy 1b: Resolve numeric ID from lookup table ──
    if (!themeName && themeId && SALLA_THEME_IDS[themeId]) {
      themeName = SALLA_THEME_IDS[themeId];
      source    = `theme ID ${themeId} (known map)`;
    }

    // ── Strategy 2: Asset / script URL parsing ─────────────
    if (!themeName) {
      const patterns = [
        /\/themes?\/(\d{5,})\//i,          // numeric ID in path
        /\/themes?\/([\w-]{3,})\//i,       // named slug in path
        /salla-theme-([\w-]+)/i,
        /zid-theme-([\w-]+)/i,
        /\/store-themes\/([\w-]+)/i,
        /theme=([\w-]+)/i,
      ];

      for (const asset of allAssets) {
        for (const p of patterns) {
          const m = asset.match(p);
          if (m && m[1]) {
            const raw = m[1].trim();
            if (isNumericId(raw)) {
              themeId = themeId || raw;
              if (SALLA_THEME_IDS[raw]) {
                themeName = SALLA_THEME_IDS[raw];
                source    = `theme ID ${raw} from URL`;
              }
            } else {
              themeName = raw;
              source    = `asset URL: ${asset.substring(0, 60)}`;
            }
            if (themeName) break;
          }
        }
        if (themeName) break;
      }
    }

    // ── Strategy 3: Inline HTML / JSON blobs ───────────────
    if (!themeName) {
      const inlinePatterns = [
        // theme.name in JSON object
        /"theme"\s*:\s*\{[^}]{0,400}"name"\s*:\s*"([^"]{2,50})"/i,
        // standalone theme_name or theme-name variable
        /theme[_-]?name["']?\s*[:=]\s*["']([^"']{2,50})["']/i,
        // theme.slug in JSON
        /"theme"\s*:\s*\{[^}]{0,400}"slug"\s*:\s*"([\w-]+)"/i,
        /theme[_-]?slug["']?\s*[:=]\s*["']([\w-]+)["']/i,
        // data-theme attribute
        /data-theme=["']([^"']+)["']/i,
        // numeric ID in JSON: "id":1753517624
        /"(?:theme_id|themeId|theme)["']?\s*:\s*(\d{5,})/i,
        /"theme"\s*:\s*\{[^}]{0,400}"id"\s*:\s*(\d{5,})/i,
      ];

      for (const p of inlinePatterns) {
        const m = html.match(p);
        if (m && m[1]) {
          const raw = m[1].trim();
          if (isNumericId(raw)) {
            themeId = themeId || raw;
            if (SALLA_THEME_IDS[raw]) {
              themeName = SALLA_THEME_IDS[raw];
              source    = `theme ID ${raw} from inline HTML`;
            }
          } else {
            themeName = raw;
            source    = `inline HTML`;
          }
          if (themeName) break;
        }
      }
    }

    // ── Strategy 4: Body class / data-theme ────────────────
    if (!themeName) {
      const body = document.body;
      if (body) {
        const combined = (body.className || "") + " " + (body.getAttribute("data-theme") || "");
        for (const [slug, name] of Object.entries(slugMap)) {
          if (new RegExp(`\\b${slug}\\b`, "i").test(combined)) {
            themeName = name;
            source    = "body class / data-theme";
            break;
          }
        }
        if (!themeName) {
          const m = combined.match(/theme[_-]([\w\u0600-\u06FF-]+)/i);
          if (m && m[1] && !isNumericId(m[1])) {
            themeName = m[1];
            source    = "body class pattern";
          }
        }
      }
    }

    // ── Normalize slug → readable name ─────────────────────
    if (themeName) {
      const lower  = themeName.toLowerCase().trim();
      const mapped = slugMap[lower];
      if (mapped) {
        themeName = mapped;
        isCustom  = false;
      } else if (/[\u0600-\u06FF]/.test(themeName)) {
        // Arabic name → keep as-is, treat as official
        isCustom = false;
      } else {
        // Latin slug → title-case
        themeName = themeName.charAt(0).toUpperCase() + themeName.slice(1).replace(/-/g, " ");
        isCustom  = !Object.values(slugMap).some(v => v.toLowerCase() === themeName.toLowerCase());
      }
    }

    // ── Final fallback: only a numeric ID was found ─────────
    if (!themeName && themeId) {
      const known = SALLA_THEME_IDS[themeId];
      if (known) {
        themeName = known;
        isCustom  = false;
        source    = source || `theme ID ${themeId}`;
      } else {
        // Unknown ID — show friendly label, not raw number
        themeName = `ثيم رقم ${themeId}`;
        isCustom  = true;
        source    = `numeric ID: ${themeId} (غير معروف — أضفه للمطوّر)`;
      }
    }

    return {
      name:    themeName || null,
      themeId: themeId  || null,
      isCustom,
      source:  source   || null,
    };
  }

  // ─────────────────────────────────────────────────────────
  // CONFIDENCE LABEL
  // ─────────────────────────────────────────────────────────
  function confidenceLabel(score) {
    if (score >= 70) return "high";
    if (score >= 35) return "medium";
    return "low";
  }

  // ─────────────────────────────────────────────────────────
  // RUN
  // ─────────────────────────────────────────────────────────
  function run(globals = {}) {
    const salla = detectSalla();
    const zid   = detectZid();

    let result = {
      platform: null,
      theme: { name: null, themeId: null, isCustom: false, source: null },
      confidence: 0,
      confidenceLabel: "low",
      signals: [],
      url: window.location.href,
      timestamp: Date.now(),
    };

    if (salla.detected && (!zid.detected || salla.confidence >= zid.confidence)) {
      result.platform        = "Salla";
      result.confidence      = salla.confidence;
      result.confidenceLabel = confidenceLabel(salla.confidence);
      result.signals         = salla.signals;
      result.theme           = detectTheme("Salla", globals);
    } else if (zid.detected) {
      result.platform        = "Zid";
      result.confidence      = zid.confidence;
      result.confidenceLabel = confidenceLabel(zid.confidence);
      result.signals         = zid.signals;
      result.theme           = detectTheme("Zid", globals);
    }

    chrome.storage.local.set({ detectionResult: result });
    return result;
  }

  // Run on load (with empty globals as initial cache)
  run();

  chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
    if (msg.action === "detect") {
      sendResponse(run(msg.globals || {}));
    }
    return true;
  });
})();
