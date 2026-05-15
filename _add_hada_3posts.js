const fs = require('fs');
const data = JSON.parse(fs.readFileSync('posts/index.json', 'utf8'));

const NEW_POSTS = [
  {
    id: 'china_ai_labs_lessons_korea_perspective_2026',
    filename: 'china_ai_labs_lessons_korea_perspective_2026.html',
    title: '중미 AI 격차와 한국 AI 산업의 위치 - 2026 외부 관찰',
    date: '2026-05-14',
    category: 'IT/기술',
    keywords: '중미 AI 격차, 한국 AI 산업, 한국 AI 생태, HyperCLOVA X, Kakao Kanana, LG AI, Upstage, AI 기본법, 2026 AI 전략, 한국 AI 정책',
    featured: true
  },
  {
    id: 'ruflo_claude_code_multi_agent_2026',
    filename: 'ruflo_claude_code_multi_agent_2026.html',
    title: 'Ruflo 분석 - Claude Code 멀티 에이전트 오케스트레이션',
    date: '2026-05-14',
    category: 'IT/기술',
    keywords: 'Ruflo, Claude Code, 멀티 에이전트, AI 오케스트레이션, Claude Flow, 멀티 에이전트 시스템, AI 코딩, 자동화 개발, AI 에이전트, 협업 AI',
    featured: true
  },
  {
    id: 'korean_solo_dev_agentic_coding_2026',
    filename: 'korean_solo_dev_agentic_coding_2026.html',
    title: '한국 1인 개발자 Agentic Coding 현실 - 2026 워크플로 분석',
    date: '2026-05-14',
    category: 'IT/기술',
    keywords: '한국 1인 개발자, Agentic Coding, 한국 인디 개발자, AI 코딩 도구, 1인 사업자 개발, 한국 SaaS, 자기 주도 개발, AI 자동화 개발, 한국 개발자 시장, 코드 공장',
    featured: true
  }
];

const newFiles = NEW_POSTS.map(p => p.filename);
data.files = [...newFiles, ...data.files.filter(f => !newFiles.includes(f))];

const newIds = NEW_POSTS.map(p => p.id);
data.posts = data.posts.filter(p => !newIds.includes(p.id));
data.posts = [...NEW_POSTS, ...data.posts];

data.posts.sort((a, b) => new Date(b.date) - new Date(a.date));
data.posts.forEach((p, i) => { p.featured = i < 5; });
data.totalFiles = data.files.length;
data.lastUpdated = '2026-05-14';

fs.writeFileSync('posts/index.json', JSON.stringify(data, null, 2));
console.log('Added 3 new posts');
console.log('Total files:', data.totalFiles);
console.log('Featured top 5:');
data.posts.filter(p => p.featured).forEach(p => console.log('  ' + p.date + ' - ' + p.title));
