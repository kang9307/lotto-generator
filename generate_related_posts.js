/**
 * generate_related_posts.js
 * 모든 글 하단(</article> 직전)에 "관련 글" 자동 섹션을 멱등 삽입.
 * 같은 카테고리 우선 + 키워드 자카드 유사도로 4개 선정. 4언어(ko/en/ja/zh) 동시.
 * 사용법:
 *   node generate_related_posts.js            # 전체 적용
 *   node generate_related_posts.js <slug>     # 단일 글만 (테스트)
 *   node generate_related_posts.js --dry       # 변경 없이 통계만
 */
const fs = require('fs');

const LANGS = [
  { code: 'ko', dir: 'posts', label: '관련 글' },
  { code: 'en', dir: 'en/posts', label: 'Related Posts' },
  { code: 'ja', dir: 'ja/posts', label: '関連記事' },
  { code: 'zh', dir: 'zh/posts', label: '相关文章' },
];
const N = 4; // 관련글 개수

const META = JSON.parse(fs.readFileSync('posts/index.json', 'utf8')).posts; // ko = 공통 메타
const titlesByLang = {};
for (const l of LANGS) {
  const arr = JSON.parse(fs.readFileSync(l.dir + '/index.json', 'utf8')).posts;
  const m = {}; for (const p of arr) m[p.id] = p.title;
  titlesByLang[l.code] = m;
}

const kw = (s) => new Set(String(s || '').split(',').map(x => x.trim().toLowerCase()).filter(Boolean));
const kwMap = {}; for (const p of META) kwMap[p.id] = kw(p.keywords);

// 관련글 선정: sameCategory +100, 키워드 교집합 *12, 최신성 소량
function pickRelated(post) {
  const myKw = kwMap[post.id];
  const scored = [];
  for (const other of META) {
    if (other.id === post.id) continue;
    let score = 0;
    if (other.category === post.category) score += 100;
    let inter = 0; for (const k of kwMap[other.id]) if (myKw.has(k)) inter++;
    score += inter * 12;
    if (score === 0) continue; // 무관한 글은 후보 제외
    scored.push({ id: other.id, date: other.date || '', score });
  }
  scored.sort((a, b) => b.score - a.score || (b.date < a.date ? -1 : 1));
  return scored.slice(0, N).map(x => x.id);
}

const START = '<!-- AUTO-RELATED-START -->', END = '<!-- AUTO-RELATED-END -->';
const blockRe = new RegExp(START + '[\\s\\S]*?' + END + '\\s*', 'g');

function buildBlock(lang, relIds) {
  const items = relIds
    .filter(id => titlesByLang[lang.code][id])
    .map(id => `      <li><a href="${id}.html">${titlesByLang[lang.code][id]}</a></li>`)
    .join('\n');
  if (!items) return '';
  return `${START}
    <div class="related-posts" style="margin:2.5rem 0 0;padding:1.5rem 0 0;border-top:1px solid #e5e7eb;">
      <h2 style="font-size:1.3rem;margin-bottom:0.8rem;">${lang.label}</h2>
      <ul style="line-height:1.9;padding-left:1.2rem;">
${items}
      </ul>
    </div>
    ${END}\n`;
}

const onlySlug = process.argv[2] && !process.argv[2].startsWith('--') ? process.argv[2] : null;
const dry = process.argv.includes('--dry');

let changed = 0, skipped = 0, missing = 0;
const targets = onlySlug ? META.filter(p => p.id === onlySlug) : META;

for (const post of targets) {
  const relIds = pickRelated(post);
  for (const lang of LANGS) {
    const f = lang.dir + '/' + post.id + '.html';
    if (!fs.existsSync(f)) { missing++; continue; }
    let html = fs.readFileSync(f, 'utf8');
    const block = buildBlock(lang, relIds);
    if (!block) { skipped++; continue; }
    html = html.replace(blockRe, ''); // 기존 자동블록 제거(멱등)
    const idx = html.lastIndexOf('</article>');
    if (idx === -1) { skipped++; continue; }
    const next = html.slice(0, idx) + block + html.slice(idx);
    if (!dry && next !== html) fs.writeFileSync(f, next);
    if (next !== html) changed++;
  }
}
console.log(`관련글 섹션 ${dry ? '(dry) ' : ''}적용: 변경 ${changed} 파일, 스킵 ${skipped}, 파일없음 ${missing}`);
if (onlySlug) console.log('대상 slug:', onlySlug, '→ 관련글:', pickRelated(targets[0]).join(', '));
