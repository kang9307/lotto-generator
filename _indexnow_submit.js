/**
 * Bing IndexNow 배치 전송
 * 2026-06-12 발행: hada 시사 8편 + 에버그린 2편 = 10편 × 4언어 = 40 URLs + blog.html × 4 + RSS × 4언어
 */
const https = require('https');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const KEY = '7d594d096f044fbba3a09184f68ffcfe';
const HOST = 'braindetox.kr';

const NEW_POSTS = [
  'germany_court_google_ai_overviews_liable_2026',
  'new_recaptcha_phone_verification_2026',
  'diffusiongemma_text_generation_2026',
  'supermemory_ai_context_engine_2026',
  'rich_sutton_ai_creativity_discovery_2026',
  'jqwik_anti_ai_controversy_2026',
  'pifs_pi_filesystem_2026',
  'visitor_funded_hosting_model_2026',
  'emergency_fund_guide',
  'medical_malpractice_guide'
];

const urls = [];
const langPrefix = { ko: '', en: '/en', ja: '/ja', zh: '/zh' };

for (const slug of NEW_POSTS) {
  for (const lang of ['ko', 'en', 'ja', 'zh']) {
    urls.push(`https://${HOST}${langPrefix[lang]}/posts/${slug}.html`);
  }
}
for (const lang of ['ko', 'en', 'ja', 'zh']) {
  urls.push(`https://${HOST}${langPrefix[lang]}/blog.html`);
}
for (const lang of ['ko', 'en', 'ja', 'zh']) {
  urls.push(`https://${HOST}${langPrefix[lang]}/rss.xml`);
}

console.log('Total URLs to submit:', urls.length);
console.log('Sample:', urls.slice(0, 3).join('\n  '));
console.log();

const payload = JSON.stringify({
  host: HOST,
  key: KEY,
  keyLocation: `https://${HOST}/${KEY}.txt`,
  urlList: urls
});

const options = {
  hostname: 'api.indexnow.org',
  port: 443,
  path: '/IndexNow',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(payload)
  }
};

const req = https.request(options, (res) => {
  console.log('Status:', res.statusCode, res.statusMessage);
  let body = '';
  res.on('data', c => body += c);
  res.on('end', () => {
    if (body) console.log('Response:', body);
    console.log('\n결과:');
    if (res.statusCode === 200) console.log('✅ ' + urls.length + '개 URL Bing IndexNow 신고 성공');
    else if (res.statusCode === 202) console.log('✅ 접수 완료 (HTTP 202)');
    else console.log('⚠️ 비정상 응답');
  });
});

req.on('error', e => console.error('전송 실패:', e.message));
req.write(payload);
req.end();
