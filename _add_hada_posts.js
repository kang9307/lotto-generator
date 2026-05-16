const fs = require('fs');
const data = JSON.parse(fs.readFileSync('posts/index.json', 'utf8'));

const NEW = [
  {
    id: 'hunk_ai_code_review_terminal_2026',
    filename: 'hunk_ai_code_review_terminal_2026.html',
    title: 'AI 에이전트 코드 리뷰 도구 Hunk - 개발자 역할 변화 분석',
    date: '2026-05-14',
    category: 'IT/기술',
    keywords: 'Hunk, AI 코드 리뷰, AI 에이전트, 터미널 diff, OpenTUI, Pierre diffs, 개발자 역할, 코드 리뷰 도구, AI 코딩, 개발 생산성',
    featured: true
  },
  {
    id: 'obsidian_ai_agent_workflow_2026',
    filename: 'obsidian_ai_agent_workflow_2026.html',
    title: 'Obsidian + AI 에이전트 통합 워크플로 - 2026 노트 도구 진화',
    date: '2026-05-14',
    category: 'IT/기술',
    keywords: 'Obsidian, AI 에이전트, Claude Code, Codex, 노트 도구, PKM, Notion, Tana, AI 통합, 개발자 노트',
    featured: true
  }
];

const newFiles = NEW.map(p => p.filename);
data.files = [...newFiles, ...data.files.filter(f => !newFiles.includes(f))];
const newIds = NEW.map(p => p.id);
data.posts = [...NEW, ...data.posts.filter(p => !newIds.includes(p.id))];
data.posts.sort((a, b) => new Date(b.date) - new Date(a.date));
data.posts.forEach((p, i) => { p.featured = i < 5; });
data.totalFiles = data.files.length;
data.lastUpdated = '2026-05-14';

fs.writeFileSync('posts/index.json', JSON.stringify(data, null, 2));
console.log('Added:', NEW.length, 'posts');
console.log('Total:', data.totalFiles);
console.log('Top 5 featured:');
data.posts.filter(p => p.featured).forEach(p => console.log('  ' + p.date + ' - ' + p.title));
