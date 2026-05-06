/**
 * Salla & Zid Theme Detector — Content Script
 */

(function () {
  "use strict";

  // Prevent multiple injections
  if (window.__SALLA_DETECTOR_RUNNING__) return;
  window.__SALLA_DETECTOR_RUNNING__ = true;

  // javascript-obfuscator:disable
  const SALLA_THEME_IDS = {
    // --- Salla Themes (Extracted & Merged) ---
    "1247874246": "رائد", "1298199463": "رائد", "568597563": "نمو", "2038173539": "واثق", "404046066": "فريد", "392563753": "زيين",
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
    "1130931637": "ملاك", "5541564": "كليك",
  };

  const ZID_THEME_IDS = {
    // --- Zid Themes (Extracted & Merged) ---
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
    "f71999e8-e5b2-4eda-bb7c-f16aca944f56": "رائد",
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
    "cloud": "غيم", "pioneer": "رائد", "modern": "عصري",
  };

  const SALLA_SLUG_MAP = {
    twilight: "Twilight", spark: "Spark", scout: "Scout",
    breeze: "Breeze", lumen: "Lumen", zeal: "Zeal",
    orchid: "Orchid", canvas: "Canvas", plex: "Plex",
    nova: "Nova", atom: "Atom", flow: "Flow",
    halo: "Halo", aura: "Aura", turquoise: "Turquoise",
    amber: "Amber", pearl: "Pearl", sapphire: "Sapphire",
    malak: "ملاك", basma: "بسمة", nour: "نور",
    rawnaq: "رونق", majd: "مجد", iilaf: "إيلاف",
    click: "كليك", /* raed: "رائد", */ celia: "سيليا",
  };
  // javascript-obfuscator:enable

  function isNumericId(id) {
    return /^[a-z0-9-]{10,}$/i.test(id) || /^\d{5,}$/.test(id);
  }

  function getPageGlobals() {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      const eventId = 'det_' + Math.random().toString(36).substring(2, 11);

      script.textContent = `
        (function() {
          try {
            const getT = (r) => (r && r.theme) || (r && r.config && r.config.theme) || (r && r.settings && r.settings.theme) || null;
            const data = {
              salla: { theme: getT(window.Salla) || getT(window.SallaConfig) || getT(window.salla) },
              zid:   { theme: getT(window.zid) || getT(window.Zid) || getT(window.ZidConfig) },
              bare:  window.theme || null
            };
            document.dispatchEvent(new CustomEvent('${eventId}', { detail: data }));
          } catch(e) {
            document.dispatchEvent(new CustomEvent('${eventId}', { detail: {} }));
          }
        })();
      `;

      const handler = function (e) {
        document.removeEventListener(eventId, handler);
        if (script.parentNode) script.remove();
        resolve(e.detail || {});
      };

      document.addEventListener(eventId, handler);
      (document.head || document.documentElement).appendChild(script);

      setTimeout(() => {
        document.removeEventListener(eventId, handler);
        if (script.parentNode) script.remove();
        resolve({});
      }, 1000);
    });
  }

  function detectSalla(globals = {}) {
    let score = 0;
    let signals = [];
    const html = document.documentElement.innerHTML.substring(0, 500000);

    // 1. Assets (Strong)
    const assets = Array.from(document.querySelectorAll('link[href], script[src]')).map(el => el.href || el.src || "");
    if (assets.some(a => a.includes('cdn.salla.sa') || a.includes('salla.sh') || a.includes('salla.sa') || a.includes('cdn.salla.network') || a.includes('salla.network'))) {
      signals.push("Salla assets detected");
      score += 50;
    }

    // 2. Globals (Strongest)
    if (globals["salla"] && (globals["salla"]["theme"] || globals["salla"]["id"])) {
      signals.push("Salla globals detected");
      score += 70;
    }

    // 3. HTML Patterns
    const patterns = [
      /salla-express/i, /"salla":\s*\{/i, /salla\.config/i,
      /window\.SallaConfig/i, /@salla\//i, /SallaApp/i, /data-salla/i, /<s-/i
    ];
    patterns.forEach(p => {
      if (p.test(html)) {
        signals.push(`Salla fingerprint: ${p.toString()}`);
        score += 20;
      }
    });

    // 4. Meta
    if (/salla/i.test(document.querySelector('meta[name="generator"]')?.content || "")) {
      signals.push("Meta generator: Salla");
      score += 40;
    }

    return { "detected": score >= 30, "confidence": Math.min(score, 100), "signals": signals };
  }

  function detectZid(globals = {}) {
    let score = 0;
    let signals = [];
    const html = document.documentElement.innerHTML.substring(0, 500000);

    if (globals["zid"] && (globals["zid"]["theme"] || globals["zid"]["id"])) {
      signals.push("Zid globals detected");
      score += 70;
    }
    if (html.includes('zid.sa') || html.includes('cdn.zid.sa') || html.includes('zid-app')) {
      signals.push("Zid patterns detected");
      score += 50;
    }

    return { "detected": score >= 40, "confidence": Math.min(score, 100), "signals": signals };
  }

  function detectWordPress() {
    let score = 0;
    let signals = [];
    const html = document.documentElement.innerHTML.substring(0, 500000);

    if (html.includes('wp-content') || html.includes('wp-includes')) {
      signals.push("WordPress folder structure detected");
      score += 60;
    }
    if (document.querySelector('meta[name="generator"][content*="WordPress"]')) {
      signals.push("Meta generator: WordPress");
      score += 40;
    }
    if (document.body.classList.contains('woocommerce') || html.includes('woocommerce-')) {
      signals.push("WooCommerce signals detected");
      score += 20;
    }

    return { "detected": score >= 50, "confidence": Math.min(score, 100), "signals": signals };
  }

  function detectShopify() {
    let score = 0;
    let signals = [];
    const html = document.documentElement.innerHTML.substring(0, 500000);

    if (window.Shopify || html.includes('cdn.shopify.com')) {
      signals.push("Shopify fingerprint detected");
      score += 80;
    }
    if (document.querySelector('link[href*="shopify.com"]')) {
      signals.push("Shopify assets detected");
      score += 40;
    }

    return { "detected": score >= 60, "confidence": Math.min(score, 100), "signals": signals };
  }

  function detectMagento() {
    const html = document.documentElement.innerHTML.substring(0, 500000);
    if (html.includes('mage-') || html.includes('Magento_') || html.includes('static/_cache')) return { detected: true, confidence: 90 };
    return { detected: false, confidence: 0 };
  }

  function detectBigCommerce() {
    const html = document.documentElement.innerHTML.substring(0, 500000);
    if (html.includes('bigcommerce') || html.includes('cdn11.bigcommerce.com')) return { detected: true, confidence: 90 };
    return { detected: false, confidence: 0 };
  }

  function detectWix() {
    const html = document.documentElement.innerHTML.substring(0, 500000);
    if (html.includes('wix.com') || html.includes('wixstatic.com')) return { detected: true, confidence: 90 };
    return { detected: false, confidence: 0 };
  }

  function detectSquarespace() {
    const html = document.documentElement.innerHTML.substring(0, 500000);
    if (html.includes('squarespace.com')) return { detected: true, confidence: 90 };
    return { detected: false, confidence: 0 };
  }

  function detectYouCan() {
    const html = document.documentElement.innerHTML.substring(0, 500000);
    if (html.includes('youcan.shop') || html.includes('youcan.com') || html.includes('cdn.youcan.shop')) {
      return { detected: true, confidence: 95 };
    }
    return { detected: false, confidence: 0 };
  }

  function detectPrestaShop() {
    const html = document.documentElement.innerHTML.substring(0, 500000);
    if (html.includes('prestashop') || html.includes('PrestaShop')) {
      return { detected: true, confidence: 90 };
    }
    return { detected: false, confidence: 0 };
  }

  function detectOpenCart() {
    const html = document.documentElement.innerHTML.substring(0, 500000);
    if (html.includes('index.php?route=') || html.includes('catalog/view/theme/')) {
      return { detected: true, confidence: 80 };
    }
    return { detected: false, confidence: 0 };
  }

  function detectTheme(platform, globals = {}) {
    let themeName = null;
    let themeId = null;
    let isCustom = false;
    let source = null;
    const html = document.documentElement.innerHTML.substring(0, 500000);
    const slugMap = platform === "Salla" ? SALLA_SLUG_MAP : {};

    // 1. Globals
    const gTheme = platform === "Salla" ? (globals["salla"] && globals["salla"]["theme"]) : (globals["zid"] && globals["zid"]["theme"]);
    if (gTheme) {
      if (typeof gTheme === "object") {
        themeId = gTheme["id"] ? String(gTheme["id"]) : null;
        themeName = gTheme["name"] || gTheme["slug"] || null;
        isCustom = gTheme["is_custom"] || false;
      } else if (isNumericId(String(gTheme))) {
        themeId = String(gTheme);
      } else {
        themeName = String(gTheme);
      }
      source = `${platform} Globals`;
    }

    // Treat generic names as null to trigger deeper scanning
    const genericNames = ["customization", "theme", "salla", "default", "custom"];
    if (themeName && genericNames.includes(themeName.toLowerCase().trim())) {
      themeName = null;
    }

    // 2. DOM Assets (Highest Confidence for ID)
    const assetLinks = Array.from(document.querySelectorAll('link[href*="theme"], script[src*="theme"]')).map(el => el.href || el.src || "");
    for (const a of assetLinks) {
      const m = a.match(/themes\/(\d+)\//i) || a.match(/theme[_-](\d+)\.css/i);
      if (m && m[1]) {
        themeId = m[1]; // Asset ID always wins
        break;
      }
    }

    // 3. HTML Search (Fallback for ID if not in assets)
    if (!themeId) {
      const mId = html.match(/"(?:theme_id|themeId)["']?\s*:\s*(\d{5,})/i) || html.match(/"id"\s*:\s*(\d{5,})[^}]*theme/i);
      if (mId) themeId = mId[1];
    }
    if (!themeName) {
      const mName = html.match(/"theme"\s*:\s*\{[^}]{0,200}"name"\s*:\s*"([^"]{2,50})"/i) || html.match(/"theme_name"\s*:\s*"([^"]{2,50})"/i);
      if (mName) themeName = mName[1];
    }

    // ID Mapping (Strongest override)
    const mapping = platform === "Salla" ? SALLA_THEME_IDS : ZID_THEME_IDS;
    console.log(`[Detector] Checking mapping for ID: ${themeId} in platform: ${platform}`);
    if (themeId && mapping[themeId]) {
      themeName = mapping[themeId];
      console.log(`[Detector] Found theme name in mapping: ${themeName}`);
      isCustom = false;
    } else if (!themeId) {
      // Emergency Search: Search entire HTML for any known ID if not found yet
      for (const [id, name] of Object.entries(mapping)) {
        if (id.length > 5 && html.includes(id)) {
          themeId = id;
          themeName = name;
          isCustom = false;
          break;
        }
      }
    }

    // Slug Normalization
    if (themeName && !isCustom) {
      const low = themeName.toLowerCase().trim();
      if (slugMap[low]) {
        themeName = slugMap[low];
      } else if (!/[\u0600-\u06FF]/.test(themeName)) {
        themeName = themeName.charAt(0).toUpperCase() + themeName.slice(1).replace(/-/g, " ");
        isCustom = true;
      }
    }

    // 4. WordPress Theme Extraction
    if (platform === "WordPress" && !themeName) {
      const wpLinks = Array.from(document.querySelectorAll('link[href*="/wp-content/themes/"]'));
      for (const link of wpLinks) {
        const match = link.href.match(/\/wp-content\/themes\/([^\/]+)\//);
        if (match && match[1]) {
          themeName = match[1].charAt(0).toUpperCase() + match[1].slice(1).replace(/-/g, " ");
          break;
        }
      }
    }

    // 5. Shopify Theme Extraction
    if (platform === "Shopify") {
      try {
        const themeMatch = html.match(/"theme_name"\s*:\s*"([^"]+)"/i) || html.match(/"name"\s*:\s*"([^"]+)"[^}]*theme/i);
        if (themeMatch) themeName = themeMatch[1];
      } catch (e) { }
    }

    if (!themeName && themeId) themeName = `ثيم رقم ${themeId}`;

    return {
      "name": themeName || null,
      "themeId": themeId || null,
      "isCustom": isCustom,
      "source": source || "Page Scan",
    };
  }

  async function run(remoteConfig = {}, options = {}) {
    const isSilent = options.isSilent || false;
    const remote = remoteConfig;

    // Attempt to get page globals, but don't let it crash the whole run
    let passedGlobals = {};
    try {
      passedGlobals = await getPageGlobals();
    } catch (e) {
      console.warn("Failed to get page globals", e);
    }

    const html = document.documentElement.innerHTML.substring(0, 500000);
    const salla = detectSalla(passedGlobals);
    const zid = detectZid(passedGlobals);
    const shopify = detectShopify();
    const magento = detectMagento();
    const bigcommerce = detectBigCommerce();
    const wix = detectWix();
    const squarespace = detectSquarespace();
    const wp = detectWordPress();
    const youcan = detectYouCan();
    const prestashop = detectPrestaShop();
    const opencart = detectOpenCart();

    let result = {
      "platform": null,
      "theme": { "name": null, "themeId": null, "isCustom": false, "source": null },
      "confidence": 0,
      "confidenceLabel": "low",
      "signals": [],
      "url": window.location.href,
      "timestamp": Date.now(),
    };

    if (salla["detected"]) {
      result["platform"] = "Salla";
      result["confidence"] = salla["confidence"];
      result["signals"] = salla["signals"];
      result["theme"] = detectTheme("Salla", passedGlobals);
    } else if (zid["detected"]) {
      result["platform"] = "Zid";
      result["confidence"] = zid["confidence"];
      result["signals"] = zid["signals"];
      result["theme"] = detectTheme("Zid", passedGlobals);
    } else if (shopify["detected"]) {
      result["platform"] = "Shopify";
      result["confidence"] = shopify["confidence"];
      result["theme"] = detectTheme("Shopify", passedGlobals);
    } else if (youcan["detected"]) {
      result["platform"] = "YouCan";
      result["confidence"] = youcan["confidence"];
    } else if (magento["detected"]) {
      result["platform"] = "Magento";
      result["confidence"] = magento["confidence"];
    } else if (prestashop["detected"]) {
      result["platform"] = "PrestaShop";
      result["confidence"] = prestashop["confidence"];
    } else if (opencart["detected"]) {
      result["platform"] = "OpenCart";
      result["confidence"] = opencart["confidence"];
    } else if (bigcommerce["detected"]) {
      result["platform"] = "BigCommerce";
    } else if (wix["detected"]) {
      result["platform"] = "Wix";
      result["confidence"] = wix["confidence"];
    } else if (squarespace["detected"]) {
      result["platform"] = "Squarespace";
      result["confidence"] = squarespace["confidence"];
    } else if (wp["detected"]) {
      result["platform"] = "WordPress";
      result["confidence"] = wp["confidence"];
      result["signals"] = wp["signals"];
      result["theme"] = detectTheme("WordPress", passedGlobals);
    }

    result["confidenceLabel"] = result["confidence"] >= 70 ? "high" : (result["confidence"] >= 35 ? "medium" : "low");

    try {
      chrome.storage.local.set({ "detectionResult": result });
    } catch (e) { }

    if (result["platform"]) {
      try {
        chrome.runtime.sendMessage({
          "action": "updateBadge",
          "platform": result["platform"],
          "result": result
        });
      } catch (e) { }

      if (!isSilent) {
        showToast(result, remote);
      }
    }

    return result;
  }

  function showToast(data, remoteConfig = {}) {
    const isAr = true;
    const themeName = (data["theme"] && data["theme"]["name"]) || "غير محدد";
    const platform = data["platform"];
    const isSalla = platform === 'Salla';
    const isZid = platform === 'Zid';

    const remoteCoupons = remoteConfig["coupons"] || {};
    const platform_salla = "Salla";
    const platform_zid = "Zid";
    const platform_shopify = "Shopify";
    const platform_magento = "Magento";
    const platform_bigcommerce = "BigCommerce";
    const platform_wix = "Wix";
    const platform_squarespace = "Squarespace";
    const platform_wordpress = "WordPress";
    const platform_unknown = "Unknown";

    const couponData = remoteCoupons[platform] || { "code": "OFFER2024", "link": "#" };
    const marketing = {
      "whatsapp": (remoteConfig.social && remoteConfig.social.whatsapp) || (remoteConfig.marketing && remoteConfig.marketing.whatsapp) || "+966500000000",
      "message": (remoteConfig.marketing && remoteConfig.marketing.message) || "استفسار"
    };

    const themeId = data["theme"] && data["theme"]["themeId"];
    const themeAffiliate = (remoteConfig["themeLinks"] && themeId && remoteConfig["themeLinks"][themeId]) || null;

    // If we have a specific affiliate link, use it. Otherwise fallback to general marketing.
    const buyLink = themeAffiliate ? themeAffiliate.affiliateUrl : (isSalla ? "https://salla.sa/themes" : (isZid ? "https://zid.sa/themes" : "#"));
    const discountCode = themeAffiliate ? themeAffiliate.discountCode : "OFFER2024";

    if (document.getElementById("salla-detector-mini")) return;

    const modal = document.createElement("div");
    modal.id = "salla-detector-mini";

    const style = document.createElement("style");
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;700;800&display=swap');

      #salla-detector-mini {
        all: initial;
        position: fixed;
        bottom: 20px;
        left: 20px;
        z-index: 2147483647;
        width: 320px;
        background: rgba(13, 15, 22, 0.85) !important;
        backdrop-filter: blur(25px) !important;
        -webkit-backdrop-filter: blur(25px) !important;
        border-radius: 24px !important;
        box-shadow: 0 20px 50px rgba(0,0,0,0.5) !important;
        border: 1px solid rgba(255,255,255,0.1) !important;
        font-family: 'Cairo', sans-serif !important;
        direction: rtl !important;
        padding: 20px !important;
        display: flex !important;
        flex-direction: column !important;
        gap: 15px !important;
        animation: s-mini-in 0.6s cubic-bezier(0.23, 1, 0.32, 1) both !important;
        color: #fff !important;
      }
      .platform-card.shopify .platform-icon { background: rgba(149, 191, 71, 0.15); color: #95bf47; }
      .platform-card.magento .platform-icon { background: rgba(238, 103, 47, 0.15); color: #ee672f; }
      .platform-card.wix .platform-icon { background: rgba(0, 0, 0, 0.15); color: #fff; }
      .platform-card.squarespace .platform-icon { background: rgba(34, 34, 34, 0.15); color: #fff; }

      .platform-name {
        font-size: 22px;
        font-weight: 900;
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      .platform-card.salla .platform-name { background-image: var(--salla-grad); }
      .platform-card.zid .platform-name { background-image: var(--zid-grad); }
      .platform-card.wordpress .platform-name { background-image: var(--wp-grad); }
      .platform-card.shopify .platform-name { background-image: var(--shopify-grad); }
      .platform-card.magento .platform-name { background-image: var(--magento-grad); }
      .platform-card.wix .platform-name { background-image: var(--wix-grad); }
      .platform-card.squarespace .platform-name { background-image: var(--squarespace-grad); }

      :root {
        --shopify-grad: linear-gradient(135deg, #95bf47 0%, #5e8e3e 100%);
        --magento-grad: linear-gradient(135deg, #ee672f 0%, #f26322 100%);
        --wix-grad: linear-gradient(135deg, #000 0%, #333 100%);
        --squarespace-grad: linear-gradient(135deg, #222 0%, #444 100%);
        --text-main: #f8fafc;
      }

      @keyframes s-mini-in {
        from { opacity: 0; transform: translateX(-30px); }
        to { opacity: 1; transform: translateX(0); }
      }

      .s-mini-header {
        display: flex !important;
        justify-content: space-between !important;
        align-items: center !important;
      }

      .s-mini-badge {
        background: ${isSalla ? 'linear-gradient(90deg, #6366f1, #a855f7)' :
        (isZid ? 'linear-gradient(90deg, #06b6d4, #3b82f6)' :
          (platform === 'Shopify' ? 'linear-gradient(90deg, #95bf47, #5e8e3e)' :
            (platform === 'YouCan' ? 'linear-gradient(90deg, #00b894, #00cec9)' :
              (platform === 'Magento' ? 'linear-gradient(90deg, #ee672f, #f26322)' :
                (platform === 'PrestaShop' ? 'linear-gradient(90deg, #df0067, #a9004e)' :
                  (platform === 'Wix' ? 'linear-gradient(90deg, #000, #333)' :
                    'linear-gradient(90deg, #666, #333)'))))))} !important;
        color: #fff !important;
        padding: 4px 10px !important;
        border-radius: 8px !important;
        font-size: 10px !important;
        font-weight: 800 !important;
        margin-left: auto !important;
      }

      .s-mini-close {
        cursor: pointer !important;
        color: #64748b !important;
        font-size: 18px !important;
        transition: 0.2s !important;
        margin-right: 10px !important;
      }
      .s-mini-close:hover { color: #fff !important; }

      .s-mini-title {
        font-size: 20px !important;
        font-weight: 900 !important;
        color: #fff !important;
        margin: 5px 0 !important;
      }

      .s-mini-coupon {
        background: rgba(255,255,255,0.05) !important;
        border: 1px dashed rgba(255,255,255,0.2) !important;
        border-radius: 12px !important;
        padding: 10px 15px !important;
        display: flex !important;
        justify-content: space-between !important;
        align-items: center !important;
      }

      .s-mini-code {
        font-family: monospace !important;
        font-size: 16px !important;
        font-weight: 800 !important;
        color: #fff !important;
      }

      .s-mini-copy {
        background: #fff !important;
        color: #000 !important;
        border: none !important;
        padding: 5px 12px !important;
        border-radius: 8px !important;
        font-size: 11px !important;
        font-weight: 800 !important;
        cursor: pointer !important;
      }

      .s-mini-btns {
        display: grid !important;
        grid-template-columns: 1fr 1fr !important;
        gap: 10px !important;
      }

      .s-mini-btn {
        padding: 10px !important;
        border-radius: 12px !important;
        font-size: 12px !important;
        font-weight: 800 !important;
        text-decoration: none !important;
        text-align: center !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 6px !important;
        transition: 0.3s !important;
      }

      .s-mini-btn-buy {
        background: rgba(255,255,255,0.1) !important;
        color: #fff !important;
      }
      
      .s-mini-btn-wa {
        background: #22c55e !important;
        color: #fff !important;
      }
      .s-mini-btn:hover { transform: translateY(-2px) !important; }

      .s-mini-footer {
        font-size: 9px !important;
        color: rgba(255,255,255,0.3) !important;
        text-align: center !important;
      }
    `;
    document.head.appendChild(style);

    modal.innerHTML = `
      <div class="s-mini-header">
        <span class="s-mini-badge">${isSalla ? 'منصة سلة' : (isZid ? 'منصة زد' : platform)}</span>
        <span class="s-mini-close" id="s-mini-close-btn">✕</span>
      </div>
      <div class="s-mini-title">${themeName}</div>
      
      <div class="s-mini-coupon">
        <span class="s-mini-code">${discountCode}</span>
        <button class="s-mini-copy" id="s-mini-copy-btn">نسخ</button>
      </div>

      <div class="s-mini-btns">
        <a href="${buyLink}" target="_blank" class="s-mini-btn s-mini-btn-buy">شراء الثيم</a>
        <a href="https://wa.me/${(marketing["whatsapp"] || "").replace('+', '')}" target="_blank" class="s-mini-btn s-mini-btn-wa">تصميم متجر</a>
      </div>

      <div class="s-mini-footer">Salla Theme Detector • Cloud v2.2</div>
    `;

    document.body.appendChild(modal);

    modal.querySelector("#s-mini-close-btn").addEventListener("click", () => modal.remove());

    modal.querySelector("#s-mini-copy-btn").addEventListener("click", function () {
      navigator.clipboard.writeText(couponData["code"]).then(() => {
        this.innerText = 'تم النسخ';
        setTimeout(() => this.innerText = 'نسخ', 2000);
      });
    });
  }

  function analyzeVisuals() {
    const visuals = { colors: [], fonts: [] };
    try {
      const sampleElements = [
        document.querySelector('.s-button'),
        document.querySelector('[class*="btn-primary"]'),
        document.querySelector('header'),
        document.querySelector('button'),
        document.body
      ].filter(Boolean);

      const colorSet = new Set();
      sampleElements.forEach(el => {
        const style = window.getComputedStyle(el);
        const bg = style.backgroundColor;
        const toHex = (rgb) => {
          const m = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
          if (!m) return rgb;
          return "#" + ("0" + parseInt(m[1]).toString(16)).slice(-2) +
            ("0" + parseInt(m[2]).toString(16)).slice(-2) +
            ("0" + parseInt(m[3]).toString(16)).slice(-2);
        };
        const hexBg = toHex(bg);
        if (hexBg.startsWith('#') && hexBg !== '#ffffff' && hexBg !== '#000000' && hexBg.length > 3) {
          colorSet.add(hexBg.toLowerCase());
        }
      });
      visuals["colors"] = Array.from(colorSet).slice(0, 5);

      const fontSet = new Set();
      const bodyFont = window.getComputedStyle(document.body).fontFamily;
      if (bodyFont) {
        bodyFont.split(',').forEach(f => {
          const clean = f.trim().replace(/['"]/g, '');
          if (clean && !['sans-serif', 'serif', 'system-ui', 'arial'].includes(clean.toLowerCase())) {
            fontSet.add(clean);
          }
        });
      }
      visuals["fonts"] = Array.from(fontSet).slice(0, 3);
    } catch (e) { }
    return visuals;
  }

  function analyzeTech(html) {
    const rules = {
      "Snapchat Pixel": [/sc-static\.net\/scevent\.min\.js/i, /snaptr\(/i],
      "TikTok Pixel": [/analytics\.tiktok\.com/i, /ttq\.track/i],
      "Facebook Pixel": [/connect\.facebook\.net\/en_US\/fbevents\.js/i, /fbq\(/i],
      "Google Analytics": [/google-analytics\.com\/analytics\.js/i, /googletagmanager\.com\/gtag\/js/i, /gtag\(/i],
      "Google Tag Manager": [/googletagmanager\.com\/gtm\.js/i, /gtm\.start/i],
      "Twitter Pixel": [/static\.ads-twitter\.com\/uwt\.js/i, /twq\(/i],
      "Pinterest Pixel": [/pinit\.js/i, /pintrk\(/i],
      "LinkedIn Pixel": [/snap\.licdn\.com\/li\.lms-analytics\/insight\.min\.js/i],
      "Microsoft Clarity": [/clarity\.ms\/tag/i],
      "Tamara": [/tamara\.co/i, /cdn\.tamara\.co/i],
      "Tabby": [/tabby\.ai/i, /checkout\.tabby\.ai/i],
      "Moyasar": [/moyasar\.com/i, /cdn\.moyasar\.com/i],
      "PayTabs": [/paytabs\.com/i],
      "HyperPay": [/hyperpay\.com/i],
      "Apple Pay": [/apple-pay/i, /apple_pay/i],
      "Hotjar": [/hotjar\.js/i, /hj\(/i],
      "Crisp": [/client\.crisp\.chat/i],
      "Tidio": [/code\.tidio\.co/i],
      "Intercom": [/widget\.intercom\.io/i],
      "Cloudflare": [/cloudflare\.com/i],
      "Tailwind CSS": [/class="[^"]*(?:bg|text|p|m|flex|grid)-/i],
      "Vue.js": [/data-v-[0-9a-f]+/i, /v-bind|v-if|v-for/i],
      "React": [/data-reactroot/i, /_reactRootContainer/i],
      "Alpine.js": [/x-data|x-init|x-show/i],
      "WhatsApp Chat": [/wa\.me/i, /api\.whatsapp\.com/i, /whatsapp-button/i],
      "Mailchimp": [/chimpstatic\.com/i, /mailchimp\.com/i],
    };
    const detected = [];
    for (const [name, patterns] of Object.entries(rules)) {
      if (patterns.some(p => p.test(html))) detected.push(name);
    }
    return detected;
  }

  // --- Initialize ---
  // Run silently on load to update badge/storage
  chrome.storage.local.get("remoteConfig", (data) => {
    run(data.remoteConfig || {}, { isSilent: true }).catch(() => { });
  });

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "ping" || message["action"] === "ping") {
      sendResponse({ "status": "alive" });
      return true;
    }
    if (message.action === "detect" || message["action"] === "detect") {
      // Merge remote config if available
      const remote = message["remoteConfig"] || {};
      if (remote["salla_themes"]) {
        console.log("[Detector] Merging remote Salla themes:", remote["salla_themes"]);
        Object.assign(SALLA_THEME_IDS, remote["salla_themes"]);
      }
      if (remote["zid_themes"]) {
        console.log("[Detector] Merging remote Zid themes:", remote["zid_themes"]);
        Object.assign(ZID_THEME_IDS, remote["zid_themes"]);
      }

      run(remote, { isSilent: false }).then(result => {
        console.log("[Detector] Detection result:", result);
        sendResponse(result);
      }).catch(err => {
        console.error("[Detector] Detection error:", err);
        sendResponse({ "error": err.message });
      });
      return true;
    }
  });
})();
