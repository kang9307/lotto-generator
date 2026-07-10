/**
 * Bing IndexNow 배치 전송
 * 2026-07-10 신규 16편 + 허브 갱신 1편(GPT-5.6) = 17편 × 4언어 = 68 URLs + blog × 4 + RSS × 4 = 76
 */
const https = require('https');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const KEY = '7d594d096f044fbba3a09184f68ffcfe';
const HOST = 'braindetox.kr';

const NEW_POSTS = [
  'openai_gpt_5_6_release_2026',
  'weave_router_llm_2026',
  'firebase_dynamic_links_shutdown_2026',
  'digital_money_evolution_2026',
  'game_localization_agent_skill_2026',
  'chatto_open_source_selfhost_2026',
  'brain_aneurysm_warning_signs_guide',
  'breast_density_mammogram_guide',
  'callus_corn_foot_care_guide',
  'tech_startup_investment_guide',
  'gdp_economic_growth_indicator_guide',
  'lease_maintenance_repair_dispute_guide',
  'labor_union_rights_guide',
  'car_battery_replacement_guide',
  'window_insulation_diy_guide',
  'mesh_wifi_guide',
  'ai_model_comparison_2026'
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
