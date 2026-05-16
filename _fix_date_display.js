const fs = require('fs');
const path = require('path');

const DATE_MAP = {
  'houseplant_summer_care_guide_2026.html': '2026-05-12',
  'ai_tutor_alternative_to_academies_2026.html': '2026-05-12',
  'korean_solo_dev_agentic_coding_2026.html': '2026-05-12',
  'ai_music_generation_tools_2026_comparison.html': '2026-05-12',
  'diet_supplements_2026_comparison.html': '2026-05-10',
  'china_ai_labs_lessons_korea_perspective_2026.html': '2026-05-10',
  'ruflo_claude_code_multi_agent_2026.html': '2026-05-10',
  'hunk_ai_code_review_terminal_2026.html': '2026-05-10',
  'obsidian_ai_agent_workflow_2026.html': '2026-05-10'
};

const DIRS = [['ko', 'posts'], ['en', 'en/posts'], ['ja', 'ja/posts'], ['zh', 'zh/posts']];

function displayDate(lang, date) {
  const [y, m, d] = date.split('-');
  if (lang === 'ko') return date;
  if (lang === 'en') {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[parseInt(m, 10) - 1]} ${parseInt(d, 10)}, ${y}`;
  }
  return `${y}年${parseInt(m, 10)}月${parseInt(d, 10)}日`;
}

let fixed = 0;
for (const [lang, dir] of DIRS) {
  for (const [filename, newDate] of Object.entries(DATE_MAP)) {
    const fpath = path.join(dir, filename);
    if (!fs.existsSync(fpath)) continue;
    let html = fs.readFileSync(fpath, 'utf8');
    const before = html;
    const newDisplay = displayDate(lang, newDate);

    // Match <span class="post-date" ... content="newDate">OLD_DISPLAY</span>
    // where OLD_DISPLAY is any date-ish text (may contain 14, 5/14, May 14, etc.)
    const re = new RegExp(
      '(<span class="post-date"\\s+itemprop="datePublished"\\s+content=")' + newDate + '("\\s*>)([^<]+)(<\\/span>)',
      'g'
    );
    html = html.replace(re, (m, p1, p2, p3, p4) => {
      if (p3.trim() === newDisplay) return m;
      return p1 + newDate + p2 + newDisplay + p4;
    });

    if (html !== before) {
      fs.writeFileSync(fpath, html);
      fixed++;
    }
  }
}

console.log('Display text fixed:', fixed, 'files');
