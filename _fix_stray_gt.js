const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();

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

const files = walk(ROOT, []);
let fixed = 0;
const fixedList = [];

for (const file of files) {
  let html = fs.readFileSync(file, 'utf8');
  const before = html;
  html = html.replace(/(content="[^"]*">)>+/g, '$1');
  if (html !== before) {
    fs.writeFileSync(file, html);
    fixed++;
    fixedList.push(path.relative(ROOT, file).split(path.sep).join('/'));
  }
}

console.log('Files fixed:', fixed);
console.log('\nSample (first 15):');
fixedList.slice(0, 15).forEach(f => console.log('  ' + f));
