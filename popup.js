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
const buyThemeRow   = document.getElementById("buy-theme-row");
const buyThemeLink  = document.getElementById("buy-theme-link");


const btnRescan     = document.getElementById("btn-rescan");
const btnCopy       = document.getElementById("btn-copy");
const btnLang       = document.getElementById("btn-lang");
const btnSearch     = document.getElementById("btn-search");

const stateSearch   = document.getElementById("state-search");
const searchInput   = document.getElementById("search-input");
const searchResults = document.getElementById("search-results");
const searchEmpty   = document.getElementById("search-empty");
const filterBtns    = document.querySelectorAll(".filter-btn");

const stateHistory  = document.getElementById("state-history");
const historyList   = document.getElementById("history-list");
const historyEmpty  = document.getElementById("history-empty");
const btnClearHistory = document.getElementById("btn-clear-history");
const stateLinks    = document.getElementById("state-links");
const navItems      = document.querySelectorAll(".nav-item");

// ── State ────────────────────────────────────────────────────
let lastResult = null;
let currentLang = "ar";
let searchActive = false; // Legacy, will use switchTab
let currentFilter = "all";
let currentTab = "home";

// ── i18n ──────────────────────────────────────────────────────
// javascript-obfuscator:disable
const TRANSLATIONS = {
  ar: {
    header_title: "كاشف المنصة والثيم",
    loading_text: "جارٍ الفحص...",
    error_title: "تعذّر الفحص",
    error_desc: "حدث خطأ أثناء محاولة فحص الصفحة.",
    platform_label: "المنصة المكتشفة",
    status_detected: "مكتشف ✓",
    status_not_detected: "غير مكتشف",
    theme_name_label: "اسم الثيم",
    theme_type_label: "نوع الثيم",
    confidence_label: "درجة الثقة",
    visuals_title: "الهوية البصرية للمتجر",
    colors_label: "الألوان المستخدمة",
    fonts_label: "الخطوط المكتشفة",
    tech_title: "أدوات التسويق والتقنية",
    marketing_text: "هل تريد تصميم متجر احترافي؟",
    btn_whatsapp: "اطلب تصميم متجرك الآن",
    btn_rescan: "إعادة الفحص",
    unknown: "غير محدد",
    theme_official: "ثيم رسمي (Official)",
    theme_custom: "ثيم مخصص (Custom)",
    conf_high: "عالية",
    conf_medium: "متوسطة",
    conf_low: "منخفضة",
    no_tech: "لم يتم اكتشاف أدوات إضافية",
    no_colors: "لم يتم العثور على ألوان",
    no_fonts: "لم يتم العثور على خطوط",
    copy_success: "✅",
    copy_fail: "❌",
    copy_ready: "📋",
    search_placeholder: "ابحث عن اسم الثيم أو ID...",
    search_empty: "لم يتم العثور على ثيمات تطابق بحثك.",
    filter_all: "الكل",
    filter_salla: "سلة",
    filter_zid: "زد",
    search_btn_title: "البحث عن ثيم",
    history_title: "المتاجر المحللة مؤخراً",
    history_empty: "لا توجد متاجر في السجل حالياً.",
    nav_home: "الرئيسية",
    nav_themes: "الثيمات",
    nav_history: "السجل",
    platform_salla: "سلة",
    platform_zid: "زد",
    platform_shopify: "شوبيفاي",
    platform_youcan: "يوكان",
    platform_magento: "ماجينتو",
    platform_prestashop: "بريستا شوب",
    platform_opencart: "أوبن كارت",
    platform_bigcommerce: "بيج كوميرس",
    platform_wix: "ويكس",
    platform_squarespace: "سكوير سبيس",
    platform_wordpress: "وردبريس",
    platform_unknown: "غير معروفة"
  },
  en: {
    header_title: "Platform & Theme Detector",
    loading_text: "Scanning store...",
    error_title: "Scan Failed",
    error_desc: "An error occurred while scanning the page.",
    platform_label: "Detected Platform",
    status_detected: "Detected ✓",
    status_not_detected: "Not Detected",
    theme_name_label: "Theme Name",
    theme_type_label: "Theme Type",
    confidence_label: "Confidence Score",
    visuals_title: "Store Visual Identity",
    colors_label: "Primary Colors",
    fonts_label: "Detected Fonts",
    tech_title: "Marketing & Tech Stack",
    marketing_text: "Need a professional store design?",
    btn_whatsapp: "Request your design now",
    btn_rescan: "Re-scan Store",
    unknown: "Unknown",
    theme_official: "Official Theme",
    theme_custom: "Custom Theme",
    conf_high: "High",
    conf_medium: "Medium",
    conf_low: "Low",
    no_tech: "No additional tools detected",
    no_colors: "No colors found",
    no_fonts: "No fonts found",
    copy_success: "✅",
    copy_fail: "❌",
    copy_ready: "📋",
    search_placeholder: "Search theme name or ID...",
    search_empty: "No themes found matching your search.",
    filter_all: "All",
    filter_salla: "Salla",
    filter_zid: "Zid",
    search_btn_title: "Search Theme",
    history_title: "Recently Analyzed",
    history_empty: "No stores in history yet.",
    nav_home: "Home",
    nav_themes: "Themes",
    nav_history: "History",
    platform_salla: "Salla",
    platform_zid: "Zid",
    platform_shopify: "Shopify",
    platform_youcan: "YouCan",
    platform_magento: "Magento",
    platform_prestashop: "PrestaShop",
    platform_opencart: "OpenCart",
    platform_bigcommerce: "BigCommerce",
    platform_wix: "Wix",
    platform_squarespace: "Squarespace",
    platform_wordpress: "WordPress",
    platform_unknown: "Unknown"
  }
};

