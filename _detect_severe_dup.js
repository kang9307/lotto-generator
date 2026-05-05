const fs = require('fs');
const path = require('path');

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

const files = walk(process.cwd(), []);
const results = { severe5plus: [], moderate3to4: [] };

for (const f of files) {
  const html = fs.readFileSync(f, 'utf8');
  const m = html.match(/<h1\s+class=["']post-title["'][^>]*>([^<]*)<\/h1>/i);
  if (!m) continue;
  const title = m[1].trim();
  if (title.length < 10) continue;
  const esc = title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const occ = (html.match(new RegExp(esc, 'g')) || []).length;
  const rel = path.relative(process.cwd(), f).split(path.sep).join('/');
  if (occ >= 5) results.severe5plus.push({ rel, occ });
  else if (occ >= 3) results.moderate3to4.push({ rel, occ });
}

console.log('=== Body Duplication Detection ===\n');
console.log('Severe (title appears 5+ times):', results.severe5plus.length);
console.log('Moderate (title appears 3-4 times):', results.moderate3to4.length);

console.log('\nTop 20 severe:');
results.severe5plus.sort((a, b) => b.occ - a.occ).slice(0, 20).forEach(x => console.log('  [' + x.occ + '] ' + x.rel));

fs.writeFileSync('_severe_dup.json', JSON.stringify(results, null, 2));
