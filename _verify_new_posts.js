const fs = require('fs');
const path = require('path');

const TOPICS = [
  'pet_summer_care_guide_2026',
  'houseplant_summer_care_guide_2026',
  'diet_supplements_2026_comparison',
  'ai_video_generation_tools_2026_comparison',
  'ai_music_generation_tools_2026_comparison',
  'ai_tutor_replacing_academies_2026'
];

const LANGS = [
  { code: 'ko', prefix: 'posts' },
  { code: 'en', prefix: 'en/posts' },
  { code: 'ja', prefix: 'ja/posts' },
  { code: 'zh', prefix: 'zh/posts' }
];

const results = [];
const issues = [];

for (const topic of TOPICS) {
  for (const lang of LANGS) {
    const file = path.join(lang.prefix, topic + '.html');
    if (!fs.existsSync(file)) {
      issues.push(`MISSING: ${file}`);
      continue;
    }
    const html = fs.readFileSync(file, 'utf8');
    const titleMatch = html.match(/<title>([^<]*)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : '';
    const h1Count = (html.match(/<h1\b[^>]*>/gi) || []).length;
    const checks = {
      title_len: title.length,
      title_ok: title.length > 0 && title.length <= 65,
      h1_one: h1Count === 1,
      desc: /<meta\s+name=["']description["']\s+content=["'][^"']+["']/.test(html),
      canonical: /<link\s+rel=["']canonical["']/.test(html),
      og_title: /<meta\s+property=["']og:title["']/.test(html),
      og_locale: /<meta\s+property=["']og:locale["']/.test(html),
      hreflang: (html.match(/hreflang=["'][a-z\-]+["']/g) || []).length >= 5,
      ga: html.includes('G-YE3ELRSMZE'),
      adsense: html.includes('ca-pub-7911569280980377'),
      kakao: html.includes('e06d0ee93e450a11bc6451d46e09cd88'),
      common: html.includes('common.js'),
      header: html.includes('header-placeholder'),
      footer: html.includes('footer-placeholder'),
      json_ld: html.includes('"@type": "BlogPosting"') || html.includes('"@type":"BlogPosting"'),
    };
    const allOk = Object.values(checks).every(v => v === true || (typeof v === 'number' && v > 0 && v <= 65));
    results.push({ file, title, ...checks, allOk });
    if (!allOk) {
      const failed = Object.entries(checks).filter(([k, v]) => k !== 'title_len' && v !== true && v <= 0).map(([k]) => k);
      issues.push(`${file}: title="${title}" (${title.length}) FAILED: ${failed.join(', ')}`);
    }
  }
}

console.log('=== 24 New Files SEO Verification ===\n');
console.log('Total checked: ' + results.length);
console.log('All OK: ' + results.filter(r => r.allOk).length);
console.log('Issues: ' + issues.length);

if (issues.length > 0) {
  console.log('\n--- Issues ---');
  issues.forEach(i => console.log('  ' + i));
}

console.log('\n--- Titles by topic/lang ---');
for (const topic of TOPICS) {
  console.log('\n' + topic);
  for (const lang of LANGS) {
    const f = path.join(lang.prefix, topic + '.html');
    const r = results.find(x => x.file === f);
    if (r) {
      console.log('  [' + lang.code.toUpperCase() + ' ' + r.title_len + 'ch] ' + r.title);
    }
  }
}

fs.writeFileSync('_verify_result.json', JSON.stringify({ results, issues }, null, 2));