function setLanguage(lang) {
  currentLang = lang;
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  btnLang.textContent = lang === "ar" ? "EN" : "عربي";
  
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (TRANSLATIONS[lang][key]) {
      el.textContent = TRANSLATIONS[lang][key];
    }
    const placeholderKey = el.getAttribute("data-i18n-placeholder");
    if (placeholderKey && TRANSLATIONS[lang][placeholderKey]) {
      el.setAttribute("placeholder", TRANSLATIONS[lang][placeholderKey]);
    }
  });

  chrome.storage.local.set({ selectedLang: lang });
  if (lastResult) renderResult(lastResult);
}

function toggleLanguage() {
  const next = currentLang === "ar" ? "en" : "ar";
  setLanguage(next);
}

// ── Confidence maps ──────────────────────────────────────────
const CONFIDENCE_MAP = {
  high:   { ar: "عالية", en: "High",   cls: "high",   pct: 90 },
  medium: { ar: "متوسطة", en: "Medium", cls: "medium", pct: 55 },
  low:    { ar: "منخفضة", en: "Low",    cls: "low",    pct: 20 },
};

const SALLA_THEME_IDS_LOCAL = {
  "1247874246": "رائد", "568597563": "نمو", "2038173539": "واثق", "404046066": "فريد", "392563753": "زيين",
  "766360058": "فخامة", "1617628556": "امتياز", "1034648396": "ملاك", "1696219221": "وسام", "197173496": "مختلف",
  "575338046": "طاهر", "513499943": "بريستيج", "268429610": "نمو", "1245464956": "جميل", "1049159835": "موعد",
  "600639717": "كليك", "466157229": "أكاسيا", "2048178472": "بيوتي", "1480248829": "متجر", "2101895899": "رهيب",
  "1894368909": "اطلالة", "1974201424": "رؤية", "1660707346": "رقمى", "581928698": "سيليا", "1753517624": "عالي",
  "1755865368": "بوتيك", "1253916907": "بيلا", "724522601": "مبدع", "1048198927": "شوبنج", "2093313756": "يافا",
  "2142196958": "بريق", "1016570170": "علا", "2071596307": "جلامور", "1485429532": "ريس", "539684003": "خيوط",
  "1462103872": "قصص", "1145699248": "كراون", "338190499": "كيان", "1582624105": "لوفيزا", "368921700": "نماء",
  "1662840947": "ماركت", "245671147": "روح", "822457965": "عطاء", "1546328629": "سمارت", "638956130": "ثمن",
  "945336214": "ساجي", "1827574400": "رناواي", "596333041": "ابداع", "1534326188": "رِحلة", "1460868166": "آرت",
  "502925332": "جلوبى", "268341705": "ذهب", "1544606478": "مرح", "265993961": "عِنان", "1241617822": "رحيق",
  "2084773836": "فريشمارت", "1822327849": "قهوة", "429755461": "غنا", "1780291170": "بيانو", "510413540": "فاشون",
  "781706584": "جميلة", "1577196143": "بليند", "77875411": "جولدن", "1734608997": "بـريـس_تـا", "1980654236": "خيال",
  "1984184780": "سبورتفاي", "1086321417": "الأصايل", "1424507866": "لمسة", "138027263": "تيرا", "592734670": "جوتراد",
  "569197373": "نماء", "1651680021": "نقاء", "1263602201": "نسيج", "1369561097": "جليمر", "1688297410": "مواسم",
  "1350850078": "شيك", "1057862511": "ليجو", "2116815542": "مسالم", "125310300": "بهجة", "980620793": "مذاق",
  "755871446": "رواسي", "2002897911": "ارتقاء", "1041107384": "بلور", "800211181": "ياسمين", "220469314": "ستوريا",
  "217796426": "نجم", "1592946635": "ألوري", "1141799720": "ايكو", "765784172": "حرير", "845406978": "اكسترا",
  "1082561676": "أيقونة", "1111293706": "أصيل", "342617772": "سيمتا", "1467724464": "رونق", "1155479931": "زينة",
  "519786499": "إسبارك", "996088907": "إلكترون", "2068030156": "سكري", "281718707": "منيو", "2134291879": "اثاث",
  "47569131": "ديجيتال", "1818347309": "لونا", "1739537572": "لوكس", "1189444482": "الكترا", "1789924449": "ستيباب",
  "1599379264": "بروتال", "835771272": "فنجال", "711411447": "أناقة", "251824297": "يافا", "1688984101": "تكنو",
  "324447868": "بارت", "1154792728": "طيبة", "1318482578": "فارماسال", "323037919": "مزايا", "934614468": "ليله",
  "943837848": "ترس", "965120482": "وهج", "1663988716": "لافندر", "76413068": "رالي", "209047556": "تسوق",
  "1921336991": "فلوريزا", "319706053": "فلورا", "2132142397": "جوي توي", "892216257": "ليالي", "1925842409": "شهد",
  "1456070295": "ليما", "856288425": "أريكة", "980393132": "رقي", "1049559847": "بِينْك", "498132723": "أكتيف",
  "107546260": "درب", "1946175377": "ريأكت", "531843130": "بيور", "221156517": "تمور", "826595551": "طراز",
  "1257369338": "طراز", "763160707": "عِنان", "1136099780": "فيو", "650711604": "ديجيتال", "1783594117": "طيف",
  "519299094": "فخر", "841594907": "بيتسي", "1029300075": "أُنس", "1313325318": "أمان", "1953037787": "ريترو",
  "1515734710": "هنا", "1482518396": "بايرلين", "1121414454": "ترف", "124595202": "مخمل", "1524733148": "وشاح",
  "1100239379": "سيري", "894085812": "سينت", "1600326275": "وجهة", "867325509": "عبق", "538856565": "أريكة",
  "1379094127": "جراي", "2140394614": "مليكة", "1514818822": "ريبو", "416209744": "سيرة", "1886663628": "تميز",
  "1349888690": "فاتن", "663056354": "جواهر", "166626249": "كفو", "1155192228": "نايا", "1568224047": "بن",
  "963236070": "نسيج", "1541775946": "تسالي", "844379262": "سكر", "697955958": "ريان", "264294837": "أفق",
  "58708512": "تراڤو", "626232485": "جوري", "1133027754": "نقي", "258399580": "ألوان", "667468690": "رابـــِــح",
  "93404080": "رابـــِــح", "1440982161": "رويال", "2065800929": "سوم", "1440981498": "مَخْمَل",
  "1951088007": "محصول", "1773372150": "فائق", "683129327": "مزايا", "1592433390": "محرك", "40297589": "روعة",
  "815383924": "قمر", "2103324124": "نوريا", "594611923": "بلاك", "1368715218": "رانيورا", "904045008": "كسرة",
  "239035350": "ساند", "1012024533": "أثر", "2046993724": "نايا", "1576058571": "كاكاو", "312769175": "جوهرة",
  "1995586709": "فاتن", "1783846755": "تميز", "1497101358": "سفرة", "1873032143": "ريبو", "1107969023": "مليكة",
  "1910425985": "جراي", "428970927": "أثينا", "146864721": "عبق", "485674501": "وجهة", "238641881": "سينت",
  "1121878777": "سيري", "1464234984": "وشاح", "1947889931": "كلاسيك", "186469831": "ترف", "1622993825": "بايرلين",
  "1327703065": "هنا", "1187766038": "ريترو", "2091965330": "أمان", "1110782388": "أُنس", "777330487": "بيتسي",
  "39105770": "فخر", "1017065877": "طيف", "1655837332": "ديجيتال", "2140366990": "فيو", "1825202310": "عِنان",
  "54522868": "طراز", "827512043": "تمور", "1029861527": "بيور", "598004948": "ريأكت", "1814171761": "درب",
  "306573680": "أكتيف", "302961717": "بِينْك", "1075950900": "رُقي", "1810145234": "أريكة", "505311441": "سيليا",
  "1797146889": "شهد", "241705472": "ليالي", "485056801": "جوي توي", "1185257977": "فلورا", "1776892441": "فلوريزا",
  "842694915": "تسوق", "619807266": "رالي", "1598371733": "لافندر", "1138588187": "وهج", "1556066333": "ترس",
  "821326355": "ليله", "1791753848": "ماكس", "836284701": "فارماسال", "1068142312": "طيبه", "535882890": "براند",
  "1351879850": "تكنو", "114290089": "تاج", "1865839635": "أناقة", "2113118697": "فنجال", "1057953436": "بروتال",
  "740215998": "بريستيج", "1378987453": "زاهر", "1556551807": "فخامة", "1548352431": "مُختلف", "814202285": "زين",
  "1723506348": "امتياز", "349994915": "وسام", "989286562": "فريد", "1764372897": "واثق", "73130640": "عالي",
  "1130931637": "ملاك", "5541564": "كليك", "1298199463": "رائد",
};

