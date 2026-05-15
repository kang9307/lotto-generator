const fs = require('fs');
const data = JSON.parse(fs.readFileSync('posts/index.json', 'utf8'));

const NEW = {
  id: 'deerflow_2_0_bytedance_agent_analysis',
  filename: 'deerflow_2_0_bytedance_agent_analysis.html',
  title: 'DeerFlow 2.0 분석 - ByteDance 자율 AI 에이전트 vs Claude Code',
  date: '2026-05-14',
  category: 'IT/기술',
  keywords: 'DeerFlow, DeerFlow 2.0, ByteDance, AI 에이전트, Claude Code, AI agent, sub-agent, 자율 에이전트, 오픈소스 AI, AI 자동화',
  featured: true
};

data.files = [NEW.filename, ...data.files.filter(f => f !== NEW.filename)];
data.posts = [NEW, ...data.posts.filter(p => p.id !== NEW.id)];
data.posts.sort((a, b) => new Date(b.date) - new Date(a.date));
data.posts.forEach((p, i) => { p.featured = i < 5; });
data.totalFiles = data.files.length;
data.lastUpdated = '2026-05-14';

fs.writeFileSync('posts/index.json', JSON.stringify(data, null, 2));
console.log('Added:', NEW.title);
console.log('Total files:', data.totalFiles);
console.log('Featured top 5:');
data.posts.filter(p => p.featured).forEach(p => console.log('  ' + p.date + ' - ' + p.title));
