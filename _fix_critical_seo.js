const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();

const SKIP_FILES = ['404.html'];

const HGSS_DESCRIPTION = '힐스테이트광교산 입주민 커뮤니티 시설(피트니스·골프·도서관 등) 쿠폰 비용을 시뮬레이션하는 무료 도구. 월별 사용 패턴 입력으로 예상 비용 계산.';

function getCanonicalUrl(rel) {
  return 'https://braindetox.kr/' + rel.replace(/\\/g, '/');
}

function escapeAttr(s) {
  return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}
function escapeReplacement(s) {
  return s.replace(/\$/g, '$$$$');
}

function patchFile(file) {
  const rel = path.relative(ROOT, file).split(path.sep).join('/');

  if (SKIP_FILES.some(s => rel === s || rel.endsWith('/' + s))) {
    return { rel, status: 'skipped (noindex)' };
  }

  let html = fs.readFileSync(file, 'utf8');
  const original = html;
  const actions = [];

  const titleMatch = html.match(/<title>([^<]*)<\/title>/i);
  const titleText = titleMatch ? titleMatch[1].trim() : '';

  const hasCanonical = /<link\s+rel=["']canonical["']/i.test(html);
  const hasOgTitle = /<meta\s+property=["']og:title["']/i.test(html);
  const hasDesc = /<meta\s+name=["']description["']\s+content=["'][^"']+["']/i.test(html);

  let inserts = [];

  if (!hasCanonical) {
    const url = getCanonicalUrl(rel);
    inserts.push('    <link rel="canonical" href="' + url + '">');
    actions.push('canonical');
  }

  if (!hasOgTitle && titleText) {
    inserts.push('    <meta property="og:title" content="' + escapeAttr(titleText) + '">');
    actions.push('og:title');
  }

  if (!hasDesc && rel === 'hgss_community.html') {
    inserts.push('    <meta name="description" content="' + escapeAttr(HGSS_DESCRIPTION) + '">');
    actions.push('description');
  }

  if (inserts.length === 0) {
    return { rel, status: 'no changes needed' };
  }

  const insertBlock = '\n' + inserts.join('\n');

  const viewportRe = /(<meta\s+name=["']viewport["'][^>]*>)/i;
  if (viewportRe.test(html)) {
    html = html.replace(viewportRe, '$1' + escapeReplacement(insertBlock));
  } else {
    const charsetRe = /(<meta\s+charset=["'][^"']+["']\s*\/?>)/i;
    html = html.replace(charsetRe, '$1' + escapeReplacement(insertBlock));
  }

  if (html !== original) {
    fs.writeFileSync(file, html);
    return { rel, status: 'patched', actions };
  }
  return { rel, status: 'no insertion point found' };
}

const TARGETS = [
  '404.html',
  'color_palette.html', 'compatibility_test.html', 'crontab_generator.html',
  'docker_builder.html', 'doublecolorball.html', 'hgss_community.html',
  'lotto7.html', 'my_day.html', 'privacy.html', 'rsync_tool.html',
  'en/color_palette.html', 'en/compatibility_test.html', 'en/crontab_generator.html',
  'en/docker_builder.html', 'en/doublecolorball.html', 'en/lotto7.html',
  'ja/color_palette.html', 'ja/compatibility_test.html', 'ja/doublecolorball.html',
  'ja/lotto7.html', 'ja/my_day.html', 'ja/rsync_tool.html',
  'zh/compatibility_test.html', 'zh/doublecolorball.html', 'zh/lotto7.html', 'zh/my_day.html',
];

const results = [];
for (const t of TARGETS) {
  const file = path.join(ROOT, t);
  if (!fs.existsSync(file)) {
    results.push({ rel: t, status: 'NOT FOUND' });
    continue;
  }
  results.push(patchFile(file));
}

console.log('=== Critical SEO Patch Results ===\n');
const counts = {};
for (const r of results) {
  counts[r.status] = (counts[r.status] || 0) + 1;
  console.log('  [' + r.status + '] ' + r.rel + (r.actions ? ' (' + r.actions.join(', ') + ')' : ''));
}
console.log('\n=== Summary ===');
for (const [k, v] of Object.entries(counts)) {
  console.log('  ' + k + ': ' + v);
}

fs.writeFileSync('_critical_seo_log.json', JSON.stringify(results, null, 2));