const ZID_THEME_IDS_LOCAL = {
  "44213182-c478-41b6-841b-c6d2fffe6be3": "موج العود",
  "4b0a29b7-5e75-401f-aee7-ee3316820b26": "شوفاي",
  "f9f0914d-3c58-493b-bd83-260ed3cb4e82": "سوفت",
  "8ba6ae26-32ea-4271-81b2-0d9d6804a473": "اشراق",
  "20e10dd5-cf9d-4a6c-87d3-bfecd5a7b4d6": "غسق",
  "ada248fd-a964-40b0-99ab-0a3c6d316f88": "راناواي",
  "8f1390a5-89d7-4ee8-ad6a-21ee9dd5103b": "جاما",
  "1dfc41af-b288-43f4-bedf-d2de974ecd80": "جاما",
  "1eb6bb46-1c14-4a5d-b11d-7c329a9985b6": "لوكس",
  "fd242cb5-1003-4526-8ea0-b2124d1a7f2e": "تميز (احترافي)",
  "4974ba37-b490-43b6-b4ab-188e74494ae2": "دارك",
  "41989791-8180-41c5-b68c-4b57d123762e": "لوفيزا",
  "2d3a8786-4282-4951-b0ed-cb9a1f835586": "رولز",
  "5ac8bff0-86d6-4cbe-842b-c7d853fb14ec": "ابتكار",
  "2ee516f5-9bc7-4895-b39c-b54865e36e93": "الأصايل",
  "3071d086-e7e1-4043-9ecb-5fe1d1c3405b": "الأصايل",
  "f8ad52f6-e6cf-4b1f-9605-e1cf3bb0fee5": "قصص",
  "a7246731-95b9-45ac-b03f-d9e981b57db4": "الملكي",
  "5a225613-8a35-4692-8348-517ea2b98b7b": "بلور",
  "fd11a287-c19e-4977-adcd-e918cec1afdb": "ستايل",
  "2f2af20a-f9e8-468d-a2ce-cafec2b4f511": "رقمي",
  "26f48a8b-9e4e-42c4-ae00-2be6a84f3a7c": "رُقي",
  "f0f4165c-73c2-41d8-817b-60bd0804ee4c": "زيادة",
  "2d2b5e89-cbd7-4211-aa8f-69eaa2f7121f": "كيان",
  "f951e4c7-fb2d-4a49-80e1-ec4e0d8b23aa": "لؤلؤ",
  "9b3c76ff-9881-495b-a95a-0e3356e0718b": "فوود توب",
  "ef6a5e40-1974-4ba9-b6a0-0443e09cd5fc": "ريس",
  "90565842-c024-4232-a369-7addfc45bf99": "بكسلة",
  "0475e33f-de73-4d10-beb9-adb39f053709": "قولدن",
  "35ec26f7-5480-4af7-9c0d-65af112b2f96": "مورف",
  "951883df-71c5-48e5-8a7f-03dce06b3011": "بريق",
  "f6eb5409-0158-4974-82bc-44e79728a5ba": "الكترو",
  "7e330b9d-bf73-45b3-83d7-2f64e63c057f": "جلامور",
  "bf7c44aa-a3d5-4739-98e9-2ef7701f1629": "بيسان",
  "23968bb5-d8f9-49f3-81f1-e7e4d54322da": "اورجانيك",
  "9c2fd906-fb7d-4a71-9cda-1f82580085f9": "زمرد",
  "e8e1ed4f-8683-46be-8b32-3a186a4fb5e7": "فيرجن4",
  "ed6efba9-7ce3-44f0-9e09-ccfa70222722": "حسام",
  "3cdfe750-5b32-4827-90fe-d3febcc38200": "اريكة",
  "c31006fb-d11d-46d1-b2d7-ea92dc1d987b": "ريو",
  "c6acee5f-a4ae-4cc0-b3c0-6803d9c6499b": "بيتس",
  "af00435d-4851-4b1f-b156-45bbf57ea3d9": "سبورتفاي",
  "aedfd94c-e16e-4512-8a7a-187578b2bb92": "رقية",
  "ba5a6c88-04e5-4385-82bc-31514232029a": "إبراق",
  "75d03a09-2ae2-40f4-b735-ee1f8bd11da3": "فرح",
  "a84f959d-39ed-4e00-b21f-6c101fe122ce": "جلوبى",
  "7ead95af-938b-4cfe-92b2-a08b4b920692": "عالم الأثاث",
  "2dbfb7b2-86f1-43d7-9caa-7d99a9023442": "ألفا",
  "518835e2-e5fb-47e1-91c9-3aa9b6aea9a9": "الأمل",
  "5ddcdb1e-d89e-4df6-b52e-7250c814e8c0": "فودي",
  "e7516d73-d9c3-4296-b2fc-1180b366097e": "ريغالو",
  "86b4dd64-dbc4-4908-b7a8-a669376a8fa7": "ترندي",
  "c93a16ab-c272-42a2-b2b1-82dd66dcdd54": "ســـــنور",
  "443035a0-9fe9-4105-ab8a-5eaf789be5c2": "تكنولوجي",
  "355c5bee-200f-44fd-b0cb-90fe67043ac5": "مذاق",
  "bb4149c1-ee82-458d-97c0-ba07092f0218": "لوكشري",
  "adcdabf2-d6f1-4194-9d41-7b8f5c545302": "فريش مارت",
  "f71999e8-e5b2-4eda-bb7c-f16aca944f56": "الرائد",
  "97e09838-7907-46ed-9d59-150d5ac955e2": "ياسمين",
  "42d39573-bbb5-47c4-a5ee-2441e185a336": "رونــق",
  "cfd36d69-0997-42a1-9239-1a673f212465": "حكاية",
  "2602e97a-26b5-4b68-bc4f-d85db332ad48": "غلو",
  "cb736ce4-8918-4a4d-ad8a-82b23c00f830": "ريسبون",
  "64b3d141-339d-4f23-bbd3-9c7f22c6c393": "فاست",
  "2ac49daf-bf9e-42cf-b25d-97979e5deabc": "الرياضي",
  "6d711e31-9110-4b12-817a-8b8f7fa20a26": "بـــــــارق",
  "861f7b86-87cb-4543-86dc-b691763d1a09": "باريستا",
  "05043c72-111b-4b11-bc68-9af9e8ba604e": "فاشن",
  "431b7239-cf92-4220-9b00-1d66da0474fc": "زينة",
  "1b6b8489-c6fe-471a-87a0-39e6693b51a0": "زهرة",
  "f3bf0ce6-dea2-4ad4-ab7b-0415deaf7376": "تراث",
  "c03b3612-691c-42ce-a5db-1f9188506913": "منفرد",
  "20ed294b-c90c-4e02-b393-8d81c3be7fc8": "فرست الذهبي",
  "900d7538-daeb-4529-a9a9-e6c83505ec52": "روزيا",
  "9b5215c0-9c31-43a8-b1e7-796e659cad21": "سترة",
  "a83992c5-1af5-4f54-a427-52be8d580fd0": "رويال",
  "fbef5f5c-0a04-4fd3-8d1e-8cb9687f87a9": "قلوري",
  "483e7db3-f138-40aa-a9c4-06d33d60ae32": "المثالي",
  "04adf1e6-d074-4de1-a9cb-9b690a72ec47": "حسام",
};

