/**
 * 발행일 분산 스크립트
 *
 * 모든 2026-05-14 글 중 일부를 5/12, 5/10으로 과거 분산
 * - HTML 메타·JSON-LD·display 날짜 모두 변경
 * - posts/index.json 날짜 변경
 * - 4언어 동시 처리
 */
const fs = require('fs');
const path = require('path');

// 분산 매핑: filename → new date
const DATE_MAP = {
  // 5/14 유지 (5개 - 가장 시간 민감/대표성)
  'summer_electricity_savings_guide_2026.html': '2026-05-14',
  'ai_coding_tools_2026_comparison.html': '2026-05-14',
  'deerflow_2_0_bytedance_agent_analysis.html': '2026-05-14',
  'pet_summer_care_guide_2026.html': '2026-05-14',
  'ai_video_generation_tools_2026_comparison.html': '2026-05-14',

  // 5/12로 이동 (4개)
  'houseplant_summer_care_guide_2026.html': '2026-05-12',
  'ai_tutor_alternative_to_academies_2026.html': '2026-05-12',
  'korean_solo_dev_agentic_coding_2026.html': '2026-05-12',
  'ai_music_generation_tools_2026_comparison.html': '2026-05-12',

  // 5/10로 이동 (5개)
  'diet_supplements_2026_comparison.html': '2026-05-10',
  'china_ai_labs_lessons_korea_perspective_2026.html': '2026-05-10',
  'ruflo_claude_code_multi_agent_2026.html': '2026-05-10',
  'hunk_ai_code_review_terminal_2026.html': '2026-05-10',
  'obsidian_ai_agent_workflow_2026.html': '2026-05-10'
};

const DIRS = ['posts', 'en/posts', 'ja/posts', 'zh/posts'];

// 언어별 display 포맷
function displayDate(lang, date) {
  const [y, m, d] = date.split('-');
  if (lang === 'ko') return date; // 2026-05-14
  if (lang === 'en') {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[parseInt(m, 10) - 1]} ${parseInt(d, 10)}, ${y}`;
  }
  if (lang === 'ja' || lang === 'zh') return `${y}年${parseInt(m, 10)}月${parseInt(d, 10)}日`;
  return date;
}

const oldDateKO = '2026-05-14';
const oldDateEN = 'May 14, 2026';
const oldDateJA = '2026年5月14日';

let totalFixed = 0;
let totalFiles = 0;

for (const dir of DIRS) {
  const lang = dir === 'posts' ? 'ko' : dir.split('/')[0];
  for (const [filename, newDate] of Object.entries(DATE_MAP)) {
    if (newDate === '2026-05-14') continue; // 이동 안 함

    const fpath = path.join(dir, filename);
    if (!fs.existsSync(fpath)) continue;

    totalFiles++;
    let html = fs.readFileSync(fpath, 'utf8');
    const before = html;

    // 1. ISO 날짜 (모두 2026-05-14 → new date)
    html = html.replace(/"datePublished":\s*"2026-05-14"/g, `"datePublished": "${newDate}"`);
    html = html.replace(/"dateModified":\s*"2026-05-14"/g, `"dateModified": "${newDate}"`);
    html = html.replace(/article:published_time"\s+content="2026-05-14"/g, `article:published_time" content="${newDate}"`);
    html = html.replace(/itemprop="datePublished"\s+content="2026-05-14"/g, `itemprop="datePublished" content="${newDate}"`);
    html = html.replace(/itemprop="dateModified"\s+content="2026-05-14"/g, `itemprop="dateModified" content="${newDate}"`);

    // 2. post-date display + content (lang-specific)
    const newDisplay = displayDate(lang, newDate);

    // KO: <span class="post-date" itemprop="datePublished" content="2026-05-14">2026-05-14</span>
    if (lang === 'ko') {
      html = html.replace(
        /(<span class="post-date"\s+itemprop="datePublished"\s+content=")2026-05-14("\s*>)2026-05-14(<\/span>)/g,
        `$1${newDate}$2${newDisplay}$3`
      );
    } else if (lang === 'en') {
      // EN: <span ... content="2026-05-14">May 14, 2026</span>
      html = html.replace(
        /(<span class="post-date"\s+itemprop="datePublished"\s+content=")2026-05-14("\s*>)May 14, 2026(<\/span>)/g,
        `$1${newDate}$2${newDisplay}$3`
      );
      // fallback if display shows ISO
      html = html.replace(
        /(<span class="post-date"\s+itemprop="datePublished"\s+content=")2026-05-14("\s*>)2026-05-14(<\/span>)/g,
        `$1${newDate}$2${newDisplay}$3`
      );
    } else if (lang === 'ja' || lang === 'zh') {
      html = html.replace(
        /(<span class="post-date"\s+itemprop="datePublished"\s+content=")2026-05-14("\s*>)2026年5月14日(<\/span>)/g,
        `$1${newDate}$2${newDisplay}$3`
      );
      // fallback
      html = html.replace(
        /(<span class="post-date"\s+itemprop="datePublished"\s+content=")2026-05-14("\s*>)2026-05-14(<\/span>)/g,
        `$1${newDate}$2${newDisplay}$3`
      );
    }

    if (html !== before) {
      fs.writeFileSync(fpath, html);
      totalFixed++;
    }
  }
}

// posts/index.json 업데이트
const idxPath = 'posts/index.json';
const idx = JSON.parse(fs.readFileSync(idxPath, 'utf8'));
for (const post of idx.posts) {
  if (DATE_MAP[post.filename] && DATE_MAP[post.filename] !== '2026-05-14') {
    post.date = DATE_MAP[post.filename];
  }
}
idx.posts.sort((a, b) => new Date(b.date) - new Date(a.date));
idx.posts.forEach((p, i) => { p.featured = i < 5; });
fs.writeFileSync(idxPath, JSON.stringify(idx, null, 2));

console.log('=== Date Distribution ===');
console.log('Files scanned:', totalFiles);
console.log('Files updated:', totalFixed);
console.log('\nNew distribution:');
const counts = { '2026-05-14': 0, '2026-05-12': 0, '2026-05-10': 0 };
for (const post of idx.posts) {
  if (counts[post.date] !== undefined) counts[post.date]++;
}
console.log('  2026-05-14:', counts['2026-05-14'], 'posts');
console.log('  2026-05-12:', counts['2026-05-12'], 'posts');
console.log('  2026-05-10:', counts['2026-05-10'], 'posts');

console.log('\nTop 5 featured (most recent):');
idx.posts.filter(p => p.featured).forEach(p => console.log('  ' + p.date + ' - ' + p.title));
