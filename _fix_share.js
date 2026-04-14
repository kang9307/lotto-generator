const fs = require('fs');

const CCY = {
  usd: { ko: '달러 환율 계산기', en: 'Dollar Exchange Rate Calculator', ja: '米ドル 為替レート計算機', zh: '美元汇率计算器' },
  jpy: { ko: '엔화 환율 계산기', en: 'Japanese Yen Exchange Rate Calculator', ja: '日本円 為替レート計算機', zh: '日元汇率计算器' },
  eur: { ko: '유로 환율 계산기', en: 'Euro Exchange Rate Calculator', ja: 'ユーロ 為替レート計算機', zh: '欧元汇率计算器' },
  cny: { ko: '위안 환율 계산기', en: 'Chinese Yuan Exchange Rate Calculator', ja: '人民元 為替レート計算機', zh: '人民币汇率计算器' },
  gbp: { ko: '파운드 환율 계산기', en: 'British Pound Exchange Rate Calculator', ja: 'ポンド 為替レート計算機', zh: '英镑汇率计算器' },
  thb: { ko: '바트 환율 계산기', en: 'Thai Baht Exchange Rate Calculator', ja: 'タイバーツ 為替レート計算機', zh: '泰铢汇率计算器' },
  php: { ko: '페소 환율 계산기', en: 'Philippine Peso Exchange Rate Calculator', ja: 'フィリピンペソ 為替レート計算機', zh: '菲律宾比索汇率计算器' },
  idr: { ko: '루피아 환율 계산기', en: 'Indonesian Rupiah Exchange Rate Calculator', ja: 'インドネシアルピア 為替レート計算機', zh: '印尼盾汇率计算器' },
  twd: { ko: '대만달러 환율 계산기', en: 'Taiwan Dollar Exchange Rate Calculator', ja: '台湾ドル 為替レート計算機', zh: '新台币汇率计算器' },
};

const LANGS = [
  { prefix: '',     key: 'ko' },
  { prefix: 'en/',  key: 'en' },
  { prefix: 'ja/',  key: 'ja' },
  { prefix: 'zh/',  key: 'zh' },
];

const SITE_LOGO = 'https://braindetox.kr/site_logo.png';
const VND_OG = 'https://braindetox.kr/static/images/vnd_calculator_og.png';

let fixed = 0;
for (const lang of LANGS) {
  for (const [ccy, names] of Object.entries(CCY)) {
    const p = `${lang.prefix}static/${ccy}_krw_calculator.html`;
    if (!fs.existsSync(p)) continue;
    let h = fs.readFileSync(p, 'utf8');
    const before = h;

    // 1) KO Kakao title fix: '베트남 동 환율 계산기' → localized per currency
    //    Only KO keeps Korean title; EN/JA/ZH already translated correctly
    if (lang.key === 'ko') {
      h = h.replace(/title: '베트남 동 환율 계산기'/g, `title: '${names.ko}'`);
    }

    // 2) Replace VND OG image with site_logo.png in all locations
    h = h.split(VND_OG).join(SITE_LOGO);

    if (h !== before) { fs.writeFileSync(p, h); fixed++; }
  }
}
console.log(`Fixed ${fixed} files.`);
