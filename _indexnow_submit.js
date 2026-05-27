/**
 * Bing IndexNow 배치 전송
 * 2026-05-27: 신규 발행 5편 × 4언어 = 20 URLs
 *   + 이전 정리분 (옛 슬러그 제거, 메타 절단 346개) 정식 슬러그 6편 × 4언어 = 24 URLs
 *   + blog.html × 4 + RSS × 4 = 8
 *   = 총 52 URLs
 */
const https = require('https');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const KEY = '7d594d096f044fbba3a09184f68ffcfe';
const HOST = 'braindetox.kr';

// 5/27 신규 발행
const NEW_POSTS = [
  'ai_code_slower_better_quality_2026',
  'codegraph_ai_coding_knowledge_graph_2026',
  'deepseek_v4_pro_75percent_permanent_2026',
  'paideia_kaist_claude_code_exam_plugin_2026',
  'braillify_korean_braille_converter_2026'
];

// 이전 Bing 경고 정리분 (옛 슬러그 제거 + 정식 슬러그 재제출)
const CLEANUP_POSTS = [
  'ai_music_generation_tools_2026_comparison',
  'houseplant_summer_care_guide_2026',
  'hunk_ai_code_review_terminal_2026',
  'ai_tutor_alternative_to_academies_2026',
  'diet_supplements_2026_comparison',
  'pet_summer_care_guide_2026'
];

const urls = [];
const langPrefix = { ko: '', en: '/en', ja: '/ja', zh: '/zh' };

// 1) 신규 5편 × 4언어 = 20
for (const slug of NEW_POSTS) {
  for (const lang of ['ko', 'en', 'ja', 'zh']) {
    urls.push(`https://${HOST}${langPrefix[lang]}/posts/${slug}.html`);
  }
}

// 2) 정리 정식 슬러그 6편 × 4언어 = 24
for (const slug of CLEANUP_POSTS) {
  for (const lang of ['ko', 'en', 'ja', 'zh']) {
    urls.push(`https://${HOST}${langPrefix[lang]}/posts/${slug}.html`);
  }
}

// 3) blog.html × 4 = 4
for (const lang of ['ko', 'en', 'ja', 'zh']) {
  urls.push(`https://${HOST}${langPrefix[lang]}/blog.html`);
}

// 4) RSS × 4 = 4
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
