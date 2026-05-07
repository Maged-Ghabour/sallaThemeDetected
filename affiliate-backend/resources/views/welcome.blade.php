<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>كاشف الثيمات | Salla & Zid Theme Detector</title>
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&display=swap" rel="stylesheet">
    <style>
        :root {
            --p-indigo: #6366f1;
            --p-violet: #8b5cf6;
            --bg-base: #07090e;
            --bg-card: rgba(22,26,38,0.7);
            --border-glass: rgba(255,255,255,0.07);
            --text-main: #f1f5f9;
            --text-dim: #94a3b8;
            --radius: 20px;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: 'Cairo', sans-serif;
            background: var(--bg-base);
            color: var(--text-main);
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background-image: radial-gradient(circle at 15% 50%, rgba(99,102,241,0.1), transparent 25%),
                              radial-gradient(circle at 85% 30%, rgba(168,85,247,0.1), transparent 25%);
        }
        .container { width: 100%; max-width: 620px; padding: 40px 20px; text-align: center; }
        .logo {
            font-size: 42px; font-weight: 900; margin-bottom: 10px;
            background: linear-gradient(135deg, var(--p-indigo), var(--p-violet));
            -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }
        .subtitle { color: var(--text-dim); font-size: 15px; margin-bottom: 40px; }
        .search-box {
            background: var(--bg-card); border: 1px solid var(--border-glass);
            border-radius: var(--radius); padding: 10px; display: flex; gap: 10px;
            backdrop-filter: blur(24px); box-shadow: 0 24px 60px rgba(0,0,0,0.4);
            margin-bottom: 20px; transition: 0.3s;
        }
        .search-box:focus-within { border-color: rgba(99,102,241,0.5); }
        .search-input {
            flex: 1; background: transparent; border: none; color: var(--text-main);
            font-family: 'Cairo', sans-serif; font-size: 16px; padding: 10px 15px; outline: none;
        }
        .search-input::placeholder { color: #475569; }
        .btn-scan {
            background: linear-gradient(135deg, var(--p-indigo), var(--p-violet));
            color: #fff; border: none; border-radius: 14px; padding: 0 28px;
            font-family: 'Cairo', sans-serif; font-size: 16px; font-weight: 700;
            cursor: pointer; transition: 0.3s; white-space: nowrap;
        }
        .btn-scan:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(99,102,241,0.4); }
        .btn-scan:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }
        .result-card {
            background: var(--bg-card); border: 1px solid var(--border-glass);
            border-radius: var(--radius); padding: 30px; backdrop-filter: blur(24px);
            display: none; flex-direction: column; gap: 20px; animation: fadeIn 0.5s ease;
        }
        @keyframes fadeIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        .result-item {
            display: flex; justify-content: space-between; align-items: center;
            padding: 15px 20px; background: rgba(255,255,255,0.03); border-radius: 12px;
        }
        .result-label { color: var(--text-dim); font-size: 14px; }
        .result-value { font-size: 18px; font-weight: 800; }
        .platform-Salla { color: #6366f1; }
        .platform-Zid { color: #06b6d4; }
        .platform-Shopify { color: #10b981; }
        .btn-whatsapp {
            display: flex; align-items: center; justify-content: center; gap: 10px;
            background: rgba(37,211,102,0.15); color: #25d366; text-decoration: none;
            padding: 15px; border-radius: 14px; font-weight: 700; font-size: 16px;
            transition: 0.3s; border: 1px solid rgba(37,211,102,0.3);
        }
        .btn-whatsapp:hover { background: #25d366; color: #fff; }
        .loader { display: none; color: var(--text-dim); font-size: 16px; margin-top: 20px; }
        /* Open Store Card */
        .open-store-card {
            background: var(--bg-card); border: 1px dashed rgba(99,102,241,0.4);
            border-radius: var(--radius); padding: 25px 30px; backdrop-filter: blur(24px);
            display: none; flex-direction: column; gap: 15px; animation: fadeIn 0.5s ease;
            text-align: center;
        }
        .open-store-icon { font-size: 48px; margin-bottom: 5px; }
        .open-store-title { font-size: 18px; font-weight: 800; color: var(--text-main); }
        .open-store-desc { font-size: 14px; color: var(--text-dim); line-height: 1.8; }
        .steps { text-align: right; background: rgba(255,255,255,0.03); border-radius: 12px; padding: 15px 20px; }
        .step { display: flex; gap: 12px; align-items: flex-start; margin-bottom: 12px; font-size: 14px; color: var(--text-dim); }
        .step:last-child { margin-bottom: 0; }
        .step-num { background: var(--p-indigo); color: #fff; border-radius: 50%; width: 22px; height: 22px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; flex-shrink: 0; margin-top: 2px; }
        .divider { display: flex; align-items: center; gap: 10px; color: var(--text-dim); font-size: 13px; }
        .divider::before, .divider::after { content: ''; flex: 1; height: 1px; background: rgba(255,255,255,0.07); }
        .bookmarklet-box { background: rgba(99,102,241,0.08); border: 1px solid rgba(99,102,241,0.25); border-radius: 12px; padding: 15px; }
        .bookmarklet-title { font-size: 14px; color: var(--text-main); font-weight: 700; margin-bottom: 8px; }
        .bookmarklet-desc { font-size: 12px; color: var(--text-dim); margin-bottom: 12px; }
        .bookmarklet-link {
            display: inline-block; background: linear-gradient(135deg, var(--p-indigo), var(--p-violet));
            color: #fff; text-decoration: none; padding: 10px 20px; border-radius: 10px;
            font-weight: 700; font-size: 14px; cursor: grab; user-select: none;
            border: 2px dashed rgba(255,255,255,0.3); transition: 0.3s;
        }
        .bookmarklet-link:hover { transform: scale(1.02); box-shadow: 0 6px 20px rgba(99,102,241,0.4); }
        .btn-open-store {
            display: inline-flex; align-items: center; justify-content: center; gap: 8px;
            background: linear-gradient(135deg, var(--p-indigo), var(--p-violet));
            color: #fff; text-decoration: none; padding: 14px 28px;
            border-radius: 14px; font-family: 'Cairo', sans-serif;
            font-size: 16px; font-weight: 700; cursor: pointer; border: none;
            transition: 0.3s; margin-top: 5px;
        }
        .btn-open-store:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(99,102,241,0.4); }
        .btn-retry {
            background: transparent; border: 1px solid rgba(255,255,255,0.15);
            color: var(--text-dim); border-radius: 10px; padding: 10px 24px;
            font-family: 'Cairo', sans-serif; font-size: 14px; cursor: pointer; transition: 0.3s;
        }
        .btn-retry:hover { border-color: var(--p-indigo); color: var(--text-main); }
        .cached-badge {
            display: inline-flex; align-items: center; gap: 6px;
            background: rgba(99,102,241,0.1); border: 1px solid rgba(99,102,241,0.3);
            color: #818cf8; border-radius: 20px; padding: 4px 12px; font-size: 12px;
        }

    </style>
</head>
<body>
    <div class="container">
        <div class="logo">كاشف الثيمات</div>
        <div class="subtitle">اكتشف المنصة والثيم لأي متجر إلكتروني في ثوانٍ</div>

        <form id="scan-form" class="search-box">
            <input type="url" id="url-input" class="search-input" placeholder="أدخل رابط المتجر (مثال: https://store.com)" required>
            <button type="submit" id="btn-scan" class="btn-scan">فحص</button>
        </form>

        <div id="loader" class="loader">⏳ جاري البحث...</div>

        <!-- نتيجة ناجحة -->
        <div id="result-card" class="result-card">
            <div id="cached-badge" class="cached-badge" style="display:none; justify-content:center;">
                <span>🗄️</span> نتيجة محفوظة مسبقاً
            </div>
            <div class="result-item">
                <span class="result-label">المنصة:</span>
                <span id="res-platform" class="result-value">-</span>
            </div>
            <div class="result-item">
                <span class="result-label">اسم الثيم:</span>
                <span id="res-theme" class="result-value">-</span>
            </div>
            <a href="#" id="btn-whatsapp" target="_blank" class="btn-whatsapp" style="display:none;">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                </svg>
                تواصل لتطوير متجرك
            </a>
            
            <!-- Technical Debug Info -->
            <div id="debug-info" style="display:none; text-align:left; font-family:monospace; font-size:11px; background:rgba(0,0,0,0.3); padding:10px; border-radius:10px; margin-top:15px; color:#aaa; max-height:200px; overflow:auto;">
                --- Technical Debug ---
                <pre id="debug-content"></pre>
            </div>
        </div>


        <!-- طلب فتح المتجر -->
        <div id="open-store-card" class="open-store-card">
            <div class="open-store-icon">🔍</div>
            <div class="open-store-title">يتطلب خطوة إضافية</div>
            <div class="open-store-desc">هذا المتجر محمي ويحتاج أداة خاصة للكشف. اختر الطريقة المناسبة:</div>

            <!-- طريقة 1: افتح المتجر + الإضافة -->
            <div class="steps">
                <div style="font-size:13px; font-weight:700; color:var(--text-main); margin-bottom:10px;">الطريقة الأولى — إذا لديك إضافة كروم:</div>
                <div class="step"><span class="step-num">1</span><span>افتح المتجر في تبويب جديد</span></div>
                <div class="step"><span class="step-num">2</span><span>الإضافة ستكتشف الثيم تلقائياً</span></div>
                <div class="step"><span class="step-num">3</span><span>عد هنا واضغط "جرب مجدداً"</span></div>
            </div>

            <button class="btn-open-store" id="btn-open-store">🌐 افتح المتجر الآن</button>

            <button class="btn-retry" id="btn-retry">🔄 جرب مجدداً بعد زيارة المتجر</button>
        </div>

    </div>

    <script>
    const form = document.getElementById('scan-form');
    const urlInput = document.getElementById('url-input');
    const btnScan = document.getElementById('btn-scan');
    const loader = document.getElementById('loader');
    const resultCard = document.getElementById('result-card');
    const openStoreCard = document.getElementById('open-store-card');
    const resPlatform = document.getElementById('res-platform');
    const resTheme = document.getElementById('res-theme');
    const btnWhatsapp = document.getElementById('btn-whatsapp');
    const cachedBadge = document.getElementById('cached-badge');
    const btnOpenStore = document.getElementById('btn-open-store');
    const btnRetry = document.getElementById('btn-retry');

    let currentUrl = '';

    // Build bookmarklet code
    const bookmarkletCode = `javascript:(function(){
var ids={"1247874246":"\u0631\u0627\u0626\u062f","1298199463":"\u0631\u0627\u0626\u062f","568597563":"\u0646\u0645\u0648","2038173539":"\u0648\u0627\u062b\u0642","404046066":"\u0641\u0631\u064a\u062f","392563753":"\u0632\u064a\u064a\u0646","766360058":"\u0641\u062e\u0627\u0645\u0629","1617628556":"\u0627\u0645\u062a\u064a\u0627\u0632","1034648396":"\u0645\u0644\u0627\u0643","1696219221":"\u0648\u0633\u0627\u0645","197173496":"\u0645\u062e\u062a\u0644\u0641","575338046":"\u0637\u0627\u0647\u0631","513499943":"\u0628\u0631\u064a\u0633\u062a\u064a\u062c","1245464956":"\u062c\u0645\u064a\u0644","1049159835":"\u0645\u0648\u0639\u062f","600639717":"\u0643\u0644\u064a\u0643","2048178472":"\u0628\u064a\u0648\u062a\u064a","1480248829":"\u0645\u062a\u062c\u0631","2101895899":"\u0631\u0647\u064a\u0628","1974201424":"\u0631\u0624\u064a\u0629","1660707346":"\u0631\u0642\u0645\u0649","1753517624":"\u0639\u0627\u0644\u064a","1755865368":"\u0628\u0648\u062a\u064a\u0643","724522601":"\u0645\u0628\u062f\u0639","2142196958":"\u0628\u0631\u064a\u0642","1016570170":"\u0639\u0644\u0627","1082561676":"\u0623\u064a\u0642\u0648\u0646\u0629","1111293706":"\u0623\u0635\u064a\u0644","1467724464":"\u0631\u0648\u0646\u0642","965120482":"\u0648\u0647\u062c","1663988716":"\u0644\u0627\u0641\u0646\u062f\u0631","1925842409":"\u0634\u0647\u062f","892216257":"\u0644\u064a\u0627\u0644\u064a","5541564":"\u0643\u0644\u064a\u0643","1130931637":"\u0645\u0644\u0627\u0643"};
var h=document.documentElement.innerHTML;
var tid=null,name="Unknown";
var m=h.match(/themes\\/(\\d+)\\//i)||h.match(/theme[_-](\\d+)\\.css/i);
if(m)tid=m[1];
if(!tid){var m2=h.match(/"(?:theme_id|themeId)"[^:]*:(\\d{5,})/i);if(m2)tid=m2[1];}
if(!tid){for(var id in ids){if(id.length>5&&h.indexOf(id)>-1){tid=id;break;}}}
if(tid&&ids[tid])name=ids[tid];
var platform="Salla";
if(h.indexOf("zid.store")>-1)platform="Zid";
fetch("https://affiliate.iqla3.com/api/track",{method:"POST",headers:{"Content-Type":"application/json","X-Extension-Key":"salla-ext-2024-maged-secret-key"},body:JSON.stringify({platform:platform,theme_name:name,theme_id:tid,domain:location.hostname})}).then(function(){alert("✅ تم الكشف!\\nالمنصة: "+platform+"\\nالثيم: "+name+"\\nيمكنك العودة للموقع الآن");}).catch(function(){alert("الثيم: "+name);});
})();`;

    // Set bookmarklet href
    const bookmarkletBtn = document.getElementById('bookmarklet-btn');
    if (bookmarkletBtn) {
        bookmarkletBtn.href = bookmarkletCode;
        bookmarkletBtn.addEventListener('click', function(e) {
            e.preventDefault();
            alert('📌 اسحب هذا الزر إلى شريط الإشارات المرجعية في متصفحك\n\n(لا تضغط عليه هنا، بل اسحبه!)');
        });
    }


    function showResult(platform, theme, cached = false) {
        openStoreCard.style.display = 'none';
        resPlatform.textContent = platform;
        resPlatform.className = 'result-value platform-' + platform;
        resTheme.textContent = (theme && theme !== 'Unknown') ? theme : 'غير معروف';
        cachedBadge.style.display = cached ? 'flex' : 'none';

        // WhatsApp button
        fetch('/api/config').then(r => r.json()).then(d => {
            const wa = d?.data?.whatsapp || d?.whatsapp || '';
            if (wa && theme && theme !== 'Unknown') {
                const msg = encodeURIComponent(`السلام عليكم، رأيت أن متجركم يستخدم ثيم "${theme}" على ${platform}، هل ترغبون بتطوير المتجر؟`);
                btnWhatsapp.href = `https://wa.me/${wa.replace('+','')}?text=${msg}`;
                btnWhatsapp.style.display = 'flex';
            }
        }).catch(() => {});

        resultCard.style.display = 'flex';
    }

    function showPartialResult(platform, storeUrl) {
        // Show platform + prompt to complete detection
        resPlatform.textContent = platform;
        resPlatform.className = 'result-value platform-' + platform;
        resTheme.textContent = '⏳ يتطلب زيارة المتجر';
        resTheme.style.color = '#f59e0b';
        cachedBadge.style.display = 'none';
        btnWhatsapp.style.display = 'none';
        resultCard.style.display = 'flex';

        // Also show the open-store card below
        btnOpenStore.onclick = () => { window.open(storeUrl, '_blank'); };
        openStoreCard.style.display = 'flex';
    }

    function showOpenStore(url) {
        resultCard.style.display = 'none';
        btnOpenStore.onclick = () => window.open(url, '_blank');
        openStoreCard.style.display = 'flex';
    }

    async function doScan(url, showCached = true) {
        btnScan.disabled = true;
        resultCard.style.display = 'none';
        openStoreCard.style.display = 'none';
        loader.style.display = 'block';
        loader.textContent = '🔍 جاري البحث في السجلات...';

        const debugInfo = document.getElementById('debug-info');
        const debugContent = document.getElementById('debug-content');
        debugInfo.style.display = 'block';
        debugContent.textContent = 'Scanning: ' + url + '\n';

        try {
            // Step 1: Check our DB (populated by extension scans)
            const lookupRes = await fetch('/api/lookup?url=' + encodeURIComponent(url));
            const lookup = await lookupRes.json();
            
            debugContent.textContent += 'DB Lookup: ' + JSON.stringify(lookup) + '\n';

            if (lookup.found) {
                if (lookup.theme && lookup.theme !== 'Unknown' && lookup.theme !== 'غير معروف') {
                    showResult(lookup.platform, lookup.theme, showCached);
                    return;
                } else if (lookup.platform && lookup.platform !== 'Unknown') {
                    // Just update UI but continue to server-side scan to try finding theme
                    showPartialResult(lookup.platform, url);
                }
            }




            // Step 2: Try server-side detection (direct + Wayback Machine fallback)
            loader.textContent = '🌐 جاري الفحص المباشر...';
            const detectRes = await fetch('/detect', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ url })
            });
            const data = await detectRes.json();
            debugContent.textContent += 'Server Detect: ' + JSON.stringify(data) + '\n';


            if (data.success && data.platform !== 'Unknown') {
                if (data.theme && data.theme !== 'Unknown') {
                    showResult(data.platform, data.theme, false);
                    return;
                }
                // Platform detected but theme needs browser visit
                showPartialResult(data.platform, url);
                return;
            }

            // Step 3: Ask user to open the store
            showOpenStore(url);

        } catch (err) {
            showOpenStore(url);
        } finally {
            btnScan.disabled = false;
            loader.style.display = 'none';
        }
    }


    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        currentUrl = urlInput.value.trim();
        if (!currentUrl) return;
        await doScan(currentUrl, true);
    });

    btnRetry.addEventListener('click', async () => {
        if (!currentUrl) return;
        openStoreCard.style.display = 'none';
        await doScan(currentUrl, false);
    });
    </script>
</body>
</html>
