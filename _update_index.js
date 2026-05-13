const fs = require('fs');
const path = 'posts/index.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

const NEW_POSTS = [
  {
    id: 'ai_coding_tools_2026_comparison',
    filename: 'ai_coding_tools_2026_comparison.html',
    title: 'AI 코딩 도구 2026 비교 - Claude Code · Cursor · Copilot',
    date: '2026-05-14',
    category: 'IT/기술',
    keywords: 'Claude Code, Cursor, GitHub Copilot, AI 코딩, AI 개발자 도구, IDE, AI 코드 생성, 페어 프로그래밍, AI 에이전트, 개발 자동화',
    featured: true
  },
  {
    id: 'summer_electricity_savings_guide_2026',
    filename: 'summer_electricity_savings_guide_2026.html',
    title: '2026 여름 전기요금 절약 가이드 - 누진제 + 에어컨 절전법',
    date: '2026-05-14',
    category: '금융/경제',
    keywords: '전기요금, 누진제, 에어컨 절약, 한전 요금, 여름 전기료, 전기요금 계산, 주택용 전기, 시간대별 요금제, 고효율가전 환급, 에어컨 사용법',
    featured: true
  }
];

const newFiles = NEW_POSTS.map(p => p.filename);
const filtered = data.files.filter(f => !newFiles.includes(f));
data.files = [...newFiles, ...filtered];

const newIds = NEW_POSTS.map(p => p.id);
data.posts = data.posts.filter(p => !newIds.includes(p.id));
data.posts = [...NEW_POSTS, ...data.posts];

data.posts.sort((a, b) => new Date(b.date) - new Date(a.date));
data.posts.forEach((p, i) => { p.featured = i < 5; });

data.totalFiles = data.files.length;
data.lastUpdated = '2026-05-14';

fs.writeFileSync(path, JSON.stringify(data, null, 2));

console.log('=== Index updated ===');
console.log('Total files:', data.totalFiles);
console.log('lastUpdated:', data.lastUpdated);
console.log('\nTop 5 featured (most recent):');
data.posts.filter(p => p.featured).forEach(p => {
  console.log('  ' + p.date + ' - ' + p.title);
});
