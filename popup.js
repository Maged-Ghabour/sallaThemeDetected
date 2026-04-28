/**
 * Salla & Zid Theme Detector — Popup Script
 * Orchestrates UI rendering and communicates with the background service worker.
 */

"use strict";

// ── DOM refs ──────────────────────────────────────────────────
const stateLoading  = document.getElementById("state-loading");
const stateError    = document.getElementById("state-error");
const stateResult   = document.getElementById("state-result");
const errorMessage  = document.getElementById("error-message");

const platformCard  = document.getElementById("platform-card");
const platformIcon  = document.getElementById("platform-icon");
const platformName  = document.getElementById("platform-name");
const statusBadge   = document.getElementById("status-badge");
const statusText    = document.getElementById("status-text");

const themeName     = document.getElementById("theme-name");
const themeType     = document.getElementById("theme-type");
const customRow     = document.getElementById("custom-row");

const confidenceFill  = document.getElementById("confidence-fill");
const confidenceLabel = document.getElementById("confidence-label");

const signalsCard   = document.getElementById("signals-card");
const signalsToggle = document.getElementById("signals-toggle");
const signalsBody   = document.getElementById("signals-body");
const signalsChevron= document.getElementById("signals-chevron");
const signalsList   = document.getElementById("signals-list");
const signalsCount  = document.getElementById("signals-count");

const footerUrl     = document.getElementById("footer-url");
const btnRescan     = document.getElementById("btn-rescan");
const btnCopy       = document.getElementById("btn-copy");

// ── State ────────────────────────────────────────────────────
let lastResult = null;
let signalsOpen = false;

// ── Confidence maps ──────────────────────────────────────────
const CONFIDENCE_MAP = {
  high:   { label: "عالية",    cls: "high",   pct: 90 },
  medium: { label: "متوسطة",   cls: "medium", pct: 55 },
  low:    { label: "منخفضة",   cls: "low",    pct: 20 },
};

const PLATFORM_META = {
  Salla: { icon: "🟣", cls: "salla", color: "salla" },
  Zid:   { icon: "🔵", cls: "zid",   color: "zid"   },
  null:  { icon: "❓", cls: "unknown", color: null   },
};

// ── Helpers ───────────────────────────────────────────────────
function showOnly(el) {
  [stateLoading, stateError, stateResult].forEach((s) => s.classList.add("hidden"));
  el.classList.remove("hidden");
}

function setLoading(loading) {
  btnRescan.disabled = loading;
  btnRescan.innerHTML = loading
    ? `<span class="spinner-ring" style="width:14px;height:14px;border-width:2px;position:static;animation:spin 0.9s linear infinite;border-color:transparent;border-top-color:#fff;border-radius:50%;display:inline-block;"></span> جارٍ الفحص...`
    : `<span>🔄</span> إعادة الفحص`;
}

function animateConfidence(pct, cls) {
  // Force reflow to restart transition
  confidenceFill.style.transition = "none";
  confidenceFill.style.width = "0%";
  confidenceFill.className = `confidence-fill ${cls}`;
  confidenceLabel.className = `confidence-label-text ${cls}`;

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      confidenceFill.style.transition = "width 0.7s cubic-bezier(0.34,1.56,0.64,1)";
      confidenceFill.style.width = `${pct}%`;
    });
  });
}