const PLATFORM_META = {
  Salla: { icon: "🟣", cls: "salla", color: "salla" },
  Zid:   { icon: "🔵", cls: "zid",   color: "zid"   },
  Shopify: { icon: "🛍️", cls: "shopify", color: "shopify" },
  YouCan: { icon: "🌿", cls: "youcan", color: "youcan" },
  Magento: { icon: "🟠", cls: "magento", color: "magento" },
  PrestaShop: { icon: "💖", cls: "prestashop", color: "prestashop" },
  OpenCart: { icon: "🛒", cls: "opencart", color: "opencart" },
  BigCommerce: { icon: "🔵", cls: "bigcommerce", color: "bigcommerce" },
  Wix: { icon: "🔳", cls: "wix", color: "wix" },
  Squarespace: { icon: "⬛", cls: "squarespace", color: "squarespace" },
  WordPress: { icon: "🌐", cls: "wordpress", color: "wordpress" },
  null:  { icon: "❓", cls: "unknown", color: null   },
};
// javascript-obfuscator:enable

// ── Helpers ───────────────────────────────────────────────────
function showOnly(el) {
  [stateLoading, stateError, stateResult, stateSearch, stateHistory, stateLinks].forEach((s) => s && s.classList.add("hidden"));
  el.classList.remove("hidden");
}

