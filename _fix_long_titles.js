const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const LIMIT = 65;
const DRY_RUN = process.argv.includes('--dry');

const SUFFIXES = [
  ' - BrainDetox 기술 블로그',
  ' - BrainDetox 技术博客',
  ' - BrainDetox 技術ブログ',
  ' - BrainDetox テックブログ',
  ' - BrainDetox Tech Blog',
  ' | BrainDetox Utility Box',
  ' - BrainDetox Utility Box',
  ' | BrainDetox',
  ' - BrainDetox',
  ' - braindetox.kr',
  ' | braindetox.kr',
];

function walk(dir, out) {
  if (!fs.existsSync(dir)) return out;
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    const st = fs.statSync(full);
    if (st.isDirectory()) {
      if (['node_modules', '.git', 'org_project', '.claude'].includes(f)) continue;
      walk(full, out);
    } else if (f.endsWith('.html')) {
      out.push(full);
    }
  }
  return out;
}

function shortenTitle(title) {
  let candidate = title;
  for (const suffix of SUFFIXES) {
    if (candidate.endsWith(suffix)) {
      candidate = candidate.slice(0, -suffix.length).trim();
      break;
    }
  }

  if (candidate.length <= LIMIT) return candidate;

  const seps = [' - ', ' — ', ' | ', ' · ', ': ', ' : ', ' ｜ '];
  let best = candidate;
  for (const sep of seps) {
    const idx = candidate.lastIndexOf(sep, LIMIT + sep.length);
    if (idx >= 30 && idx + sep.length <= LIMIT + 5) {
      const truncated = candidate.slice(0, idx).trim();
      if (truncated.length <= LIMIT && truncated.length < best.length) {
        best = truncated;
      }
    }
  }

  if (best.length <= LIMIT) return best;

  const cut = candidate.slice(0, LIMIT - 1);
  const lastSpace = cut.lastIndexOf(' ');
  if (lastSpace > 30) {
    return cut.slice(0, lastSpace).trim();
  }
  return cut.trim();
}

function escapeAttr(s) {
  return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

function escapeReplacement(s) {
  return s.replace(/\$/g, '$$$$');
}

const files = walk(ROOT, []);
const stats = { ko: { fixed: 0, skipped: 0 }, en: { fixed: 0, skipped: 0 }, ja: { fixed: 0, skipped: 0 }, zh: { fixed: 0, skipped: 0 } };
const log = [];

for (const file of files) {
  const rel = path.relative(ROOT, file).split(path.sep).join('/');
  let lang = 'ko';
  if (rel.startsWith('en/')) lang = 'en';
  else if (rel.startsWith('ja/')) lang = 'ja';
  else if (rel.startsWith('zh/')) lang = 'zh';

  let html = fs.readFileSync(file, 'utf8');
  const titleMatch = html.match(/<title>([^<]*)<\/title>/i);
  if (!titleMatch) continue;

  const oldTitle = titleMatch[1].trim();
  if (oldTitle.length <= LIMIT) continue;

  const newTitle = shortenTitle(oldTitle);
  if (newTitle.length >= oldTitle.length || newTitle.length > LIMIT) {
    stats[lang].skipped++;
    log.push({ file: rel, status: 'skipped', oldLen: oldTitle.length, oldTitle });
    continue;
  }

  const newTitleAttr = escapeAttr(newTitle);
  const newTitleReplacement = escapeReplacement(newTitle);
  const newTitleAttrReplacement = escapeReplacement(newTitleAttr);

  html = html.replace(/<title>[^<]*<\/title>/i, '<title>' + newTitleReplacement + '</title>');

  html = html.replace(
    /(<meta\s+property=["']og:title["']\s+content=)["'][^"']*["']/i,
    '$1"' + newTitleAttrReplacement + '"'
  );

  html = html.replace(
    /(<meta\s+name=["']twitter:title["']\s+content=)["'][^"']*["']/i,
    '$1"' + newTitleAttrReplacement + '"'
  );

  if (!DRY_RUN) {
    fs.writeFileSync(file, html);
  }
  stats[lang].fixed++;
  log.push({ file: rel, status: 'fixed', oldLen: oldTitle.length, newLen: newTitle.length, oldTitle, newTitle });
}

console.log(DRY_RUN ? '=== DRY RUN ===' : '=== APPLIED ===');
let total = 0;
for (const lang of ['ko', 'en', 'ja', 'zh']) {
  const s = stats[lang];
  console.log(`${lang.toUpperCase()}: fixed=${s.fixed}, skipped=${s.skipped}`);
  total += s.fixed;
}
console.log('Total fixed:', total);
console.log('\nSample fixes:');
log.filter(x => x.status === 'fixed').slice(0, 10).forEach(x => {
  console.log(`  [${x.oldLen}→${x.newLen}] ${x.file}`);
  console.log(`    BEFORE: ${x.oldTitle}`);
  console.log(`    AFTER:  ${x.newTitle}`);
});

fs.writeFileSync('_title_fix_log.json', JSON.stringify(log, null, 2));
console.log('\nLog saved to _title_fix_log.json');
