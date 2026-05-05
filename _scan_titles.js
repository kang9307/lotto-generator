const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const LANGS = { ko: '', en: 'en', ja: 'ja', zh: 'zh' };
const LIMIT = 65;

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    const st = fs.statSync(full);
    if (st.isDirectory()) {
      if (['node_modules', '.git', 'org_project'].includes(f)) continue;
      walk(full, out);
    } else if (f.endsWith('.html')) {
      out.push(full);
    }
  }
  return out;
}

function getLang(file) {
  const rel = path.relative(ROOT, file).split(path.sep).join('/');
  if (rel.startsWith('en/')) return 'en';
  if (rel.startsWith('ja/')) return 'ja';
  if (rel.startsWith('zh/')) return 'zh';
  return 'ko';
}
function getRel(file) {
  return path.relative(ROOT, file).split(path.sep).join('/');
}

const files = walk(ROOT);
const stats = { ko: { total: 0, over: 0, missing: 0 }, en: { total: 0, over: 0, missing: 0 }, ja: { total: 0, over: 0, missing: 0 }, zh: { total: 0, over: 0, missing: 0 } };
const longTitles = { ko: [], en: [], ja: [], zh: [] };
const missingTitles = { ko: [], en: [], ja: [], zh: [] };

for (const file of files) {
  const lang = getLang(file);
  const html = fs.readFileSync(file, 'utf8');
  const m = html.match(/<title>([^<]*)<\/title>/i);
  stats[lang].total++;
  if (!m || !m[1].trim()) {
    stats[lang].missing++;
    missingTitles[lang].push(getRel(file));
    continue;
  }
  const title = m[1].trim();
  const len = title.length;
  if (len > LIMIT) {
    stats[lang].over++;
    longTitles[lang].push({ file: getRel(file), len, title });
  }
}

console.log('=== Title Length Audit (limit: ' + LIMIT + ' chars) ===\n');
for (const lang of ['ko', 'en', 'ja', 'zh']) {
  const s = stats[lang];
  console.log(`${lang.toUpperCase()}: total=${s.total}, over=${s.over} (${(s.over/s.total*100).toFixed(1)}%), missing=${s.missing}`);
}

console.log('\n=== Top 10 Longest Titles per Language ===');
for (const lang of ['ko', 'en', 'ja', 'zh']) {
  console.log(`\n--- ${lang.toUpperCase()} (top 10) ---`);
  longTitles[lang].sort((a, b) => b.len - a.len).slice(0, 10).forEach(({ file, len, title }) => {
    console.log(`  [${len}] ${file}`);
    console.log(`         ${title.slice(0, 100)}${title.length > 100 ? '...' : ''}`);
  });
}

console.log('\n=== Missing Titles ===');
for (const lang of ['ko', 'en', 'ja', 'zh']) {
  if (missingTitles[lang].length) {
    console.log('\n--- ' + lang.toUpperCase() + ' (' + missingTitles[lang].length + ' missing) ---');
    missingTitles[lang].forEach(f => console.log('  ' + f));
  }
}

fs.writeFileSync('_scan_titles_result.json', JSON.stringify({ stats, longTitles, missingTitles }, null, 2));
console.log('\n→ Full result saved to _scan_titles_result.json');