function setLoading(loading) {
  btnRescan.disabled = loading;
  btnRescan.innerHTML = loading
    ? `<span class="spinner-ring" style="width:14px;height:14px;border-width:2px;position:static;animation:spin 0.9s linear infinite;border-color:transparent;border-top-color:#fff;border-radius:50%;display:inline-block;"></span> جارٍ الفحص...`
    : `<span>🔄</span> إعادة الفحص`;
}

function animateConfidence(pct, cls) {
  // Logic removed
}


// ── Render Result ────────────────────────────────────────────
function renderResult(data) {
  lastResult = data;
  showOnly(stateResult);
  
  // Add to history if detected
  if (data["platform"]) {
    addToHistory(data);
  }

  const platform = data["platform"];
  const meta = PLATFORM_META[platform] || PLATFORM_META[null];
  const detected = !!platform;

  // ── Platform card appearance ──
  platformCard.className = `platform-card ${meta.cls} fade-in`;
  platformIcon.textContent = meta.icon;
  
  // Platform Name Translation
  if (platform) {
    const platKey = "platform_" + platform.toLowerCase();
    platformName.textContent = TRANSLATIONS[currentLang][platKey] || platform;
  } else {
    platformName.textContent = TRANSLATIONS[currentLang].platform_unknown;
  }

  // ── Status badge ──
  if (detected) {
    statusBadge.className = "status-badge detected";
    statusText.textContent = TRANSLATIONS[currentLang].status_detected;
  } else {
    statusBadge.className = "status-badge not-detected";
    statusText.textContent = TRANSLATIONS[currentLang].status_not_detected;
  }

  // ── Theme name ──
  if (data["theme"] && data["theme"]["name"]) {
    themeName.textContent = data["theme"]["name"];
    themeName.className   = data["theme"]["isCustom"] ? "info-value custom-tag" : "info-value";
    if (data["theme"]["themeId"]) {
      themeName.title = `Theme ID: ${data["theme"]["themeId"]}`;
    } else {
      themeName.removeAttribute("title");
    }
  } else {
    themeName.textContent = TRANSLATIONS[currentLang].unknown;
    themeName.className   = "info-value not-found";
    themeName.removeAttribute("title");
  }  // ── Buy Theme Row Logic ──
  chrome.storage.local.get("remoteConfig", (storage) => {
    const remote = storage.remoteConfig || {};
    const themeId = data["theme"] && data["theme"]["themeId"];
    const themeAffiliate = (remote.themeLinks && themeId && remote.themeLinks[themeId]) || null;
    
    if (detected && (platform === "Salla" || platform === "Zid")) {
      buyThemeRow.classList.remove("hidden");
      const buyLink = themeAffiliate ? themeAffiliate.affiliateUrl : (platform === "Salla" ? "https://salla.sa/themes" : "https://zid.sa/themes");
      buyThemeLink.href = buyLink;

      // Show discount code row
      const discountRow = document.getElementById("discount-code-row");
      const discountText = document.getElementById("discount-code-text");
      const btnCopyDiscount = document.getElementById("btn-copy-discount");
      if (themeAffiliate && themeAffiliate.discountCode) {
        discountText.textContent = themeAffiliate.discountCode;
        discountRow.classList.remove("hidden");
        btnCopyDiscount.onclick = () => {
          navigator.clipboard.writeText(themeAffiliate.discountCode).then(() => {
            btnCopyDiscount.textContent = "✅";
            setTimeout(() => { btnCopyDiscount.textContent = "📋"; }, 1800);
          });
        };
      } else {
        discountRow.classList.add("hidden");
      }
    } else {
      buyThemeRow.classList.add("hidden");
      const discountRow = document.getElementById("discount-code-row");
      if (discountRow) discountRow.classList.add("hidden");
    }
    
    // Update Whatsapp link dynamically
    const waNum = (remote.social && remote.social.whatsapp) || (remote.marketing && remote.marketing.whatsapp) || '';
    if (waNum) {
      const waBtn = document.querySelector(".btn-whatsapp");
      if (waBtn) {
        const msg = encodeURIComponent(currentLang === 'ar' ? 'السلام عليكم، أريد الاستفسار عن تصميم متجر' : 'Hello, I would like to inquire about store design');
        waBtn.href = `https://wa.me/${waNum.replace('+', '')}?text=${msg}`;
      }
    }

    // Show Special Offer text if set
    const specialOffer = remote.marketing && remote.marketing.specialOffer;
    const specialOfferEl = document.getElementById('special-offer-text');
    if (specialOfferEl) {
      if (specialOffer && specialOffer.trim()) {
        specialOfferEl.textContent = specialOffer;
        specialOfferEl.classList.remove('hidden');
      } else {
        specialOfferEl.classList.add('hidden');
      }
    }
  });

  // ── Visual Identity ──
  const visualsCard = document.getElementById("visuals-card");
  const colorPalette = document.getElementById("color-palette");
  const fontList = document.getElementById("font-list");
  const visuals = data["visuals"] || { "colors": [], "fonts": [] };

  if (visuals.colors.length === 0 && visuals.fonts.length === 0) {
    visualsCard.classList.add("hidden");
  } else {
    visualsCard.classList.remove("hidden");
    
    // Render colors
    colorPalette.innerHTML = "";
    if (visuals.colors.length === 0) {
      colorPalette.innerHTML = `<div class="tech-tag empty">${TRANSLATIONS[currentLang].no_colors}</div>`;
    } else {
      visuals.colors.forEach(color => {
        const swatch = document.createElement("div");
        swatch.className = "color-swatch";
        swatch.style.backgroundColor = color;
        swatch.title = color;
        swatch.addEventListener("click", () => {
          navigator.clipboard.writeText(color);
          const originalTitle = swatch.title;
          swatch.title = currentLang === "ar" ? "تم النسخ!" : "Copied!";
          setTimeout(() => { swatch.title = originalTitle; }, 1000);
        });
        colorPalette.appendChild(swatch);
      });
    }

    // Render fonts
    fontList.innerHTML = "";
    if (visuals.fonts.length === 0) {
      fontList.innerHTML = `<div class="tech-tag empty">${TRANSLATIONS[currentLang].no_fonts}</div>`;
    } else {
      visuals.fonts.forEach(font => {
        const tag = document.createElement("div");
        tag.className = "font-tag";
        tag.textContent = font;
        tag.style.fontFamily = `"${font}", sans-serif`;
        fontList.appendChild(tag);
      });
    }
  }

  // ── Technology Stack ──
  const techCard = document.getElementById("tech-card");
  const techList = document.getElementById("tech-list");
  const techs = data["technology"] || [];
  techList.innerHTML = "";

  if (techs.length === 0) {
    const empty = document.createElement("div");
    empty.className = "tech-tag empty";
    empty.textContent = TRANSLATIONS[currentLang].no_tech;
    techList.appendChild(empty);
  } else {
    techs.forEach((t) => {
      const tag = document.createElement("div");
      tag.className = "tech-tag";
      tag.textContent = t;
      techList.appendChild(tag);
    });
  }

  // ── Footer URL ──
  // (Removed as element was deleted)
}

