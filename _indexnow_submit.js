/**
 * Bing IndexNow 배치 전송
 * 2026-07-23 신규 6편 × 4언어 = 24 + desc 전면수정 변경파일 전체(_indexnow_urls.txt) + rss × 4
 * (IndexNow 요청당 1만 URL 한도 내)
 */
const https = require('https');
const fs = require('fs');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const KEY = '7d594d096f044fbba3a09184f68ffcfe';
const HOST = 'braindetox.kr';

const urls = new Set();
const langPrefix = { ko: '', en: '/en', ja: '/ja', zh: '/zh' };

// 1) 변경 파일 전체 (desc 수정 + 관련글 재생성 + 신규 6편 포함)
const listed = fs.readFileSync('_indexnow_urls.txt', 'utf8').split(/\r?\n/).filter(Boolean);
for (const p of listed) urls.add(`https://${HOST}/${p}`);

// 2) blog/rss (각 언어)
for (const lang of ['ko', 'en', 'ja', 'zh']) {
  urls.add(`https://${HOST}${langPrefix[lang]}/blog.html`);
  urls.add(`https://${HOST}${langPrefix[lang]}/rss.xml`);
}

const urlList = [...urls];
console.log('Total URLs to submit:', urlList.length);
console.log('Sample:', urlList.slice(0, 3).join('\n  '));
console.log();

const payload = JSON.stringify({
  host: HOST,
  key: KEY,
  keyLocation: `https://${HOST}/${KEY}.txt`,
  urlList
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
    if (res.statusCode === 200) console.log('✅ ' + urlList.length + '개 URL Bing IndexNow 신고 성공');
    else if (res.statusCode === 202) console.log('✅ 접수 완료 (HTTP 202)');
    else console.log('⚠️ 비정상 응답');
  });
});

req.on('error', e => console.error('전송 실패:', e.message));
req.write(payload);
req.end();
