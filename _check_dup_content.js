const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();

function walk(dir, out) {
  if (!fs.existsSync(dir)) return out;
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    const st = fs.statSync(full);
    if (st.isDirectory()) {
      if (['node_modules', '.git', 'org_project', '.claude', 'components'].includes(f)) continue;
      walk(full, out);
    } else if (f.endsWith('.html')) {
      out.push(full);
    }
  }
  return out;
}

const files = walk(ROOT, []);
const suspicious = [];

for (const file of files) {
  const html = fs.readFileSync(file, 'utf8');
  const m = html.match(/<\/code><\/pre>/g) || [];
  const o = html.match(/<pre><code/g) || [];
  if (o.length > m.length + 2) {
    suspicious.push({ file: path.relative(ROOT, file), open: o.length, close: m.length });
    continue;
  }

  const postTitleMatch = html.match(/<h1\s+class=["']post-title["'][^>]*>([^<]*)<\/h1>/i);
  if (postTitleMatch) {
    const titleText = postTitleMatch[1].trim();
    if (titleText.length > 10) {
      const escaped = titleText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const occurs = (html.match(new RegExp(escaped, 'g')) || []).length;
      if (occurs > 1) {
        suspicious.push({ file: path.relative(ROOT, file), titleText: titleText.slice(0, 60), occurs, type: 'duplicate-title' });
      }
    }
  }

  const articleBodyMatch = html.match(/<div class=["']post-content["'][^>]*>([\s\S]*?)<\/article>/);
  if (articleBodyMatch) {
    const body = articleBodyMatch[1];
    const h2Texts = (body.match(/<h2[^>]*>([^<]+)<\/h2>/g) || []).map(m => m.replace(/<[^>]+>/g, '').trim());
    const dupH2 = {};
    h2Texts.forEach(t => { dupH2[t] = (dupH2[t] || 0) + 1; });
    const dups = Object.entries(dupH2).filter(([t, c]) => c > 1 && t.length > 5);
    if (dups.length > 0) {
      suspicious.push({ file: path.relative(ROOT, file), dupH2: dups.slice(0, 3), type: 'duplicate-h2' });
    }
  }
}

console.log('Suspicious files (potential body duplication):');
suspicious.forEach(s => console.log('  ' + JSON.stringify(s)));
console.log('Total suspicious:', suspicious.length);