// ── Render Result ────────────────────────────────────────────
function renderResult(data) {
  lastResult = data;
  showOnly(stateResult);

  const platform = data.platform;
  const meta = PLATFORM_META[platform] || PLATFORM_META[null];
  const detected = !!platform;

  // ── Platform card appearance ──
  platformCard.className = `platform-card ${meta.cls} fade-in`;
  platformIcon.textContent = meta.icon;
  platformName.textContent = platform || "غير معروفة";

  // ── Status badge ──
  if (detected) {
    statusBadge.className = "status-badge detected";
    statusText.textContent = "مكتشف ✓";
  } else {
    statusBadge.className = "status-badge not-detected";
    statusText.textContent = "غير مكتشف";
  }

  // ── Theme name ──
  if (data.theme && data.theme.name) {
    themeName.textContent = data.theme.name;
    themeName.className   = data.theme.isCustom ? "info-value custom-tag" : "info-value";
    // Show raw ID as tooltip so developers can add it to the map
    if (data.theme.themeId) {
      themeName.title = `Theme ID: ${data.theme.themeId}`;
    } else {
      themeName.removeAttribute("title");
    }
  } else {
    themeName.textContent = "غير محدد";
    themeName.className   = "info-value not-found";
    themeName.removeAttribute("title");
  }

  // ── Theme type (custom / official) ──
  if (detected && data.theme && data.theme.name) {
    customRow.classList.remove("hidden");
    themeType.textContent = data.theme.isCustom ? "ثيم مخصص (Custom)" : "ثيم رسمي (Official)";
    themeType.className = data.theme.isCustom ? "info-value custom-tag" : "info-value";
  } else {
    customRow.classList.add("hidden");
  }

  // ── Confidence ──
  const confKey   = (data.confidenceLabel || "low");
  const confMeta  = CONFIDENCE_MAP[confKey] || CONFIDENCE_MAP.low;
  const confPct   = detected ? confMeta.pct : 0;
  confidenceLabel.textContent = detected ? confMeta.label : "—";
  animateConfidence(confPct, confMeta.cls);

  // ── Signals ──
  const signals = data.signals || [];
  signalsCount.textContent = signals.length;
  signalsList.innerHTML = "";

  if (signals.length === 0) {
    signalsCard.classList.add("hidden");
  } else {
    signalsCard.classList.remove("hidden");
    signals.forEach((sig) => {
      const item = document.createElement("div");
      item.className = "signal-item";
      item.textContent = sig;
      signalsList.appendChild(item);
    });
  }

  // ── Footer URL ──
  footerUrl.textContent = data.url || "";
}

function renderError(msg) {
  showOnly(stateError);
  errorMessage.textContent = msg || "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.";
}

// ── Detection ────────────────────────────────────────────────
function runDetection() {
  showOnly(stateLoading);
  setLoading(true);
  signalsOpen = false;
  signalsBody.classList.remove("open");
  signalsChevron.classList.remove("open");

  chrome.runtime.sendMessage({ action: "runDetection" }, (response) => {
    setLoading(false);

    if (chrome.runtime.lastError) {
      renderError("تعذّر الاتصال بالصفحة. يرجى تحديث الصفحة والمحاولة مجددًا.");
      return;
    }

    if (!response) {
      renderError("لم يتم استلام أي استجابة من الصفحة.");
      return;
    }

    if (response.error) {
      renderError(response.error);
      return;
    }

    renderResult(response);
  });
}

// ── Copy to clipboard ────────────────────────────────────────
function copyResult() {
  if (!lastResult) return;

  const platform = lastResult.platform || "غير معروفة";
  const theme    = lastResult.theme?.name || "غير محدد";
  const conf     = CONFIDENCE_MAP[lastResult.confidenceLabel]?.label || "—";
  const url      = lastResult.url || "";
  const isCustom = lastResult.theme?.isCustom ? "ثيم مخصص" : "ثيم رسمي";

  const text = [
    `🔍 Salla & Zid Theme Detector`,
    `━━━━━━━━━━━━━━━━━━━━`,
    `📌 الرابط: ${url}`,
    `🟣 المنصة: ${platform}`,
    `🎨 الثيم:  ${theme} (${isCustom})`,
    `📊 الثقة:  ${conf}`,
    `━━━━━━━━━━━━━━━━━━━━`,
  ].join("\n");

  navigator.clipboard.writeText(text).then(() => {
    btnCopy.textContent = "✅";
    setTimeout(() => { btnCopy.textContent = "📋"; }, 1800);
  }).catch(() => {
    btnCopy.textContent = "❌";
    setTimeout(() => { btnCopy.textContent = "📋"; }, 1500);
  });
}

// ── Signals toggle ───────────────────────────────────────────
signalsToggle.addEventListener("click", () => {
  signalsOpen = !signalsOpen;
  signalsBody.classList.toggle("open", signalsOpen);
  signalsChevron.classList.toggle("open", signalsOpen);
});

// ── Event listeners ──────────────────────────────────────────
btnRescan.addEventListener("click", runDetection);
btnCopy.addEventListener("click", copyResult);

// ── Init ─────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  // Try to show cached result immediately for snappier UX
  chrome.storage.local.get("detectionResult", (data) => {
    if (data.detectionResult) {
      renderResult(data.detectionResult);
      setLoading(false);
    } else {
      runDetection();
    }
  });
});
