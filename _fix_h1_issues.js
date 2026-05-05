const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();

const audit = require('./_audit_result.json');

function escapeAttr(s) {
  return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}
function escapeReplacement(s) {
  return s.replace(/\$/g, '$$$$');
}

const HIDDEN_H1_STYLE = 'position:absolute;left:-9999px;top:auto;width:1px;height:1px;overflow:hidden;';

function getMainHeadingText(html) {
  const titleMatch = html.match(/<title>([^<]*)<\/title>/i);
  if (titleMatch) {
    let title = titleMatch[1].trim();
    title = title.replace(/\s*[\-|｜]\s*BrainDetox.*$/i, '').trim();
    title = title.replace(/\s*\|\s*braindetox\.kr\s*$/i, '').trim();
    title = title.replace(/\s*-\s*braindetox\.kr\s*$/i, '').trim();
    return title;
  }
  return null;
}

function demoteDuplicateH1s(html) {
  let count = 0;
  let firstFound = false;
  const out = html.replace(/<h1\b([^>]*)>([\s\S]*?)<\/h1>/gi, (full, attrs, content) => {
    if (!firstFound) {
      firstFound = true;
      return full;
    }
    count++;
    return '<h2' + attrs + '>' + content + '</h2>';
  });
  return { html: out, demoted: count };
}

function addHiddenH1(html, headingText) {
  const bodyOpenRe = /<body\b[^>]*>/i;
  const m = html.match(bodyOpenRe);
  if (!m) return { html, added: false };

  const bodyTag = m[0];
  const insertion = bodyTag + '\n<h1 style="' + HIDDEN_H1_STYLE + '">' + escapeAttr(headingText) + '</h1>';
  return { html: html.replace(bodyOpenRe, escapeReplacement(insertion)), added: true };
}

const results = { multi: [], missing: [], skipped: [] };

const allMulti = [];
for (const lang of ['ko', 'en', 'ja', 'zh']) {
  audit.issues.multiH1[lang].forEach(x => allMulti.push(x.file));
}

for (const rel of allMulti) {
  const file = path.join(ROOT, rel);
  if (!fs.existsSync(file)) {
    results.skipped.push({ file: rel, reason: 'not found' });
    continue;
  }
  let html = fs.readFileSync(file, 'utf8');
  const before = html;
  const r = demoteDuplicateH1s(html);
  if (r.demoted > 0 && r.html !== before) {
    fs.writeFileSync(file, r.html);
    results.multi.push({ file: rel, demoted: r.demoted });
  } else {
    results.skipped.push({ file: rel, reason: 'no duplicate H1 to demote' });
  }
}

const allMissing = [];
for (const lang of ['ko', 'en', 'ja', 'zh']) {
  audit.issues.noH1[lang].forEach(f => allMissing.push(f));
}

for (const rel of allMissing) {
  const file = path.join(ROOT, rel);
  if (!fs.existsSync(file)) {
    results.skipped.push({ file: rel, reason: 'not found' });
    continue;
  }
  let html = fs.readFileSync(file, 'utf8');
  const heading = getMainHeadingText(html);
  if (!heading) {
    results.skipped.push({ file: rel, reason: 'no title to derive heading' });
    continue;
  }
  const r = addHiddenH1(html, heading);
  if (r.added) {
    fs.writeFileSync(file, r.html);
    results.missing.push({ file: rel, heading });
  } else {
    results.skipped.push({ file: rel, reason: 'no <body> tag' });
  }
}

console.log('=== H1 Issues Fix ===\n');
console.log('Multi-H1 demoted:', results.multi.length);
console.log('  Total H1 tags demoted to H2:', results.multi.reduce((s, x) => s + x.demoted, 0));
console.log('Missing H1 added (hidden):', results.missing.length);
console.log('Skipped:', results.skipped.length);

if (results.skipped.length) {
  console.log('\nSkipped details:');
  results.skipped.slice(0, 10).forEach(x => console.log('  ' + x.file + ' - ' + x.reason));
}

console.log('\nSample multi-H1 fixes:');
results.multi.slice(0, 5).forEach(x => console.log('  [demoted ' + x.demoted + '] ' + x.file));

console.log('\nSample missing H1 added:');
results.missing.slice(0, 5).forEach(x => console.log('  ' + x.file + ' → "' + x.heading + '"'));

fs.writeFileSync('_h1_fix_log.json', JSON.stringify(results, null, 2));