function renderError(msg) {
  showOnly(stateError);
  errorMessage.textContent = msg || "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.";
}

// ── Detection ────────────────────────────────────────────────
function runDetection() {
  showOnly(stateLoading);
  setLoading(true);

  chrome.runtime.sendMessage({ "action": "runDetection" }, (response) => {
    setLoading(false);

    if (chrome.runtime.lastError) {
      renderError("تعذّر الاتصال بالصفحة. يرجى تحديث الصفحة والمحاولة مجددًا.");
      return;
    }

    if (!response) {
      renderError("لم يتم استلام أي استجابة من الصفحة.");
      return;
    }

    if (response["error"]) {
      renderError(response["error"]);
      return;
    }

    renderResult(response);
  });
}

// ── Copy to clipboard ────────────────────────────────────────
function copyResult() {
  if (!lastResult) return;

  const platform = lastResult["platform"] || (currentLang === "ar" ? "غير معروفة" : "Unknown");
  const theme    = (lastResult["theme"] && lastResult["theme"]["name"]) || TRANSLATIONS[currentLang].unknown;
  const conf     = CONFIDENCE_MAP[lastResult["confidenceLabel"]]?.[currentLang] || "—";
  const url      = lastResult["url"] || "";
  const isCustom = (lastResult["theme"] && lastResult["theme"]["isCustom"]) 
    ? (currentLang === "ar" ? "ثيم مخصص" : "Custom Theme")
    : (currentLang === "ar" ? "ثيم رسمي" : "Official Theme");
  const techs    = (lastResult["technology"] || []).join(", ") || (currentLang === "ar" ? "لا يوجد" : "None");

  const labels = {
    ar: { link: "📌 الرابط", plat: "🟣 المنصة", thm: "🎨 الثيم", tec: "🛠️ التقنيات", con: "📊 الثقة" },
    en: { link: "📌 Link", plat: "🟣 Platform", thm: "🎨 Theme", tec: "🛠️ Technologies", con: "📊 Confidence" }
  };

  const l = labels[currentLang];
  const text = [
    `🔍 Salla & Zid Theme Detector`,
    `━━━━━━━━━━━━━━━━━━━━`,
    `${l.link}: ${url}`,
    `${l.plat}: ${platform}`,
    `${l.thm}: ${theme} (${isCustom})`,
    `${l.tec}: ${techs}`,
    `${l.con}: ${conf}`,
    `━━━━━━━━━━━━━━━━━━━━`,
  ].join("\n");

  navigator.clipboard.writeText(text).then(() => {
    btnCopy.textContent = TRANSLATIONS[currentLang].copy_success;
    setTimeout(() => { btnCopy.textContent = TRANSLATIONS[currentLang].copy_ready; }, 1800);
  }).catch(() => {
    btnCopy.textContent = TRANSLATIONS[currentLang].copy_fail;
    setTimeout(() => { btnCopy.textContent = TRANSLATIONS[currentLang].copy_ready; }, 1500);
  });
}

