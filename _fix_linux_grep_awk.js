const fs = require('fs');
const file = 'posts/linux_grep_awk.html';
const lines = fs.readFileSync(file, 'utf8').split('\n');
console.log('Original lines:', lines.length);

const before = lines[346];
const at585 = lines[584];
const at823 = lines[822];
const at824 = lines[823];
console.log('\nBoundary check:');
console.log('  Line 347 (keep last):', before.slice(0, 80));
console.log('  Line 585 (broken start):', at585.slice(0, 80));
console.log('  Line 823 (broken trans):', at823.slice(0, 80));
console.log('  Line 824 (block 3 start, keep first):', at824.slice(0, 80));

const cleaned = [...lines.slice(0, 347), ...lines.slice(823)].join('\n');
fs.writeFileSync(file, cleaned);

const newLines = cleaned.split('\n');
console.log('\nAfter cleanup:', newLines.length, '(removed ' + (lines.length - newLines.length) + ' lines)');
const dupCount = (cleaned.match(/리눅스 텍스트 처리 심층 분석/g) || []).length;
console.log('"리눅스 텍스트 처리 심층 분석" occurrences:', dupCount);
