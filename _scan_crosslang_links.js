const fs = require('fs'), path = require('path');
// Scan all {lang}/** HTML files for hrefs that escape the language folder
// i.e., href pointing to KO root instead of same-language file
const results = { en: {}, ja: {}, zh: {} };

function walk(dir, lang) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { walk(p, lang); continue; }
    if (!e.name.endsWith('.html')) continue;
    const h = fs.readFileSync(p, 'utf8');
    // Depth from lang root: 0 = ja/index.html, 1 = ja/static/foo.html, 2 = ja/posts/xxx/foo.html
    const rel = p.replace(path.join(lang) + path.sep, '');
    const depth = rel.split(path.sep).length - 1;

    // Pattern 1: href="../..." that escapes lang folder
    // Count how many `../` consecutively; if >= depth+1, escapes to root
    const hrefs = [...h.matchAll(/href="(\.\.\/[^"]+)"/g)];
    for (const m of hrefs) {
      const href = m[1];
      const ups = (href.match(/\.\.\//g) || []).length;
      if (ups > depth) {
        // Escapes out of /{lang}/
        // Filter common ones: alternates/hreflang, images, fonts
        if (/\.(png|jpg|jpeg|ico|svg|css|woff|js)$/.test(href)) continue;
        if (!/\.html(#|\?|$)/.test(href)) continue;
        const target = href.replace(/^(\.\.\/)+/, '');
        if (!results[lang][target]) results[lang][target] = [];
        results[lang][target].push(rel);
      }
    }
    // Pattern 2: absolute href="/xxx.html" without lang prefix
    const abs = [...h.matchAll(/href="\/([a-z0-9_\-]+\.html)"/g)];
    for (const m of abs) {
      const target = m[1];
      if (!results[lang]['ABS:' + target]) results[lang]['ABS:' + target] = [];
      results[lang]['ABS:' + target].push(rel);
    }
  }
}

for (const l of ['en', 'ja', 'zh']) walk(l, l);

const summary = { total: 0 };
for (const l of ['en', 'ja', 'zh']) {
  let count = 0, files = 0;
  for (const t of Object.keys(results[l])) { count += results[l][t].length; files++; }
  summary[l] = { unique_targets: files, total_occurrences: count };
  summary.total += count;
}
console.log(JSON.stringify(summary, null, 2));

// Top offenders
console.log('\n=== Top targets (JA) ===');
const ja = Object.entries(results.ja).sort((a,b) => b[1].length - a[1].length).slice(0, 15);
for (const [t, fs2] of ja) console.log(`  ${t}: ${fs2.length} files`);

fs.writeFileSync('CROSSLANG_LINK_ISSUES.json', JSON.stringify(results, null, 2));
console.log('\nSaved full report to CROSSLANG_LINK_ISSUES.json');