// ── Event listeners ──────────────────────────────────────────
btnRescan.addEventListener("click", () => {
  switchTab("home");
  runDetection();
});
btnCopy.addEventListener("click", copyResult);
btnLang.addEventListener("click", toggleLanguage);

// ── Navigation ───────────────────────────────────────────────
function switchTab(tabId) {
  currentTab = tabId;
  navItems.forEach(item => {
    item.classList.toggle("active", item.getAttribute("data-tab") === tabId);
  });

  if (tabId === "home") {
    if (lastResult) renderResult(lastResult);
    else runDetection();
  } else if (tabId === "themes") {
    showOnly(stateSearch);
    searchInput.value = "";
    performSearch();
    setTimeout(() => searchInput.focus(), 100);
  } else if (tabId === "history") {
    showOnly(stateHistory);
    renderHistory();
  } else if (tabId === "links") {
    showOnly(stateLinks);
    renderLinks();
  }
}

// ── Search Logic ─────────────────────────────────────────────
function toggleSearch() {
  switchTab(currentTab === "themes" ? "home" : "themes");
}

function performSearch() {
  const query = searchInput.value.toLowerCase().trim();
  
  chrome.storage.local.get("remoteConfig", (data) => {
    const config = data.remoteConfig || {};
    const remoteSalla = config.salla_themes || {};
    const remoteZid = config.zid_themes || {};
    
    // Merge local and remote
    const sallaThemes = { ...SALLA_THEME_IDS_LOCAL, ...remoteSalla };
    const zidThemes = { ...ZID_THEME_IDS_LOCAL, ...remoteZid };
    
    let results = [];

    // Search Salla
    if (currentFilter === "all" || currentFilter === "Salla") {
      Object.entries(sallaThemes).forEach(([id, name]) => {
        if (!query || id.includes(query) || name.toLowerCase().includes(query)) {
          results.push({ id, name, platform: "Salla" });
        }
      });
    }

    // Search Zid
    if (currentFilter === "all" || currentFilter === "Zid") {
      Object.entries(zidThemes).forEach(([id, name]) => {
        if (!query || id.includes(query) || name.toLowerCase().includes(query)) {
          results.push({ id, name, platform: "Zid" });
        }
      });
    }

    renderSearchResults(results);
  });
}

function renderSearchResults(results) {
  searchResults.innerHTML = "";
  
  if (results.length === 0) {
    searchEmpty.classList.remove("hidden");
  } else {
    searchEmpty.classList.add("hidden");
    
    results.forEach(item => {
      const el = document.createElement("div");
      el.className = "theme-result-item";
      el.innerHTML = `
        <div class="theme-result-info">
          <div class="theme-result-name">${item.name}</div>
          <div class="theme-result-id">ID: ${item.id}</div>
        </div>
        <div class="theme-result-badge ${item.platform.toLowerCase()}">${item.platform}</div>
      `;
      
      el.addEventListener("click", () => {
        navigator.clipboard.writeText(item.id);
        const nameEl = el.querySelector(".theme-result-name");
        const originalName = item.name;
        nameEl.textContent = currentLang === "ar" ? "تم نسخ الـ ID!" : "ID Copied!";
        setTimeout(() => { nameEl.textContent = originalName; }, 1000);
      });
      
      searchResults.appendChild(el);
    });
  }
}

btnSearch.addEventListener("click", toggleSearch);
searchInput.addEventListener("input", performSearch);

filterBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    filterBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.getAttribute("data-filter");
    performSearch();
  });
});

// ── History Logic ────────────────────────────────────────────
function addToHistory(data) {
  if (!data["url"] || !data["platform"]) return;

  try {
    const urlObj = new URL(data["url"]);
    let domain = urlObj.hostname;
    
    // Handle platform subdirectories (e.g., salla.sa/store-name)
    const platformDomains = ["salla.sa", "salla.network", "zid.store"];
    if (platformDomains.some(p => domain.endsWith(p))) {
      const pathParts = urlObj.pathname.split("/").filter(p => p);
      if (pathParts.length > 0) {
        domain = `${domain}/${pathParts[0]}`;
      }
    }
    
    const themeName = (data["theme"] && data["theme"]["name"]) || "Unknown";
    const entry = {
      domain,
      theme: themeName,
      platform: data["platform"],
      url: data["url"],
      timestamp: Date.now()
    };

    chrome.storage.local.get("scanHistory", (res) => {
      let history = res.scanHistory || [];
      // Remove existing entry for same domain/store
      history = history.filter(item => item.domain !== domain);
      // Add to start
      history.unshift(entry);
      // Limit to 20
      history = history.slice(0, 20);
      chrome.storage.local.set({ scanHistory: history });
    });
  } catch (e) {
    console.error("History error:", e);
  }
}

function renderHistory() {
  historyList.innerHTML = "";
  chrome.storage.local.get("scanHistory", (res) => {
    const history = res.scanHistory || [];
    
    if (history.length === 0) {
      historyEmpty.classList.remove("hidden");
    } else {
      historyEmpty.classList.add("hidden");
      history.forEach(item => {
        const el = document.createElement("div");
        el.className = "history-item";
        const platKey = "platform_" + item.platform.toLowerCase();
        const platName = TRANSLATIONS[currentLang][platKey] || item.platform;
        
        el.innerHTML = `
          <div class="history-item-info">
            <div class="history-item-domain">${item.domain}</div>
            <div class="history-item-theme">${platName}: ${item.theme}</div>
          </div>
          <a href="${item.url}" target="_blank" class="btn-open-store" title="Open Store">
            <span>↗️</span>
          </a>
        `;
        historyList.appendChild(el);
      });
    }
  });
}

