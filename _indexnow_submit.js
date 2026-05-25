/**
 * Bing IndexNow 배치 전송
 * 2026-05-23~25 발행: 신규 포스트 9편 × 4언어 = 36 URLs + blog.html + RSS × 4언어
 */
const https = require('https');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const KEY = '7d594d096f044fbba3a09184f68ffcfe';
const HOST = 'braindetox.kr';

const NEW_POSTS = [
  'twelve_ways_wrong_ai_coding_2026',
  'age_of_products_to_brains_2026',
  'software_becoming_headless_2026',
  'zero_agent_first_programming_language_2026',
  'llm_architecture_kv_cache_trends_2026',
  'new_programming_language_5year_5m_lesson_2026',
  'mimalloc_performance_allocator_2026',
  'dont_roll_your_own_browser_principle_2026',
  'ai_capability_multiplier_2026'
];

const urls = [];
const langPrefix = { ko: '', en: '/en', ja: '/ja', zh: '/zh' };

// 1) 신규 포스트 9편 × 4언어 = 36 URLs
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
