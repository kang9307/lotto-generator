/**
 * Bing IndexNow 배치 전송
 * 2026-07-13 신규 hada 6편 × 4언어 = 24 URLs + blog × 4 + RSS × 4 = 32
 */
const https = require('https');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const KEY = '7d594d096f044fbba3a09184f68ffcfe';
const HOST = 'braindetox.kr';

const NEW_POSTS = [
  'sem_semantic_version_control_2026',
  'ai_model_build_off_2026',
  'ghost_font_ai_resistant_2026',
  'competence_blindness_2026',
  'qamap_pr_qa_cli_2026',
  'reporter_github_stats_2026'
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
