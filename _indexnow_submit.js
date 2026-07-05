/**
 * Bing IndexNow 배치 전송
 * 2026-07-06 신규 20편 × 4언어 = 80 URLs + blog × 4 + RSS × 4 = 88
 */
const https = require('https');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const KEY = '7d594d096f044fbba3a09184f68ffcfe';
const HOST = 'braindetox.kr';

const NEW_POSTS = [
  'memnixfs_memory_forensics_2026',
  'yeomil_mono_coding_font_2026',
  'epiq_git_issue_tracker_2026',
  'databow_adbc_query_cli_2026',
  'code_as_image_llm_cost_2026',
  'safari_mcp_server_2026',
  'local_llm_running_guide_2026',
  'kernel_level_ai_safety_2026',
  'generative_ai_seo_geo_2026',
  'designing_perfect_worlds_2026',
  'newsroom_multiagent_architecture_2026',
  'windows_automation_guide',
  'vitamin_b12_deficiency_guide',
  'vertigo_bppv_guide',
  'negative_account_guide',
  'jeonse_vs_monthly_rent_guide',
  'noise_dispute_neighbor_guide',
  'moving_checklist_guide',
  'mold_condensation_removal_guide',
  'spam_call_block_guide'
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
