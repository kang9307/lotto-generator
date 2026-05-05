const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const SKIP_PATHS = ['components/', 'naver', 'google', 'bing'];

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

function getLang(rel) {
  if (rel.startsWith('en/')) return 'en';
  if (rel.startsWith('ja/')) return 'ja';
  if (rel.startsWith('zh/')) return 'zh';
  return 'ko';
}

const issues = {
  noDescription: { ko: [], en: [], ja: [], zh: [] },
  noH1: { ko: [], en: [], ja: [], zh: [] },
  multiH1: { ko: [], en: [], ja: [], zh: [] },
  noCanonical: { ko: [], en: [], ja: [], zh: [] },
  noOgTitle: { ko: [], en: [], ja: [], zh: [] },
  noViewport: { ko: [], en: [], ja: [], zh: [] },
};

const stats = { ko: 0, en: 0, ja: 0, zh: 0 };

const files = walk(ROOT, []);

for (const file of files) {
  const rel = path.relative(ROOT, file).split(path.sep).join('/');
  if (SKIP_PATHS.some(p => rel.includes(p))) continue;

  const lang = getLang(rel);
  const html = fs.readFileSync(file, 'utf8');
  stats[lang]++;

  // meta description
  if (!/<meta\s+name=["']description["']\s+content=["'][^"']+["']/i.test(html)) {
    issues.noDescription[lang].push(rel);
  }

  // h1 count
  const h1Matches = html.match(/<h1\b[^>]*>/gi) || [];
  if (h1Matches.length === 0) {
    issues.noH1[lang].push(rel);
  } else if (h1Matches.length > 1) {
    issues.multiH1[lang].push({ file: rel, count: h1Matches.length });
  }

  // canonical
  if (!/<link\s+rel=["']canonical["']/i.test(html)) {
    issues.noCanonical[lang].push(rel);
  }

  // og:title
  if (!/<meta\s+property=["']og:title["']/i.test(html)) {
    issues.noOgTitle[lang].push(rel);
  }

  // viewport
  if (!/<meta\s+name=["']viewport["']/i.test(html)) {
    issues.noViewport[lang].push(rel);
  }
}

console.log('=== Multi-Language SEO Audit ===\n');
console.log('Files scanned (excluding components/verification):');
for (const lang of ['ko', 'en', 'ja', 'zh']) {
  console.log('  ' + lang.toUpperCase() + ': ' + stats[lang]);
}

console.log('\n=== Issue Counts ===');
const issueLabels = {
  noDescription: 'Meta description missing',
  noH1: 'H1 missing',
  multiH1: 'Multiple H1',
  noCanonical: 'Canonical missing',
  noOgTitle: 'og:title missing',
  noViewport: 'Viewport missing',
};

for (const [key, label] of Object.entries(issueLabels)) {
  console.log('\n[' + label + ']');
  for (const lang of ['ko', 'en', 'ja', 'zh']) {
    const count = issues[key][lang].length;
    if (count > 0) {
      console.log('  ' + lang.toUpperCase() + ': ' + count);
    }
  }
}

fs.writeFileSync('_audit_result.json', JSON.stringify({ stats, issues }, null, 2));
console.log('\nFull list saved to _audit_result.json');
