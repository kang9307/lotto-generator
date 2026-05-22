/**
 * Bing IndexNow 배치 전송
 * 2026-05-22 발행: 신규 포스트 7편 × 4언어 = 28 URLs + blog.html + RSS × 4언어
 */
const https = require('https');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const KEY = '7d594d096f044fbba3a09184f68ffcfe';
const HOST = 'braindetox.kr';

const NEW_POSTS = [
  'ai_native_organization_dorsey_2026',
  'gemini_cli_discontinuation_antigravity_2026',
  'npm_supply_chain_attack_2026',
  'google_search_vs_web_ai_era_2026',
  'openshorts_video_to_shorts_automation_2026',
  'tabpfn_tabular_foundation_model_2026',
  'software_engineer_identity_ai_agent_era_2026'
];

const urls = [];
const langPrefix = { ko: '', en: '/en', ja: '/ja', zh: '/zh' };

// 1) 신규 포스트 7편 × 4언어 = 28 URLs
for (const slug of NEW_POSTS) {
  for (const lang of ['ko', 'en', 'ja', 'zh']) {
    urls.push(`https://${HOST}${langPrefix[lang]}/posts/${slug}.html`);
  }
}

// 2) blog.html (4언어)
for (const lang of ['ko', 'en', 'ja', 'zh']) {
  urls.push(`https://${HOST}${langPrefix[lang]}/blog.html`);
}

// 3) RSS feeds (4언어)
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
    if (res.statusCode === 200) {
      console.log('✅ ' + urls.length + '개 URL Bing IndexNow 신고 성공');
      console.log('   24시간 내 색인 시작 예상');
    } else if (res.statusCode === 202) {
      console.log('✅ 접수 완료 (HTTP 202)');
    } else if (res.statusCode === 422) {
      console.log('⚠️ 일부 URL 거부됨 (422) - 키 검증 또는 URL 형식 확인');
    } else {
      console.log('⚠️ 비정상 응답');
    }
  });
});

req.on('error', e => console.error('전송 실패:', e.message));
req.write(payload);
req.end();
