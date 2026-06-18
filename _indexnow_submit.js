/**
 * Bing IndexNow 배치 전송
 * 2026-06-18 발행: hada 3편 + 에버그린 9편 = 12편 × 4언어 = 48 URLs + blog × 4 + RSS × 4 = 56
 */
const https = require('https');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const KEY = '7d594d096f044fbba3a09184f68ffcfe';
const HOST = 'braindetox.kr';

const NEW_POSTS = [
  'ai_generated_ui_coherence_2026',
  'codex_mobile_vibe_coding_2026',
  'sandboxd_ai_app_builder_sandbox_2026',
  'four_major_insurances_guide',
  'menopause_management_guide',
  'quit_smoking_guide',
  'sleep_apnea_guide',
  'index_fund_vs_etf_guide',
  'dollar_investing_guide',
  'home_buying_first_time_guide',
  'car_buying_vs_leasing_guide',
  'real_estate_vs_stocks_guide',
  'spacex_cursor_acquisition_2026',
  'local_token_router_gemma_2026',
  'codeburn_ai_coding_cost_2026',
  'claude_designer_ai_build_2026',
  'agentic_code_review_2026',
  'job_interview_kubernetes_2026',
  'graph_ai_memory_mcp_2026',
  'why_email_strangers_2026',
  'john_carmack_bellard_2026'
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
