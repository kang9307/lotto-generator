/**
 * Bing IndexNow 배치 전송
 * 2026-07-03 신규 22편 × 4언어 = 88 URLs + blog × 4 + RSS × 4 = 96
 */
const https = require('https');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const KEY = '7d594d096f044fbba3a09184f68ffcfe';
const HOST = 'braindetox.kr';

const NEW_POSTS = [
  'debate_ego_not_ideas_2026',
  'frontier_ai_medical_tool_reproducibility_2026',
  'korea_transit_mcp_cli_2026',
  'supertree_decision_tree_viz_2026',
  'kubernetes_in_browser_2026',
  'longcat_2_open_model_2026',
  'godot_rejects_ai_code_2026',
  'mit_pinker_perfect_world_2026',
  'openai_codex_micro_keyboard_2026',
  'ai_takes_before_jobs_2026',
  'playstation_physical_disc_end_2026',
  'windy_api_randomized_data_2026',
  'varicose_veins_guide',
  'periodontal_disease_guide',
  'card_loan_caution_guide',
  'els_dls_risk_guide',
  'child_support_enforcement_guide',
  'jeonse_lien_registration_guide',
  'prepaid_funeral_sangjo_guide',
  'bidet_installation_guide',
  'dark_web_exposure_check_guide',
  'ai_resume_writing_guide'
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