function clearHistory() {
  if (confirm(currentLang === "ar" ? "هل أنت متأكد من مسح السجل؟" : "Are you sure you want to clear history?")) {
    chrome.storage.local.set({ scanHistory: [] }, () => {
      renderHistory();
    });
  }
}

// ── Links / Social Tab ─────────────────────────────────
function renderLinks() {
  chrome.storage.local.get('remoteConfig', (data) => {
    const social = (data.remoteConfig || {}).social || {};

    const SOCIAL_CONFIG = [
      { key: 'whatsapp',  label: 'واتساب',    icon: '💬', cls: 'whatsapp',  prefix: 'https://wa.me/' },
      { key: 'twitter',   label: 'تويتر/X',   icon: '🐦', cls: 'twitter',   prefix: '' },
      { key: 'telegram',  label: 'تيليجرام',  icon: '✈️', cls: 'telegram',  prefix: '' },
      { key: 'instagram', label: 'انستغرام',  icon: '📸', cls: 'instagram', prefix: '' },
      { key: 'tiktok',    label: 'تيكتوك',    icon: '🎥', cls: 'tiktok',    prefix: '' },
      { key: 'youtube',   label: 'يوتيوب',    icon: '🎦', cls: 'youtube',   prefix: '' },
      { key: 'website',   label: 'موقعنا',    icon: '🌐', cls: 'website',   prefix: '' },
    ];

    // Coffee card
    const coffeeWrap = document.getElementById('social-coffee-wrap');
    const coffeeLink = document.getElementById('social-coffee-link');
    if (coffeeWrap && social.coffee && social.coffee.trim()) {
      coffeeLink.href = social.coffee;
      coffeeWrap.classList.remove('hidden');
    } else if (coffeeWrap) {
      coffeeWrap.classList.add('hidden');
    }

    // Social grid
    const grid = document.getElementById('social-grid');
    const emptyEl = document.getElementById('social-empty');
    if (!grid) return;

    grid.innerHTML = '';
    let count = 0;

    SOCIAL_CONFIG.forEach(({ key, label, icon, cls, prefix }) => {
      const val = social[key];
      if (!val || !val.trim()) return;

      const href = prefix && !val.startsWith('http') ? prefix + val.replace('+', '') : val;
      const btn = document.createElement('a');
      btn.href = href;
      btn.target = '_blank';
      btn.className = `social-btn ${cls} fade-in`;
      btn.innerHTML = `
        <div class="social-btn-icon">${icon}</div>
        <div class="social-btn-label">${label}</div>
      `;
      grid.appendChild(btn);
      count++;
    });

    if (emptyEl) {
      emptyEl.classList.toggle('hidden', count > 0 || !!(social.coffee && social.coffee.trim()));
    }
  });
}

navItems.forEach(item => {
  item.addEventListener("click", () => {
    switchTab(item.getAttribute("data-tab"));
  });
});

btnClearHistory.addEventListener("click", clearHistory);

// ── Init ─────────────────────────────────────────────────────
// ── Remote Settings Loader ───────────────────────────────────
function loadRemoteSettings() {
  chrome.storage.local.get('remoteConfig', (data) => {
    const remote = data.remoteConfig || {};
    const marketing = remote.marketing || {};

    // 1. Show alert_message banner if set
    const alertMsg = marketing.alertMessage || '';
    const alertBanner = document.getElementById('alert-banner');
    const alertText   = document.getElementById('alert-text');
    const alertClose  = document.getElementById('alert-close');

    if (alertBanner && alertText && alertMsg.trim()) {
      // Check if user already dismissed this specific message
      chrome.storage.local.get('dismissedAlert', (res) => {
        if (res.dismissedAlert !== alertMsg) {
          alertText.textContent = alertMsg;
          alertBanner.classList.remove('hidden');
          alertClose.addEventListener('click', () => {
            alertBanner.classList.add('hidden');
            // Remember dismissed message so it doesn't show again
            chrome.storage.local.set({ dismissedAlert: alertMsg });
          });
        }
      });
    }

    // 2. Show special_offer in marketing card
    const specialOffer = marketing.specialOffer || '';
    const specialOfferEl = document.getElementById('special-offer-text');
    if (specialOfferEl) {
      if (specialOffer.trim()) {
        specialOfferEl.textContent = specialOffer;
        specialOfferEl.classList.remove('hidden');
      } else {
        specialOfferEl.classList.add('hidden');
      }
    }

    // 3. Update WhatsApp button link
    const waNum = marketing.whatsapp || (remote.social && remote.social.whatsapp) || '';
    if (waNum) {
      const waBtn = document.querySelector('.btn-whatsapp');
      if (waBtn) {
        const msg = encodeURIComponent('السلام عليكم، أريد الاستفسار عن تصميم متجر');
        waBtn.href = `https://wa.me/${waNum.replace('+', '')}?text=${msg}`;
      }
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  // Load language preference
  chrome.storage.local.get("selectedLang", (data) => {
    if (data.selectedLang) {
      setLanguage(data.selectedLang);
    } else {
      setLanguage("ar");
    }
    // Load remote settings (alerts, special offers, etc.)
    loadRemoteSettings();
    // Always run detection on startup to get the correct tab-specific result
    runDetection();
  });
});
