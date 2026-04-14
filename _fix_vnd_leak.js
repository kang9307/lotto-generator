const fs = require('fs');

// Per-currency data
const CCY = {
  usd: { symbol: '$',   code: 'USD', ko: '달러',     en: 'US Dollar',         ja: '米ドル',     zh: '美元',   emoji: '💵' },
  jpy: { symbol: '¥',   code: 'JPY', ko: '엔화',     en: 'Japanese Yen',      ja: '日本円',     zh: '日元',   emoji: '💴' },
  eur: { symbol: '€',   code: 'EUR', ko: '유로',     en: 'Euro',              ja: 'ユーロ',     zh: '欧元',   emoji: '💶' },
  cny: { symbol: '¥',   code: 'CNY', ko: '위안',     en: 'Chinese Yuan',      ja: '人民元',     zh: '人民币', emoji: '💴' },
  gbp: { symbol: '£',   code: 'GBP', ko: '파운드',   en: 'British Pound',     ja: 'ポンド',     zh: '英镑',   emoji: '💷' },
  thb: { symbol: '฿',   code: 'THB', ko: '바트',     en: 'Thai Baht',         ja: 'タイバーツ', zh: '泰铢',   emoji: '💸' },
  php: { symbol: '₱',   code: 'PHP', ko: '페소',     en: 'Philippine Peso',   ja: 'フィリピンペソ', zh: '菲律宾比索', emoji: '💸' },
  idr: { symbol: 'Rp',  code: 'IDR', ko: '루피아',   en: 'Indonesian Rupiah', ja: 'インドネシアルピア', zh: '印尼盾', emoji: '💸' },
  twd: { symbol: 'NT$', code: 'TWD', ko: '대만달러', en: 'Taiwan Dollar',     ja: '台湾ドル',   zh: '新台币', emoji: '💵' },
};

const KO_DESC = (c) => `${c.ko}(${c.code})를 원화(KRW)로 실시간 환율 계산. 아이폰 스타일 계산기로 간편하게!`;
const EN_DESC = (c) => `Real-time ${c.en} (${c.code}) to KRW exchange rate calculator. iPhone-style UI.`;
const JA_DESC = (c) => `${c.ja}(${c.code})から韓国ウォン(KRW)へのリアルタイム為替計算。iPhone風計算機で簡単に!`;
const ZH_DESC = (c) => `${c.zh}(${c.code})兑韩元(KRW)实时汇率计算。iPhone风格计算器,简单易用!`;

const DESCS = { '': KO_DESC, 'en/': EN_DESC, 'ja/': JA_DESC, 'zh/': ZH_DESC };

const LANGS = [
  { prefix: '',    key: 'ko' },
  { prefix: 'en/', key: 'en' },
  { prefix: 'ja/', key: 'ja' },
  { prefix: 'zh/', key: 'zh' },
];

let fixed = 0;
for (const lang of LANGS) {
  for (const [ccy, data] of Object.entries(CCY)) {
    const p = `${lang.prefix}static/${ccy}_krw_calculator.html`;
    if (!fs.existsSync(p)) continue;
    let h = fs.readFileSync(p, 'utf8');
    const before = h;

    // 1) ₫ symbol → currency symbol (in display div only, preserve inside JSON-LD priceCurrency etc)
    h = h.replace(/<span class="foreign-unit">₫<\/span>/g, `<span class="foreign-unit">${data.symbol}</span>`);

    // 2) JS string "VND" → currency code (in share text contexts)
    h = h.replace(/formatNumber\(inputNum\)\} VND`/g, `formatNumber(inputNum)} ${data.code}\``);
    h = h.replace(/formatNumber\(Math\.round\(resultNum\)\)\} VND`/g, `formatNumber(Math.round(resultNum))} ${data.code}\``);

    // 3) Korean share text "💱 베트남 동 환율 계산" → per-currency name
    h = h.replace(/💱 베트남 동 환율 계산/g, `💱 ${data.ko} 환율 계산`);
    // English/Japanese/Chinese variants if present
    h = h.replace(/💱 Vietnamese Dong Exchange Rate/g, `💱 ${data.en} Exchange Rate`);
    h = h.replace(/💱 ベトナムドン為替計算/g, `💱 ${data.ja}為替計算`);
    h = h.replace(/💱 越南盾汇率计算/g, `💱 ${data.zh}汇率计算`);

    // 4) JS comments - generalize (cosmetic, but tidy)
    h = h.replace(/\/\/ true: VND→KRW, false: KRW→VND/g, `// true: foreign→KRW, false: KRW→foreign`);
    h = h.replace(/\/\/ Display rate as KRW per 10,000 VND/g, `// Display rate`);
    h = h.replace(/\/\/ Display rate as KRW per 1 VND/g, `// Display rate`);

    // 5) KO only: og:description / twitter:description if still contains "베트남"
    if (lang.key === 'ko') {
      const desc = KO_DESC(data);
      h = h.replace(
        /(<meta property="og:description" content=")[^"]*베트남[^"]*(")/,
        `$1${desc}$2`
      );
      h = h.replace(
        /(<meta name="twitter:description" content=")[^"]*베트남[^"]*(")/,
        `$1${desc}$2`
      );
    }

    // 6) Other lang og/twitter description if references Vietnamese/Dong/越南/ベトナム
    const descFn = DESCS[lang.prefix];
    const descNew = descFn(data);
    h = h.replace(
      /(<meta property="og:description" content=")[^"]*(Vietnamese Dong|ベトナムドン|越南盾)[^"]*(")/,
      `$1${descNew}$3`
    );
    h = h.replace(
      /(<meta name="twitter:description" content=")[^"]*(Vietnamese Dong|ベトナムドン|越南盾)[^"]*(")/,
      `$1${descNew}$3`
    );

    if (h !== before) { fs.writeFileSync(p, h); fixed++; }
  }
}
console.log(`Fixed ${fixed} files.`);
