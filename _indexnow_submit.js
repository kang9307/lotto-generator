/**
 * Bing IndexNow 배치 전송
 * 2026-05-18: 신규 도구 5개 (JWT/YAML-JSON/HTTP/curl/SSH) × 4언어 + static_index × 4언어
 */
const https = require('https');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const KEY = '7d594d096f044fbba3a09184f68ffcfe';
const HOST = 'braindetox.kr';

const NEW_TOOLS = [
  'jwt_decoder',
  'yaml_json_converter',
  'http_status_codes',
  'curl_builder',
  'ssh_config_generator'
];

const urls = [];
const langPrefix = { ko: '', en: '/en', ja: '/ja', zh: '/zh' };

// 1) 신규 도구 5개 × 4언어 = 20 URLs
for (const slug of NEW_TOOLS) {
  for (const lang of ['ko', 'en', 'ja', 'zh']) {
    urls.push(`https://${HOST}${langPrefix[lang]}/static/${slug}.html`);
  }
}

// 2) static_index (4언어) - 카드 추가 반영
for (const lang of ['ko', 'en', 'ja', 'zh']) {
  urls.push(`https://${HOST}${langPrefix[lang]}/static_index.html`);
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
